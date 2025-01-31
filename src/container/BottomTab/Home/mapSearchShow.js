import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Button,
  Platform,
  
  ActivityIndicator,
  RefreshControl,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../../../i18n';
import HelpFindAPI from '../../../../config';
import HomeComponent from './mainComponent';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import LoadingComponent from '../../../component/loadingComponent';
import Spinner from 'react-native-loading-spinner-overlay';

var newData = '';

export default class MapSearchShow extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
      return(
        I18n.locale = JSON.parse(value)
      )}
    );
    this.state = {

      data: props.navigation.state.params === undefined ? '' : props.navigation.state.params.data,
      selectedCity : props.navigation.state.params === undefined ? '' : props.navigation.state.params.selectedCity.length > 0 ? props.navigation.state.params.selectedCity[0] : '',
      afterData : '',

      IsLoaderVisible : true,
      networkStatus : true,
      //for show map & select the city
      showMap : false,
      noData : false,
      refreshing: false,
      postGoogleData : '',
    };
    this.arrayholder = this.state.data;
    this.searchFilterFunction();
  }

    searchFilterFunction = () => {
        itemData = '';
            newData = this.arrayholder !== undefined && this.arrayholder.filter(item => {
               
                if(item.post_meta.length === 0) {
                    
                } else {
                  if (item.post_meta.city.length) {
                      itemData = `${item.post_meta.city[0].toUpperCase()}`;

                        var textData = this.state.selectedCity.toUpperCase();

                        return itemData.indexOf(textData) > -1;

                        
                  }
                }
            });
        
    };

  render() {
    
   

    var leng = newData === '' ? 0 : newData.length;
    var header = `${leng} Post in ${this.state.selectedCity} City`
    return (
        <View style={{ flex: 1 }}>

            <HeaderWithBackButton label={header} other={this.props.navigation} />
            {
                newData !== '' ? <HomeComponent data={newData} userId={this.state.userId} token={this.state.token} navigation={this.props.navigation} /> : null
            }
        </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
});  