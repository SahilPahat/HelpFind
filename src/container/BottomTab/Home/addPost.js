import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  
  ImageStore,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-picker';
import HeaderWithBackButton from '../../../component/headerComponent';
import I18n from '../../../i18n';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HelpFindAPI from '../../../../config';
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from 'react-native-multiple-select';


import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';

class AddNewPost extends Component {

  constructor(props) {
    super(props);
    

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
      );

    this.state = {
        userImage: '',
        title: '',
        details: '',
        warningTitle : 'black',
        warningDetails: 'black',
        warningAddress: 'black',
        showFullAddressPage: false,
        isLoaderVisible: false,
        fullAddress: '',
        cityName: '',
        stateName: '',
        countryName: '',
        warningMessage: false,
        networkStatus : true,

        //for app user tag section
        selectedItems : [],
        tagUserData : [ { id: '92iijs7yta', name: 'Ondo' },
                    { id: 'a0s0a8ssbsd', name: 'Ogun' },
                    { id: '16hbajsabsd', name: 'Calabar' },
                    { id: 'nahs75a5sg', name: 'Lagos' },
                    { id: '667atsas', name: 'Maiduguri' },
                    { id: 'hsyasajs', name: 'Anambra' },
                    { id: 'djsjudksjd', name: 'Benue' },
                    { id: 'sdhyaysdj', name: 'Kaduna' },
                    { id: 'suudydjsjd', name: 'Abuja',}
                ]
    };
    this.onStorageDataLoad();
  }

    //for app user tag section
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

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

  postSubmitButton = () => {
      var { userImage, title, details, fullAddress, cityName, stateName, countryName, base64ImagePath } = this.state;
      if(title === ''){
        this.setState({ warningTitle: 'red', warningDetails: 'black', warningAddress: 'black' })
      }else if(details === '' ) {
        this.setState({ warningDetails: 'red', warningTitle: 'black', warningAddress: 'black' })
      }else if(fullAddress === '')  {
        this.setState({ warningTitle: 'black', warningDetails: 'black', warningAddress: 'red' })
    } else {

      
            if(this.props.isConnected) {

              this.setState({ isLoaderVisible: true })
              var URL= HelpFindAPI.BASE_URL+'create_new_post';

              fetch(URL,  {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "user_id"   : this.state.userId,
                    "token"     : this.state.token,
                    "title"		:	title,
                    "content"	:	details,
                    "city"		:	cityName,
                    "state"		:	stateName,
                    "country"	:	countryName.value,
                    "image"		:	base64ImagePath
                  })
              }).then((response) => response.json()).then((responseJson) => {

                    if(responseJson.sucess){
                        this.setState({ warningMessage : false, networkStatus : true, })
                        this.props.navigation.navigate('HomeTab');
                        this.setState({ isLoaderVisible: false })
                    }else{

                      this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true,  })
                    }
                  }).catch((error) => {
                    this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true })

                  });
              } else {

                this.setState({ networkStatus : false, warningMessage: false })
                this.setState({ IsLoaderVisible: false })
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
          userImage: source,
          base64ImagePath : response.data,
        });
        }
      });
    }
  

  render() {


    return (
        <View style={styles.mainContainer}>
            <Spinner visible={this.state.isLoaderVisible} color="black" />

            <HeaderWithBackButton label={this.props.navigation.state.params === undefined ? I18n.t('Home.addPost.headerAddTime') : I18n.t('Home.addPost.headerEditTime') } other={this.props.navigation} />
                {
                    this.state.warningMessage ?  
                        <View style={{ backgroundColor: 'red' }}>
                            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Something went wrong. Please try again.</Text>
                        </View>
                    : null
                }
                {
                    !this.state.networkStatus ?
                        <View style={{ backgroundColor: 'red' }}>
                            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Network not connected</Text>
                        </View>
                        : null
                }
                {
                    this.state.showFullAddressPage ? 
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, padding: 10 }}>
                            {I18n.t('Home.addPost.selectAddressTitle')}
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
                                    warningAddress : 'black',
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
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={{ }}
                        keyboardShouldPersistTaps='handled'
                    >
                    <View style={{ margin: 5, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 18, color: this.state.warningTitle, marginTop: 10 }}>{I18n.t('Home.addPost.postTitle')}</Text>
                        <TextInput
                            style={{ height: 40, borderColor: this.state.warningTitle === 'black' ? '#D3D3D3' : 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.title}
                            placeholder={I18n.t('Home.addPost.postTitlePlaceHolder')}
                            onChangeText={(title) => this.setState({title})}
                        />

                        <Text style={{ fontSize: 18, color: this.state.warningDetails, marginTop: 10 }}>{I18n.t('Home.addPost.postDetails')}</Text>
                        <TextInput
                            style={{ height: 200, borderColor: this.state.warningDetails === 'black' ? '#D3D3D3' : 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.details}
                            placeholder={I18n.t('Home.addPost.postDetailsPlaceHolder')}
                            multiline={true}
                            onChangeText={(details) => this.setState({details})}
                        />

                        <Text style={{ fontSize: 18 }}>{I18n.t('Home.addPost.postImage')}</Text>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={this.selectPhotoTapped.bind(this)}>
                            { 
                                this.state.userImage === '' ? 
                                <View style={{ marginTop: 5, borderColor: this.state.userImage === '' ? '#D3D3D3' : 'red', borderWidth: 2, borderRadius: 7 }}>
                                    <Text style={{ padding: 5, paddingTop: 10, paddingBottom: 10, color: '#808080' }}>{I18n.t('Home.addPost.postImagePlaceHolder')}</Text>
                                </View> :
                                <Image style={{ width: 100, height: 100 }} source={this.state.userImage} />
                            }
                        </TouchableOpacity>
                        
                        <Text style={{ fontSize: 18, color: this.state.warningAddress, marginTop: 15 }}>{I18n.t('Home.addPost.postAddress')}</Text>
                        <TextInput
                            style={{ height: 50, borderColor: this.state.warningAddress === 'black' ? '#D3D3D3': 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.fullAddress}
                            placeholder={I18n.t('Home.addPost.postDetailsPlaceHolder')}
                            multiline={true}
                            onFocus={() => this.setState({ showFullAddressPage : true }) }
                            onChangeText={ (fullAddress) => this.setState({ fullAddress }) }
                        />



                        <TouchableOpacity style={styles.button} onPress={() => this.postSubmitButton() } underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>{this.props.navigation.state.params === undefined ? I18n.t('Home.addPost.submitButtonLabelAddTime') : I18n.t('Home.addPost.submitButtonLabelEditTime')} </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                }
        </View>
    );
  }
}
export default (AddNewPost);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: 'white',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
      },
    button: {
        height: 36,
        backgroundColor: buttonBackgroundColor,
        borderColor: buttonBackgroundColor,
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    ImageText: {
        fontSize: 18,
    },
});  