import { inventory, starterBuilds } from '../data';
import { budgetHealth, estimateHeadroom, statusAccent, sumParts } from './calculations';

describe('calculations', () => {
  it('sums parts accurately', () => {
    const totals = sumParts([inventory[0], inventory[1]]);
    expect(totals.cost).toBe(inventory[0].price + inventory[1].price);
    expect(totals.wattage).toBe(inventory[0].wattage + inventory[1].wattage);
  });

  it('estimates power headroom with minimum buffer', () => {
    const headroom = estimateHeadroom([inventory[0]]);
    expect(headroom).toBeGreaterThan(inventory[0].wattage);
  });

  it('caps headroom at upper bound and guards negative totals', () => {
    const oversized = estimateHeadroom([...starterBuilds[0].parts, inventory[3]]);
    expect(oversized).toBeLessThanOrEqual(1200);
    const withPsuOffset = estimateHeadroom([inventory.find((p) => p.id === 'psu-01')!]);
    expect(withPsuOffset).toBe(0);
  });

  it('calculates budget health percentage', () => {
    const build = starterBuilds[0];
    const health = budgetHealth(build);
    expect(health).toBeLessThanOrEqual(100);
  });

  it('returns zero budget health for missing budget', () => {
    const health = budgetHealth({ ...starterBuilds[0], budget: 0 });
    expect(health).toBe(0);
  });

  it('maps order status to accent classes', () => {
    expect(statusAccent('Delivered')).toContain('emerald');
    expect(statusAccent('Returned')).toContain('rose');
    expect(statusAccent('Unknown')).toContain('slate');
  });
});
