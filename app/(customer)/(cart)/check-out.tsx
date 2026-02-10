

// app/checkout.tsx

import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    FlatList, Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { computeCartTotals, computeLineAmount, useCart } from './CartBar';

function stepFor(unit:string) {
  if (unit === 'pc') return 1;
  // Adjust step to your liking: 50g/ml or 1x00
  return 100;
}
// function stepFor(unit: 'g' | 'ml' | 'pc') {
//   if (unit === 'pc') return 1;
//   // Adjust step to your liking: 50g/ml or 1x00
//   return 100;
// }

export default function Checkout() {
  const router = useRouter();
  const { state, setQtyBase, removeLine, applyCoupon, clear } = useCart();
  const totals = computeCartTotals(state);

  const [coupon, setCoupon] = React.useState('');

  const onApplyCoupon = () => {
    if (!coupon.trim()) return;
    // Very basic example: SAVE20 => 20% off, FLAT50 => ₹50 off
    if (coupon.toUpperCase() === 'SAVE20') {
      applyCoupon({ code: 'SAVE20', discountType: 'percent', value: 20 });
    } else if (coupon.toUpperCase() === 'FLAT50') {
      applyCoupon({ code: 'FLAT50', discountType: 'flat', value: 50 });
    } else {
      Alert.alert('Invalid coupon', 'Please try another code.');
      return;
    }
    Alert.alert('Coupon applied', coupon.toUpperCase());
  };

  const placeOrder = () => {
    // TODO: integrate payment & address flow
    Alert.alert('Order placed', 'Thank you! Your order is confirmed.', [
      {
        text: 'OK',
        onPress: () => {
          clear();
          router.replace('/'); // go home
        },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <AntDesign name="left" size={20} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Address (placeholder) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Delivery Address</Text>
        <Text style={styles.addrText}>Kurla, Mumbai • 400070</Text>
        <Pressable style={styles.addrBtn}>
          <Text style={styles.addrBtnText}>Change</Text>
        </Pressable>
      </View>

      {/* Items */}
      <View style={[styles.card, { paddingBottom: 6 }]}>
        <Text style={styles.cardTitle}>Your Items</Text>
        <FlatList
          data={state.lines}
          keyExtractor={(l) => l.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const amt = computeLineAmount(item);
            const stp = stepFor(item.baseUnit);
            return (
              <View style={styles.lineRow}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.lineImg} />
                ) : (
                  <View style={[styles.lineImg, { backgroundColor: '#F3F4F6' }]} />
                )}
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2} style={styles.lineName}>{item.name}</Text>
                  {!!item.qtyDisplay && (
                    <Text style={styles.lineMeta}>{item.qtyDisplay}</Text>
                  )}
                  <Text style={styles.lineAmount}>
                    {state.currency}{amt.toFixed(2)}
                  </Text>
                </View>

                {/* Stepper */}
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => setQtyBase(item.id, Math.max(0, item.qtyBase - stp))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperText}>−</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>
                    {item.baseUnit === 'pc' ? item.qtyBase : `${item.qtyBase}${item.baseUnit}`}
                  </Text>
                  <Pressable
                    onPress={() => setQtyBase(item.id, item.qtyBase + stp)}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperText}>＋</Text>
                  </Pressable>
                </View>

                {/* Remove */}
                <Pressable onPress={() => removeLine(item.id)} style={styles.removeBtn}>
                  <AntDesign name="delete" size={18} color="#EF4444" />
                </Pressable>
              </View>
            );
          }}
        />
      </View>

      {/* Coupon */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Apply Coupon</Text>
        <View style={styles.couponRow}>
          <TextInput
            value={coupon}
            onChangeText={setCoupon}
            placeholder="Enter code (e.g. SAVE20, FLAT50)"
            autoCapitalize="characters"
            style={styles.couponInput}
          />
          <Pressable onPress={onApplyCoupon} style={styles.couponBtn}>
            <Text style={styles.couponBtnText}>Apply</Text>
          </Pressable>
        </View>
        {state.coupon && (
          <Text style={styles.couponApplied}>
            Applied: {state.coupon.code} ({state.coupon.discountType === 'flat'
              ? `${state.currency}${state.coupon.value.toFixed(0)}`
              : `${state.coupon.value}%`
            })
          </Text>
        )}
      </View>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bill Summary</Text>
        <Row label="Subtotal" value={`${state.currency}${totals.subtotal.toFixed(2)}`} />
        <Row label="Discount" value={`- ${state.currency}${totals.discount.toFixed(2)}`} />
        <Row label="Delivery Fee" value={`${state.currency}${state.lines.length ? state.deliveryFee.toFixed(2) : '0.00'}`} />
        <Row label={`Tax (${(state.taxRate * 100).toFixed(0)}%)`} value={`${state.currency}${totals.tax.toFixed(2)}`} />
        <View style={styles.divider} />
        <Row label="Total" value={`${state.currency}${totals.total.toFixed(2)}`} strong />
      </View>

      {/* Place Order */}
      <View style={{ height: 70 }} />
      <View style={styles.footerBar}>
        <Pressable
          onPress={placeOrder}
          disabled={!state.lines.length}
          style={[styles.placeBtn, !state.lines.length && { opacity: 0.6 }]}
        >
          <Text style={styles.placeBtnText}>Place Order • {state.currency}{totals.total.toFixed(2)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, strong && styles.rowStrong]}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.rowStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 10, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 8 },

  addrText: { color: '#4B5563' },
  addrBtn: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: '#EEF4FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addrBtnText: { color: '#0B72E7', fontWeight: '700', fontSize: 12 },

  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lineImg: { width: 56, height: 56, borderRadius: 8 },
  lineName: { fontWeight: '700', color: '#111827' },
  lineMeta: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  lineAmount: { color: '#059669', fontWeight: '800', marginTop: 4 },

  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 10, padding: 4 },
  stepperBtn: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#D1D5DB' },
  stepperText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  qtyText: { minWidth: 52, textAlign: 'center', fontWeight: '800' },
  removeBtn: { padding: 6, marginLeft: 6 },

  couponRow: { flexDirection: 'row', gap: 8 },
  couponInput: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 12, height: 44, fontWeight: '700' },
  couponBtn: { backgroundColor: '#0B72E7', paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  couponBtnText: { color: '#fff', fontWeight: '800' },
  couponApplied: { marginTop: 6, color: '#059669', fontWeight: '700' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  rowLabel: { color: '#374151' },
  rowValue: { color: '#111827', fontWeight: '700' },
  rowStrong: { fontSize: 16, fontWeight: '900' },
  divider: { height: 1, backgroundColor: '#EEF2F7', marginTop: 10 },

  footerBar: {
    position: 'absolute', left: 12, right: 12, bottom: 12,
  },
  placeBtn: {
    height: 52, borderRadius: 14, backgroundColor: '#0B72E7',
    alignItems: 'center', justifyContent: 'center',
  },
  placeBtnText: { color: '#fff', fontWeight: '900' },
});
``