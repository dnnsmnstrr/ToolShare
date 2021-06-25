import React from 'react';
import { UIManager, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {AuthProvider} from './hooks/useAuth';
import {ToolProvider} from './hooks/useTools';
import {LoanProvider} from './hooks/useLoan';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AuthProvider>
        <ToolProvider>
          <LoanProvider>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </LoanProvider>
        </ToolProvider>
      </AuthProvider>
    );
  }
}
