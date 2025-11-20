export function createBuild(name, budget = 0, parts = []) {
  if (!name || typeof name !== 'string') throw new Error('Build name required');
  const cleanParts = parts.map(parsePart).filter((p) => p.name && p.price >= 0);
  return {
    name: name.trim(),
    budget: Number(budget) || 0,
    parts: cleanParts,
  };
}

export function parsePart(entry) {
  if (typeof entry === 'string') {
    const match = entry.match(/(.+?)\s*\$?(\d+(?:\.\d+)?)/);
    if (!match) return { name: entry.trim(), price: 0 };
    return { name: match[1].trim(), price: Number(match[2]) };
  }
  return { name: entry.name?.trim() ?? '', price: Number(entry.price) || 0 };
}

export function calculateTotalCost(build) {
  return (build.parts || []).reduce((sum, part) => sum + (part.price || 0), 0);
}

export function summarizeBuild(build) {
  const total = calculateTotalCost(build);
  const variance = build.budget ? build.budget - total : null;
  return { total, variance };
}

export function compareBuilds(buildA, buildB) {
  if (!buildA || !buildB) throw new Error('Two builds required');
  const summaryA = summarizeBuild(buildA);
  const summaryB = summarizeBuild(buildB);
  const betterValue = summaryA.total === summaryB.total ? 'Tie' : summaryA.total < summaryB.total ? buildA.name : buildB.name;
  return {
    costDelta: summaryA.total - summaryB.total,
    betterValue,
    byBudgetRoom: (buildA.budget - summaryA.total) - (buildB.budget - summaryB.total),
  };
}

export function addOrder(orders, buildName, item, status = 'Processing') {
  const record = {
    id: crypto.randomUUID(),
    build: buildName,
    item,
    status,
    returned: false,
  };
  return [...orders, record];
}

export function updateOrderStatus(orders, id, status) {
  return orders.map((order) => (order.id === id ? { ...order, status } : order));
}

export function recordReturn(orders, id) {
  return orders.map((order) => (order.id === id ? { ...order, status: 'Returned', returned: true } : order));
}

export function computeReturnRate(orders) {
  if (!orders.length) return 0;
  const returned = orders.filter((o) => o.returned).length;
  return Math.round((returned / orders.length) * 100);
}

export function filterIdeas(ideas, keyword) {
  if (!keyword) return ideas;
  const query = keyword.toLowerCase();
  return ideas.filter((idea) => idea.title.toLowerCase().includes(query) || idea.summary.toLowerCase().includes(query));
}
