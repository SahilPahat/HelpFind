import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import ChooseLanguage from './container/Initial/language';

import LoginScreen from './container/Initial/login';
import LoginFacebookScreen from './container/Initial/fillFacebookInfo';

import RegistrationScreen from './container/Initial/registration';
import RegistrationInterestedCityScreen from './container/Initial/registrationInterestedCity';
import RegistrationFullAddressScreen from './container/Initial/registrationFullAddress';

import TabNavigation from './tabNavigation';

import SkipTabNavigation from './skipTabNavigation';

const Stack = createStackNavigator();

const NavigationApp = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Language" component={ChooseLanguage} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="LoginFacebook" component={LoginFacebookScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen
        name="RegistrationInterestedCity"
        component={RegistrationInterestedCityScreen}
      />
      <Stack.Screen
        name="RegistrationFullAddress"
        component={RegistrationFullAddressScreen}
      />
      <Stack.Screen name="skipUserTabBar" component={SkipTabNavigation} />
      <Stack.Screen name="BottomTabBar" component={TabNavigation} />
    </Stack.Navigator>
  );
};

export default NavigationApp;
