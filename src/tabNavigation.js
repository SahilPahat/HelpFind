import React from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import I18n from './i18n';

// Screens
import HomeScreen from './container/BottomTab/Home';
import HomeDetailsScreen from './container/BottomTab/Home/details';
import HomeAddNewPostScreen from './container/BottomTab/Home/addPost';
import HomeAddTagUserScreen from './container/BottomTab/Home/tagPage';
import HomeCommentScreen from './container/BottomTab/Home/comment';
import HomeSharedScreen from './container/BottomTab/Home/sharePost';
import HomeForwardPostScreen from './container/BottomTab/Home/forward';
import MapSearchScreen from './container/BottomTab/Home/mapSearchShow';

import NotificationScreen from './container/BottomTab/Notification';
import NotificationDetailsScreen from './container/BottomTab/Notification/details';

import MyPostScreen from './container/BottomTab/MyPost';
import MyPostDetailsScreen from './container/BottomTab/MyPost/details';
import EditPostScreen from './container/BottomTab/MyPost/editPost';
import MyPostCommentScreen from './container/BottomTab/MyPost/comment';

import ProfileScreen from './container/BottomTab/Profile';
import ChangePasswordScreen from './container/BottomTab/Profile/changePassword';
import EditProfileScreen from './container/BottomTab/Profile/editProfile';
import ProfileUserCityScreen from './container/BottomTab/Profile/city';
import {createStackNavigator} from '@react-navigation/stack';
import { buttonBackgroundColor, textLabelColor } from '../env';

// Create stack and tab navigators
const Stack = createStackNavigator(); // or use `createStackNavigator`
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="HomeTab" component={HomeScreen} />
    <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
    <Stack.Screen name="HomeAddNewPost" component={HomeAddNewPostScreen} />
    <Stack.Screen name="HomeAddTagUser" component={HomeAddTagUserScreen} />
    <Stack.Screen name="HomeComment" component={HomeCommentScreen} />
    <Stack.Screen name="HomeForwardPost" component={HomeForwardPostScreen} />
    <Stack.Screen name="MapSearch" component={MapSearchScreen} />
    <Stack.Screen name="SharedPost" component={HomeSharedScreen} />
  </Stack.Navigator>
);

// Notification Stack
const NotificationStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Notification" component={NotificationScreen} />
    <Stack.Screen
      name="NotificationDetails"
      component={NotificationDetailsScreen}
    />
  </Stack.Navigator>
);

// MyPost Stack
const MyPostStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="MyPost" component={MyPostScreen} />
    <Stack.Screen name="MyPostDetails" component={MyPostDetailsScreen} />
    <Stack.Screen name="EditPost" component={EditPostScreen} />
    <Stack.Screen name="MyPostComment" component={MyPostCommentScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ProfileTab" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ProfileUserCity" component={ProfileUserCityScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? require('./images/homeAc.png')
            : require('./images/homeIn.png');
        } else if (route.name === 'MyPost') {
          iconName = focused
            ? require('./images/myPostAc.png')
            : require('./images/myPostIn.png');
        } else if (route.name === 'Notification') {
          iconName = focused
            ? require('./images/notificationAc.png')
            : require('./images/notificationIn.png');
        } else if (route.name === 'Profile') {
          iconName = focused
            ? require('./images/profileAc.png')
            : require('./images/profileIn.png');
        }

        return (
          <Image
            style={{width: 30, height: 30, marginTop: 8}}
            source={iconName}
          />
        );
      },
      tabBarActiveTintColor: buttonBackgroundColor,
      tabBarInactiveTintColor: textLabelColor,
      tabBarStyle: {height: 65, backgroundColor: 'white'},
      tabBarLabelStyle: {fontSize: 13, paddingTop: 2, marginBottom: 8},
    })}>
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{title: I18n.t('drawer.Home')}}
    />
    <Tab.Screen
      name="MyPost"
      component={MyPostStack}
      options={{title: I18n.t('drawer.MyPost')}}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{title: I18n.t('drawer.Profile')}}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
  </Stack.Navigator>
);

export default AppNavigator;
