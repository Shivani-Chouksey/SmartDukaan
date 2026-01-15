import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     const role = await AsyncStorage.getItem('role');

  //     setTimeout(() => {
  //       if (token && role) {
  //         if (role === 'CUSTOMER') {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'CustomerHome' }],
  //           });
  //         } else if (role === 'SHOPKEEPER') {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'ShopkeeperDashboard' }],
  //           });
  //         }
  //       } else {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'AuthStack' }],
  //         });
  //       }
  //     }, 2000); // Smooth splash delay
  //   } catch (error) {
  //     navigation.replace('AuthStack');
  //   }
  // };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      /> */}

      <Text style={styles.appName}>LocalShop</Text>
      <Text style={styles.tagline}>Smart ordering for local stores</Text>

      <ActivityIndicator
        size="small"
        color="#4F46E5"
        style={{ marginTop: 24 }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
});
