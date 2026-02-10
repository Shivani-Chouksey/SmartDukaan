
// app/(auth)/register.tsx
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Google Sign-In
// import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

type Role = 'CUSTOMER' | 'SHOPKEEPER';

export default function Register() {
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: Role }>();

  const [role, setRole] = useState<Role>(roleParam === 'SHOPKEEPER' ? 'SHOPKEEPER' : 'CUSTOMER');

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  // Optional common fields
  const [phone, setPhone]       = useState('');

  // Shopkeeper-only fields
  const [shopName, setShopName]     = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [city, setCity]             = useState('');
  const [pincode, setPincode]       = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});

//   // ---------- Google Sign-In ----------
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     // TODO: Replace these placeholders with your own client IDs
//     // Tip: keep these in env/config (e.g., app.config.js or expo-constants)
//     expoClientId:    'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
//     iosClientId:     'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
//     webClientId:     'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
//     // You can add scopes if you need more data
//     scopes: ['profile', 'email'],
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { authentication } = response;
//       // You now have authentication?.accessToken and authentication?.idToken (if configured)
//       // 1) Optionally fetch Google profile:
//       //    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//       //      headers: { Authorization: `Bearer ${authentication?.accessToken}` }
//       //    })
//       // 2) Send token(s) to your backend to create or login user
//       Alert.alert('Google Sign-In', 'Signed in with Google successfully.');
//       // Example route (adjust to your flow)
//       router.replace('/login');
//     }
//   }, [response, router]);

  // ---------- Validation ----------
  const validate = () => {
    const e: Record<string, string> = {};

    if (!fullName.trim()) e.fullName = 'Full name is required';

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) e.email = 'Email is required';
    else if (!emailRx.test(email.trim())) e.email = 'Enter a valid email';

    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';

    if (!confirm) e.confirm = 'Please confirm your password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';

    if (phone && !/^[0-9+\-\s]{6,15}$/.test(phone)) e.phone = 'Enter a valid phone';

    if (role === 'SHOPKEEPER') {
      if (!shopName.trim()) e.shopName = 'Shop name is required';
      if (!shopAddress.trim()) e.shopAddress = 'Shop address is required';
      if (!city.trim()) e.city = 'City is required';
      if (!pincode.trim()) e.pincode = 'Pincode is required';
      else if (!/^\d{4,7}$/.test(pincode)) e.pincode = 'Enter a valid pincode';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const payload = useMemo(() => {
    const base = {
      role,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim() || undefined,
    };

    if (role === 'SHOPKEEPER') {
      return {
        ...base,
        shop: {
          name: shopName.trim(),
          address: shopAddress.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          // Add more fields here: gstin, category, openingHours, etc.
        },
      };
    }

    // CUSTOMER payload
    return base;
  }, [role, fullName, email, password, phone, shopName, shopAddress, city, pincode]);

  const onRegister = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);

      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      // TODO:
      //  - Call your backend:
      //    await api.register(payload)
      //  - Handle duplicate email, weak password, etc.
      //  - Store token securely (expo-secure-store) if returned (for login)
      console.log('REGISTER payload =>', payload);

      Alert.alert('Success', 'Account created. Please login.');
      router.replace('/login'); // (auth) group => path is "/login"
    } catch (err: any) {
      console.warn(err);
      Alert.alert('Error', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const RoleTab = ({ value, label }: { value: Role; label: string }) => {
    const active = role === value;
    return (
      <TouchableOpacity
        onPress={() => setRole(value)}
        style={[styles.roleTab, active && styles.roleTabActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
      >
        <Text style={[styles.roleTabText, active && styles.roleTabTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: '' }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              {role === 'SHOPKEEPER' ? 'Register your shop on QuickKart' : 'Join QuickKart in seconds'}
            </Text>

            {/* Role Switcher (preselects from ?role=) */}
            <View style={styles.roleTabs}>
              <RoleTab value="CUSTOMER" label="Customer" />
              <RoleTab value="SHOPKEEPER" label="Shopkeeper" />
            </View>

            {/* Common: Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              style={[styles.input, errors.fullName && styles.inputError]}
              autoCapitalize="words"
              textContentType="name"
              accessibilityLabel="Full name"
              returnKeyType="next"
            />
            {errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}

            {/* Common: Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94A3B8"
              style={[styles.input, errors.email && styles.inputError]}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              accessibilityLabel="Email address"
              returnKeyType="next"
            />
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            {/* Optional Common: Phone */}
            <Text style={styles.label}>Phone (optional)</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94A3B8"
              style={[styles.input, errors.phone && styles.inputError]}
              autoCapitalize="none"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              accessibilityLabel="Phone number"
              returnKeyType="next"
            />
            {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputRow, errors.password && styles.inputError]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor="#94A3B8"
                style={styles.inputFlex}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="password"
                accessibilityLabel="Password"
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputRow, errors.confirm && styles.inputError]}>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="••••••"
                placeholderTextColor="#94A3B8"
                style={styles.inputFlex}
                secureTextEntry={!showConfirm}
                autoCapitalize="none"
                textContentType="password"
                accessibilityLabel="Confirm password"
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={() => setShowConfirm((s) => !s)}
                accessibilityRole="button"
                accessibilityLabel={showConfirm ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.toggle}>{showConfirm ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}

            {/* ------- SHOPKEEPER FIELDS ------- */}
            {role === 'SHOPKEEPER' && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Shop Details</Text>

                <Text style={styles.label}>Shop Name</Text>
                <TextInput
                  value={shopName}
                  onChangeText={setShopName}
                  placeholder="Acme General Store"
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, errors.shopName && styles.inputError]}
                  autoCapitalize="words"
                  accessibilityLabel="Shop name"
                />
                {errors.shopName ? <Text style={styles.error}>{errors.shopName}</Text> : null}

                <Text style={styles.label}>Address</Text>
                <TextInput
                  value={shopAddress}
                  onChangeText={setShopAddress}
                  placeholder="123, MG Road, Kurla"
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, errors.shopAddress && styles.inputError]}
                  autoCapitalize="sentences"
                  accessibilityLabel="Shop address"
                />
                {errors.shopAddress ? <Text style={styles.error}>{errors.shopAddress}</Text> : null}

                <Text style={styles.label}>City</Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Mumbai"
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, errors.city && styles.inputError]}
                  autoCapitalize="words"
                  accessibilityLabel="City"
                />
                {errors.city ? <Text style={styles.error}>{errors.city}</Text> : null}

                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  value={pincode}
                  onChangeText={setPincode}
                  placeholder="400070"
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, errors.pincode && styles.inputError]}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  accessibilityLabel="Pincode"
                  maxLength={7}
                />
                {errors.pincode ? <Text style={styles.error}>{errors.pincode}</Text> : null}
              </>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={onRegister}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {role === 'SHOPKEEPER' ? 'Create Shop Account' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Continue with Google */}
            {/* <TouchableOpacity
              style={[styles.googleBtn, !request && styles.buttonDisabled]}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity> */}

            {/* Already have account */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href={'/login'}>
              
                <TouchableOpacity>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#475569', marginTop: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  // Role tabs
  roleTabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  roleTab: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  roleTabActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  roleTabText: { color: '#334155', fontWeight: '600' },
  roleTabTextActive: { color: '#2563EB' },

  // Inputs
  label: { fontSize: 14, color: '#334155', marginBottom: 6, marginTop: 12 },
  input: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 14, backgroundColor: '#F8FAFC', color: '#0F172A',
  },
  inputRow: {
    height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 14, backgroundColor: '#F8FAFC', color: '#0F172A',
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  inputFlex: { flex: 1, color: '#0F172A' },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  error: { color: '#B91C1C', fontSize: 12, marginTop: 6 },

  toggle: { color: '#2563EB', fontWeight: '600' },

  // Buttons
  button: {
    marginTop: 20, height: 50, borderRadius: 12, backgroundColor: '#2563EB',
    alignItems: 'center', justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  googleBtn: {
    marginTop: 12, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
  },
  googleText: { color: '#0F172A', fontSize: 16, fontWeight: '700' },

  footer: { marginTop: 18, flexDirection: 'row', alignItems: 'center' },
  footerText: { color: '#475569' },
  link: { color: '#2563EB', fontWeight: '600' },
});
