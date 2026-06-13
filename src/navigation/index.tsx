import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/rates';
import { useAuthStore } from '../store/authStore';

import SplashScreen from '../screens/auth/SplashScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import PhoneAuthScreen from '../screens/auth/PhoneAuthScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

import FarmerHomeScreen from '../screens/farmer/FarmerHomeScreen';
import BookingFormScreen from '../screens/farmer/BookingFormScreen';
import BookingSuccessScreen from '../screens/farmer/BookingSuccessScreen';
import BookingHistoryScreen from '../screens/farmer/BookingHistoryScreen';

import WorkerHomeScreen from '../screens/worker/WorkerHomeScreen';
import MyJobsScreen from '../screens/worker/MyJobsScreen';
import EarningsScreen from '../screens/worker/EarningsScreen';

import CoordinatorHomeScreen from '../screens/coordinator/CoordinatorHomeScreen';
import MachineryOwnerHomeScreen from '../screens/machinery/MachineryOwnerHomeScreen';

import ProfileScreen from '../screens/shared/ProfileScreen';
import RatingScreen from '../screens/shared/RatingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function tabIcon(emoji: string) {
  return () => <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

const tabOptions = (accent: string) => ({
  headerShown: false,
  tabBarActiveTintColor: accent,
  tabBarInactiveTintColor: COLORS.clay,
  tabBarStyle: { backgroundColor: COLORS.white, height: 64, paddingBottom: 8 },
  tabBarLabelStyle: { fontSize: 12, fontWeight: '700' as const },
});

function FarmerTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions(COLORS.soil)}>
      <Tab.Screen name="Home" component={FarmerHomeScreen} options={{ title: 'मुख्यपृष्ठ', tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="NewBooking" component={BookingFormScreen} options={{ title: 'बुकिंग', tabBarIcon: tabIcon('➕') }} initialParams={{}} />
      <Tab.Screen name="History" component={BookingHistoryScreen} options={{ title: 'इतिहास', tabBarIcon: tabIcon('📋') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'माझे खाते', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}

function WorkerTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions(COLORS.leaf)}>
      <Tab.Screen name="Home" component={WorkerHomeScreen} options={{ title: 'मुख्यपृष्ठ', tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="MyJobs" component={MyJobsScreen} options={{ title: 'माझे काम', tabBarIcon: tabIcon('💼') }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: 'कमाई', tabBarIcon: tabIcon('💰') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'माझे खाते', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}

function MachineryTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions(COLORS.leaf)}>
      <Tab.Screen name="Home" component={MachineryOwnerHomeScreen} options={{ title: 'मुख्यपृष्ठ', tabBarIcon: tabIcon('🚜') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'माझे खाते', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}

function CoordinatorTabs() {
  return (
    <Tab.Navigator screenOptions={tabOptions(COLORS.earth)}>
      <Tab.Screen name="Home" component={CoordinatorHomeScreen} options={{ title: 'डॅशबोर्ड', tabBarIcon: tabIcon('🧑‍💼') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'माझे खाते', tabBarIcon: tabIcon('👤') }} />
    </Tab.Navigator>
  );
}

function MainTabs() {
  const role = useAuthStore((st) => st.user?.role ?? st.selectedRole ?? 'farmer');
  if (role === 'worker') return <WorkerTabs />;
  if (role === 'machinery_owner') return <MachineryTabs />;
  if (role === 'coordinator') return <CoordinatorTabs />;
  return <FarmerTabs />;
}

export default function RootNavigator() {
  const user = useAuthStore((st) => st.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Main' : 'Splash'}
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.cream },
          headerTintColor: COLORS.earth,
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ title: '' }} />
        <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} options={{ title: '' }} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} options={{ title: '' }} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'सेवा बुक करा' }} />
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Rating" component={RatingScreen} options={{ title: 'रेटिंग' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
