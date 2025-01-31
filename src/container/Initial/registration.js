import React, { Component } from 'react';
import { ScrollView, View, NetInfo, Image, Text, Alert, Platform, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Spinner from 'react-native-loading-spinner-overlay';
import HelpFindAPI from '../../../config';

import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';
import HeaderWithBackButton from '../../component/headerComponentWithBackButton';

import I18n from '../../i18n';
import LoadingComponent  from '../../component/loadingComponent';


let styles = {
    scroll: {
        backgroundColor: backgroundColor,
    },
    container: {
        margin: 8,
        marginTop: 24,
    },

    contentContainer: {
    },
    mainContainer: {
      flex: 1,
      marginBottom: 10
    },
    headerBackgroundImage: {
        paddingBottom: 20,
        paddingTop: 10,
    },
    headerColumn: {
      backgroundColor: 'transparent',
      paddingTop: 5,
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
      borderRadius: 75,
      borderWidth: 3,
      height: 150,
      marginBottom: 15,
      width: 150,
    },
};

//create a function to check a object is empty or not
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

class RegistrationScreen extends Component {
    constructor(props) {
      super(props);

      AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
      );


      this.onFocus = this.onFocus.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChangeText = this.onChangeText.bind(this);
      
      this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
      this.onSubmitLastName = this.onSubmitLastName.bind(this);
      this.onSubmitPhone = this.onSubmitPhone.bind(this);
      this.onSubmitEmail = this.onSubmitEmail.bind(this);
      this.onSubmitPassword = this.onSubmitPassword.bind(this);
      
      this.onAccessoryPress = this.onAccessoryPress.bind(this);

      this.firstnameRef = this.updateRef.bind(this, 'firstname');
      this.lastnameRef = this.updateRef.bind(this, 'lastname');
      this.phoneRef = this.updateRef.bind(this, 'phone');
      this.emailRef = this.updateRef.bind(this, 'email');
      this.passwordRef = this.updateRef.bind(this, 'password');
      this.fullAddressRef = this.updateRef.bind(this, 'fullAddress');

      this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

        this.state = {
          networkStatus: true,
          isLoaderVisible: false,
          mainWarning: '',
          showFullAddressPage : false,
          showInterestedCityPage : false,
          firstname: '',
          lastname: '',
          cityName : '',
          stateName : '',
          countryName : '',
          fullAddress : '',
          interestedCityName : '',
          warningImage: false,
          base64ImagePath: '',

          
          phone: '',
          secureTextEntry: true,

          warningAddress : false,
          warningInterestedCity : false,

          profileImage: '',
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
              profileImage: source,
              base64ImagePath : response.data,
              warningImage: false
          });
          }
      });
      }

    static navigationOptions = {
      title: 'Registration',
    };

    onFocus() {
      let { errors = {} } = this.state;

      for (let name in errors) {
        let ref = this[name];

        if (ref && ref.isFocused()) {
          delete errors[name];
        }
      }

      this.setState({ errors });
    }

    onChangeText(text) {
      ['firstname', 'lastname', 'phone', 'email', 'password', ]
        .map((name) => ({ name, ref: this[name] }))
        .forEach(({ name, ref }) => {
          if (ref.isFocused()) {
            this.setState({ [name]: text });
          }
        });
    }

    onAccessoryPress() {
      this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }

    onSubmitFirstName() {
      this.lastname.focus();
    }

    onSubmitLastName() {
      this.phone.focus();
    }

    onSubmitPhone() {
      this.email.focus();
    }

    onSubmitEmail() {
      this.password.focus();
    }

    onSubmitPassword() {
      this.password.blur();
    }

    onSubmit() {
      let errors = {};

      ['firstname', 'lastname', 'email', 'password', ]
        .forEach((name) => {
          let value = this[name].value();
          let emailValidString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
          if (!value) {
            errors[name] = I18n.t('registration.emptyError');
          } else if('email' === name && emailValidString.test(this.state.email) === false) {
            errors[name] = '* Please enter valid email address. For example Help@find.com'
          } else {
            let passwordValidString = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
            if ('password' === name && passwordValidString.test(this.state.password) === false ) {
              errors[name] = 'The password must contain atleast 8 character with mix of letters, numbers, and/or special characters';
            }
          }
        });
      this.setState({ errors });
      var errorCheck = isEmpty(this.state.errors);
      if(this.state.fullAddress === ''){
        this.setState({ warningAddress : true })
      }else{
        this.setState({ warningAddress : false })
      }

      if(this.state.interestedCityName === ''){
        this.setState({ warningInterestedCity : true })
      }else{
        this.setState({ warningInterestedCity : false })
      }

      if(this.state.profileImage === ''){
        this.setState({ warningImage : true })
      }else{
        this.setState({ warningImage : false })
      }
      if(errorCheck && !this.state.warningAddress && !this.state.warningInterestedCity ){
            this.setState({ isLoaderVisible: true })

            var { firstname, lastname, email, password, profileImage, stateName, interestedCityName, cityName, countryName, phone, base64ImagePath } = this.state;
            if(this.props.isConnected) {

              var URL= HelpFindAPI.BASE_URL+'get_register';

              fetch(URL,  {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "user_name" : email,
                    "user_pass" : password,
                    "first_name" : firstname,
                    "last_name" : lastname,
                    "phone_no" : phone,
                    "city" : cityName,
                    "state" : stateName,
                    "country" : countryName,
                    "interested_city" : interestedCityName,
                    "profile_image" : base64ImagePath
                  })
              }).then((response) => response.json()).then((responseJson) => {

                    if(responseJson.sucess){
                        this.setState({ IsLoaderVisible: false, networkStatus: true })
                        this.ShowAlertDialog()
                        this.props.navigation.navigate('LoginScreen');
                    } else{
                      this.setState({ IsLoaderVisible: false, networkStatus: true, mainWarning : responseJson.message })
                    }
                  }).catch((error) => {

                    this.setState({ IsLoaderVisible: false, networkStatus: true, mainWarning: error })
                  });
              } else {
                this.setState({ isLoaderVisible: false })
                this.setState({ networkStatus : false })
              }
        }
    }

    ShowAlertDialog = () => {
      Alert.alert(
        'Success',
        'Your account has been successfully created. Please login with your email ID.',
        [
          {
            
          },
          {
            text: 'OK', onPress: () => this.props.navigation.navigate('LoginScreen')
          },
        ],
        { cancelable: false }
      )
    }

    updateRef(name, ref) {
      this[name] = ref;
    }

    renderPasswordAccessory() {
      let { secureTextEntry } = this.state;

      let name = secureTextEntry?
        'visibility':
        'visibility-off';
      return (
        <MaterialIcon
          size={24}
          name={name}
          color={TextField.defaultProps.baseColor}
          onPress={this.onAccessoryPress}
          suppressHighlighting
        />
      );
    }

    render() {
      let { errors = {}, secureTextEntry, ...data } = this.state;
      let { firstname = 'name', lastname = 'house' } = data;

      let defaultEmail = `${firstname}@${lastname}.com`
        .replace(/\s+/g, '_')
        .toLowerCase();

      const { navigate } = this.props.navigation;

  
      return (
        <View style={{ flex : 1 }}>
          <Spinner visible={this.state.isLoaderVisible} color="black" />
          {
            this.state.showFullAddressPage || this.state.showInterestedCityPage ?
              this.state.showFullAddressPage ?
                <View style={{ flex: 1 }}>
                    <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                      <TouchableOpacity style={{ flex: 1, marginLeft: 5 }} onPress={() => this.setState({ showFullAddressPage : false}) }>
                          <Image style={{ width: 20, height: 20 }} source={require('../../images/back.png')}/>
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
                  <View style={{ flex: 1 }}>
                      <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                          <TouchableOpacity style={{ flex: 1, marginLeft: 5 }} onPress={() => this.setState({ showInterestedCityPage : false}) }>
                              <Image style={{ width: 20, height: 20 }} source={require('../../images/back.png')}/>
                          </TouchableOpacity>
                          <View style={{ flex: 2.5, alignItems: 'center'}}>
                              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('citySelectpage.CityPageHeader')}</Text>
                          </View>
                          <View style={{ flex: 1 }} />
                    </View>
                      <Text style={{ fontSize: 17, padding: 10 }}>
                          {I18n.t('citySelectpage.CityPageTitle')}
                      </Text>
                      <GooglePlacesAutocomplete
                          placeholder={I18n.t('citySelectpage.CityPagePlaceholder')}
                          minLength={2}
                          autoFocus={false}
                          returnKeyType={'search'}
                          listViewDisplayed='auto'
                          fetchDetails={true}
                          renderDescription={(row) => {
                                  //for calculate city Name.
                                  var fullCityName = row.description;

                                  return(
                                      fullCityName
                                  )
                              }
                          }
                          onPress={(data, details = null) => { 

                              const cityName = data.terms[0].value;
                              this.setState({
                                showInterestedCityPage : false,
                                warningInterestedCity : false,
                                interestedCityName : cityName
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
              <View style={styles.mainContainer}>
                <HeaderWithBackButton label={I18n.t('registration.header')} other={this.props.navigation} />
                {
                  !this.state.networkStatus ? 
                      <View style={{ backgroundColor: 'red' }}>
                        <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>Network not connected, please try again</Text>
                    </View> : null
                }
                {
                  this.state.mainWarning !== '' ? 
                    <View style={{ backgroundColor: 'red' }}>
                      <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>{this.state.mainWarning}</Text>
                  </View> : null
                }
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps='handled'
                >  
                  <ImageBackground
                    style={styles.headerBackgroundImage}
                    blurRadius={10}
                    source={require('../../images/profileBackground.png')}
                  >
                    <View style={{ alignItems: 'flex-end', paddingRight: 10, }}>
                        <TouchableOpacity  onPress={this.selectPhotoTapped.bind(this)} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 2, padding: 5, borderColor: 'green' }}>
                          <Image style={{ width:20, height:20 }} source={require('../../images/email.png')}/>
                          <Text style={{ marginLeft: 5, color: 'white' }}>{I18n.t('registration.ChooseImageLabel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerColumn}>
                        { 
                          this.state.profileImage === '' ? 
                          <Image
                              style={styles.userImage}
                              source={require('../../images/dummyImage.png')}
                          /> :
                          <Image
                              style={styles.userImage}
                              source={this.state.profileImage}
                          />
                        }
                        
                    </View>
                  </ImageBackground>
      
                <View style={styles.container}>
                          
                  <TextField
                    ref={this.firstnameRef}
                    value={data.firstname}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitFirstName}
                    returnKeyType='next'
                    label={I18n.t('registration.firstNameLabel')}
                    error={errors.firstname}
                  />
      
                  <TextField
                    ref={this.lastnameRef}
                    value={data.lastname}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitLastName}
                    returnKeyType='next'
                    label={I18n.t('registration.lastNameLabel')}
                    error={errors.lastname}
                  />
      
                  <TextField
                    ref={this.phoneRef}
                    value={data.phone}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitPhone}
                    returnKeyType='next'
                    multiline={false}
                    blurOnSubmit={true}
                    maxLength={10}
                    keyboardType='numeric'
                    label={I18n.t('registration.phoneLabel')}
                  />
      
                  <TextField
                    ref={this.emailRef}
                    value={data.email}
                    defaultValue={defaultEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitEmail}
                    returnKeyType='next'
                    label={I18n.t('registration.emailAddressLabel')}
                    error={errors.email}
                  />
      
                  <TextField
                    ref={this.passwordRef}
                    value={data.password}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize='none'
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    clearTextOnFocus={true}
                    onFocus={this.onFocus}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitPassword}
                    returnKeyType='done'
                    label={I18n.t('registration.passwordLabel')}
                    error={errors.password}
                    title={I18n.t('registration.passwordTitle')}
                    maxLength={30}
                    characterRestriction={20}
                    renderAccessory={this.renderPasswordAccessory}
                  />
      
                  <TextField
                    value={this.state.fullAddress}
                    onChangeText={ (fullAddress) => this.setState({ fullAddress }) }
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically={true}
                    onFocus={() => this.setState({ showFullAddressPage : true }) }
                    label={I18n.t('registration.selectAddressLabel')}
                    error={this.state.warningAddress}
                  />
      
                  <TextField
                    value={this.state.interestedCityName}
                    onChangeText={ (interestedCityName) => this.setState({ interestedCityName }) }
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically={true}
                    onFocus={() => this.setState({ showInterestedCityPage : true }) }
                    label={I18n.t('registration.interestedCityLabel')}
                    error={this.state.warningInterestedCity}
                  />
              </View>
      
                  <View style={styles.container}>
                      <RaisedTextButton onPress={this.onSubmit} title={I18n.t('registration.submitButtonLabel')} color={buttonBackgroundColor} titleColor='white' />
                  </View>
              </ScrollView>
            </View>
          }
        </View>
      );
    }
}

export default (RegistrationScreen);