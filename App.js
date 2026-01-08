import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import MainPage from './screens/MainPage';
import SearchPage from './screens/SearchPage';
import AddReview from './screens/AddReview';
import Activity from './screens/Activity';
import Profile from './screens/Profile';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Main') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'AddReview') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Activity') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Main" 
          component={MainPage}
          options={{
            title: 'Main Page',
            tabBarLabel: 'Main',
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchPage}
          options={{
            title: 'Search',
            tabBarLabel: 'Search',
          }}
        />
        <Tab.Screen 
          name="AddReview" 
          component={AddReview}
          options={{
            title: 'Add Review',
            tabBarLabel: 'Add Review',
          }}
        />
        <Tab.Screen 
          name="Activity" 
          component={Activity}
          options={{
            title: 'Activity',
            tabBarLabel: 'Activity',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
