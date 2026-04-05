/**
 * BakeBot Pricing Engine
 * Handles complex cake and baked goods pricing logic.
 */

export interface PricingConfig {
  productType: string;
  tiers: number;
  quantity: number;
  flavor: string;
  filling: string;
  addOns: string[];
  themeComplexity: number; // 0-1 range
  zipCode?: string | null;
  /** Monthly overhead (utilities, rent) allocated per order. Defaults to $15. */
  overheadBuffer?: number;
}

export interface QuoteBreakdown {
  base: number;
  decor: number;
  filling: number;
  addOns: number;
  /** Overhead/utility buffer allocated to this order */
  overhead: number;
  /** Complexity surcharge for intricate piping, sugar flowers, etc. */
  complexityTax: number;
  marketAdjustment: number;
  serviceFee: number;
  total: number;
}

export interface TieredQuote extends QuoteBreakdown {
  tier: 'good' | 'better' | 'best';
  label: string;
  description: string;
}

export interface TieredQuotes {
  good: TieredQuote;
  better: TieredQuote;
  best: TieredQuote;
}

export function calculateQuote(config: PricingConfig): QuoteBreakdown {
  const { productType, tiers, quantity, filling, addOns, themeComplexity, zipCode } = config;
  
  let base = 0;
  let fillingCost = 0;
  let decorCost = 0;
  let addOnsPrice = 0;
  const serviceFee = 10;

  // 1. High-Cost Area Multiplier (Premium Audit Aesthetics)
  const premiumZips = ['100', '902', '941', '606', '331', '752']; // NYC, Beverly Hills, SF, Chicago, Miami, Dallas
  const isHighCostArea = zipCode ? premiumZips.some(prefix => zipCode.startsWith(prefix)) : false;
  const marketMultiplier = isHighCostArea ? 1.40 : 1.10;

  // 2. Base Product Pricing
  if (productType === 'cake') {
    // Cakes are priced tiers * $65 base
    base = tiers * 65;
    fillingCost = (filling === 'None' || !filling) ? 0 : 15;
    decorCost = 30 + (themeComplexity * 100); // Decors vary by complexity
  } else if (productType === 'cupcakes') {
    base = (quantity / 12) * 45;
    fillingCost = (filling === 'None' || !filling) ? 0 : 10;
    decorCost = 15 + (themeComplexity * 50);
  } else {
    // Cookies/Cake Pops
    base = (quantity / 12) * 35;
    fillingCost = 0;
    decorCost = 10 + (themeComplexity * 40);
  }

  // 3. Add-ons Calculation
  const addonPricing: Record<string, number> = {
    'Fondant Work': 45,
    'Gold Leaf': 35,
    'Hand-painted': 60,
    'Fresh Flowers': 25,
    'Acrylic Topper': 20,
    'Chocolate Drip': 15,
  };

  addOns.forEach(opt => {
    addOnsPrice += addonPricing[opt] || 20;
  });

  /** Complexity threshold above which the surcharge activates (0–1 scale). */
  const COMPLEXITY_TAX_THRESHOLD = 0.6;
  /** Fraction of decoration cost charged as the complexity surcharge. */
  const COMPLEXITY_TAX_RATE = 0.12;

  // 4. Overhead buffer (utilities, rent per order)
  const overhead = config.overheadBuffer ?? 15;

  // 5. Complexity tax: surcharge on decoration for highly intricate designs
  //    (intricate piping, sugar flowers, hand-sculpted elements)
  const complexityTax = themeComplexity > COMPLEXITY_TAX_THRESHOLD
    ? Math.round(decorCost * COMPLEXITY_TAX_RATE)
    : 0;

  // 6. Market Adjustment (Labor + Area)
  const marketAdjustment = Math.floor((decorCost + addOnsPrice) * (marketMultiplier - 1));

  const total = base + decorCost + fillingCost + addOnsPrice + overhead + complexityTax + marketAdjustment + serviceFee;

  return {
    base,
    decor: decorCost,
    filling: fillingCost,
    addOns: addOnsPrice,
    overhead,
    complexityTax,
    marketAdjustment,
    serviceFee,
    total: Math.ceil(total),
  };
}

/** Multiplier applied to themeComplexity for the "Good" tier (simpler design). */
const GOOD_TIER_COMPLEXITY_SCALE = 0.5;
/** Maximum themeComplexity allowed for the "Good" tier. */
const GOOD_TIER_COMPLEXITY_CAP = 0.3;
/** Amount added to themeComplexity for the "Best" tier (more intricate design). */
const BEST_TIER_COMPLEXITY_BOOST = 0.3;

/**
 * Generates a "Good, Better, Best" tiered quote for a single order config.
 * - Good:   Simple buttercream finish, no premium add-ons
 * - Better: The design as described by the baker
 * - Best:   Full fondant upgrade + premium add-ons
 */
export function calculateTieredQuotes(config: PricingConfig): TieredQuotes {
  const goodConfig: PricingConfig = {
    ...config,
    addOns: [],
    themeComplexity: Math.min(config.themeComplexity * GOOD_TIER_COMPLEXITY_SCALE, GOOD_TIER_COMPLEXITY_CAP),
  };

  const betterConfig: PricingConfig = { ...config };

  const premiumAddOns = Array.from(new Set([...config.addOns, 'Fondant Work', 'Acrylic Topper']));
  const bestConfig: PricingConfig = {
    ...config,
    addOns: premiumAddOns,
    themeComplexity: Math.min(config.themeComplexity + BEST_TIER_COMPLEXITY_BOOST, 1.0),
  };

  return {
    good: {
      ...calculateQuote(goodConfig),
      tier: 'good',
      label: 'Good',
      description: 'Simple buttercream finish',
    },
    better: {
      ...calculateQuote(betterConfig),
      tier: 'better',
      label: 'Better',
      description: 'Your design as described',
    },
    best: {
      ...calculateQuote(bestConfig),
      tier: 'best',
      label: 'Best',
      description: 'Full fondant with premium upgrades',
    },
  };
}
