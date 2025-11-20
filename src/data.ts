export type ComponentCategory =
  | 'CPU'
  | 'GPU'
  | 'Motherboard'
  | 'Memory'
  | 'Storage'
  | 'Cooling'
  | 'Case'
  | 'Power';

export type ComponentPart = {
  id: string;
  name: string;
  brand: string;
  category: ComponentCategory;
  price: number;
  wattage: number;
  notes?: string;
};

export type BuildPlan = {
  id: string;
  name: string;
  purpose: string;
  budget: number;
  parts: ComponentPart[];
  notes: string;
};

export type OrderItem = {
  id: string;
  vendor: string;
  items: string;
  eta: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
};

export const inventory: ComponentPart[] = [
  {
    id: 'cpu-01',
    name: 'Ryzen 9 7950X3D',
    brand: 'AMD',
    category: 'CPU',
    price: 699,
    wattage: 120,
    notes: '16c/32t, gaming + creation powerhouse'
  },
  {
    id: 'cpu-02',
    name: 'Core i7-14700K',
    brand: 'Intel',
    category: 'CPU',
    price: 469,
    wattage: 125,
    notes: 'Hybrid architecture, great all-rounder'
  },
  {
    id: 'gpu-01',
    name: 'RTX 4080 Super',
    brand: 'NVIDIA',
    category: 'GPU',
    price: 999,
    wattage: 320,
    notes: '4K ready with DLSS 3.5 support'
  },
  {
    id: 'gpu-02',
    name: 'Radeon RX 7900 XTX',
    brand: 'AMD',
    category: 'GPU',
    price: 899,
    wattage: 355,
    notes: 'Excellent raster performance, 24GB VRAM'
  },
  {
    id: 'mb-01',
    name: 'ASUS ROG Strix X670E-E',
    brand: 'ASUS',
    category: 'Motherboard',
    price: 489,
    wattage: 30,
    notes: 'PCIe 5.0, WiFi 6E, DDR5-ready'
  },
  {
    id: 'ram-01',
    name: 'Corsair Dominator 32GB DDR5-6000',
    brand: 'Corsair',
    category: 'Memory',
    price: 189,
    wattage: 20,
    notes: 'Low-latency kit tuned for Ryzen EXPO'
  },
  {
    id: 'storage-01',
    name: 'Samsung 990 PRO 2TB NVMe',
    brand: 'Samsung',
    category: 'Storage',
    price: 219,
    wattage: 8,
    notes: 'PCIe 4.0 with hardware encryption'
  },
  {
    id: 'cool-01',
    name: 'NZXT Kraken Elite 360',
    brand: 'NZXT',
    category: 'Cooling',
    price: 219,
    wattage: 9,
    notes: 'Quiet liquid cooling with LCD display'
  },
  {
    id: 'case-01',
    name: 'Fractal Design North',
    brand: 'Fractal',
    category: 'Case',
    price: 169,
    wattage: 0,
    notes: 'Airflow-optimized, natural wood front'
  },
  {
    id: 'psu-01',
    name: 'Corsair RM850x Shift',
    brand: 'Corsair',
    category: 'Power',
    price: 179,
    wattage: -850,
    notes: 'ATX 3.0 ready, side connectors for tidy builds'
  }
];

export const starterBuilds: BuildPlan[] = [
  {
    id: 'build-creator',
    name: 'Creator Studio',
    purpose: '4K editing, Blender, and streaming',
    budget: 2800,
    notes: 'Silent-first, workstation stability',
    parts: [inventory[0], inventory[2], inventory[4], inventory[5], inventory[6], inventory[7], inventory[8], inventory[9]]
  },
  {
    id: 'build-esports',
    name: 'Esports Velocity',
    purpose: 'High FPS competitive gaming',
    budget: 1800,
    notes: 'Latency tuned, high refresh displays',
    parts: [inventory[1], inventory[3], inventory[4], inventory[5], inventory[6], inventory[7], inventory[8], inventory[9]]
  }
];

export const sampleOrders: OrderItem[] = [
  {
    id: 'order-1001',
    vendor: 'Newegg',
    items: 'CPU, Motherboard',
    eta: '2 days',
    status: 'Shipped'
  },
  {
    id: 'order-1002',
    vendor: 'Amazon',
    items: 'Case, PSU, Memory',
    eta: 'Arriving today',
    status: 'Delivered'
  },
  {
    id: 'order-1003',
    vendor: 'MicroCenter',
    items: 'GPU',
    eta: '5 days',
    status: 'Processing'
  }
];
