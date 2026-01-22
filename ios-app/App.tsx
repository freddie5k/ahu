import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HomeScreen from './screens/HomeScreen'
import OpportunityDetailScreen from './screens/OpportunityDetailScreen'
import NewOpportunityScreen from './screens/NewOpportunityScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OpportunityDetail"
            component={OpportunityDetailScreen}
            options={{ title: 'Edit Opportunity' }}
          />
          <Stack.Screen
            name="NewOpportunity"
            component={NewOpportunityScreen}
            options={{ title: 'New Opportunity' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
