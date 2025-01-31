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
  ImageBackground,
  PermissionsAndroid,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ActionButton from 'react-native-action-button';

import MapView from 'react-native-maps';

import I18n from '../../../i18n';
import HelpFindAPI from '../../../../config';
import HomeComponent from './mainComponent';
import HeaderComponent from '../../../component/headerComponent';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import LoadingComponent from '../../../component/loadingComponent';

var { height, width } = Dimensions.get('window');
import RNRestart from 'react-native-restart'; // Import package from node modules

class Home extends Component {

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
      //for show map & select the city
      showMap : false,
      noData : false,
      refreshing: false,
      postGoogleData : '',
      selectedCity : '',

      //for current location latitude & longtitude
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
    this.onStorageDataLoad();
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  //for load data from AsynchStorage storage
  async onStorageDataLoad() {
    await AsyncStorage.getItem("token").then((value) => {

      this.setState({
        token : JSON.parse(value)
      })
    });
    await AsyncStorage.getItem("userId").then((value) => {

      this.setState({
        userId : JSON.parse(value)
      })
    });
    this.allPostLoadDataAPI();
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'This app needs access to your location',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          this.watchID = navigator.geolocation.watchPosition((position) => {
          let region = {
            latitude:       position.coords.latitude,
            longitude:      position.coords.longitude,
            latitudeDelta:  0.00922*1.5,
            longitudeDelta: 0.00421*1.5
          }
         this.onRegionChange(region, region.latitude, region.longitude);
        }, (error)=>{
          let region = {
            latitude:       30.5852,
            longitude:      36.2384,
            latitudeDelta:  0.00922*1.5,
            longitudeDelta: 0.00421*1.5
          }
          this.onRegionChange(region, region.latitude, region.longitude);
        });
      } else {
        console.log('Hello ios map');
        let region = {
          latitude:       30.5852,
          longitude:      36.2384,
          latitudeDelta:  0.00922*1.5,
          longitudeDelta: 0.00421*1.5
        }
        this.onRegionChange(region, region.latitude, region.longitude);
      }
    } catch (err) {

    }
  }

  onRegionChange(region, lastLat, lastLong) {
    console.log('Hello ios map 11');
    this.setState({
      mapRegion: region,
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentDidMount(){
    this.timer = setInterval(()=> this.allPostLoadDataAPI(), 30000)
    this.requestLocationPermission();
   }

  onRefreshControl(){
    this.setState({ refreshing : true })
    this.allPostLoadDataAPI();
  }

  //for show map & select the city
  onMapCityClick(item) {

    this.setState({
      showMap : false
    })
  }

  //to load the data from api
    allPostLoadDataAPI() {
          this.setState({ refreshing : true })
          if(this.props.isConnected) {

            var URL= HelpFindAPI.BASE_URL+'get_all_posts';

            fetch(URL,  {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "user_id" : this.state.userId,
                  "token" : this.state.token
                })
            }).then((response) => response.json()).then((responseJson) => {

                  if(responseJson.sucess){
                      if(responseJson.data.length > 0 ){
                        this.setState({ data : responseJson.data, })
                        this.setState({ postGoogleData : responseJson.data })
                        AsyncStorage.setItem('completeData', JSON.stringify(responseJson.data) );
                        this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                      } else {
                        AsyncStorage.getItem("completeData").then((value) => {
                          this.setState({ data : JSON.parse(value), refreshing : false })
                        })
                        this.setState({ noData : true })
                        this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false})
                      }
                  }else{
                    AsyncStorage.getItem("completeData").then((value) => {
                      this.setState({ data : JSON.parse(value), refreshing : false })
                    })

                    this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                  }
                }).catch((error) => {
                  AsyncStorage.getItem("completeData").then((value) => {
                    this.setState({ data : JSON.parse(value), refreshing : false })
                  })
                  this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })

                });
            } else {

              AsyncStorage.getItem("completeData").then((value) => {
                this.setState({ data : JSON.parse(value) })
              })
              this.setState({ networkStatus : false, refreshing : false })
              this.setState({ IsLoaderVisible: false })
            }
  }

  onMapButton = (selectedCity) => {

    this.setState({ showMap : false })
    this.props.navigation.navigate('MapSearch', { data: this.state.postGoogleData, selectedCity : selectedCity } )
  }

  render() {
    console.log(this.state, 'please one find')
    if(this.state.IsLoaderVisible){
      return(
        <View style={{ flex : 1 }}>
          <ScrollView>
            <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 3, alignItems: 'center'}}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('Home.index.header')}</Text>
                </View>
                <View style={{ flex: 1.3 }}>
                      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.setState({ showMap : true }) }>
                          <Image source={require('../../../images/googleMap.png')}/>
                          <Text style={{ color: 'white', fontSize: 18, marginLeft: 5, fontWeight: 'bold' }}>{I18n.t('Home.index.HideMapLabel')}</Text>
                      </TouchableOpacity>
                </View>
            </View>
              <View style={{ marginTop: height/3, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color={buttonBackgroundColor} />
              </View>
            </ScrollView>
          </View>
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
        
        {   
            this.state.showMap ?
              <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                    
                <TouchableOpacity style={{ flex: 1, marginLeft: 5, flexDirection: 'row' }} onPress={() => this.setState({ showMap : false })}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/back.png')}/>
                    <Text style={{ color : 'white', fontSize : 16 }}>Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('Home.index.ShowGoogleMapLabel')}</Text>
                </View>
                <View style={{ flex: 1 }}/>
              </View>

            :
            <View>
              <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 3, alignItems: 'center'}}>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('Home.index.header')}</Text>
                  </View>
                  <View style={{ flex: 1.3 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.setState({ showMap : true }) }>
                            <Image source={require('../../../images/googleMap.png')}/>
                            <Text style={{ color: 'white', fontSize: 18, marginLeft: 5, fontWeight: 'bold' }}>{I18n.t('Home.index.HideMapLabel')}</Text>
                        </TouchableOpacity>
                  </View>
              </View>
              {
                !this.state.networkStatus ?
                  <View style={{ backgroundColor: 'red' }}>
                    <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Network not connected</Text>
                  </View>
                  :
                  null
              }
            </View>
        }
        {   
            this.state.showMap ?
            <View style={{ flex : 1 }}>
              
              <MapView
              style={ styles.map }
              initialRegion={{
                latitude: Platform.OS === 'ios' ? 30.5852 : 30.5852,
                longitude: Platform.OS === 'ios' ? 36.2384 : 30.5852,
                latitudeDelta: Platform.OS === 'ios' ? 0.00922*1.5 : 0.00922*1.5,
                longitudeDelta: Platform.OS === 'ios' ? 0.00421*1.5 : 0.00421*1.5, 
              }}
            > 
            
              {
                this.state.postGoogleData !=='' && this.state.postGoogleData.map((item, key) => {


          
                  var locationCity = 'Noida';

                  if(item.post_meta.city !== undefined ){
                      var locationCity = item.post_meta.city;
                  }else {
                    var locationCity = 'Noida';
                  }

                  var latitude = 30.5852;
                  var longtitude = 36.2384;
                  if(item.post_meta.lat === undefined){
                    latitude = 30.5852;
                  }else {
                    latitude = Number(item.post_meta.lat);
                  }
                  if(item.post_meta.long === undefined){
                    longtitude= 36.2384;
                  } else {
                    longtitude = Number(item.post_meta.long);
                  }
                  


                  return (
                    <MapView.Marker
                      coordinate={{ latitude: latitude,
                      longitude: longtitude }}
                      title="title"
                      description="description"
                      key={key}
                    >
                      <MapView.Callout onPress={() => this.onMapButton(locationCity) } >
                          <TouchableOpacity style={{ backgroundColor : buttonBackgroundColor }}>
                              <Text style={{ color: 'red' }}>Post in {locationCity} City</Text>
                          </TouchableOpacity>
                      </MapView.Callout>
                    </MapView.Marker>
                  )
                })
              }
              </MapView>  
            </View>  :
              <View style={{ flex: 1 }}>
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={ () => this.allPostLoadDataAPI() }
                    />
                  }
                >
                  <HomeComponent data={this.state.data} userId={this.state.userId} token={this.state.token} methodCall={ () => this.allPostLoadDataAPI() } navigation={this.props.navigation}/>
                </ScrollView>
                {/* <ActionButton buttonColor= {buttonBackgroundColor}>
                  <ActionButton.Item
                    buttonColor={buttonBackgroundColor}
                    title={I18n.t('Home.index.actionButtonLabel')}
                    onPress={() => this.props.navigation.navigate('HomeAddNewPost')}
                  >
                    <Image style={{ width:38, height:30 }} source={require('../../../images/commentIcon.png')}/>
                  </ActionButton.Item>
                  
                </ActionButton> */}
              </View>
        }
        

      </View>
    );
  }
}

export default (Home);

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