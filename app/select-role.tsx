import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function SelectRoleScreen() {
  const [role, setRole] = useState<'CUSTOMER' | 'SHOPKEEPER' | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    if (!role) return;

    await AsyncStorage.setItem('userRole', role);
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>
        Select how you want to use the app
      </Text>

      {/* Customer Card */}
      <TouchableOpacity
        style={[styles.card, role === 'CUSTOMER' && styles.activeCard]}
        onPress={() => setRole('CUSTOMER')}
        activeOpacity={0.8}
      >
        <Ionicons name="cart-outline" size={28} color="#2563EB" />
        <Text style={styles.cardTitle}>Customer</Text>
        <Text style={styles.cardDesc}>
          Browse items, place orders, and track deliveries
        </Text>
      </TouchableOpacity>

      {/* Shopkeeper Card */}
      <TouchableOpacity
        style={[styles.card, role === 'SHOPKEEPER' && styles.activeCard]}
        onPress={() => setRole('SHOPKEEPER')}
        activeOpacity={0.8}
      >
        <Ionicons name="storefront-outline" size={28} color="#2563EB" />
        <Text style={styles.cardTitle}>Shopkeeper</Text>
        <Text style={styles.cardDesc}>
          Manage products, orders, and store performance
        </Text>
      </TouchableOpacity>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.button, !role && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!role}
      >
        <Text style={styles.buttonText}>
          {role ? `Continue as ${role}` : 'Continue'}
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        You can change your role later in settings
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  activeCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
  button: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 14,
    fontSize: 12,
    textAlign: 'center',
    color: '#9CA3AF',
  },
});
