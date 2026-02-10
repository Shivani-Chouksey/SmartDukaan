
// app/splash.tsx or your initial route
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// 1) Keep the native splash visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: it may throw if called twice in dev fast refresh
});

export default function Splash() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initApp = async () => {
      try {
        // Simulate minimal splash delay (optional)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const [role, token] = await Promise.all([
          AsyncStorage.getItem('userRole'),
          AsyncStorage.getItem('token'),
        ]);

        if (cancelled) return;

        // Decide where to go

        if (!token) {
          if (!role) {
            router.replace('/select-role');
            return;
          }

          router.replace('/(auth)/login');
          return;
        }

        // if (role === 'SHOPKEEPER') {
        //   router.replace('/(shopkeeper)/home');
        // } else {
        //   router.replace('/(customer)/home');
        // }
      } catch (e) {
        // You might want to route to an error screen or log this
        console.warn('Init error:', e);
        router.replace('/(auth)/login');
      } finally {
        if (!cancelled) setAppIsReady(true);
      }
    };

    initApp();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // 2) Hide the splash once the root view has layout and we're ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore hide errors
      }
    }
  }, [appIsReady]);

  // 3) Render a simple branded placeholder while deciding (optional; native splash is still up)
  // Note: This view appears briefly between native splash and navigation, but we hide native splash
  // only after this view has laid out to avoid a white flash.
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text style={styles.logo}>SmartDukaan</Text>
      <Text style={styles.tagline}>Order before you reach</Text>
      <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 30 }} />
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
