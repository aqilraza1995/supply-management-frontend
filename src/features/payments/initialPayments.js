/**
 * Initial Seed Data: Payments
 * Demonstrates FIFO settlement with allocations against oldest supply records
 */

const getOffsetDate = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_PAYMENTS = [
  // Rahul Fish Supplier: Day 1 payment of ₹50,000
  {
    id: 'pmt-rec-201',
    supplierId: 'sup-1',
    amount: 50000,
    paymentDate: getOffsetDate(3),
    paymentMethod: 'Bank Transfer / NEFT / RTGS',
    notes: 'Advance part payment for Hilsa shipment 1',
    allocations: [
      {
        supplyId: 'sup-rec-101',
        supplyCategory: 'Hilsa',
        supplyDate: getOffsetDate(4),
        amount: 50000,
        previousBalance: 100000,
        remainingBalance: 50000,
      },
    ],
    createdAt: `${getOffsetDate(3)}T14:30:00.000Z`,
  },
  // Rahul Fish Supplier: Day 2 payment of ₹1,00,000
  // Settle Day 1 supply completely (₹50k -> ₹0) and Day 2 supply partly (₹100k -> ₹50k)
  {
    id: 'pmt-rec-202',
    supplierId: 'sup-1',
    amount: 100000,
    paymentDate: getOffsetDate(1),
    paymentMethod: 'Bank Transfer / NEFT / RTGS',
    notes: 'FIFO settlement: clears batch 1 remainder and 50% of batch 2',
    allocations: [
      {
        supplyId: 'sup-rec-101',
        supplyCategory: 'Hilsa',
        supplyDate: getOffsetDate(4),
        amount: 50000,
        previousBalance: 50000,
        remainingBalance: 0,
      },
      {
        supplyId: 'sup-rec-102',
        supplyCategory: 'Hilsa',
        supplyDate: getOffsetDate(1),
        amount: 50000,
        previousBalance: 100000,
        remainingBalance: 50000,
      },
    ],
    createdAt: `${getOffsetDate(1)}T16:00:00.000Z`,
  },

  // Apex Marine Traders: ₹2,00,000 payment
  // Settle Tiger Prawns (₹1,50,000 -> ₹0) and Pomfret (₹2,00,000 -> ₹1,50,000)
  {
    id: 'pmt-rec-203',
    supplierId: 'sup-2',
    amount: 200000,
    paymentDate: getOffsetDate(1),
    paymentMethod: 'Cheque',
    notes: 'Cheque #449281 cleared via HDFC',
    allocations: [
      {
        supplyId: 'sup-rec-103',
        supplyCategory: 'Tiger Prawns',
        supplyDate: getOffsetDate(5),
        amount: 150000,
        previousBalance: 150000,
        remainingBalance: 0,
      },
      {
        supplyId: 'sup-rec-104',
        supplyCategory: 'Pomfret',
        supplyDate: getOffsetDate(2),
        amount: 50000,
        previousBalance: 200000,
        remainingBalance: 150000,
      },
    ],
    createdAt: `${getOffsetDate(1)}T15:20:00.000Z`,
  },

  // Sundarbans Coastal Supply: Full settlement of ₹80,000
  {
    id: 'pmt-rec-204',
    supplierId: 'sup-3',
    amount: 80000,
    paymentDate: getOffsetDate(4),
    paymentMethod: 'UPI / Online',
    notes: 'UPI Ref 4291880019 Full settlement',
    allocations: [
      {
        supplyId: 'sup-rec-105',
        supplyCategory: 'Crab',
        supplyDate: getOffsetDate(6),
        amount: 80000,
        previousBalance: 80000,
        remainingBalance: 0,
      },
    ],
    createdAt: `${getOffsetDate(4)}T12:00:00.000Z`,
  },

  // Kolkata Agro Fisheries: ₹1,20,000 settlement of Rohu
  {
    id: 'pmt-rec-205',
    supplierId: 'sup-4',
    amount: 120000,
    paymentDate: getOffsetDate(2),
    paymentMethod: 'Bank Transfer / NEFT / RTGS',
    notes: 'Direct RTGS to SBI Account',
    allocations: [
      {
        supplyId: 'sup-rec-106',
        supplyCategory: 'Rohu',
        supplyDate: getOffsetDate(3),
        amount: 120000,
        previousBalance: 120000,
        remainingBalance: 0,
      },
    ],
    createdAt: `${getOffsetDate(2)}T10:45:00.000Z`,
  },

  // Riverine Catch Co.: ₹95,000 today's payment
  {
    id: 'pmt-rec-206',
    supplierId: 'sup-6',
    amount: 95000,
    paymentDate: getOffsetDate(0),
    paymentMethod: 'UPI / Online',
    notes: 'Instant UPI payout upon harbour delivery confirmation',
    allocations: [
      {
        supplyId: 'sup-rec-109',
        supplyCategory: 'Bhetki',
        supplyDate: getOffsetDate(0),
        amount: 95000,
        previousBalance: 95000,
        remainingBalance: 0,
      },
    ],
    createdAt: `${getOffsetDate(0)}T11:00:00.000Z`,
  },

  // Himalayan Trout & Marine: ₹50,000 payment
  {
    id: 'pmt-rec-207',
    supplierId: 'sup-7',
    amount: 50000,
    paymentDate: getOffsetDate(1),
    paymentMethod: 'Bank Transfer / NEFT / RTGS',
    notes: 'Partial payment against invoice #HTM-2601',
    allocations: [
      {
        supplyId: 'sup-rec-110',
        supplyCategory: 'Salmon',
        supplyDate: getOffsetDate(2),
        amount: 50000,
        previousBalance: 110000,
        remainingBalance: 60000,
      },
    ],
    createdAt: `${getOffsetDate(1)}T13:10:00.000Z`,
  },
];
