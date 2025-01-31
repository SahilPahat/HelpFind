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

import HelpFindAPI from '../../../config';
import HomeComponent from './mainComponent';
import HeaderComponent from '../../component/headerComponent';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';
import LoadingComponent from '../../component/loadingComponent';
import I18n from '../../i18n';


class HomeSkipUser extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
      return(
        I18n.locale = JSON.parse(value)
      )}
    );
    this.state = {
      data: '',
      IsLoaderVisible : true,
      networkStatus : true,
      noData : false,
      refreshing: false,
      data: ''
    };
    this.allPostLoadDataAPI();
  }

  componentDidMount(){
    this.timer = setInterval(()=> this.allPostLoadDataAPI(), 50000)
   }

   onRefreshControl(){
      this.setState({ refreshing : true })
      this.allPostLoadDataAPI();
   }

  allPostLoadDataAPI() {
      if(this.props.isConnected) {
        var URL= HelpFindAPI.BASE_URL+'get_all_posts_without_token';
        fetch(URL,  {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((responseJson) => {
              if(responseJson.sucess){
                  if(responseJson.data.length > 0 ){
                    this.setState({ data : responseJson.data })
                    AsyncStorage.setItem('skipHomeData', JSON.stringify(responseJson.data) );
                    this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                  } else {
                    this.setState({ noData : true })
                    AsyncStorage.getItem("skipHomeData").then((value) => {
                      this.setState({ data : JSON.parse(value), refreshing : false })
                    })
                    this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false})
                  }
              }else{
                AsyncStorage.getItem("skipHomeData").then((value) => {
                  this.setState({ data : JSON.parse(value), refreshing : false })
                })
                this.setState({ IsLoaderVisible: false, networkStatus : true })
              }
            }).catch((error) => {
              AsyncStorage.getItem("skipHomeData").then((value) => {
                this.setState({ data : JSON.parse(value), refreshing : false })
              })
              this.setState({ IsLoaderVisible: false, networkStatus : true })
            });
        } else {

          AsyncStorage.getItem("skipHomeData").then((value) => {
            this.setState({ data : JSON.parse(value), refreshing : false })
          })
          this.setState({ networkStatus : false })
          this.setState({ IsLoaderVisible: false })
        }
    this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false }) 
}

  render() {
  
    if(this.state.IsLoaderVisible){
      return(
        <ImageBackground source={require('../../images/backgroundImage.png')} style={{ flex: 1 }}>
          <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
              <View style={{ flex: 1 }} />
              <View style={{ flex: 2, alignItems: 'center'}}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.home.header')}</Text>
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LoginScreen') }>
                <Image style={{ width:38, height:38 }} source={require('../../images/skipUserLogin.png')}/>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.home.loginTitle')}</Text>
              </TouchableOpacity>
          </View>
          <LoadingComponent />
        </ImageBackground>
      )
    }

    if(this.state.noData){
      return(
        <View style={{ flex : 1, alignItems: 'center', justifyContent: 'center' }}>
           <Text>No Data Found. Please add some post.</Text>
        </View>
      )
    }

    return (
      <View style={styles.mainContainer}>

        <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 2, alignItems: 'center'}}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.home.header')}</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LoginScreen') }>
              <Image style={{ width:38, height:38 }} source={require('../../images/skipUserLogin.png')}/>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.home.loginTitle')}</Text>
            </TouchableOpacity>
        </View>

        {
          !this.state.networkStatus ?
            <View style={{ backgroundColor: 'red' }}>
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Network not connected</Text>
            </View>
            :
            null
        }
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefreshControl() }
            />
          }
        >
          <HomeComponent data={this.state.data} navigation={this.props.navigation}/>
        </ScrollView>
      </View>
    );
  }
}

export default (HomeSkipUser);

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    }
});  