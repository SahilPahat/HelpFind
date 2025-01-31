import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TextInput,
    Platform,
    Image,
    ImageBackground,
    TouchableOpacity,
    
    Alert,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import HelpFindAPI from '../../../../config';
import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import I18n from '../../../i18n';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';

import ImagePicker from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


class EditProfile extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
    );
    this.state = {

      networkStatus: true,
      IsLoaderVisible: false,
      mainWarning: '',
      showFullAddressPage : false,
      hidePassword : true,
      showInterestedCityPage : false,
      firstname: props?.route?.params?.first_name === '' ? '' : props?.route?.params?.first_name,
      lastname: props?.route?.params?.last_name === '' ? '' : props?.route?.params?.last_name, 
      cityName : props?.route?.params?.city === '' ? '' : props?.route?.params?.city,
      stateName : props?.route?.params?.state,
      countryName : props?.route?.params?.country === '' ? props?.route?.params?.country.value : '',
      profileImage : props?.route?.params?.user_image === null ? null : props?.route?.params?.user_image,
      profileEmail : props?.route?.params?.data[0].user_email,
      password : '',
      fullAddress : '',
      base64ImagePath: '',
      wrongInformation : '',

      
      phone: props?.route?.params?.phone === '' ? props?.route?.params?.phone : '',
      secureTextEntry: true,

      warningEmail : false,
      warningPassword: false,

      warningMessage: false,
      newImage: false,
      


        borderName: '#D3D3D3',
        borderCity: '#D3D3D3',
        borderCountry: '#D3D3D3',
        
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
    }


  onEditProfileButton = () => {

    var { profileEmail, token, userId, password, phone, firstname, lastname, cityName, stateName, countryName, base64ImagePath } = this.state;
    let passwordValidString = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    if(profileEmail === ''){

        this.setState({ warningEmail : true, warningPassword : false})
    } else if(password === '') {

      this.setState({ warningEmail : false, warningPassword : true })
    }  else if(passwordValidString.test(password) === false) {
      this.setState({ warningEmail : false, warningPassword : true })
    } else {

      this.setState({ warningEmail : false, warningPassword : false })

        this.setState({ IsLoaderVisible : true })
        if(this.props.isConnected) {

          var URL= HelpFindAPI.BASE_URL+'edit_user_profile';

          fetch(URL,  {
              method: 'POST',
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "token"	:	token,
                "user_id"	:	userId,
                "user_name"		:	profileEmail,
                "user_pass"	:	password,
                "first_name" : firstname,
                "last_name" : lastname,
                "website" : "",
                "phone_no" : phone,
                "city"		:	cityName,
                "state"		:	stateName,
                "country"	:	countryName,
                "image"		:	base64ImagePath
              })
          }).then((response) => response.json()).then((responseJson) => {

                if(responseJson.sucess){
                    this.setState({ warningMessage : false, networkStatus : true, IsLoaderVisible: false, wrongInformation : '' })
                    Alert.alert('You have successfully updated your profile.')
                    this.props.navigation.navigate('HomeTab');
                }else{

                  this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: false, wrongInformation: 'you entered wrong password' })
                  if(responseJson.message === "User Data Not Update"){
                    this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: false, wrongInformation: 'please change some previous information' })
                  }
                }
              }).catch((error) => {
                this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true, wrongInformation : '' })

              });
          } else {

            this.setState({ networkStatus : false })
            this.setState({ IsLoaderVisible: false, warningMessage : false, wrongInformation : '' })
          }

    }
  }

selectPhotoTapped() {
    const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
            skipBackup: true
        }
    };
    this.setState({ loadingImage: true });
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {

      }
      else if (response.error) {

      }
      else if (response.customButton) {

      }
      else {
        let source = { uri: response.uri };

        this.setState({
            newImage : true,
            newProfileImage: source,
            base64ImagePath : response.data,
        });
        }
    });
  }

  managePasswordVisibility = () => {
      this.setState({ hidePassword: !this.state.hidePassword });
  }

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{ }}>
      <ActivityIndicator visible={this.state.IsLoaderVisible} color="black" />
      {
        this.state.showFullAddressPage ?
            <View style={{ flex: 1 }}>
                <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                  <TouchableOpacity style={{ flex: 1, marginLeft: 5 }} onPress={() => this.setState({ showFullAddressPage : false}) }>
                      <Image style={{ width: 20, height: 20 }} source={require('../../../images/back.png')}/>
                  </TouchableOpacity>
                  <View style={{ flex: 2.5, alignItems: 'center'}}>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('addressSelectpage.AddressPageHeader')}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                  <Text style={{ fontSize: 17, padding: 10 }}>
                      {I18n.t('addressSelectpage.AddressPageTitle')}
                  </Text>
                  <GooglePlacesAutocomplete
                      placeholder={I18n.t('addressSelectpage.AddressPagePlaceholder')}
                      minLength={2}
                      autoFocus={false}
                      returnKeyType={'search'}
                      listViewDisplayed='auto'
                      fetchDetails={true}
                      renderDescription={(row) => {
                              //for calculate city Name.
                              var fullAddress = row.description;

                              return(
                                  fullAddress
                              )
                          }
                      }
                      onPress={(data, details = null) => { 

                          var fullAddress = data.description;
                          var addressCityName = data.terms[0].value;
                          var addressCountryName = data.terms[data.terms.length - 1];
                          var addressStateName = '';
                          if(data.terms.length > 2){
                              addressStateName = data.terms[1].value;
                          }

                          this.setState({
                            showFullAddressPage : false,
                            warningAddress : false,
                            fullAddress : fullAddress,
                            cityName : addressCityName,
                            countryName : addressCountryName,
                            stateName : addressStateName
                          })
                      }}
                      
                      getDefaultValue={() => ''}
                      
                      query={{
                          key: 'AIzaSyAjKCVJA0JTMjT3ccJXNF3PTG4BnXGdYUs',
                          language: 'en',
                          types: '(cities)'
                      }}
                      
                      styles={{
                          textInputContainer: {
                              width: '95%',
                              margin: 10,
                              marginTop: 0
                          },
                          description: {
                              fontWeight: 'bold'
                          },
                          predefinedPlacesDescription: {
                              color: '#1faadb'
                          }
                      }}
                      currentLocationLabel="Current location"
                      nearbyPlacesAPI='GooglePlacesSearch'
                      GoogleReverseGeocodingQuery={{
                      }}
                      GooglePlacesSearchQuery={{
                          rankby: 'distance',
                          types: 'food'
                      }}
                      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                      debounce={200}
                  />
            </View>
            
          : 
          <View style={{ marginBottom : 10 }}>
            <HeaderWithBackButton label="EDIT PROFILE" other={this.props.navigation} />
            {
              !this.state.networkStatus ? 
                  <View style={{ backgroundColor: 'red' }}>
                    <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>Network not connected, please try again</Text>
                </View> : null
            }
            {
              this.state.warningMessage ? 
                <View style={{ backgroundColor: 'red' }}>
                  <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>something went wrong, please try again.</Text>
              </View> : null
            }
            {
              this.state.wrongInformation ? 
                <View style={{ backgroundColor: 'red' }}>
                  <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>{this.state.wrongInformation}</Text>
              </View> : null
            }


            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps='handled'
            >  

            <View style={{  flex: 1, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
              {
                this.state.newImage ? 
                    <Image
                      style={styles.userImage}
                      source={this.state.newProfileImage}
                    /> :
                    this.state.profileImage === null ?
                      <Image
                        style={styles.userImage}
                        source={require('../../../images/notificationTest1.png')}
                    /> :
                    <Image
                        style={styles.userImage}
                        source={{ uri : this.state.profileImage}}
                    />
              }
              <TouchableOpacity style={{ backgroundColor: buttonBackgroundColor, borderRadius : 5 }} onPress={this.selectPhotoTapped.bind(this)}>
                <Text style={{ color : 'white', padding: 7 }}>Change Image</Text>
              </TouchableOpacity>
            </View>
              
              
              <View style={{ padding: 15 }}>

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>First Name</Text>
                <TextInput
                    style={{ padding: 5, height: 40, borderColor: this.state.borderName, borderWidth: 2, borderRadius: 7 }}
                    value={this.state.firstname}
                    placeholder={"enter your first name"}
                    onChangeText={ (firstname) => this.setState({ firstname }) }
                />

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>Last Name</Text>
                <TextInput
                    style={{ padding: 5, height: 40, borderColor: this.state.borderName, borderWidth: 2, borderRadius: 7 }}
                    value={this.state.lastname}
                    placeholder={"enter your last name"}
                    onChangeText={ (lastname) => this.setState({ lastname }) }
                />

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>Phone Number</Text>
                <TextInput
                    style={{ padding: 5, height: 40, borderColor: this.state.borderName, borderWidth: 2, borderRadius: 7 }}
                    value={this.state.phone}
                    placeholder={"enter your phone number"}
                    onChangeText={ (phone) => this.setState({ phone }) }
                    keyboardType='numeric'
                    maxLength={10}
                />

                <Text style={{ fontSize: 18, color: this.state.warningEmail ? 'red' : 'grey', marginTop: 10, marginBottom: 5 }}>Email</Text>
                <TextInput
                    style={{ padding: 5, height: 40, borderColor: this.state.warningEmail ? 'red' : 'grey', borderWidth: 2, borderRadius: 7 }}
                    value={this.state.profileEmail}
                    placeholder={"enter your email id"}
                    onChangeText={ (profileEmail) => this.setState({ profileEmail }) }
                    editable={false}
                />
                <Text style={{ color : 'red' }}>* Email Id cannot be change.</Text>

                <Text style={{ fontSize: 18, color: this.state.warningPassword ? 'red' : 'grey', marginTop: 10, marginBottom: 5 }}>Password</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                      style={{ padding: 5, height: 40, flex: 4, borderColor: this.state.warningPassword ? 'red' : 'grey', borderWidth: 2, borderRadius: 7 }}
                      value={this.state.password}
                      secureTextEntry = { this.state.hidePassword }
                      placeholder={"enter your pasword for security purposes"}
                      onChangeText={ (password) => this.setState({ password }) }
                  />
                  <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>  
                      <Image source = { ( this.state.hidePassword ) ? require('../../../images/hide.png') : require('../../../images/show.png') } style = { styles.btnImage } />
                  </TouchableOpacity>
                </View>
                {this.state.warningPassword ? <Text style={{ color : 'red' }}>The password must contain atleast 8 character with mix of letters, numbers, and/or special characters</Text> : null }

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5 }}>Full Address</Text>
                <TextInput
                    style={{ padding: 5, height: 40, borderColor: this.state.borderName, borderWidth: 2, borderRadius: 7 }}
                    value={this.state.fullAddress}
                    onFocus={() => this.setState({ showFullAddressPage : true }) }
                    onChangeText={ (fullAddress) => this.setState({ fullAddress }) }
                />

              </View>
            
  
              <View style={styles.container}>
                  <RaisedTextButton onPress={() => this.onEditProfileButton()} title="Edit Submit Profile" color={buttonBackgroundColor} titleColor='white' />
              </View>
          </ScrollView>
        </View>
      }
    </View>
    );
  }
}

export default (EditProfile);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: backgroundColor,

      },
  container: {
    marginBottom : 150
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    marginTop: 30,
    height: 36,
    backgroundColor: buttonBackgroundColor,
    borderColor: buttonBackgroundColor,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
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
    paddingTop: 10,
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
  visibilityBtn: {
    flex: 1,
    position: 'absolute',
    right: 0,
    height: 40,
    width: 35,
    padding: 5,
    marginLeft: 10
  },
  btnImage: {
      resizeMode: 'contain',
      height: '110%',
      width: '110%',
      marginRight: 20,
  },
});  