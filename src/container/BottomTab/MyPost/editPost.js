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
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import I18n from '../../../i18n';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HelpFindAPI from '../../../../config';
import Spinner from 'react-native-loading-spinner-overlay';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';


class EditNewPost extends Component {

  constructor(props) {
    super(props);
    
    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
      );

    this.state = {
        postImage: props.navigation.state.params.item.item.post_image,
        postId: props.navigation.state.params.item.item.post_id,
        title: props.navigation.state.params.item.item.post_array.post_title,
        details: props.navigation.state.params.item.item.post_array.post_content,
        warningTitle : 'black',
        warningDetails: 'black',
        warningImage: 'black',
        warningAddress: 'black',
        showFullAddressPage: false,
        fullAddress: '',
        cityName: '',
        stateName: '',
        countryName: '',
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
      }

  editPostSubmitButton = () => {
      var { postImage, title, details, fullAddress, cityName, stateName, countryName, base64ImagePath } = this.state;
      if(title === ''){
        this.setState({ warningTitle: 'red', warningImage: 'black', warningDetails: 'black', warningAddress: 'black' })
      }else if(details === '' ) {
        this.setState({ warningDetails: 'red', warningTitle: 'black', warningImage: 'black', warningAddress: 'black' })
      }else if(postImage === '') {
        this.setState({ warningImage: 'red', warningTitle: 'black', warningDetails: 'black', warningAddress: 'black' })
      }else if(fullAddress === '')  {
        this.setState({ warningImage: 'black', warningTitle: 'black', warningDetails: 'black', warningAddress: 'red' })
    } else {

            this.setState({ IsLoaderVisible : true })
            if(this.props.isConnected) {

              var URL= HelpFindAPI.BASE_URL+'edit_post';

              fetch(URL,  {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "user_id"   : this.state.userId,
                    "token"     : this.state.token,
                    "postID"    : this.state.postId,
                    "title"		:	title,
                    "content"	:	details,
                    "city"		:	cityName,
                    "state"		:	stateName,
                    "country"	:	countryName.value,
                    "image"		:	base64ImagePath
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
    return (
        <View style={styles.mainContainer}>
            <HeaderWithBackButton label={I18n.t('Home.addPost.headerEditTime')} other={this.props.navigation} />
                <Spinner visible={this.state.IsLoaderVisible} color="black" />
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
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text style={{ fontSize: 18, color: this.state.warningImage, marginTop: 15 }}>{I18n.t('Home.addPost.postImage')}</Text>
                            </View>
                        </View>
                        
                            { 
                                this.state.newImage ?
                                    <Image style={{ width: 200, height: 200 }} source={this.state.newPostImage} /> :
                                this.state.postImage === false ?
                                <View>
                                    <Image style={{ width: 200, height: 200 }} source={require('../../../images/emptyImage.jpg')} />
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => this.selectPhotoTapped()}>
                                        <Text style={{ fontSize: 18 }}>Change Image</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View>
                                    <Image style={{ width: 200, height: 200 }} source={{ uri : this.state.postImage }} />
                                    <TouchableOpacity style={{ padding: 5 }} onPress={() => this.selectPhotoTapped()}>
                                        <Text style={{ fontSize: 18 }}>Change Image</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        
                        <Text style={{ fontSize: 18, color: this.state.warningAddress, marginTop: 15 }}>Post Address</Text>
                        <TextInput
                            style={{ height: 50, borderColor: this.state.warningAddress === 'black' ? '#D3D3D3': 'red', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.fullAddress}
                            placeholder={I18n.t('Home.addPost.postDetailsPlaceHolder')}
                            multiline={true}
                            onFocus={() => this.setState({ showFullAddressPage : true }) }
                            onChangeText={ (fullAddress) => this.setState({ fullAddress }) }
                        />



                        <TouchableOpacity style={styles.button} onPress={() => this.editPostSubmitButton() } underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>{I18n.t('Home.addPost.submitButtonLabelEditTime')} </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                }
        </View>
    );
  }
}
export default (EditNewPost);

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