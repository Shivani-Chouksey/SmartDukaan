import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const shops = [
  { id: '1', name: 'Gupta General Store', distance: '200 m' },
  { id: '2', name: 'Fresh Mart', distance: '450 m' },
  { id: '3', name: 'Daily Needs', distance: '700 m' },
];

export default function CustomerHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Your Location</Text>
          <Text style={styles.location}>Indore</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={34} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TouchableOpacity style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <Text style={styles.searchText}>Search shops or products</Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="qr-code-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="receipt-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Nearby Shops */}
      <Text style={styles.sectionTitle}>Nearby Shops</Text>

      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.shopCard}
            onPress={() => router.push('/(customer)/shop')}
          >
            <View>
              <Text style={styles.shopName}>{item.name}</Text>
              <Text style={styles.shopDistance}>{item.distance} away</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  location: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  searchText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  shopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
  },
  shopDistance: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
