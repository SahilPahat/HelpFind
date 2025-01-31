import React, {Component} from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavigationApp from './src';
import BottomTab from './src/tabNavigation';
import LoadingComponent from './src/component/loadingComponent';
import { NavigationContainer } from '@react-navigation/native';

export default class AppScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousLogin: false,
      isLoaderVisible: true,
    };
    this.onStorageDataLoad();
  }

  async onStorageDataLoad() {
    await AsyncStorage.getItem('token').then(value => {
      this.setState({
        token: JSON.parse(value),
      });
    });
    await AsyncStorage.getItem('userId').then(value => {
      this.setState({
        userId: JSON.parse(value),
      });
    });
    console.log(
      this.state.userId,
      this.state.token,
      'check token & userId in first screen',
    );
    if (this.state.token === null && this.state.userId === null) {
      this.setState({previousLogin: false});
    } else {
      this.setState({previousLogin: true});
    }
    this.setState({isLoaderVisible: false});
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    console.log(this.state, 'all state in app.js file');

    if (this.state.isLoaderVisible) {
      return <LoadingComponent />;
    }

    return (
      <NavigationContainer>
        {this.state.previousLogin === true ? <BottomTab /> : <NavigationApp />}
      </NavigationContainer>
    );
  }
}
