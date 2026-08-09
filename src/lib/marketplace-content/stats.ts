/**
 * Single source of truth for every headline number and the one global price.
 * Any surface that shows catalogue size, category count or pricing MUST read
 * these constants — no locally invented numbers anywhere in the system.
 */
export const SOFTWARE_COUNT = "12,000+";
export const CATEGORY_COUNT = "80+";
export const LIVE_DEMO_LABEL = "Live Demos";

/** One price for the entire marketplace — lifetime, no per-product pricing. */
export const LIFETIME_PRICE = "$249";
export const LIFETIME_LABEL = "Lifetime";
export const LIFETIME_PRICE_FULL = `${LIFETIME_PRICE} ${LIFETIME_LABEL}`;

/** Minimum number of cards rendered in every category rail. */
export const MIN_ROW_CARDS = 40;
