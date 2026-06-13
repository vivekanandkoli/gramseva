import React, { useEffect, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import RootNavigator from './src/navigation';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <View style={eb.container}>
          <Text style={eb.title}>🚨 Startup Error</Text>
          <ScrollView>
            <Text style={eb.msg}>{err.message}</Text>
            <Text style={eb.stack}>{err.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const eb = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', color: 'red', marginBottom: 12 },
  msg: { fontSize: 15, color: '#333', marginBottom: 8 },
  stack: { fontSize: 11, color: '#888' },
});

function AppInner() {
  const hydrate = useAuthStore((st) => st.hydrate);
  useEffect(() => { hydrate(); }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
