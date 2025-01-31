import React, { Component } from 'react';
import {
  Image,
} from 'react-native';

import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../env';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import I18n from './i18n';
import { createStackNavigator } from '@react-navigation/stack';
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

const HomeStackScreen = createStackNavigator({
  HomeTab: HomeScreen,
  HomeDetails: HomeDetailsScreen,
  HomeAddNewPost : HomeAddNewPostScreen,
  HomeAddTagUser: HomeAddTagUserScreen,
  HomeComment : HomeCommentScreen,
  HomeForwardPost : HomeForwardPostScreen,
  MapSearch : MapSearchScreen,
  SharedPost : HomeSharedScreen
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const NotificationStackScreen = createStackNavigator({
  Notiifcation: NotificationScreen,
  NotificationDetails: NotificationDetailsScreen,
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const MyPostStackScreen = createStackNavigator({
  MyPost: MyPostScreen,
  MyPostDetails: MyPostDetailsScreen,
  EditPost: EditPostScreen,
  MyPostComment : MyPostCommentScreen
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const ProfileStackScreen = createStackNavigator({
  PofileTab: ProfileScreen,
  EditProfile: EditProfileScreen,
  ProfileUserCity : ProfileUserCityScreen,
  ChangePassword : ChangePasswordScreen
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

const BottomTabBarNavigator = createBottomTabNavigator(
  {
    Home : { screen : HomeStackScreen, navigationOptions: { title: I18n.t('drawer.Home')} },
    MyPost : { screen : MyPostStackScreen, navigationOptions: { title: I18n.t('drawer.MyPost')} },
    Profile : { screen : ProfileStackScreen, navigationOptions: { title: I18n.t('drawer.Profile')} }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = focused ? require('./images/homeAc.png') : require('./images/homeIn.png');
        } else if (routeName === 'MyPost') {
          iconName = focused ? require('./images/myPostAc.png') : require('./images/myPostIn.png');
        } else if (routeName === 'Notification') {
          iconName = focused ? require('./images/notificationAc.png') : require('./images/notificationIn.png');
        } else {
          iconName = focused ? require('./images/profileAc.png') : require('./images/profileIn.png');
        }
        return <Image style={{ width:30, height:30, marginTop: 8 }} source={iconName}/>;
      },
    }),
    
    tabBarOptions: {
			activeTintColor: buttonBackgroundColor,
		    style:  { height: 65, backgroundColor: 'white' },
			labelStyle: {
				fontSize: 13,
				paddingTop: 2,
				marginBottom: 8,
		  },
		  inactiveTintColor: textLabelColor,
	  },
  },
);



const BottomTab = createStackNavigator({
    loginUser : BottomTabBarNavigator,    
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

export default BottomTab;
