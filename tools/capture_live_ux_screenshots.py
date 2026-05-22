from __future__ import annotations

import base64
import hashlib
import json
import os
import socket
import struct
import subprocess
import time
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "ux" / "screenshots"
PROFILE = ROOT / ".chrome_screenshot_profile"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
BASE_URL = "https://tdlwebshop.web.app"
PORT = 9225


DEMO_CART = [
    {
        "id": 1,
        "key": "TDL-LAK-003",
        "firestoreId": "TDL-LAK-003",
        "name": "ROTHENBERGER nyomaték-villáskulcs készlet, 17-29 mm",
        "sku": "TDL-LAK-003",
        "category": "Lakossági megoldások",
        "price": 57690,
        "image": "products/lakossagi/rothenberger_fo.jpg",
        "quantity": 2,
    },
    {
        "id": 2,
        "key": "TDL-LAK-007",
        "firestoreId": "TDL-LAK-007",
        "name": "Soudal szaniter szilikon transzparens 280ml",
        "sku": "TDL-LAK-007",
        "category": "Lakossági megoldások",
        "price": 2690,
        "image": "products/lakossagi/soudal_szilo_fo.jpg",
        "quantity": 3,
    },
]


DEMO_SUMMARY = {
    "orderId": "DEMO-UX-2026",
    "customerName": "Minta Péter",
    "customerEmail": "minta.peter@example.hu",
    "customerPhone": "+36 30 123 4567",
    "shippingMethodLabel": "Házhozszállítás",
    "paymentMethodLabel": "Bankkártya",
    "subtotal": 123450,
    "shippingFee": 1990,
    "paymentFee": 0,
    "discount": 5000,
    "couponCode": "DEMO500",
    "couponDescription": "Demo kedvezmény",
    "total": 120440,
    "items": [
        {
            "name": "ROTHENBERGER nyomaték-villáskulcs készlet, 17-29 mm",
            "quantity": 2,
            "price": 57690,
            "image": "products/lakossagi/rothenberger_fo.jpg",
        }
    ],
}


class Cdp:
    def __init__(self, websocket_url: str) -> None:
        self.sock = self._connect(websocket_url)
        self.next_id = 0

    def _connect(self, websocket_url: str) -> socket.socket:
        assert websocket_url.startswith("ws://")
        host_port_path = websocket_url[5:]
        host_port, path = host_port_path.split("/", 1)
        host, port = host_port.split(":")
        sock = socket.create_connection((host, int(port)), timeout=10)
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        req = (
            f"GET /{path} HTTP/1.1\r\n"
            f"Host: {host_port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        sock.sendall(req.encode("ascii"))
        response = sock.recv(4096)
        if b"101" not in response.split(b"\r\n", 1)[0]:
            raise RuntimeError(f"WebSocket handshake failed: {response[:120]!r}")
        return sock

    def close(self) -> None:
        try:
            self.sock.close()
        except OSError:
            pass

    def send(self, method: str, params: dict | None = None) -> dict:
        self.next_id += 1
        msg_id = self.next_id
        payload = json.dumps({"id": msg_id, "method": method, "params": params or {}}).encode("utf-8")
        self._send_frame(payload)
        while True:
            data = json.loads(self._recv_frame().decode("utf-8"))
            if data.get("id") == msg_id:
                if "error" in data:
                    raise RuntimeError(f"CDP error for {method}: {data['error']}")
                return data.get("result", {})

    def _send_frame(self, payload: bytes) -> None:
        header = bytearray([0x81])
        length = len(payload)
        if length < 126:
            header.append(0x80 | length)
        elif length < 65536:
            header.append(0x80 | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack("!Q", length))
        mask = os.urandom(4)
        header.extend(mask)
        masked = bytes(payload[i] ^ mask[i % 4] for i in range(length))
        self.sock.sendall(bytes(header) + masked)

    def _recv_frame(self) -> bytes:
        first = self.sock.recv(2)
        if len(first) < 2:
            raise RuntimeError("WebSocket closed")
        opcode = first[0] & 0x0F
        length = first[1] & 0x7F
        if length == 126:
            length = struct.unpack("!H", self._read_exact(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self._read_exact(8))[0]
        if first[1] & 0x80:
            mask = self._read_exact(4)
            payload = self._read_exact(length)
            payload = bytes(payload[i] ^ mask[i % 4] for i in range(length))
        else:
            payload = self._read_exact(length)
        if opcode == 0x8:
            raise RuntimeError("WebSocket close frame received")
        if opcode == 0x9:
            return self._recv_frame()
        return payload

    def _read_exact(self, length: int) -> bytes:
        chunks = bytearray()
        while len(chunks) < length:
            part = self.sock.recv(length - len(chunks))
            if not part:
                raise RuntimeError("Socket closed")
            chunks.extend(part)
        return bytes(chunks)


def get_json(path: str) -> list | dict:
    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}{path}", timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def wait_for_chrome() -> str:
    for _ in range(80):
        try:
            tabs = get_json("/json")
            if tabs:
                return tabs[0]["webSocketDebuggerUrl"]
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chrome DevTools endpoint did not start")


def wait(cdp: Cdp, milliseconds: int) -> None:
    cdp.send(
        "Runtime.evaluate",
        {
            "expression": f"new Promise(resolve => setTimeout(resolve, {milliseconds}))",
            "awaitPromise": True,
        },
    )


def eval_js(cdp: Cdp, script: str) -> None:
    cdp.send("Runtime.evaluate", {"expression": script, "awaitPromise": True})


def capture(cdp: Cdp, name: str, path: str, before: str = "", after: str = "", delay_ms: int = 7000) -> None:
    common_before = """
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('themeUserSet', '1');
    """
    cdp.send("Page.addScriptToEvaluateOnNewDocument", {"source": common_before + "\n" + before})
    cdp.send("Page.navigate", {"url": f"{BASE_URL}{path}"})
    wait(cdp, delay_ms)
    if after:
        eval_js(cdp, after)
        wait(cdp, 2500)
    result = cdp.send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
    target = OUT / name
    target.write_bytes(base64.b64decode(result["data"]))
    digest = hashlib.sha256(target.read_bytes()).hexdigest()[:10]
    print(f"{name}: {target.stat().st_size} bytes sha256:{digest}")


def main() -> None:
    if not CHROME.exists():
        raise RuntimeError(f"Chrome not found: {CHROME}")
    OUT.mkdir(parents=True, exist_ok=True)
    PROFILE.mkdir(parents=True, exist_ok=True)

    process = subprocess.Popen(
        [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            f"--remote-debugging-port={PORT}",
            "--window-size=1440,900",
            f"--user-data-dir={PROFILE}",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    cdp: Cdp | None = None
    try:
        cdp = Cdp(wait_for_chrome())
        cdp.send("Page.enable")
        cdp.send("Runtime.enable")
        cdp.send(
            "Emulation.setDeviceMetricsOverride",
            {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False},
        )

        cart_before = f"localStorage.setItem('cart', {json.dumps(json.dumps(DEMO_CART))});"
        wishlist_before = f"localStorage.setItem('wishlist:guest', {json.dumps(json.dumps(DEMO_CART))});"
        success_before = f"sessionStorage.setItem('lastOrderSummary', {json.dumps(json.dumps(DEMO_SUMMARY))});"

        capture(cdp, "S01_kezdolap_desktop.png", "/")
        capture(
            cdp,
            "S02_kategoriak_lenyilo_desktop.png",
            "/",
            after="document.querySelector('.category-button')?.click();",
        )
        capture(cdp, "S03_termeklista_desktop.png", "/products")
        capture(
            cdp,
            "S04_termekadatlap_desktop.png",
            "/products",
            after="document.querySelector('.details-btn')?.click();",
        )
        capture(cdp, "S05_kosar_desktop.png", "/cart", before=cart_before)
        capture(cdp, "S06_checkout_desktop.png", "/checkout", before=cart_before)
        capture(
            cdp,
            "S07_checkout_validacio_desktop.png",
            "/checkout",
            before=cart_before,
            after="""
              const set = (selector, value) => {
                const el = document.querySelector(selector);
                if (!el) return;
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
              };
              set('input[type=email]', 'hibas-email');
              set('input[type=tel]', '123');
              [...document.querySelectorAll('button')].find(button => button.textContent.includes('Rendelés elküldése'))?.click();
            """,
        )
        capture(cdp, "S08_sikeres_rendeles_desktop.png", "/order-success", before=success_before)
        capture(cdp, "S10_kivansaglista_desktop.png", "/wishlist", before=wishlist_before)
        capture(
            cdp,
            "S16_ai_asszisztens_desktop.png",
            "/",
            after="document.querySelector('.assistant-fab')?.click();",
        )
        capture(cdp, "S17_login_regisztracio_desktop.png", "/login")
        capture(cdp, "S19_kapcsolat_desktop.png", "/contact")
    finally:
        if cdp:
            cdp.close()
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()


if __name__ == "__main__":
    main()
