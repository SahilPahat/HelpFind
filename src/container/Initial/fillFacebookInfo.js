import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  
  Alert,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonBackgroundColor } from '../../../env';
import HelpFindAPI from '../../../config';
import PopupDialog from 'react-native-popup-dialog';
var { height, width } = Dimensions.get('window');
import RNRestart from 'react-native-restart'; // Import package from node modules
import { LoginManager } from 'react-native-fbsdk';
import LoadingComponent from '../../component/loadingComponent';


class FillFacebookInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            facebookPassword : '',
            facebookEmail : props.navigation.state.params.data.email,
            facebookImage : props.navigation.state.params.data.picture.data.url,
            facebookName : props.navigation.state.params.data.name,
            facebookWarningNewPassword : '',
            hidePassword : true,
            facebookIsLoaderVisible: false,
            basicData : {
                isRTL : props.navigation.state.params.basicData.isRTL,
                selectedLanguage : props.navigation.state.params.basicData.selectedLanguage,
            }
        }
    }
    
    

    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    fillFacebookInfoButton = () => {
        LoginManager.logOut()

        var facebookPassword = this.state.facebookPassword;
        let passwordValidString = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

        if(passwordValidString.test(facebookPassword) === false){
            this.setState({ facebookWarningNewPassword : true })
        } else {
            this.setState({ facebookWarningNewPassword : false })
                var { facebookEmail, facebookImage, facebookName, facebookPassword } = this.state;
                if(this.props.isConnected) {
                  this.setState({ facebookIsLoaderVisible: true })
                  var URL= HelpFindAPI.BASE_URL+'get_register';
                  fetch(URL,  {
                      method: 'POST',
                      headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        "user_name" : facebookEmail,
                        "user_pass" : facebookPassword,
                        "first_name" : facebookName,
                        "last_name" : '',
                        "phone_no" : '',
                        "city" : '',
                        "state" : '',
                        "country" : '',
                        "interested_city" : '',
                        "profile_image" : facebookImage,
                        "regis_type" : 'facebook'
                      })
                  }).then((response) => response.json()).then((responseJson) => {
                        if(responseJson.sucess){
                            AsyncStorage.setItem('userId', JSON.stringify(responseJson.UserID)); 
                            AsyncStorage.setItem('token', JSON.stringify(responseJson.token));
                            AsyncStorage.setItem('userName', JSON.stringify(responseJson.data[0].display_name));
                            this.setState({ facebookIsLoaderVisible: false, networkStatus: true })
                            this.popupDialogSetPassword.dismiss();
                            this.props.navigation.navigate('HomeTab', { basicData : this.state.basicData });
                        } else{
                          this.setState({ facebookIsLoaderVisible: false, networkStatus: true, mainWarning : responseJson.message })
                          Alert.alert(responseJson.message)
                          LoginManager.logOut()
                          this.popupDialogSetPassword.dismiss();
                          RNRestart.Restart();
                        }
                      }).catch((error) => {
                        this.setState({ facebookIsLoaderVisible: false, networkStatus: true, mainWarning: error })
                        Alert.alert('Something went wrong. Please try again')
                        LoginManager.logOut()
                        this.popupDialogSetPassword.dismiss();
                        RNRestart.Restart();
                      });
                  } else {
                    this.setState({ facebookIsLoaderVisible: false })
                    this.setState({ networkStatus : false })
                    Alert.alert('Something went wrong. Please try again')
                    LoginManager.logOut()
                    this.popupDialogSetPassword.dismiss();
                    RNRestart.Restart();
                  }
        }
    }

    render() {
        
        if(this.state.facebookIsLoaderVisible){
            return(
              <ImageBackground source={require('../../images/backgroundImage.png')} style={{ flex : 1 }}>
                <LoadingComponent />
              </ImageBackground>
            )
          }

        return (
            <View style={{ flex : 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                
                <Image source={require('../../images/logo.png')} style={styles.logoImage} />

                <TouchableOpacity style={{ backgroundColor : buttonBackgroundColor }} onPress={() => this.popupDialogSetPassword.show() }>
                    <Text style={{ color : 'white', fontSize : 17, padding : 10  }}>Set Password</Text>
                </TouchableOpacity>

                <PopupDialog width={width-60} height={height/2.40} dialogStyle={{ borderRadius: 7, borderWidth: 1, borderColor: '#d3d3d3' }} ref={(popupDialogSetPassword) => { this.popupDialogSetPassword = popupDialogSetPassword; }}>
                <View style={{ borderRadius: 7, padding: 10, backgroundColor: buttonBackgroundColor }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>Set Password of HelpFind Application</Text>
                </View>
                
                    <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5, color: this.state.facebookWarningNewPassword ? 'red' : '#D3D3D3' }}>Password</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{ padding: 5, height: 40, flex: 4, borderColor: this.state.facebookWarningNewPassword ? 'red' : '#D3D3D3', borderWidth: 2, borderRadius: 7 }}
                            value={this.state.facebookPassword}
                            returnKeyType = {"next"}
                            secureTextEntry = { this.state.hidePassword }
                            placeholder={"enter password"}
                            onChangeText={ (facebookPassword) => this.setState({ facebookPassword }) }
                        />
                        <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>  
                            <Image source = { ( this.state.hidePassword ) ? require('../../images/hide.png') : require('../../images/show.png') } style = { styles.btnImage } />
                        </TouchableOpacity>
                    </View>
                    {this.state.facebookWarningNewPassword ? <Text style={{ color : 'red' }}>The password must contain atleast 8 character with mix of letters, numbers, and/or special characters</Text> : null }


                <View style={{ marginTop: 12, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => this.fillFacebookInfoButton() }>
                    <Text style={styles.buttonText}>
                        OK
                    </Text>
                    </TouchableOpacity>
                </View>
            </PopupDialog>
          </View>
        );
    }
}

export default (FillFacebookInfo);

const styles = StyleSheet.create({

    logoImage: {
        width: 400,
        height: 100,
        marginBottom: 20
    },
    visibilityBtn: {
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
    button : {
        width: 110,
        height: 50,
        backgroundColor: buttonBackgroundColor,   
        paddingVertical: 13,
        borderRadius : 5
      },
      buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
      },
});