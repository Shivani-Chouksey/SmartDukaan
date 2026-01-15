import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // splash delay

      const role = await AsyncStorage.getItem('userRole');
      const token = await AsyncStorage.getItem('token');

      if (!role) {
        router.replace('/select-role');
        return;
      }

      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      if (role === 'SHOPKEEPER') {
        router.replace('/(shopkeeper)/home');
      } else {
        router.replace('/(customer)/home');
      }
    };

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QuickKart</Text>
      <Text style={styles.tagline}>
        Order before you reach
      </Text>

      <ActivityIndicator
        size="large"
        color="#2563EB"
        style={{ marginTop: 30 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 8,
  },
});
