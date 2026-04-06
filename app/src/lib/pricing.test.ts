import { calculateQuote, calculateTieredQuotes, PricingConfig } from './pricing';

const baseConfig: PricingConfig = {
  productType: 'cake',
  tiers: 1,
  quantity: 1,
  flavor: 'Vanilla',
  filling: 'None',
  addOns: [],
  themeComplexity: 0,
  zipCode: '90001', // non-premium zip
};

describe('calculateQuote', () => {
  it('returns correct structure with all expected fields', () => {
    const result = calculateQuote(baseConfig);
    expect(result).toHaveProperty('base');
    expect(result).toHaveProperty('decor');
    expect(result).toHaveProperty('filling');
    expect(result).toHaveProperty('addOns');
    expect(result).toHaveProperty('overhead');
    expect(result).toHaveProperty('complexityTax');
    expect(result).toHaveProperty('marketAdjustment');
    expect(result).toHaveProperty('serviceFee');
    expect(result).toHaveProperty('total');
  });

  it('calculates basic cake: 1 tier, no filling, no add-ons, non-premium zip, complexity 0', () => {
    const result = calculateQuote(baseConfig);
    // base=65, decor=30, filling=0, addOns=0, overhead=15, complexityTax=0
    // marketAdjustment = floor((30+0)*(1.10-1)) = floor(3) = 3
    // total = ceil(65+30+0+0+15+0+3+10) = ceil(123) = 123
    expect(result.base).toBe(65);
    expect(result.decor).toBe(30);
    expect(result.filling).toBe(0);
    expect(result.addOns).toBe(0);
    expect(result.overhead).toBe(15);
    expect(result.complexityTax).toBe(0);
    expect(result.serviceFee).toBe(10);
    expect(result.total).toBe(123);
  });

  it('calculates cupcakes: quantity 12, no filling → base = 45', () => {
    const config: PricingConfig = { ...baseConfig, productType: 'cupcakes', quantity: 12, tiers: 0 };
    const result = calculateQuote(config);
    expect(result.base).toBe(45);
  });

  it('applies complexity tax when themeComplexity > 0.6', () => {
    const config: PricingConfig = { ...baseConfig, themeComplexity: 0.7 };
    const result = calculateQuote(config);
    // decorCost = 30 + 0.7*100 = 100
    // complexityTax = round(100 * 0.12) = 12
    expect(result.complexityTax).toBe(12);
    expect(result.complexityTax).toBeGreaterThan(0);
  });

  it('does NOT apply complexity tax when themeComplexity = 0.6', () => {
    const config: PricingConfig = { ...baseConfig, themeComplexity: 0.6 };
    const result = calculateQuote(config);
    expect(result.complexityTax).toBe(0);
  });

  it('applies 1.40 market multiplier for premium zip starting with "100"', () => {
    const standardResult = calculateQuote({ ...baseConfig, addOns: ['Chocolate Drip'] });
    const premiumResult = calculateQuote({ ...baseConfig, addOns: ['Chocolate Drip'], zipCode: '10001' });
    expect(premiumResult.marketAdjustment).toBeGreaterThan(standardResult.marketAdjustment);
    // marketAdjustment with premium zip = floor((30+15)*(1.40-1))
    // Note: (1.40 - 1) has float precision so floor(45 * 0.3999...) = 17
    expect(premiumResult.marketAdjustment).toBe(17);
  });

  it('service fee is always 10', () => {
    expect(calculateQuote(baseConfig).serviceFee).toBe(10);
    expect(calculateQuote({ ...baseConfig, productType: 'cupcakes', quantity: 24 }).serviceFee).toBe(10);
  });

  it('overhead defaults to 15', () => {
    expect(calculateQuote(baseConfig).overhead).toBe(15);
  });

  it('overhead uses overheadBuffer when provided', () => {
    const result = calculateQuote({ ...baseConfig, overheadBuffer: 25 });
    expect(result.overhead).toBe(25);
  });

  it('total equals ceiling of all components summed', () => {
    const result = calculateQuote(baseConfig);
    const rawTotal = result.base + result.decor + result.filling + result.addOns + result.overhead + result.complexityTax + result.marketAdjustment + result.serviceFee;
    expect(result.total).toBe(Math.ceil(rawTotal));
  });
});

describe('calculateTieredQuotes', () => {
  it('returns good, better, and best tiers', () => {
    const result = calculateTieredQuotes(baseConfig);
    expect(result).toHaveProperty('good');
    expect(result).toHaveProperty('better');
    expect(result).toHaveProperty('best');
    expect(result.good.tier).toBe('good');
    expect(result.better.tier).toBe('better');
    expect(result.best.tier).toBe('best');
  });

  it('good.total <= better.total <= best.total', () => {
    const result = calculateTieredQuotes(baseConfig);
    expect(result.good.total).toBeLessThanOrEqual(result.better.total);
    expect(result.better.total).toBeLessThanOrEqual(result.best.total);
  });

  it('tiered ordering holds with premium add-ons and high complexity', () => {
    const config: PricingConfig = {
      ...baseConfig,
      tiers: 3,
      themeComplexity: 0.8,
      addOns: ['Gold Leaf', 'Hand-painted'],
    };
    const result = calculateTieredQuotes(config);
    expect(result.good.total).toBeLessThanOrEqual(result.better.total);
    expect(result.better.total).toBeLessThanOrEqual(result.best.total);
  });
});
