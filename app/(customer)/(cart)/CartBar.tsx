// components/CartBar.tsx

import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CartBar() {
  const { state } = useCart();
  const router = useRouter();

  const itemCount = state.lines.reduce((n, l) => n + (l.baseUnit === 'pc' ? l.qtyBase : 1), 0);
  const { total } = computeCartTotals(state);

  if (!state.lines.length) return null;

  return (
    <View style={styles.wrap}>
        <Text>Cart</Text>
      <View style={styles.left}>
        <Text style={styles.count}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        <Text style={styles.total}>
          {state.currency}{total.toFixed(2)}
        </Text>
      </View>

      <Pressable onPress={() => router.push('/(customer)/(cart)/check-out')} style={styles.btn}>
        <Text style={styles.btnText}>Go to Checkout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    // position: 'absolute',
    // left: 12,
    // right: 12,
    // bottom: 12,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#0B72E7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    elevation: 10,
  },
  left: { flex: 1 },
  count: { color: '#DCEBFF', fontWeight: '700', fontSize: 12 },
  total: { color: '#fff', fontWeight: '800', fontSize: 16 },
  btn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: { color: '#0B72E7', fontWeight: '800' },
});





export type BaseUnit = 'g' | 'ml' | 'pc';

export type CartLine = {
  id: string;
  name: string;
  image?: string;
  // Pricing model: we store price per base (₹/g | ₹/ml | ₹/pc)
  pricePerBase: number;
  baseUnit: string;
  qtyBase: number;           // quantity in base units (g/ml/pc)
  qtyDisplay?: string;       // e.g., "750 g" or "0.75 kg"
  unitLabel?: string;        // e.g., "1 kg" or "12 pcs" (for context)
};

export type CartState = {
  lines: CartLine[];
  currency: string;
  coupon?: { code: string; discountType: 'flat' | 'percent'; value: number } | null;
  deliveryFee: number;
  taxRate: number; // e.g. 0.05 for 5%
};

const CartContext = React.createContext<{
  state: CartState;
  addLine: (line: CartLine) => void;
  removeLine: (id: string) => void;
  setQtyBase: (id: string, qtyBase: number) => void;
  clear: () => void;
  applyCoupon: (coupon: CartState['coupon']) => void;
} | null>(null);

const initialState: CartState = {
  lines: [],
  currency: '₹',
  coupon: null,
  deliveryFee: 19, // simple flat fee example
  taxRate: 0.00,   // grocery often 0% for produce; adjust as needed
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>(initialState);

  const addLine = (line: CartLine) => {
    setState((s) => {
      const idx = s.lines.findIndex((l) => l.id === line.id);
      if (idx >= 0) {
        const updated = [...s.lines];
        updated[idx] = {
          ...updated[idx],
          qtyBase: updated[idx].qtyBase + line.qtyBase,
          qtyDisplay: line.qtyDisplay ?? updated[idx].qtyDisplay,
        };
        return { ...s, lines: updated };
      }
      return { ...s, lines: [...s.lines, line] };
    });
  };

  const removeLine = (id: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== id) }));
  };

  const setQtyBase = (id: string, qtyBase: number) => {
    setState((s) => ({
      ...s,
      lines: s.lines.map((l) => (l.id === id ? { ...l, qtyBase: Math.max(0, qtyBase) } : l)),
    }));
  };

  const clear = () => setState(initialState);

  const applyCoupon = (coupon: CartState['coupon']) => setState((s) => ({ ...s, coupon }));

  return (
    <CartContext.Provider value={{ state, addLine, removeLine, setQtyBase, clear, applyCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// Helpers for totals
export function computeLineAmount(line: CartLine): number {
  return line.qtyBase * line.pricePerBase;
}

export function computeCartTotals(state: CartState) {
  const subtotal = state.lines.reduce((sum, l) => sum + computeLineAmount(l), 0);
  const discount =
    state.coupon
      ? state.coupon.discountType === 'flat'
        ? state.coupon.value
        : (subtotal * state.coupon.value) / 100
      : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * state.taxRate;
  const total = Math.max(0, taxable + tax + (state.lines.length ? state.deliveryFee : 0));
  return { subtotal, discount, tax, total };
}

