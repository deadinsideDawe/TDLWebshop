// Kozos akcios ar logika products/home/admin megjeleniteshez.
export interface SalePricingInput {
  price?: number;
  salePercent?: number;
  saleStartsAt?: number;
  saleEndsAt?: number;
  isWeeklyDeal?: boolean;
}

export interface ProductPricingResult {
  originalPrice: number;
  finalPrice: number;
  discountPercent: number;
  hasDiscount: boolean;
  isSaleActive: boolean;
}

export function getProductPricing(input: SalePricingInput, nowMs = Date.now()): ProductPricingResult {
  const originalPrice = Math.max(0, Number(input.price) || 0);
  const salePercent = normalizePercent(input.salePercent);
  const isSaleActive = isActiveSaleWindow(input.saleStartsAt, input.saleEndsAt, nowMs);

  const fallbackWeeklyDiscount = !!input.isWeeklyDeal && salePercent <= 0 ? 15 : 0;
  const effectivePercent = isSaleActive ? Math.max(salePercent, fallbackWeeklyDiscount) : fallbackWeeklyDiscount;
  const hasDiscount = effectivePercent > 0;
  const finalPrice = hasDiscount
    ? Math.max(0, Math.round(originalPrice * (1 - effectivePercent / 100)))
    : originalPrice;

  return {
    originalPrice,
    finalPrice,
    discountPercent: effectivePercent,
    hasDiscount,
    isSaleActive
  };
}

function normalizePercent(value?: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(95, Math.max(0, Math.round(parsed)));
}

function isActiveSaleWindow(startAt?: number, endAt?: number, nowMs = Date.now()): boolean {
  const start = Number(startAt);
  const end = Number(endAt);
  const hasStart = Number.isFinite(start) && start > 0;
  const hasEnd = Number.isFinite(end) && end > 0;

  if (!hasStart && !hasEnd) {
    return true;
  }

  if (hasStart && nowMs < start) {
    return false;
  }

  if (hasEnd && nowMs > end) {
    return false;
  }

  return true;
}
