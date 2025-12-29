import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AgreementScreen from './src/screens/AgreementScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import GovernanceScreen from './src/screens/GovernanceScreen';
import AboutScreen from './src/screens/AboutScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#007cba" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007cba',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Music Engine' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ title: 'Platform' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Music Registration' }}
        />
        <Stack.Screen 
          name="Agreement" 
          component={AgreementScreen} 
          options={{ title: 'Legal Agreements' }}
        />
        <Stack.Screen 
          name="Services" 
          component={ServicesScreen} 
          options={{ title: 'Services' }}
        />
        <Stack.Screen 
          name="Governance" 
          component={GovernanceScreen} 
          options={{ title: 'Governance' }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen} 
          options={{ title: 'About' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}