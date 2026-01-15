import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ordersData = [
  {
    id: '1',
    customer: 'Rohit Sharma',
    amount: '₹450',
    status: 'Pending',
    items: ['Milk', 'Bread', 'Eggs'],
  },
  {
    id: '2',
    customer: 'Anita Singh',
    amount: '₹320',
    status: 'Completed',
    items: ['Rice', 'Oil'],
  },
  {
    id: '3',
    customer: 'Sunil Gupta',
    amount: '₹780',
    status: 'Pending',
    items: ['Vegetables', 'Fruits', 'Snacks'],
  },
];

export default function ShopkeeperOrders() {
  const router = useRouter();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    Alert.alert(
      'Update Order',
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log(orderId, newStatus) },
      ]
    );
  };

  const handleOrderPress = (orderId: string) => {
    // Navigate to Order Details Screen with dynamic route
    router.push(`/order-details/${orderId}`);
  };

  const renderOrder = ({ item }: any) => (
    <TouchableOpacity
      style={styles.orderCard}
      activeOpacity={0.8}
      onPress={() => handleOrderPress(item.id)}
    >
      <View>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.orderAmount}>{item.amount}</Text>
        <Text style={styles.itemsText}>{item.items.join(', ')}</Text>
      </View>

      <View style={styles.actionsColumn}>
        <Text
          style={[
            styles.statusText,
            item.status === 'Pending'
              ? { color: '#F97316' }
              : { color: '#16A34A' },
          ]}
        >
          {item.status}
        </Text>

        {item.status === 'Pending' && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#2563EB' }]}
              onPress={() => handleStatusUpdate(item.id, 'Completed')}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: '#F87171' }]}
              onPress={() => handleStatusUpdate(item.id, 'Cancelled')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={ordersData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderOrder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
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
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  itemsText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  actionsColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
