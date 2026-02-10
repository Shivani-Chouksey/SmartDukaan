import { Link, useRouter } from 'expo-router';
import React from 'react';
import {
  BackHandler,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';

type SortOption = {
  id: string;
  label: string;
  value: string;
};

const SORT_OPTIONS: SortOption[] = [
  { id: 'rel', label: 'Relevance', value: 'relevance' },
  { id: 'plh', label: 'Price: Low to High', value: 'price_asc' },
  { id: 'phl', label: 'Price: High to Low', value: 'price_desc' },
  { id: 'pop', label: 'Popularity', value: 'popularity' },
  { id: 'new', label: 'Newest First', value: 'newest' },
];

export default function Modal() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string>('relevance');

  // Handle Android hardware back button to close modal
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, [router]);

  const onBackdropPress = () => router.back();

  const onApply = () => {
    // TODO: pass selection back via params or state manager
    // e.g., router.replace({ pathname: '/items', params: { sort: selected } });
    router.back();
  };

  const renderOption = ({ item }: { item: SortOption }) => {
    const isActive = selected === item.value;
    return (
      <Pressable
        onPress={() => setSelected(item.value)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isActive }}
        style={({ pressed }) => [
          styles.optionRow,
          pressed && styles.optionRowPressed,
        ]}
      >
        <Text style={styles.optionLabel}>{item.label}</Text>
        <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
          {isActive && <View style={styles.radioInner} />}
        </View>
      </Pressable>
    );
  };

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
      style={styles.overlay}
      // For accessibility
      accessibilityViewIsModal
      accessible
      accessibilityLabel="Sort modal"
    >
      {/* Backdrop (tap to dismiss) */}
      <Pressable
        onPress={onBackdropPress}
        style={StyleSheet.absoluteFill}
        accessibilityLabel="Close modal"
        accessibilityHint="Double tap to close the sort modal"
      />

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
          <Text style={styles.title}>Sort By</Text>
          <Link href="/" asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.clearAll}>Clear</Text>
            </Pressable>
          </Link>
        </View>

        {/* Options */}
        <FlatList
          data={SORT_OPTIONS}
          keyExtractor={(it) => it.id}
          renderItem={renderOption}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          bounces
          showsVerticalScrollIndicator={false}
        />

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Pressable onPress={onBackdropPress} style={[styles.btn, styles.btnGhost]}>
            <Text style={[styles.btnText, styles.btnGhostText]}>Cancel</Text>
          </Pressable>

          <Pressable onPress={onApply} style={[styles.btn, styles.btnPrimary]}>
            <Text style={[styles.btnText, styles.btnPrimaryText]}>Apply</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const SHEET_HEIGHT = 420;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055', // softer dim
    justifyContent: 'flex-end',
  },

  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 20,
      },
    }),
  },

  grip: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginBottom: 6,
    marginTop: 4,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  clearAll: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B72E7',
  },

  listContent: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

  optionRow: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionRowPressed: {
    backgroundColor: '#F8FAFC',
  },

  optionLabel: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterActive: {
    borderColor: '#0B72E7',
  },

  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0B72E7',
  },

  separator: {
    height: 10,
  },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    borderTopColor: '#F1F5F9',
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: '#EEF2F7',
  },
  btnGhostText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#0B72E7',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  btnText: {
    fontSize: 15,
  },
});