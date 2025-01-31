import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  NetInfo,
  
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';
import I18n from '../../i18n';
import HelpFindAPI from '../../../config';
import { Button } from 'react-native-elements';
import { facebookService } from './facebookService';
import { LoginManager } from 'react-native-fbsdk';


class LoginScreen extends Component {

    constructor(props) {
        super(props)

        I18n.locale = props?.route?.params?.basicData.selectedLanguage;

        this.state = {
            facebookPassword : '',
            facebookEmail : '',
            facebookImage : '',
            facebookName : '',
            facebookWarningNewPassword : '',
            facebookMainWarning: '',
            facebookIsLoaderVisible: false,

            email   : '',
            password: '',
            hidePassword : true,
            emailWarning: '',
            passwordWarning: '',
            mainWarning: '',
            isRTL : props?.route?.params?.basicData.isRTL,
            basicData : {
                isRTL : props?.route?.params?.basicData.isRTL,
                selectedLanguage : props?.route?.params?.basicData.selectedLanguage,
            }
        }
    }

    managePasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }
    

    async onLonginButton () {
        var { email, password, emailWarning, passwordWarning } = this.state;
        
        let emailValidString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        let passwordValidString = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        
        if(emailValidString.test(email) === false){
            this.setState({ emailWarning: I18n.t('login.emailWarning') })
            return false;
        } else {
            this.setState({ emailWarning: '' })
        }
        if(passwordValidString.test(password) === false){
            this.setState({ passwordWarning: I18n.t('login.passwordWarning') })
            return false;
        } else {
            this.setState({ passwordWarning : '' })
        }
        Keyboard.dismiss();
        if( emailWarning === '' && passwordWarning === ''){
            this.setState({ IsLoaderVisible: true })

                var { email, password } = this.state;
                if(this.props.isConnected) {

                  var URL= HelpFindAPI.BASE_URL+'member_login';

                  fetch(URL,  {
                      method: 'POST',
                      headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        "user_name" : email,
                        "user_pass" : password,
                      })
                  }).then((response) => response.json()).then((responseJson) => {

                        if(responseJson.sucess){
                            AsyncStorage.setItem('userId', JSON.stringify(responseJson.User_ID)); 
                            AsyncStorage.setItem('token', JSON.stringify(responseJson.token));
                            AsyncStorage.setItem('userName', JSON.stringify(responseJson.data[0].display_name));
                            this.setState({ IsLoaderVisible: false, email : '', password : '' })
                            this.props.navigation.navigate('HomeTab', { basicData : this.state.basicData });
                        }else{
                            this.setState({ mainWarning : responseJson.message})
                            this.setState({ IsLoaderVisible: false })
                        }
                      }).catch((error) => {
                          this.setState({ mainWarning : error })
                          this.setState({ IsLoaderVisible: false })
                          
                        });
                    } else {
                      this.props.navigation.navigate('BottomTabBar');
                    this.setState({ mainWarning : '* Network not available' })
                    this.setState({ IsLoaderVisible: false })
                  }
      }
    }

    onFacebookExistingUser = (accessToken) => {
        if(this.props.isConnected) {

            this.setState({ facebookMainWarning: '', facebookIsLoaderVisible: true })
            var URL= HelpFindAPI.BASE_URL+'check_emailID';

            fetch(URL,  {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                "emailid" : accessToken.email
                })
            }).then((response) => response.json()).then((responseJson) => {

                if(responseJson.sucess){
                    AsyncStorage.setItem('userId', JSON.stringify(responseJson.UserID)); 
                    AsyncStorage.setItem('token', JSON.stringify(responseJson.token));
                    AsyncStorage.setItem('userName', JSON.stringify(responseJson.data[0].display_name));
                    this.setState({ facebookMainWarning: '', })
                    this.props.navigation.navigate('HomeTab', { basicData : this.state.basicData });
                    this.setState({  facebookIsLoaderVisible: false})
                }else{
                    this.setState({ facebookMainWarning : responseJson.message})
                    this.setState({ facebookIsLoaderVisible: false })
                    this.props.navigation.navigate('LoginFacebook', { data : accessToken, basicData : this.state.basicData });
                }
                }).catch((error) => {
                this.setState({ facebookMainWarning : error })
                this.setState({ facebookIsLoaderVisible: false })

                });
            } else {
            this.setState({ facebookMainWarning : '* Network not available' })
            this.setState({ facebookIsLoaderVisible: false })
            }
        this.setState({ facebookIsLoaderVisible: false })
    }


    render() {

        return (
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps='handled'
            >

            <View style={styles.container}>
                <Image source={require('../../images/logo.png')} style={styles.logoImage} />

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../images/email.png')}/>
                    <TextInput style={styles.inputs}
                        placeholder={I18n.t('login.Email')}
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(email) => this.setState({email : email, mainWarning : '',  emailWarning : '', passwordWarning : ''})}
                    />
                </View>
                <Text style={styles.warningLabel}>{this.state.emailWarning}</Text>
        
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={require('../../images/changePassword.png')}/>
                    <TextInput style={styles.inputs}
                        placeholder={I18n.t('login.Password')}
                        secureTextEntry = { this.state.hidePassword }
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => this.setState({password : password, mainWarning : '',  emailWarning : '', passwordWarning : '' })}
                    />
                    <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>  
                        <Image source = { ( this.state.hidePassword ) ? require('../../images/hide.png') : require('../../images/showPassword.png') } style = { styles.btnImage } />
                    </TouchableOpacity>
                </View>
                <Text style={styles.warningLabel}>{this.state.passwordWarning}</Text>
                
                <Button
                    title={I18n.t('login.LOGIN')}
                    loading={this.state.IsLoaderVisible}
                    titleStyle={{ fontWeight: "700" }}
                    buttonStyle={[styles.buttonContainer, styles.loginButton]}
                    containerStyle={{ marginTop: 20 }}
                    onPress={() => this.onLonginButton()}
                />
                <Text style={styles.warningLabel}>{this.state.mainWarning}</Text>

                <Text style={styles.logoText}>{I18n.t('login.or Connect with')}</Text>

                {
                    this.state.facebookIsLoaderVisible ? 
                        <ActivityIndicator size="large" color="white" />
                        :
                        facebookService.makeLoginButton((accessToken) => {
                            
                            if(accessToken.email !== undefined){
                                if(accessToken.email !== ''){
                                    this.onFacebookExistingUser(accessToken);
                                } else{
                                    Alert.alert('Your Email is not access by facebook. Please try manually.')
                                }
                                LoginManager.logOut()
                            } else{
                                Alert.alert('Your Email is not access by facebook. Please try manually.')
                                LoginManager.logOut()
                            }
                        })
                }
                {
                    this.state.facebookMainWarning === '' ? null :
                        <Text>{this.state.facebookMainWarning}</Text>
                }


                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>{I18n.t('login.Create a account? Then')} </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Registration', { basicData : this.state.basicData })}>
                        <Text style={styles.signupButton}>{I18n.t('login.Sign in!')}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.props.navigation.navigate('skipUserTabBar', { basicData : this.state.basicData })}>
                    <Text style={{ color:'green', fontSize:16 }}>{I18n.t('login.skipLabel')}</Text>
                </TouchableOpacity>

            </View>
            </ScrollView>
        );
    }
}

export default (LoginScreen);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 400,
        height: 100,
        marginBottom: 20
    },
    logoText : {
        marginVertical: 10,
        fontSize:18,
        color: textLabelColor,
    },
    signupTextCont : {
        alignItems:'flex-end',
        justifyContent :'center',
        paddingVertical:16,
        flexDirection:'row'
      },
    signupText: {
        color:'black',
        fontSize:16,
      },
    signupButton: {
        color: buttonBackgroundColor,
        fontSize:16,
        fontWeight: 'bold'
      },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width:250,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: buttonBackgroundColor,
    },
    loginText: {
        color: 'white',
        fontSize: 18
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
    facebookbutton : {
        justifyContent: 'center',
        alignItems: 'center',
    },
    warningLabel : {
        color: 'red',
        marginBottom: 20,
        width: 225
    },
    scroll: {
        backgroundColor: backgroundColor,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center'
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