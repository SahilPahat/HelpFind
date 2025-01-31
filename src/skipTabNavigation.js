import React, { Component } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import I18n from './i18n';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonBackgroundColor, textLabelColor } from '../env';

import SkipUserHomeScreen from './container/skipUserTab';
import SkipUserHomeDetailsScreen from './container/skipUserTab/details';
import SkipUserHomeCommentScreen from './container/skipUserTab/skipHomeComment';

const SkipHomeStackScreen = createStackNavigator({
    SkipUserHome : SkipUserHomeScreen,
    SkipUserHomeDetails: SkipUserHomeDetailsScreen,
    SkipUserHomeComment : SkipUserHomeCommentScreen
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
      title: "Home",
    }
  }
);

AsyncStorage.getItem("selectedLanguage").then((value) => { 

  return(
    I18n.locale = JSON.parse(value)
  )},

);




const SkipUserTabNavigation = createBottomTabNavigator(
  {
    SkipHome : { screen : SkipHomeStackScreen, navigationOptions: { title: 'Home' } },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'SkipHome') {
          iconName = focused ? require('./images/homeAc.png') : require('./images/homeIn.png');
        } else {
          iconName = focused ? require('./images/homeAc.png') : require('./images/homeIn.png');
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



export default SkipUserTabNavigation;

