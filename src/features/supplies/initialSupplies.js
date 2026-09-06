/**
 * Initial Seed Data: Supplies
 * Includes dynamic dates based on the current session day
 */

const getOffsetDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_SUPPLIES = [
  // Rahul Fish Supplier (sup-1): Day 1 & Day 2 scenario
  {
    id: 'sup-rec-101',
    supplierId: 'sup-1',
    category: 'Hilsa',
    quantity: 100,
    unit: 'KG',
    totalAmount: 100000,
    supplyDate: getOffsetDate(4),
    createdAt: `${getOffsetDate(4)}T08:00:00.000Z`,
    notes: 'Premium Padma Hilsa 1.2kg+ grade',
  },
  {
    id: 'sup-rec-102',
    supplierId: 'sup-1',
    category: 'Hilsa',
    quantity: 100,
    unit: 'KG',
    totalAmount: 100000,
    supplyDate: getOffsetDate(1),
    createdAt: `${getOffsetDate(1)}T08:30:00.000Z`,
    notes: 'Fresh arrival Chandpur harvest',
  },

  // Apex Marine Traders (sup-2)
  {
    id: 'sup-rec-103',
    supplierId: 'sup-2',
    category: 'Tiger Prawns',
    quantity: 150,
    unit: 'KG',
    totalAmount: 150000,
    supplyDate: getOffsetDate(5),
    createdAt: `${getOffsetDate(5)}T09:15:00.000Z`,
    notes: 'Deep sea jumbo tiger prawns',
  },
  {
    id: 'sup-rec-104',
    supplierId: 'sup-2',
    category: 'Pomfret',
    quantity: 200,
    unit: 'KG',
    totalAmount: 200000,
    supplyDate: getOffsetDate(2),
    createdAt: `${getOffsetDate(2)}T10:00:00.000Z`,
    notes: 'Silver pomfret grade A',
  },

  // Sundarbans Coastal Supply (sup-3) - Fully cleared balance
  {
    id: 'sup-rec-105',
    supplierId: 'sup-3',
    category: 'Crab',
    quantity: 80,
    unit: 'KG',
    totalAmount: 80000,
    supplyDate: getOffsetDate(6),
    createdAt: `${getOffsetDate(6)}T07:30:00.000Z`,
    notes: 'Live mud crabs premium export box',
  },

  // Kolkata Agro Fisheries (sup-4)
  {
    id: 'sup-rec-106',
    supplierId: 'sup-4',
    category: 'Rohu',
    quantity: 400,
    unit: 'KG',
    totalAmount: 120000,
    supplyDate: getOffsetDate(3),
    createdAt: `${getOffsetDate(3)}T06:45:00.000Z`,
    notes: 'Sweetwater rohu fresh netting',
  },
  // Today's supply 1 for sup-4
  {
    id: 'sup-rec-107',
    supplierId: 'sup-4',
    category: 'Katla',
    quantity: 200,
    unit: 'KG',
    totalAmount: 60000,
    supplyDate: getOffsetDate(0),
    createdAt: `${getOffsetDate(0)}T06:00:00.000Z`,
    notes: 'Sweetwater large katla batch',
  },

  // Bayview Seafood Export (sup-5) - Today's supply 2
  {
    id: 'sup-rec-108',
    supplierId: 'sup-5',
    category: 'Vannamei Shrimp',
    quantity: 500,
    unit: 'KG',
    totalAmount: 250000,
    supplyDate: getOffsetDate(0),
    createdAt: `${getOffsetDate(0)}T07:10:00.000Z`,
    notes: 'IQF head-on vannamei 30/40 count',
  },

  // Riverine Catch Co. (sup-6) - Today's supply 3
  {
    id: 'sup-rec-109',
    supplierId: 'sup-6',
    category: 'Bhetki',
    quantity: 120,
    unit: 'KG',
    totalAmount: 95000,
    supplyDate: getOffsetDate(0),
    createdAt: `${getOffsetDate(0)}T07:45:00.000Z`,
    notes: 'Sea bass bhetki medium size fillets',
  },

  // Himalayan Trout & Marine (sup-7)
  {
    id: 'sup-rec-110',
    supplierId: 'sup-7',
    category: 'Salmon',
    quantity: 110,
    unit: 'KG',
    totalAmount: 110000,
    supplyDate: getOffsetDate(2),
    createdAt: `${getOffsetDate(2)}T11:20:00.000Z`,
    notes: 'Cold water farm fresh trout/salmon',
  },
];
