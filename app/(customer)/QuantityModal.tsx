import React from 'react';
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown,
} from 'react-native-reanimated';


type BaseUnit = 'g' | 'ml' | 'pc';

type ItemForModal = {
  id: string;
  name: string;
  image?: string;           // optional
  unitLabel: string;        // e.g. "1 kg", "500 g", "1 L", "750 ml", "12 pcs"
  price: number;            // price for the unitLabel above
  currency?: string;        // default ₹
  baseUnit?: BaseUnit;      // optional override for inference
};

type Payload = {
  id: string;
  qtyBase: number;          // quantity in base units (g/ml/pc)
  qtyDisplay: string;       // e.g. "750 g" or "0.75 kg"
  unit: string;             // chosen display unit
  amount: number;           // payable amount
  pricePerBase: number;     // price per g/ml/pc
};

type Props = {
  visible: boolean;
  onClose: () => void;
  item: ItemForModal;
  onConfirm: (payload: Payload) => void;
};

/** ---------- Helpers ---------- */

const UNIT_MAP = {
  kg: { base: 'g', factor: 1000 },
  g: { base: 'g', factor: 1 },
  l: { base: 'ml', factor: 1000 },
  ml: { base: 'ml', factor: 1 },
  pc: { base: 'pc', factor: 1 },
  pcs: { base: 'pc', factor: 1 },
} as const;

function parseUnitLabel(label: string): { qty: number; unit: keyof typeof UNIT_MAP } | null {
  try {
    const trimmed = label.trim().toLowerCase();
    // Try patterns: "1 kg", "500 g", "12 pcs", "1 l", "750 ml"
    const m = trimmed.match(/([\d.]+)\s*(kg|g|l|ml|pcs?|piece|pieces)/i);
    if (!m) return null;
    const qty = Number(m[1]);
    let unitRaw = m[2].toLowerCase();
    if (unitRaw === 'piece' || unitRaw === 'pieces') unitRaw = 'pc';
    if (unitRaw === 'pcs') unitRaw = 'pcs';
    return { qty, unit: unitRaw as any };
  } catch {
    return null;
  }
}

function toBase(qty: number, unit: keyof typeof UNIT_MAP): { base: BaseUnit; value: number } {
  const def = UNIT_MAP[unit];
  return { base: def.base as BaseUnit, value: qty * def.factor };
}

function fromBase(baseQty: number, baseUnit: BaseUnit, target: 'g' | 'kg' | 'ml' | 'l' | 'pc') {
  if (baseUnit === 'g') {
    if (target === 'kg') return baseQty / 1000;
    if (target === 'g') return baseQty;
  }
  if (baseUnit === 'ml') {
    if (target === 'l') return baseQty / 1000;
    if (target === 'ml') return baseQty;
  }
  // pcs
  return baseQty; // 'pc'
}

function formatQty(baseQty: number, baseUnit: BaseUnit): { text: string; unit: string } {
  if (baseUnit === 'g') {
    if (baseQty >= 1000) return { text: `${(baseQty / 1000).toFixed(2)}`, unit: 'kg' };
    return { text: `${Math.round(baseQty)}`, unit: 'g' };
  }
  if (baseUnit === 'ml') {
    if (baseQty >= 1000) return { text: `${(baseQty / 1000).toFixed(2)}`, unit: 'L' };
    return { text: `${Math.round(baseQty)}`, unit: 'ml' };
  }
  return { text: `${Math.round(baseQty)}`, unit: 'pc' };
}

function clamp(n: number, min = 0, max = Number.POSITIVE_INFINITY) {
  return Math.min(Math.max(n, min), max);
}

export default function QuantityModal({ visible, onClose, item, onConfirm }: Props) {
  const currency = item.currency ?? '₹';

  // Derive pricePerBaseUnit from provided unitLabel and price
  const parsed = React.useMemo(() => parseUnitLabel(item.unitLabel), [item.unitLabel]);
  const inferredBase = React.useMemo<BaseUnit | null>(() => {
    if (item.baseUnit) return item.baseUnit;
    if (!parsed) return null;
    return UNIT_MAP[parsed.unit].base as BaseUnit;
  }, [item.baseUnit, parsed]);

  const baseInfo = React.useMemo(() => {
    if (!parsed || !inferredBase) return null;
    const base = toBase(parsed.qty, parsed.unit);
    const pricePerBase = item.price / base.value; // ₹ per g/ml/pc
    return {
      baseUnit: inferredBase,
      pricePerBase,               // price per base unit
      refBaseQty: base.value,     // e.g., 1 kg -> 1000 g
    };
  }, [parsed, inferredBase, item.price]);

  // UI States
  const [mode, setMode] = React.useState<'qty' | 'amt'>('qty');
  const [displayUnit, setDisplayUnit] = React.useState<'g' | 'kg' | 'ml' | 'l' | 'pc'>(
    inferredBase === 'g' ? 'g' : inferredBase === 'ml' ? 'ml' : 'pc'
  );
  const [qtyInput, setQtyInput] = React.useState<string>('');     // quantity (in chosen displayUnit)
  const [amtInput, setAmtInput] = React.useState<string>('');     // amount ₹

  React.useEffect(() => {
    // Reset inputs when switching modes
    setQtyInput('');
    setAmtInput('');
  }, [mode, visible]);

  React.useEffect(() => {
    if (!visible) {
      setMode('qty');
      setQtyInput('');
      setAmtInput('');
    }
  }, [visible]);

  if (!visible) return null;

  const unitsForBase: Array<'g'|'kg'|'ml'|'l'|'pc'> =
    inferredBase === 'g' ? ['g', 'kg'] :
    inferredBase === 'ml' ? ['ml', 'l'] : ['pc'];

  const quickChips =
    inferredBase === 'g'
      ? [{v:100,u:'g'},{v:250,u:'g'},{v:500,u:'g'},{v:1,u:'kg'}]
      : inferredBase === 'ml'
      ? [{v:250,u:'ml'},{v:500,u:'ml'},{v:750,u:'ml'},{v:1,u:'l'}]
      : [{v:1,u:'pc'},{v:2,u:'pc'},{v:5,u:'pc'},{v:10,u:'pc'}];

  // Compute base quantity & amount based on inputs
  let qtyBase = 0;
  let amount = 0;

  if (baseInfo) {
    if (mode === 'qty') {
      const q = Number(qtyInput.replace(',', '.')) || 0;
      const baseQty =
        inferredBase === 'g'
          ? (displayUnit === 'kg' ? q * 1000 : q)
          : inferredBase === 'ml'
          ? (displayUnit === 'l' ? q * 1000 : q)
          : q; // pcs
      qtyBase = clamp(baseQty, 0);
      amount = qtyBase * baseInfo.pricePerBase;
    } else {
      const amt = Number(amtInput.replace(',', '.')) || 0;
      amount = clamp(amt, 0);
      qtyBase = baseInfo.pricePerBase > 0 ? amount / baseInfo.pricePerBase : 0;
    }
  }

  const formattedQty = baseInfo ? formatQty(qtyBase, baseInfo.baseUnit) : { text: '—', unit: '' };

  const canConfirm = baseInfo && qtyBase > 0 && amount > 0;

  const onPressConfirm = () => {
  if (!baseInfo || !canConfirm) return;

  const payload = {
    id: item.id,
    qtyBase: Math.round(qtyBase), // integer base units (g/ml/pc)
    qtyDisplay: `${formattedQty.text} ${formattedQty.unit}`,
    unit: formattedQty.unit, // e.g., "kg", "g", "L", "ml", "pc"
    amount: Number(amount.toFixed(2)),
    pricePerBase: baseInfo.pricePerBase, // ₹ per g/ml/pc
  };

  onConfirm(payload); // parent will addLine(...)
  onClose();
};


  const applyChip = (v: number, u: 'g'|'kg'|'ml'|'l'|'pc') => {
    setMode('qty');
    setDisplayUnit(u);
    setQtyInput(String(v));
  };

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={styles.overlay}
      accessibilityViewIsModal
      accessible
      accessibilityLabel="Quantity selector modal"
    >
      {/* Backdrop */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* Bottom Sheet */}
      <Animated.View
        entering={SlideInUp.springify().damping(18)}
        exiting={SlideOutDown.springify().damping(20)}
        style={styles.sheet}
      >
        {/* Grip */}
        <View style={styles.grip} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.itemRow}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="cover" />
            ) : (
              <View style={[styles.itemImg, { backgroundColor: '#F3F4F6' }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.unitLabel} • {currency}{item.price}
              </Text>
            </View>
          </View>

          {baseInfo ? (
            <Text style={styles.pricePerUnit}>
              {currency}{baseInfo.pricePerBase.toFixed(3)} per {baseInfo.baseUnit}
            </Text>
          ) : (
            <Text style={[styles.pricePerUnit, { color: '#EF4444' }]}>
              Unable to infer unit from “{item.unitLabel}”
            </Text>
          )}
        </View>

        {/* Mode Switch */}
        <View style={styles.segment}>
          <Pressable
            onPress={() => setMode('qty')}
            style={[styles.segBtn, mode === 'qty' && styles.segBtnActive]}
          >
            <Text style={[styles.segText, mode === 'qty' && styles.segTextActive]}>
              By Quantity
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('amt')}
            style={[styles.segBtn, mode === 'amt' && styles.segBtnActive]}
          >
            <Text style={[styles.segText, mode === 'amt' && styles.segTextActive]}>
              By Amount (₹)
            </Text>
          </Pressable>
        </View>

        {/* Inputs */}
        <View style={styles.content}>
          {mode === 'qty' ? (
            <>
              {/* Unit Selector */}
              <View style={styles.unitRow}>
                {unitsForBase.map((u) => (
                  <Pressable
                    key={u}
                    onPress={() => setDisplayUnit(u)}
                    style={[styles.unitPill, displayUnit === u && styles.unitPillActive]}
                  >
                    <Text style={[styles.unitPillText, displayUnit === u && styles.unitPillTextActive]}>
                      {u.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Quantity Input */}
              <View style={styles.inputRow}>
                <TextInput
                  value={qtyInput}
                  onChangeText={(t) => setQtyInput(t.replace(/[^\d.,]/g, ''))}
                  keyboardType="decimal-pad"
                  placeholder={`e.g. ${inferredBase === 'g' ? '250' : inferredBase === 'ml' ? '500' : '2'}`}
                  style={styles.input}
                />
                <Text style={styles.inputUnit}>{displayUnit.toUpperCase()}</Text>
              </View>

              {/* Quick Chips */}
              <View style={styles.chipsRow}>
                {quickChips.map((c) => (
                  <Pressable key={`${c.v}-${c.u}`} onPress={() => applyChip(c.v as number, c.u as any)} style={styles.chip}>
                    <Text style={styles.chipText}>
                      {c.v} {String(c.u).toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Amount Input */}
              <View style={styles.inputRow}>
                <Text style={styles.currency}>{currency}</Text>
                <TextInput
                  value={amtInput}
                  onChangeText={(t) => setAmtInput(t.replace(/[^\d.,]/g, ''))}
                  keyboardType="decimal-pad"
                  placeholder="e.g. 100"
                  style={[styles.input, { paddingLeft: 6 }]}
                />
              </View>
              <Text style={styles.helper}>
                Enter the amount you want to spend. We’ll calculate the quantity for you.
              </Text>
            </>
          )}

          {/* Summary */}
          <View style={styles.summary}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>You will get</Text>
              <Text style={styles.summaryValue}>
                {formattedQty.text} {formattedQty.unit}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>You pay</Text>
              <Text style={styles.summaryValue}>
                {currency}{amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
            <Text style={[styles.btnText, styles.btnGhostText]}>Cancel</Text>
          </Pressable>
          <Pressable
            disabled={!canConfirm}
            onPress={onPressConfirm}
            style={[styles.btn, styles.btnPrimary, !canConfirm && { opacity: 0.6 }]}
          >
            <Text style={[styles.btnText, styles.btnPrimaryText]}>Add to Cart</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const SHEET_H = 520;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: SHEET_H,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 20 },
    }),
  },
  grip: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF2F7',
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemImg: { width: 44, height: 44, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  itemMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  pricePerUnit: { fontSize: 12, color: '#475569', marginTop: 6 },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    margin: 12,
    padding: 4,
    borderRadius: 12,
  },
  segBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: { backgroundColor: '#FFFFFF' },
  segText: { fontSize: 13, color: '#334155', fontWeight: '700' },
  segTextActive: { color: '#0B72E7' },

  content: { paddingHorizontal: 12 },
  unitRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  unitPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2F7',
  },
  unitPillActive: { backgroundColor: '#E0EAFF' },
  unitPillText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  unitPillTextActive: { color: '#0B72E7' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0,
  },
  inputUnit: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  currency: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginRight: 6 },

  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: '#EEF2F7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },

  helper: { fontSize: 12, color: '#6B7280', marginTop: 8 },

  summary: {
    marginTop: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
  },
  summaryLabel: { fontSize: 12, color: '#6B7280' },
  summaryValue: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    borderTopColor: '#EEF2F7',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: { backgroundColor: '#EEF2F7' },
  btnGhostText: { color: '#0F172A', fontWeight: '800' },
  btnPrimary: { backgroundColor: '#0B72E7' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '800' },
  btnText: { fontSize: 15 },
});
``