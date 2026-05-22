from pathlib import Path
import re
import textwrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "code-snippet-images"


SNIPPETS = [
    ("M2.1", "Utvonalkezeles es lazy loading", [("src/app/app.routes.ts", 5, 21)]),
    ("M2.2", "Admin route guard", [("src/app/guards/admin.guard.ts", 7, 23)]),
    ("M2.3", "Szerepkor-ellenorzes", [("src/app/services/auth.service.ts", 104, 122)]),
    ("M2.4a", "Firestore admin es aktiv user helper", [("firestore.rules", 1, 32)]),
    ("M2.4b", "Firestore admin jogosultsag helper", [("firestore.rules", 34, 45)]),
    ("M2.4c", "Firestore termek es tartalom szabalyok", [("firestore.rules", 288, 309)]),
    ("M2.4d", "Firestore rendeles szabalyok", [("firestore.rules", 311, 316)]),
    ("M2.5", "Rendeles adatmodell", [("src/app/models/order.model.ts", 3, 63)]),
    ("M2.6a", "Checkout validacio es osszegszamitas", [("src/pages/checkout/checkout.ts", 457, 486)]),
    ("M2.6b", "Rendeles objektum osszeallitasa", [("src/pages/checkout/checkout.ts", 488, 545)]),
    ("M2.6c", "Rendeles osszegzes es profilmentes", [("src/pages/checkout/checkout.ts", 546, 618)]),
    ("M2.7a", "Checkout urlaphibak gyujtese", [("src/pages/checkout/checkout.ts", 659, 693)]),
    ("M2.7b", "Email validacio helper", [("src/app/utils/form-validators.ts", 1, 38)]),
    ("M2.7c", "Telefonszam validacio helper", [("src/app/utils/form-validators.ts", 40, 89)]),
    ("M2.8a", "Rendelesstatusz tranzakcio inditasa", [("src/app/services/order.service.ts", 41, 70)]),
    ("M2.8b", "Keszletkorrekcio statuszvaltaskor", [("src/app/services/order.service.ts", 72, 116)]),
    ("M2.8c", "Rendelesfrissites es audit naplo", [("src/app/services/order.service.ts", 118, 134)]),
    ("M2.9", "Admin statuszvaltas meghivasa", [("src/pages/admin/admin.ts", 1577, 1614)]),
    ("M2.10a", "Helyszini vasarlas osszeg es cimke", [("src/pages/admin/admin.ts", 2335, 2361)]),
    ("M2.10b", "Mentett vasarlo elozo rendelesek", [("src/pages/admin/admin.ts", 2363, 2398)]),
    ("M2.10c", "Mentett vasarlo kivalasztas es kedvezmeny", [("src/pages/admin/admin.ts", 2400, 2431)]),
    ("M2.10d", "Helyszini vasarlas elovalidacio", [("src/pages/admin/admin.ts", 2433, 2478)]),
    ("M2.10e", "Helyszini tetelek es osszegek", [("src/pages/admin/admin.ts", 2480, 2498)]),
    ("M2.10f", "Helyszini rendeles objektum", [("src/pages/admin/admin.ts", 2500, 2549)]),
    ("M2.10g", "Helyszini szamla es pdf inditas", [("src/pages/admin/admin.ts", 2551, 2557)]),
    ("M2.11", "Helyszini vasarlas tranzakcio", [("src/app/services/order.service.ts", 238, 304)]),
    ("M2.12a", "Termek torles es import elokeszites", [("src/app/services/product.service.ts", 59, 77)]),
    ("M2.12b", "CSV termekek normalizalasa", [("src/app/services/product.service.ts", 78, 94)]),
    ("M2.12c", "CSV insert mod termekmentes", [("src/app/services/product.service.ts", 96, 111)]),
    ("M2.12d", "CSV upsert SKU alapu frissites", [("src/app/services/product.service.ts", 113, 166)]),
    ("M2.13a", "Szamlaszam generalas tranzakcioban", [("src/app/services/order.service.ts", 327, 362)]),
    ("M2.13b", "PDF bizonylat adatainak elokeszitese", [("src/app/services/invoice.service.ts", 8, 40)]),
    ("M2.13c", "PDF letoltes bongeszoben", [("src/app/services/invoice.service.ts", 41, 56)]),
    ("M2.14a", "AI kerdes domain szurese", [("src/app/services/chatbot-llm.service.ts", 39, 59)]),
    ("M2.14b", "AI proxy hivas es valaszfeldolgozas", [("src/app/services/chatbot-llm.service.ts", 61, 88)]),
    ("M2.14c", "AI relevans termekkatalogus", [("src/app/services/chatbot-llm.service.ts", 92, 114)]),
    ("M2.14d", "AI katalogus termek DTO", [("src/app/services/chatbot-llm.service.ts", 116, 128)]),
    ("M2.15a", "Worker CORS es metodus vedelem", [("workers/openrouter-proxy/src/index.js", 153, 160)]),
    ("M2.15b", "Worker rate limit es kulcsellenorzes", [("workers/openrouter-proxy/src/index.js", 162, 180)]),
    ("M2.15c", "Worker uzenet es domain validacio", [("workers/openrouter-proxy/src/index.js", 182, 197)]),
    ("M2.15d", "OpenRouter API hivas", [("workers/openrouter-proxy/src/index.js", 198, 216)]),
    ("M2.15e", "OpenRouter valasz parse", [("workers/openrouter-proxy/src/index.js", 217, 224)]),
]


KEYWORDS = {
    "async", "await", "const", "let", "return", "if", "else", "for", "while",
    "try", "catch", "throw", "new", "import", "from", "export", "class",
    "interface", "type", "private", "public", "function", "true", "false",
    "null", "undefined", "allow", "match", "request", "resource",
}


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default(size=size)


CODE_FONT = font(r"C:\Windows\Fonts\consola.ttf", 20)
CODE_FONT_BOLD = font(r"C:\Windows\Fonts\consolab.ttf", 20)
TITLE_FONT = font(r"C:\Windows\Fonts\segoeuib.ttf", 26)
META_FONT = font(r"C:\Windows\Fonts\segoeui.ttf", 17)


COLORS = {
    "bg": (14, 18, 28),
    "panel": (20, 27, 41),
    "header": (28, 38, 56),
    "line": (103, 232, 249),
    "number": (125, 142, 166),
    "text": (226, 232, 240),
    "keyword": (96, 165, 250),
    "string": (134, 239, 172),
    "comment": (148, 163, 184),
    "punct": (203, 213, 225),
    "separator": (56, 68, 92),
}


def read_range(relative_path: str, start: int, end: int) -> list[tuple[int, str]]:
    path = ROOT / relative_path
    lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    actual_end = min(end, len(lines))
    return [(line_no, lines[line_no - 1]) for line_no in range(start, actual_end + 1)]


def slug(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def draw_highlighted(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str) -> None:
    x, y = xy
    token_pattern = re.compile(r"(//.*|'.*?'|\".*?\"|`.*?`|\b[A-Za-z_][A-Za-z0-9_]*\b|\d+|[^\w\s]+|\s+)")
    for token in token_pattern.findall(text):
        color = COLORS["text"]
        font_used = CODE_FONT
        if token.strip().startswith("//"):
            color = COLORS["comment"]
        elif token.startswith(("'", '"', "`")):
            color = COLORS["string"]
        elif token in KEYWORDS:
            color = COLORS["keyword"]
            font_used = CODE_FONT_BOLD
        elif re.fullmatch(r"[^\w\s]+", token):
            color = COLORS["punct"]
        draw.text((x, y), token, fill=color, font=font_used)
        x += int(draw.textlength(token, font=font_used))


def wrapped_code_lines(line: str, width: int = 112) -> list[str]:
    if len(line) <= width:
        return [line]
    indent = len(line) - len(line.lstrip(" "))
    continuation = " " * min(indent + 2, 18)
    return textwrap.wrap(
        line,
        width=width,
        replace_whitespace=False,
        drop_whitespace=False,
        subsequent_indent=continuation,
    )


def build_snippet_image(snippet_id: str, title: str, ranges: list[tuple[str, int, int]]) -> Path:
    sections: list[tuple[str, int | None, str]] = []
    for index, (relative_path, start, end) in enumerate(ranges):
      if index > 0:
          sections.append(("gap", None, ""))
      sections.append(("file", None, f"{relative_path}  |  {start}-{end}. sor"))
      for line_no, line in read_range(relative_path, start, end):
          for wrapped_index, wrapped in enumerate(wrapped_code_lines(line)):
              sections.append(("code", line_no if wrapped_index == 0 else None, wrapped))

    line_height = 29
    width = 1720
    header_h = 102
    padding = 28
    height = header_h + padding + len(sections) * line_height + padding
    height = min(max(height, 500), 8200)

    image = Image.new("RGB", (width, height), COLORS["bg"])
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((16, 16, width - 16, height - 16), radius=18, fill=COLORS["panel"])
    draw.rounded_rectangle((16, 16, width - 16, 96), radius=18, fill=COLORS["header"])
    draw.rectangle((16, 58, width - 16, 96), fill=COLORS["header"])
    draw.rectangle((40, 44, 50, 68), fill=COLORS["line"])
    draw.text((68, 34), f"{snippet_id} - {title}", fill=COLORS["text"], font=TITLE_FONT)

    y = header_h + 10
    for kind, line_no, text in sections:
        if y > height - 48:
            draw.text((72, y), "... a kodreszlet folytatodik a forrasfajlban ...", fill=COLORS["comment"], font=CODE_FONT)
            break
        if kind == "gap":
            draw.line((40, y + 12, width - 40, y + 12), fill=COLORS["separator"], width=1)
            y += line_height
            continue
        if kind == "file":
            draw.text((72, y), text, fill=COLORS["line"], font=META_FONT)
            y += line_height
            continue

        number = "" if line_no is None else str(line_no)
        draw.text((54, y), number.rjust(4), fill=COLORS["number"], font=CODE_FONT)
        draw.line((126, y - 3, 126, y + line_height - 5), fill=COLORS["separator"], width=1)
        draw_highlighted(draw, (150, y), text)
        y += line_height

    out_name = f"{snippet_id.replace('.', '_')}_{slug(title)}.png"
    out_path = OUT_DIR / out_name
    image.save(out_path, optimize=True)
    return out_path


def write_readme(paths: list[Path]) -> None:
    lines = [
        "# Kodreszlet-kepek a szakdolgozat mellekletehez",
        "",
        "A kepek a `tools/create_code_snippet_images.py` scriptbol generalhatok ujra.",
        "A fajlnevek M2.1-M2.15 mellekletazonositokkal kezdodnek, hogy Wordben is konnyen hivatkozhatok legyenek.",
        "",
    ]
    for path in paths:
        lines.append(f"- `{path.name}`")
    (OUT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = [build_snippet_image(*snippet) for snippet in SNIPPETS]
    write_readme(paths)
    print(OUT_DIR)
    for path in paths:
        print(path.name)


if __name__ == "__main__":
    main()
