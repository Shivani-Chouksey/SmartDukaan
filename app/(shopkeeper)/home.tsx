import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const stats = [
  { id: '1', title: 'Orders Today', value: 12, icon: 'cart-outline' },
  { id: '2', title: 'Pending Orders', value: 3, icon: 'time-outline' },
  { id: '3', title: 'Revenue', value: '₹4,500', icon: 'cash-outline' },
];

const recentOrders = [
  { id: '1', customer: 'Rohit Sharma', amount: '₹450', status: 'Pending' },
  { id: '2', customer: 'Anita Singh', amount: '₹320', status: 'Completed' },
  { id: '3', customer: 'Sunil Gupta', amount: '₹780', status: 'Pending' },
];

export default function ShopkeeperHome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.shopName}>Gupta General Store</Text>
          <Text style={styles.shopLocation}>Indore</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={36} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <Ionicons name={item.icon as any} size={28} color="#2563EB" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(shopkeeper)/add-product')}
        >
          <Ionicons name="add-circle-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(shopkeeper)/orders')}
        >
          <Ionicons name="receipt-outline" size={28} color="#2563EB" />
          <Text style={styles.actionText}>View Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Orders */}
      <Text style={styles.sectionTitle}>Recent Orders</Text>
      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View>
              <Text style={styles.customerName}>{item.customer}</Text>
              <Text style={styles.orderAmount}>{item.amount}</Text>
            </View>
            <Text
              style={[
                styles.orderStatus,
                item.status === 'Pending'
                  ? { color: '#F97316' }
                  : { color: '#16A34A' },
              ]}
            >
              {item.status}
            </Text>
          </View>
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
  shopName: {
    fontSize: 20,
    fontWeight: '700',
  },
  shopLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '32%',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderAmount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '700',
  },
});
