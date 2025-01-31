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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-picker';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import I18n from '../../../i18n';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HelpFindAPI from '../../../../config';
import Spinner from 'react-native-loading-spinner-overlay';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';


class SharedPost extends Component {

  constructor(props) {
    super(props);
    

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
      );

    this.state = {
        postImage: props?.route?.params?.item.post_image,
        postId: props?.route?.params?.item.post_array.ID,
        title: props?.route?.params?.item.post_array.post_title,
        details: props?.route?.params?.item.post_array.post_content,
        warningTitle : 'black',
        warningDetails: 'black',
        warningImage: 'black',
        warningAddress: 'black',
        showFullAddressPage: false,
        fullAddress: '',
        cityName: props?.route?.params?.item.post_meta !== undefined ? 
                    props?.route?.params?.item.post_meta.city !== undefined ? 
                        props?.route?.params?.item.post_meta.city.length > 0 ?
                            props?.route?.params?.item.post_meta.city[0] : '' : '' : '',
        stateName: props?.route?.params?.item.post_meta !== undefined ? 
                        props?.route?.params?.item.post_meta.state !== undefined ? 
                            props?.route?.params?.item.post_meta.state.length > 0 ?
                                props?.route?.params?.item.post_meta.state[0] : '' : '' : '',
        countryName: props?.route?.params?.item.post_meta !== undefined ? 
                        props?.route?.params?.item.post_meta.country !== undefined ? 
                            props?.route?.params?.item.post_meta.country.length > 0 ?
                                props?.route?.params?.item.post_meta.country[0] : '' : '' : '',
        newPostImage: '',
        warningMessage: false,
        networkStatus : true,
        newImage: false,
        IsLoaderVisible: false
    };
    this.onStorageDataLoad();
  }

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
        await AsyncStorage.getItem("userName").then((value) => {

            this.setState({
              userName : JSON.parse(value)
            })
          });
    }

  sharedPostSubmitButton = () => {
      var { postImage, title, details, fullAddress, cityName, stateName, countryName, base64ImagePath } = this.state;
     

            this.setState({ IsLoaderVisible : true })
            if(this.props.isConnected) {

              var URL= HelpFindAPI.BASE_URL+'share_post';

              fetch(URL,  {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "token"	:	this.state.token,
                    "user_id"	:	this.state.userId,
                    "postID"				:	this.state.postId,
                    "shared_by_userid"		:	this.state.userId,
                    "shared_by_username"	:	this.state.userName,
                    "username"				:	this.state.userName,
                  })
              }).then((response) => response.json()).then((responseJson) => {

                    if(responseJson.sucess){
                        this.setState({ warningMessage : false, networkStatus : true, IsLoaderVisible: false})
                        this.props.navigation.navigate('MyPost');
                    }else{
                      this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true })
                    }
                  }).catch((error) => {
                    this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true })
                  });
              } else {

                this.setState({ networkStatus : false })
                this.setState({ IsLoaderVisible: false })
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
          newPostImage: source,
          base64ImagePath : response.data,
        });
        }
      });
    }
  

  render() {


    var fullAddress = this.state.cityName + ' ' + this.state.stateName + ' ' + this.state.countryName;

    return (
        <View style={styles.mainContainer}>
            <HeaderWithBackButton label={I18n.t('Home.sharedPost.header')} other={this.props.navigation} />
                <ActivityIndicator visible={this.state.IsLoaderVisible} color="black" />
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
                            Select Post Address City
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
                        <Text style={{ fontSize: 18, color: this.state.warningTitle, marginTop: 10 }}>{I18n.t('Home.sharedPost.postTitle')}</Text>
                        <TextInput
                            style={{ height: 40, borderColor: this.state.warningTitle === 'black' ? '#D3D3D3' : 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.title}
                            placeholder={I18n.t('Home.sharedPost.postTitlePlaceHolder')}
                            editable={false}
                            onChangeText={(title) => this.setState({title})}
                        />

                        <Text style={{ fontSize: 18, color: this.state.warningDetails, marginTop: 10 }}>{I18n.t('Home.sharedPost.postDetails')}</Text>
                        <TextInput
                            style={{ height: 200, borderColor: this.state.warningDetails === 'black' ? '#D3D3D3' : 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.details}
                            placeholder={I18n.t('Home.sharedPost.postDetailsPlaceHolder')}
                            multiline={true}
                            editable={false}
                            onChangeText={(details) => this.setState({details})}
                        />
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontSize: 18, color: this.state.warningImage, marginTop: 15 }}>{I18n.t('Home.sharedPost.postImage')}</Text>
                            </View>
                        </View>
                        
                            { 
                                this.state.newImage ?
                                    <Image style={{ width: 200, height: 200 }} source={this.state.newPostImage} /> :
                                this.state.postImage === false ? 
                                <Image style={{ width: 200, height: 200 }} source={require('../../../images/emptyImage.jpg')} />
                                :
                                <Image style={{ width: 200, height: 200 }} source={{ uri : this.state.postImage }} />
                            }
                        
                        <Text style={{ fontSize: 18, color: this.state.warningAddress, marginTop: 15 }}>Post Address</Text>
                        <TextInput
                            style={{ height: 50, borderColor: this.state.warningAddress === 'black' ? '#D3D3D3': 'red', borderWidth: 2, borderRadius: 7 }}
                            value={fullAddress}
                            placeholder={I18n.t('Home.sharedPost.postAddress')}
                            multiline={true}
                            editable={false}
                            onFocus={() => this.setState({ showFullAddressPage : true }) }
                            onChangeText={ (fullAddress) => this.setState({ fullAddress }) }
                        />



                        <TouchableOpacity style={styles.button} onPress={() => this.sharedPostSubmitButton() } underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>{I18n.t('Home.sharedPost.submitButtonLabelEditTime')} </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                }
        </View>
    );
  }
}

export default (SharedPost);

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