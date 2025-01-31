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
    
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import HelpFindAPI from '../../../../config';
import { RaisedTextButton } from 'react-native-material-buttons';
import I18n from '../../../i18n';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import LoadingComponent from '../../../component/loadingComponent';
import RNRestart from 'react-native-restart'; // Import package from node modules


class ChangePassword extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
    );
    this.state = {

      hidePreviousPassword : true,
      hideNewPassword : true,
      hideConfirmPassword : true,

      samePassword: false,
      networkStatus: true,
      IsLoaderVisible: false,
      warningMessage: false,
      previousPassword : '',
      newPassword : '',
      confirmNewPassword : '',
      mailId : props.navigation.state.params.data[0].user_email,

      warningPreviousPassword : false,
      warningNewPassword : false,
      warningConfirmPassword : false,
      wrongInformation : '',
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


  onSubmitPassword = () => {

    let passwordValidString = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    var { previousPassword, newPassword, confirmNewPassword, warningNewPassword, warningPreviousPassword } = this.state;
    if(passwordValidString.test(previousPassword) === false){
        this.setState({ warningPreviousPassword : true, warningNewPassword : false, warningConfirmPassword : false, samePassword : false })
    } else if (passwordValidString.test(newPassword) === false) {
        this.setState({ warningNewPassword : true, warningPreviousPassword: false, warningConfirmPassword: false, samePassword : false })
    }else if( passwordValidString.test(newPassword) === false ) {
        this.setState({ warningPreviousPassword : false, warningNewPassword : false, warningConfirmPassword: true, samePassword : false })
    } else if( newPassword !== confirmNewPassword){
      this.setState({ warningPreviousPassword : false, warningNewPassword : false, warningConfirmPassword: false, samePassword : true })
    } else if( previousPassword === confirmNewPassword){
      Alert.alert('New password must be differ with previous password');
    }
    else  {
      this.setState({ warningPreviousPassword : false, warningNewPassword : false, warningConfirmPassword: false, samePassword : false })

        this.setState({ IsLoaderVisible : true })
        if(this.props.isConnected) {

          var URL= HelpFindAPI.BASE_URL+'change_password';

          fetch(URL,  {
              method: 'POST',
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "token"	:	this.state.token,
                "user_id"	:	this.state.userId,
                "user_login"	:	this.state.mailId,
                "password"		:	previousPassword,
                "new_password"	:	newPassword
              })
          }).then((response) => response.json()).then((responseJson) => {

                if(responseJson.sucess){
                    this.setState({ warningMessage : false, networkStatus : true, IsLoaderVisible: false, wrongInformation : '' })
                    Alert.alert('You have successfully changed your password. please login again with new password')
                    AsyncStorage.removeItem('token');
                    AsyncStorage.removeItem('userId');
                    RNRestart.Restart();
                }else{

                  this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true, wrongInformation : 'you field some wrong information' })
                }
              }).catch((error) => {
                this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true, wrongInformation: '' })

              });
          } else {

            this.setState({ networkStatus : false })
            this.setState({ IsLoaderVisible: false, wrongInformation: '' })
          }
    }
    this.setState({ IsLoaderVisible : false })
  }

  managePreviousPasswordVisibility = () => {
      this.setState({ hidePreviousPassword: !this.state.hidePreviousPassword });
  }
  manageNewPasswordVisibility = () => {
    this.setState({ hideNewPassword: !this.state.hideNewPassword });
  }
  manageConfirmPasswordVisibility = () => {
    this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword });
  }



  render() {
    const navigation = this.props.navigation;

    if(this.state.IsLoaderVisible){
        return(
          <ImageBackground source={require('../../../images/backgroundImage.png')} style={{ flex : 1 }}>
            <HeaderWithBackButton label="Change Password" other={this.props.navigation} />
            <LoadingComponent />
          </ImageBackground>
        )
      }


    return (
      <View style={{ flex : 1 }}>
      
          <View style={{ flex: 1, marginBottom : 10 }}>
            <HeaderWithBackButton label="Change Password" other={this.props.navigation} />
            {
              !this.state.networkStatus ? 
                  <View style={{ backgroundColor: 'red' }}>
                    <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>Network not connected, please try again</Text>
                </View> : null
            }
            {
              this.state.warningMessage !== '' ? 
                <View style={{ backgroundColor: 'red' }}>
                  <Text style={{ color: 'white', textAlign : 'center', fontSize: 17 }}>{this.state.warningMessage}</Text>
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
              
              <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5, color: this.state.warningPreviousPassword ? 'red' : '#D3D3D3' }}>Old Password</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                      style={{ padding: 5, height: 40, flex: 4, borderColor: this.state.warningPreviousPassword ? 'red' : '#D3D3D3', borderWidth: 2, borderRadius: 7 }}
                      value={this.state.previousPassword}
                      returnKeyType = {"next"}
                      secureTextEntry = { this.state.hidePreviousPassword }
                      placeholder={"enter your old password"}
                      onChangeText={ (previousPassword) => this.setState({ previousPassword }) }
                  />
                  <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePreviousPasswordVisibility }>  
                      <Image source = { ( this.state.hidePreviousPassword ) ? require('../../../images/hide.png') : require('../../../images/show.png') } style = { styles.btnImage } />
                  </TouchableOpacity>
                </View>
                {this.state.warningPreviousPassword ? <Text style={{ color : 'red' }}>The password must contain atleast 8 character with mix of letters, numbers, and/or special characters</Text> : null }

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5, color: this.state.warningNewPassword ? 'red' : '#D3D3D3' }}>New Password</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                      style={{ padding: 5, height: 40, flex: 4, borderColor: this.state.warningNewPassword ? 'red' : '#D3D3D3', borderWidth: 2, borderRadius: 7 }}
                      value={this.state.newPassword}
                      returnKeyType = {"next"}
                      secureTextEntry = { this.state.hideNewPassword }
                      placeholder={"enter new password"}
                      onChangeText={ (newPassword) => this.setState({ newPassword }) }
                  />
                  <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.manageNewPasswordVisibility }>  
                      <Image source = { ( this.state.hideNewPassword ) ? require('../../../images/hide.png') : require('../../../images/show.png') } style = { styles.btnImage } />
                  </TouchableOpacity>
                </View>
                {this.state.warningNewPassword ? <Text style={{ color : 'red' }}>The password must contain atleast 8 character with mix of letters, numbers, and/or special characters</Text> : null }

                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 5, color: this.state.warningConfirmPassword ? 'red' : '#D3D3D3' }}>Confirm Password</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                      style={{ padding: 5, height: 40, flex: 4, borderColor: this.state.warningConfirmPassword ? 'red' : '#D3D3D3', borderWidth: 2, borderRadius: 7 }}
                      value={this.state.confirmNewPassword}
                      secureTextEntry = { this.state.hideConfirmPassword }
                      placeholder={"enter your phone number"}
                      returnKeyType = {"next"}
                      onChangeText={ (confirmNewPassword) => this.setState({ confirmNewPassword }) }
                  />
                  <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.manageConfirmPasswordVisibility }>  
                      <Image source = { ( this.state.hideConfirmPassword ) ? require('../../../images/hide.png') : require('../../../images/show.png') } style = { styles.btnImage } />
                  </TouchableOpacity>
                </View>
                {this.state.warningConfirmPassword ? <Text style={{ color : 'red' }}>The password must contain atleast 8 character with mix of letters, numbers, and/or special characters</Text> : null }
                {this.state.samePassword ? <Text style={{ color : 'red' }}>New Password does not match with confirm new password.</Text> : null }
              </View>
            
  
              <View style={styles.container}>
                  <RaisedTextButton onPress={() => this.onSubmitPassword()} title="Submit Change Password" color={buttonBackgroundColor} titleColor='white' />
              </View>
          </ScrollView>
        </View>
    </View>
    );
  }
}

export default (ChangePassword);

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: backgroundColor,
      },
  container: {
      flex: 1,
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
  userImage: {
    borderColor: 'green',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
});  