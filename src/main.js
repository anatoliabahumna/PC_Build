import {
  createBuild,
  parsePart,
  calculateTotalCost,
  summarizeBuild,
  compareBuilds,
  addOrder,
  recordReturn,
  computeReturnRate,
  filterIdeas,
} from './core/app.js';

const buildListEl = document.getElementById('build-list');
const orderListEl = document.getElementById('order-list');
const ideaListEl = document.getElementById('idea-list');
const compareOutputEl = document.getElementById('compare-output');

const builds = new Map();
let orders = [];

const ideas = [
  { title: 'Silence-first workstation', summary: 'Fanless PSU, acoustic panels, and low-RPM fans with thermal mapping.' },
  { title: 'RGB restraint', summary: 'Minimalist lighting, frosted panels, and subtle cyan underglow.' },
  { title: 'LAN party rocket', summary: 'Compact case, handle strap, Wi-Fi 7, and quick-disconnect cables.' },
  { title: 'AI creator rig', summary: 'Dual NVMe scratch disks, 64GB DDR5, and tuned power budget.' },
];

document.getElementById('filter-ideas').addEventListener('click', () => {
  const keyword = document.getElementById('idea-keyword').value;
  renderIdeas(filterIdeas(ideas, keyword));
});

document.getElementById('brainstorm-btn').addEventListener('click', () => {
  document.getElementById('idea-keyword').value = '';
  renderIdeas(ideas);
});

function refreshStats() {
  document.getElementById('build-count').textContent = builds.size;
  document.getElementById('order-count').textContent = orders.length;
  document.getElementById('return-rate').textContent = `${computeReturnRate(orders)}%`;
}

function renderIdeas(list) {
  ideaListEl.innerHTML = '';
  list.forEach((idea) => {
    const card = document.createElement('article');
    card.className = 'idea';
    card.innerHTML = `<p class="eyebrow">Idea</p><h4>${idea.title}</h4><p>${idea.summary}</p>`;
    ideaListEl.appendChild(card);
  });
}

function renderBuilds() {
  buildListEl.innerHTML = '';
  builds.forEach((build) => {
    const tpl = document.getElementById('build-card-template').content.cloneNode(true);
    tpl.querySelector('.build-title').textContent = build.name;
    tpl.querySelector('.budget-value').textContent = `$${build.budget.toLocaleString()}`;
    const partsList = tpl.querySelector('.parts');
    build.parts.forEach((part) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${part.name}</span><strong>$${part.price.toLocaleString()}</strong>`;
      partsList.appendChild(li);
    });
    const totals = tpl.querySelector('.totals');
    const summary = summarizeBuild(build);
    totals.innerHTML = `<strong>Total</strong> $${summary.total.toLocaleString()} | <span class="ls-secondary">Budget room: ${summary.variance != null ? `$${summary.variance.toLocaleString()}` : 'n/a'}</span>`;

    tpl.querySelector('.add-order-quick').addEventListener('click', () => quickOrder(build.name));

    buildListEl.appendChild(tpl);
  });
  refreshStats();
}

function renderOrders() {
  orderListEl.innerHTML = '';
  orders.forEach((order) => {
    const tpl = document.getElementById('order-row-template').content.cloneNode(true);
    tpl.querySelector('.order-build').textContent = order.build;
    tpl.querySelector('.order-item').textContent = order.item;
    tpl.querySelector('.status').textContent = order.status;
    tpl.querySelector('.mark-return').addEventListener('click', () => {
      orders = recordReturn(orders, order.id);
      renderOrders();
      refreshStats();
    });
    orderListEl.appendChild(tpl);
  });
  refreshStats();
}

function quickOrder(buildName) {
  const item = prompt('Item to track for this build?');
  if (!item) return;
  orders = addOrder(orders, buildName, item, 'Processing');
  renderOrders();
}

document.getElementById('save-build').addEventListener('click', () => {
  const name = document.getElementById('build-name').value;
  const budget = Number(document.getElementById('build-budget').value);
  const rawPart = document.getElementById('build-part').value;
  if (!name || !rawPart) return;
  const existing = builds.get(name);
  const parsedPart = parsePart(rawPart);
  if (existing) {
    existing.parts.push(parsedPart);
    existing.budget = budget || existing.budget;
    builds.set(name, existing);
  } else {
    builds.set(name, createBuild(name, budget, [parsedPart]));
  }
  renderBuilds();
  document.getElementById('build-part').value = '';
});

document.getElementById('add-order').addEventListener('click', () => {
  const buildName = document.getElementById('order-build').value;
  const item = document.getElementById('order-item').value;
  const status = document.getElementById('order-status').value || 'Processing';
  if (!buildName || !item) return;
  orders = addOrder(orders, buildName, item, status);
  renderOrders();
});

document.getElementById('run-compare').addEventListener('click', () => {
  const a = builds.get(document.getElementById('compare-a').value);
  const b = builds.get(document.getElementById('compare-b').value);
  if (!a || !b) {
    compareOutputEl.textContent = 'Select two existing builds to compare.';
    return;
  }
  const result = compareBuilds(a, b);
  const cheaper = result.costDelta === 0 ? 'They cost the same.' : `${result.costDelta > 0 ? b.name : a.name} is cheaper by $${Math.abs(result.costDelta).toLocaleString()}.`;
  const room = result.byBudgetRoom === 0 ? 'Equal headroom.' : `${result.byBudgetRoom > 0 ? a.name : b.name} has more budget flexibility.`;
  compareOutputEl.innerHTML = `<strong>${result.betterValue}</strong> wins on raw value. ${cheaper} ${room}`;
});

// Seed demo content
const starter = createBuild('Nebula Prime', 2500, ['GPU $799', 'CPU $429', 'Memory $189', 'Case $139']);
builds.set(starter.name, starter);
orders = addOrder(orders, 'Nebula Prime', 'RTX 5080 Vision', 'Processing');
orders = addOrder(orders, 'Nebula Prime', '650W SFX PSU', 'Delivered');
renderBuilds();
renderOrders();
renderIdeas(ideas);
refreshStats();
