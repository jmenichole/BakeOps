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
}

export interface QuoteBreakdown {
  base: number;
  decor: number;
  filling: number;
  addOns: number;
  marketAdjustment: number;
  serviceFee: number;
  total: number;
}

export function calculateQuote(config: PricingConfig): QuoteBreakdown {
  const { productType, tiers, quantity, filling, addOns, themeComplexity, zipCode } = config;
  
  let base = 0;
  let fillingCost = 0;
  let decorCost = 0;
  let addOnsPrice = 0;
  const serviceFee = 25;

  // 1. High-Cost Area Multiplier (Premium Audit Aesthetics)
  const premiumZips = ['100', '902', '941', '606', '331', '752']; // NYC, Beverly Hills, SF, Chicago, Miami, Dallas
  const isHighCostArea = zipCode ? premiumZips.some(prefix => zipCode.startsWith(prefix)) : false;
  const marketMultiplier = isHighCostArea ? 1.45 : 1.15;

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

  // 4. Market Adjustment (Labor + Area)
  const marketAdjustment = Math.floor((decorCost + addOnsPrice) * (marketMultiplier - 1));

  const total = base + decorCost + fillingCost + addOnsPrice + marketAdjustment + serviceFee;

  return {
    base,
    decor: decorCost,
    filling: fillingCost,
    addOns: addOnsPrice,
    marketAdjustment,
    serviceFee,
    total: Math.ceil(total),
  };
}
