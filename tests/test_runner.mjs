import assert from 'node:assert/strict';
import {
  addOrder,
  calculateTotalCost,
  compareBuilds,
  computeReturnRate,
  createBuild,
  filterIdeas,
  parsePart,
  recordReturn,
  summarizeBuild,
  updateOrderStatus,
} from '../src/core/app.js';

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const starter = createBuild('Test', 1000, ['GPU $500', { name: 'CPU', price: 300 }]);

test('createBuild normalizes parts and budget', () => {
  assert.equal(starter.parts.length, 2);
  assert.equal(starter.budget, 1000);
});

test('calculateTotalCost sums part prices', () => {
  assert.equal(calculateTotalCost(starter), 800);
});

test('summarizeBuild calculates variance', () => {
  const summary = summarizeBuild(starter);
  assert.equal(summary.total, 800);
  assert.equal(summary.variance, 200);
});

test('compareBuilds identifies better value and deltas', () => {
  const challenger = createBuild('Challenger', 900, ['GPU $400', 'CPU $200']);
  const result = compareBuilds(starter, challenger);
  assert.equal(result.betterValue, 'Challenger');
  assert.equal(result.costDelta, 200);
});

test('parsePart handles strings and objects', () => {
  assert.deepEqual(parsePart('Memory $120'), { name: 'Memory', price: 120 });
  assert.deepEqual(parsePart({ name: 'Case', price: '99' }), { name: 'Case', price: 99 });
});

test('orders can be added, updated, and returned', () => {
  let orders = addOrder([], 'Test', 'GPU', 'Processing');
  const id = orders[0].id;
  orders = updateOrderStatus(orders, id, 'Delivered');
  assert.equal(orders[0].status, 'Delivered');
  orders = recordReturn(orders, id);
  assert.equal(orders[0].returned, true);
  assert.equal(computeReturnRate(orders), 100);
});

test('filterIdeas matches by title and summary', () => {
  const ideas = [
    { title: 'Silent PC', summary: 'Noctua fans and dampening' },
    { title: 'Budget Build', summary: 'Value focus' },
  ];
  const filtered = filterIdeas(ideas, 'silent');
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'Silent PC');
});
