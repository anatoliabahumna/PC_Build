import { type ReactNode, useMemo, useState } from 'react';
import { BuildPlan, ComponentCategory, ComponentPart, inventory, sampleOrders, starterBuilds } from './data';
import { budgetHealth, estimateHeadroom, statusAccent, sumParts } from './utils/calculations';

const categories: (ComponentCategory | 'All')[] = ['All', 'CPU', 'GPU', 'Motherboard', 'Memory', 'Storage', 'Cooling', 'Case', 'Power'];

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <div className="card">
    <div className="section-title">
      <div>
        <div className="badge">FUTURAFORGE</div>
        <h2>{title}</h2>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
    {children}
  </div>
);

const InfoPill = ({ label, value }: { label: string; value: string }) => (
  <div className="pill">
    <strong>{label}</strong>&nbsp;{value}
  </div>
);

export default function App() {
  const [activeBuild, setActiveBuild] = useState<BuildPlan>({ ...starterBuilds[0] });
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'All'>('All');
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState<string[]>(['Route GPU cables behind shroud', 'Thermal paste cross-pattern reminder']);
  const [orders, setOrders] = useState(sampleOrders);
  const [returns, setReturns] = useState<string[]>([]);

  const totals = useMemo(() => sumParts(activeBuild.parts), [activeBuild.parts]);
  const wattageHeadroom = useMemo(() => estimateHeadroom(activeBuild.parts), [activeBuild.parts]);
  const budgetRemaining = useMemo(() => budgetHealth(activeBuild), [activeBuild]);

  const addPartToBuild = (part: ComponentPart) => {
    setActiveBuild((prev) => ({
      ...prev,
      parts: [...prev.parts, part]
    }));
  };

  const swapBuild = (build: BuildPlan) => {
    setActiveBuild({ ...build });
  };

  const recordIdea = () => {
    if (idea.trim().length === 0) return;
    setIdeas((prev) => [idea.trim(), ...prev]);
    setIdea('');
  };

  const submitReturn = (orderId: string) => {
    setReturns((prev) => [`Return initiated for ${orderId}`, ...prev]);
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'Returned' } : order)));
  };

  const filteredParts = useMemo(
    () => (selectedCategory === 'All' ? inventory : inventory.filter((item) => item.category === selectedCategory)),
    [selectedCategory]
  );

  const comparisonBuild = starterBuilds.find((build) => build.id !== activeBuild.id) ?? starterBuilds[0];
  const comparisonTotals = sumParts(comparisonBuild.parts);

  return (
    <div className="app-shell">
      <header className="card" style={{ padding: '28px' }}>
        <div className="section-title">
          <div>
            <div className="badge">FuturaForge OS</div>
            <h1 style={{ margin: '12px 0 4px' }}>Ultimate PC Build Command Center</h1>
            <small>Plan, compare, forecast, and ship-ready your dream rig with lightning-fast UI.</small>
          </div>
          <div className="list">
            <InfoPill label="Budget delta" value={`${budgetRemaining}%`} />
            <InfoPill label="Power headroom" value={`${wattageHeadroom}W`} />
            <InfoPill label="Parts onboard" value={`${activeBuild.parts.length}`} />
          </div>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Section title="Build Planner" subtitle="Drag-and-drop free planning with instant telemetry">
          <div className="list" style={{ marginBottom: 12 }}>
            {starterBuilds.map((build) => (
              <button key={build.id} className="button secondary" onClick={() => swapBuild(build)}>
                {build.name}
              </button>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <h3 style={{ margin: '0 0 8px' }}>{activeBuild.name}</h3>
              <p style={{ color: '#cbd5e1', marginTop: 0 }}>{activeBuild.purpose}</p>
              <div className="list">
                <InfoPill label="Budget" value={`$${activeBuild.budget.toLocaleString()}`} />
                <InfoPill label="Spend" value={`$${totals.cost.toLocaleString()}`} />
                <InfoPill label="Wattage" value={`${totals.wattage}W`} />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: 16, display: 'grid', gap: 8 }}>
                {activeBuild.parts.map((part) => (
                  <li key={part.id} className="pill" aria-label={`part-${part.id}`}>
                    <strong>{part.name}</strong> · {part.category} · ${part.price}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>Capture build notes</label>
              <textarea
                className="input"
                rows={6}
                aria-label="build-notes"
                defaultValue={activeBuild.notes}
                style={{ resize: 'vertical' }}
              />
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button className="button">Lock layout</button>
                <button className="button secondary">Export as checklist</button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Component Library" subtitle="Filter by role and add to your live build">
          <div className="list" style={{ marginBottom: 10 }}>
            {categories.map((category) => (
              <button
                key={category}
                className="button secondary"
                onClick={() => setSelectedCategory(category)}
                aria-label={`category-${category}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {filteredParts.map((part) => (
              <div key={part.id} className="card" style={{ padding: 14 }}>
                <div className="section-title">
                  <div>
                    <h3 style={{ margin: 0 }}>{part.name}</h3>
                    <small>{part.category}</small>
                  </div>
                  <InfoPill label={part.brand} value={`$${part.price}`} />
                </div>
                <p style={{ color: '#cbd5e1', minHeight: 40 }}>{part.notes}</p>
                <div className="list">
                  <span className="pill">{part.wattage}W</span>
                  <button className="button" onClick={() => addPartToBuild(part)} aria-label={`add-${part.id}`}>
                    Add to build
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', marginTop: 16 }}>
        <Section title="Compare & simulate" subtitle="Benchmark budget, wattage, and readiness">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[activeBuild, comparisonBuild].map((build) => {
              const summary = sumParts(build.parts);
              return (
                <div key={build.id} className="card" style={{ padding: 14 }}>
                  <h3 style={{ marginTop: 0 }}>{build.name}</h3>
                  <p style={{ color: '#cbd5e1' }}>{build.purpose}</p>
                  <div className="list">
                    <InfoPill label="Spend" value={`$${summary.cost}`} />
                    <InfoPill label="Wattage" value={`${summary.wattage}W`} />
                    <InfoPill label="Budget Fit" value={`${budgetHealth(build)}%`} />
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
                    {build.parts.slice(0, 5).map((part) => (
                      <li key={part.id} className="pill">
                        {part.category} · {part.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="list" style={{ marginTop: 12 }}>
            <InfoPill label="Power recommendation" value={`${wattageHeadroom}W PSU`} />
            <InfoPill label="Savings window" value={`$${(comparisonTotals.cost - totals.cost).toFixed(0)} delta`} />
            <InfoPill label="Readiness" value={budgetRemaining > 0 ? 'Under budget' : 'Over budget'} />
          </div>
        </Section>

        <Section title="Brainstorm & quick-capture" subtitle="Leave tactical notes, checklists, and risks">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              className="input"
              placeholder="Next idea: thermal targets, cable map, fan curves..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <button className="button" onClick={recordIdea} aria-label="add-idea">
              Add
            </button>
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ideas.map((note, index) => (
              <div key={`${note}-${index}`} className="pill" aria-label="idea-item">
                {note}
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', marginTop: 16 }}>
        <Section title="Order & return control" subtitle="Track every vendor, parcel, and RMA state">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Vendor</th>
                <th>Items</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} aria-label={`order-${order.id}`}>
                  <td>{order.id}</td>
                  <td>{order.vendor}</td>
                  <td>{order.items}</td>
                  <td>{order.eta}</td>
                  <td>
                    <span className={`pill ${statusAccent(order.status)}`}>{order.status}</span>
                  </td>
                  <td>
                    <button className="button secondary" onClick={() => submitReturn(order.id)} aria-label={`return-${order.id}`}>
                      Start return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {returns.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h4>Return log</h4>
              <ul>
                {returns.map((entry, idx) => (
                  <li key={`${entry}-${idx}`}>{entry}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section title="Health radar" subtitle="Instant risk + readiness report">
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
            <div className="pill" aria-label="budget-health">
              Budget health: <strong>{budgetRemaining}%</strong>
            </div>
            <div className="pill" aria-label="delivery-health">
              Orders: <strong>{orders.filter((o) => o.status === 'Delivered').length}</strong> delivered /
              {orders.length} total
            </div>
            <div className="pill" aria-label="headroom-health">
              Power headroom: <strong>{wattageHeadroom}W</strong> suggested
            </div>
            <div className="pill" aria-label="ideas-health">
              Ideas captured: <strong>{ideas.length}</strong>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="button secondary">Export PDF</button>
            <button className="button" style={{ marginLeft: 8 }}>
              Share to squad
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
