import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

export type ItemCardProps = {
  id: string;
  name: string;
  unit: string;          // e.g., "1 kg"
  price: number;         // selling price
  mrp?: number;          // MRP to show strike-through (optional)
  currency?: string;     // default "₹"
  image: string;         // URL or local asset via require
  inStock?: boolean;     // default true
  initialQty?: number;   // default 0
  onAdd?: (id: string) => void;
  onChangeQty?: (id: string, qty: number) => void;
  onPressCard?: (id: string, e?: GestureResponderEvent) => void;
  style?: object;
};

const ItemCards: React.FC<ItemCardProps> = ({
  id,
  name,
  unit,
  price,
  mrp,
  currency = '₹',
  image,
  inStock = true,
  initialQty = 0,
  onAdd,
  onChangeQty,
  // onPressCard,
  style,
}) => {
  const [qty, setQty] = useState<number>(initialQty);
const [show, setShow] = React.useState(false);
  const hasDiscount = useMemo(
    () => !!mrp && mrp > price,
    [mrp, price]
  );

  const handleAdd = () => {
    const next = 1;
    setQty(next);
    onAdd?.(id);
    onChangeQty?.(id, next);
  };

  const handleInc = () => {
    const next = qty + 1;
    setQty(next);
    onChangeQty?.(id, next);
  };

  const handleDec = () => {
    const next = Math.max(0, qty - 1);
    setQty(next);
    onChangeQty?.(id, next);
  };

  const handlePressCard = (e: GestureResponderEvent) => {
    router.push(
      {
        pathname: "/item/[id]",
        params: { id, source: "home" },
      }
    )
    // onPressCard?.(id, e);
  };

  const priceText = `${currency}${price}`;
  const mrpText = mrp ? `${currency}${mrp}` : undefined;

  const imageSource =
    typeof image === 'string' && image.startsWith('http')
      ? { uri: image }
      : // If you pass require(...) directly, RN handles it; keep as string fallback
      (typeof image === 'string' ? { uri: image } : (image as any));

  return (
    <Pressable
      onPress={handlePressCard}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.99 }] },
        style,
        !inStock && styles.cardDisabled,
      ]}
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        {/* <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        /> */}
        {!inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {name}
        </Text>

        <Text style={styles.unit}>{unit}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{priceText}</Text>
          {hasDiscount && mrpText && (
            <Text style={styles.mrp}>{mrpText}</Text>
          )}
          {hasDiscount && mrp && (
            <View style={styles.offPill}>
              <Text style={styles.offPillText}>
                {Math.round(((mrp - price) / mrp) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* CTA / Stepper */}
        <View style={styles.ctaRow}>
          {qty === 0 ? (
            <Pressable
              disabled={!inStock}
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && { opacity: 0.9 },
                !inStock && styles.addBtnDisabled,
              ]}
            >
              <Text style={styles.addBtnText}  onPress={() => setShow(true)}>
                {inStock ? 'Add' : 'Unavailable'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.stepper}>
              <Pressable
                onPress={handleDec}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  pressed && styles.stepperBtnPressed,
                ]}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>

              <Text style={styles.qtyText}>{qty}</Text>

              <Pressable
                onPress={handleInc}
                style={({ pressed }) => [
                  styles.stepperBtn,
                  pressed && styles.stepperBtnPressed,
                ]}
              >
                <Text style={styles.stepperBtnText}>＋</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
   
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    // Shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Shadow Android
    elevation: 2,
    marginVertical: 8,
  },
  cardDisabled: {
    opacity: 0.72,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  outOfStockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(33, 33, 33, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b1b1b',
  },
  unit: {
    fontSize: 13,
    color: '#60666F',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20', // green-900
  },
  mrp: {
    fontSize: 13,
    color: '#9AA0A6',
    textDecorationLine: 'line-through',
  },
  offPill: {
    marginLeft: 4,
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  offPillText: {
    color: '#1B5E20',
    fontSize: 11,
    fontWeight: '700',
  },
  ctaRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#0B72E7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnDisabled: {
    backgroundColor: '#BFC7D1',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    padding: 4,
    gap: 8,
  },
  stepperBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DADFE6',
  },
  stepperBtnPressed: {
    backgroundColor: '#EFF3F8',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    minWidth: 14,
    textAlign: 'center',
  },
  qtyText: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});

export default ItemCards;
``