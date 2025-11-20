import { BuildPlan, ComponentPart } from '../data';

type Totals = {
  cost: number;
  wattage: number;
};

export const sumParts = (parts: ComponentPart[]): Totals =>
  parts.reduce(
    (acc, part) => ({
      cost: acc.cost + part.price,
      wattage: acc.wattage + part.wattage
    }),
    { cost: 0, wattage: 0 }
  );

export const estimateHeadroom = (parts: ComponentPart[]): number => {
  const { wattage } = sumParts(parts);
  const absolute = Math.max(0, wattage + 150);
  return Math.min(1200, absolute);
};

export const budgetHealth = (build: BuildPlan): number => {
  const { cost } = sumParts(build.parts);
  if (build.budget === 0) return 0;
  const remaining = build.budget - cost;
  return Math.round((remaining / build.budget) * 100);
};

export const statusAccent = (status: string): string => {
  switch (status) {
    case 'Delivered':
      return 'text-emerald-400 bg-emerald-500/10';
    case 'Shipped':
      return 'text-sky-400 bg-sky-500/10';
    case 'Processing':
      return 'text-amber-400 bg-amber-500/10';
    case 'Returned':
      return 'text-rose-400 bg-rose-500/10';
    default:
      return 'text-slate-200 bg-slate-700/30';
  }
};
