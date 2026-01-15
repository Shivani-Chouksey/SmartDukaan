import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const dummyOrder = {
  id: '1',
  customer: {
    name: 'Rohit Sharma',
    phone: '+91 9876543210',
    address: '123, MG Road, Indore',
  },
  items: [
    { id: '1', name: 'Milk', quantity: 2, price: 50 },
    { id: '2', name: 'Bread', quantity: 1, price: 30 },
    { id: '3', name: 'Eggs', quantity: 12, price: 120 },
  ],
  totalAmount: 450,
  status: 'Pending',
};

export default function OrderDetailsScreen() {
  const router = useRouter();
const { orderId } = useLocalSearchParams<{ orderId: string }>();


  const handleStatusUpdate = (newStatus: string) => {
    Alert.alert(
      'Update Order',
      `Are you sure you want to mark this order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log(orderId, newStatus) },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Info</Text>
        <Text style={styles.text}>Name: {dummyOrder.customer.name}</Text>
        <Text style={styles.text}>Phone: {dummyOrder.customer.phone}</Text>
        <Text style={styles.text}>Address: {dummyOrder.customer.address}</Text>
      </View>

      {/* Items List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <FlatList
          data={dummyOrder.items}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          )}
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹{dummyOrder.totalAmount}</Text>
        </View>
      </View>

      {/* Status Actions */}
      {dummyOrder.status === 'Pending' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#2563EB' }]}
            onPress={() => handleStatusUpdate('Completed')}
          >
            <Text style={styles.buttonText}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: '#F87171' }]}
            onPress={() => handleStatusUpdate('Cancelled')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    marginTop: 10,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
