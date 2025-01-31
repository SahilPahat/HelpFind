import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from './i18n';
import { buttonBackgroundColor, textLabelColor } from '../env';

// Screens
import SkipUserHomeScreen from './container/skipUserTab';
import SkipUserHomeDetailsScreen from './container/skipUserTab/details';
import SkipUserHomeCommentScreen from './container/skipUserTab/skipHomeComment';

// Create stack and tab navigators
const Stack = createStackNavigator(); // or use `createStackNavigator`
const Tab = createBottomTabNavigator();

// Skip Home Stack
const SkipHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SkipUserHome" component={SkipUserHomeScreen} />
    <Stack.Screen name="SkipUserHomeDetails" component={SkipUserHomeDetailsScreen} />
    <Stack.Screen name="SkipUserHomeComment" component={SkipUserHomeCommentScreen} />
  </Stack.Navigator>
);

// Skip User Tab Navigator
const SkipUserTabNavigator = () => {
  // Set the language from AsyncStorage
  useEffect(() => {
    const setLanguage = async () => {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage) {
        I18n.locale = JSON.parse(selectedLanguage);
      }
    };
    setLanguage();
  }, []);

  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'SkipHome') {
              iconName = focused ? require('./images/homeAc.png') : require('./images/homeIn.png');
            } else {
              iconName = focused ? require('./images/homeAc.png') : require('./images/homeIn.png');
            }

            return <Image style={{ width: 30, height: 30, marginTop: 8 }} source={iconName} />;
          },
          tabBarActiveTintColor: buttonBackgroundColor,
          tabBarInactiveTintColor: textLabelColor,
          tabBarStyle: { height: 65, backgroundColor: 'white' },
          tabBarLabelStyle: { fontSize: 13, paddingTop: 2, marginBottom: 8 },
        })}
      >
        <Tab.Screen name="SkipHome" component={SkipHomeStack} options={{ title: 'Home' }} />
      </Tab.Navigator>
  );
};

export default SkipUserTabNavigator;