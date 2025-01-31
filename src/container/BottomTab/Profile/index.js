import React, {Component} from 'react';
import { Alert, Platform, ActivityIndicator, RefreshControl, Dimensions,  ImageBackground, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import I18n from '../../../i18n';
import HelpFindAPI from '../../../../config';
import HeaderComponent from '../../../component/headerComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import LoadingComponent from '../../../component/loadingComponent';
import Spinner from 'react-native-loading-spinner-overlay';
import RNRestart from 'react-native-restart'; // Import package from node modules
var { height, width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';



class MyProfile extends Component {

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
      selectedLanguage : 'en'
    }
    this.onStorageDataLoad();
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
    this.profilePageData();
  }


  componentDidMount(){
    this.timer = setInterval(()=> this.profilePageData(), 10000)
 }
  


  //to load the data from api
  async profilePageData() {


              if(this.props.isConnected) {

                this.setState({ refreshing : true })
                var URL= HelpFindAPI.BASE_URL+'get_user_by_userID';

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
                        this.setState({ data : responseJson })
                        AsyncStorage.setItem('profileData', JSON.stringify(responseJson) );
                        this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                      }else{
                        AsyncStorage.getItem("profileData").then((value) => {
                          this.setState({ data : JSON.parse(value), refreshing : false })
                        })

                        this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                      }
                    }).catch((error) => {
                      AsyncStorage.getItem("profileData").then((value) => {
                        this.setState({ data : JSON.parse(value), refreshing : false })
                      })
                      this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })

                    });
                } else {

                  AsyncStorage.getItem("profileData").then((value) => {
                    this.setState({ data : JSON.parse(value) })
                  })
                  this.setState({ networkStatus : false, refreshing : false })
                  this.setState({ IsLoaderVisible: false })
                }
}

onPressLogout = () => {

  Alert.alert(
    'Logout',
    'Are you want to sure to logout the help find application ?',
    [
      {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'OK', onPress: () => this.confirmLogout()},
    ],
    { cancelable: false }
  )
}

confirmLogout = () => {
  if(this.state.networkStatus){
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('userId');
    RNRestart.Restart();
  }
}

  render() {


    if(this.state.IsLoaderVisible){
      return(
        <View style={{ flex : 1 }}>
          <ScrollView>
            <HeaderComponent label={I18n.t('Profile.index.header')} />
            <View style={{ marginTop: height/3, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={buttonBackgroundColor} />
            </View>
          </ScrollView>
        </View>
      )
    }

    return (
      <View style={styles.container}>
          <HeaderComponent label={I18n.t('Profile.index.header')} />
          {
            !this.state.networkStatus ?
            <View style={{ backgroundColor: 'red' }}>
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Network not connected</Text>
            </View>
            :
            null
          }
      
          {
            this.state.data === '' ?
            null : 
            <ScrollView
              style={styles.scroll}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.profilePageData() }
                />
              }

              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps='handled'
            >


            <View style={styles.headerContainer}>
              <ImageBackground
                style={styles.headerBackgroundImage}
                blurRadius={10}
                source={require('../../../images/profileBackground.png')}
              >
                <View style={styles.headerColumn}>
                  {
                    this.state.data.user_image === null ? 
                      <Image
                        style={styles.userImage}
                        source={require('../../../images/notificationTest1.png')}
                      /> :
                      <Image
                        style={styles.userImage}
                        source={{ uri : this.state.data.user_image}}
                      />
                  }
                  <Text style={styles.userNameText}>{ (this.state.data.data && this.state.data.data.length) > 0 ? this.state.data.data[0].display_name : '' }</Text>
                  <View style={styles.userAddressRow}>
                    <View style={styles.userCityRow}>
                      <Text style={styles.userCityText}>
                        {this.state.data.city}  {this.state.data.state} { this.state.data.country === '' ? this.state.data.country.value : '' }
                      </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
            
            <View style={{ backgroundColor: 'white', alignItems: 'flex-end', padding: 10 }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile', this.state.data ) } style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, padding: 5, borderColor: '#D3D3D3' }}>
                <Image style={styles.bodyIcon} source={require('../../../images/editProfile.png')}/>
                <Text style={{ marginLeft: 5 }}>{I18n.t('Profile.index.editLabel')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/Name.png')}/>
              <Text style={styles.bodyLabel}>{I18n.t('Profile.index.NameTextLabel')}</Text>
              <Text style={styles.bodyRight}>{ (this.state.data.data && this.state.data.data.length) > 0 ? this.state.data.data[0].display_name : '' }</Text>
            </View>
            <View style={styles.line} />

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/email.png')}/>
              <Text style={styles.bodyLabel}>{I18n.t('Profile.index.EmailTextLabel')}</Text>
              <Text style={styles.bodyRight}>{ (this.state.data.data && this.state.data.data.length) > 0 ? this.state.data.data[0].user_email : '' }</Text>
            </View>
            <View style={styles.line} />

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/City.png')}/>
              <Text style={styles.bodyLabel}>{I18n.t('Profile.index.SelectedCityTextLabel')}</Text>
              <Text style={styles.bodyRight}>{this.state.data.city}</Text>
            </View>
            <View style={styles.line} />

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/Country.png')}/>
              <Text style={styles.bodyLabel}>{I18n.t('Profile.index.SelectedCountryTextLabel')}</Text>
              <Text style={styles.bodyRight}>{ this.state.data.country === '' ? this.state.data.country.value : '' }</Text>
            </View>
            <View style={styles.line} />

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/Logout.png')}/>
              <Text style={styles.bodyLabel}>{I18n.t('Profile.index.logoutTextLabel')}</Text>
              <TouchableOpacity style={styles.button} onPress={() => this.onPressLogout()}>
                <Text style = {styles.bodyRight}>{I18n.t('Profile.index.logoutLabel')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />

            <View style={styles.bodyContainer}>
              <Image style={styles.bodyIcon} source={require('../../../images/changePassword.png')}/>
              <Text style={styles.bodyLabel}>Change Password</Text>
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('ChangePassword', this.state.data ) }>
                <Text style = {styles.bodyRight}>Change Password</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.line} />

          </ScrollView>
          }


      </View>
    );
  }
}
export default (MyProfile);

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: backgroundColor,
  },
  contentContainer: {

  },
  container: {
    flex: 1,
  },
  header:{
    backgroundColor: "#3ea7c8",
  },
  headerContent:{
    padding:20,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom:10,
  },
  image:{
    width: 50,
    height: 50,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  userImage: {
    borderColor: 'green',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  bodyContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  bodyIcon:{
    width:25,
    height:25,
    marginLeft:15,
    justifyContent: 'center'
  },
  bodyLabel:{
    fontSize: 15,
    flex: 1,
    marginLeft: 16
  },
  bodyRight:{
    fontSize: 17,
    flex: 1,
    padding: 5
  },
  line : {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: '#D3D3D3'
  }
});