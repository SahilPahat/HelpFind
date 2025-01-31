import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import HeaderWithBackButton from '../../../component/headerComponent';

import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import I18n from '../../../i18n';

export default class ForwardPost extends Component {

  constructor(props) {
    super(props);

    I18n.locale = props?.route?.params?.basicData.selectedLanguage;
    this.state = {
        title: '',
        warningTitle : 'black',
        userData : [
            { id: 1, userName: 'XYZ Singh', userImage : require('../../../images/notificationTest1.png') },
            { id: 2, userName: 'Robin Hud', userImage : require('../../../images/notificationTest2.png') },
            { id: 3, userName: 'ABC Khanna', userImage : require('../../../images/notificationTest1.png') },
            { id: 4, userName: 'XYZ Singh', userImage : require('../../../images/notificationTest2.png') },
            { id: 5, userName: 'PQR Pretty', userImage : require('../../../images/notificationTest1.png') },
            { id: 6, userName: 'Birbal Khatri', userImage : require('../../../images/notificationTest2.png') },
            { id: 7, userName: 'ABC Khanna', userImage : require('../../../images/notificationTest1.png') },
            { id: 8, userName: 'Google Chacha', userImage : require('../../../images/notificationTest2.png') },
            { id: 9, userName: 'XYZ Singh', userImage : require('../../../images/notificationTest1.png') },
            { id: 10, userName: 'Birbal Khatri', userImage : require('../../../images/notificationTest2.png') }
        ]
    };
  }

  forwardButton = () => {
      var { title } = this.state;
      if(title === ''){
        this.setState({ warningTitle: 'red' })
      }else  {
        this.setState({ warningTitle: 'black' })
        Alert.alert(
            'You have successfully forward a post.'
        )
        this.props.navigation.navigate('HomeTab');
    }
  }

  render() {
    return (
            <View style={styles.mainContainer}>
                <HeaderWithBackButton label={I18n.t('Home.forward.header')} other={this.props.navigation} />
                
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ }}
                    keyboardShouldPersistTaps='handled'
                >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 5 }}>
                    <Image source={require('../../../images/notificationTest1.png')} style={styles.avatar}/>
                    <Text style={styles.name}>XYZ Singh</Text>
                </View>

                <View style={{ margin: 5 }}>
    
                    <Text style={{ fontSize: 18, color: buttonBackgroundColor, marginTop: 10 }}>{I18n.t('Home.forward.forwardLabelTitle')}</Text>
                    <Image style={styles.cardImage} source={this.props?.route?.params?.item.postImage }/>
                    <Text style={{ margin: 5 }}>{this.props?.route?.params?.item.postDetails}</Text>


                    <Text style={{ fontSize: 18, color: this.state.warningTitle, marginTop: 10 }}>{I18n.t('Home.forward.postLabelTitle')}</Text>
                    <TextInput
                        style={{ height: 40, borderColor: '#D3D3D3', borderWidth: 2, borderRadius: 7 }}
                        placeholder={I18n.t('Home.forward.postTextInputPlaceHolder')}
                        onChangeText={(title) => this.setState({title})}
                    />

                    <View style={{ marginTop: 20, marginBottom: 30 }}>
                        <Text style={{ fontWeight: 'bold', color: 'gray', fontSize: 17 }}>SUGGESTED</Text>
                        
                        {
                            this.state.userData.map((item, id) => {
                                return(
                                    <View style={styles.suggestRowView}>
                                        <Image source={item.userImage} style={styles.avatar} />
                                        
                                        <View style={{ flex: 1, marginLeft: 15 }}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View style={{ flex: 3 }} ><Text>{item.userName}</Text></View>
                                                <View style={{ flex : 1 }}>
                                                    <TouchableOpacity style={{ backgroundColor : buttonBackgroundColor, paddingTop: 10, paddingBottom: 10, padding: 15, borderRadius: 5, alignItems: 'center',  }}>
                                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{ borderBottomColor: 'gray', borderBottomWidth: 0.5, marginTop: 10 }} />
                                        </View>
                                        
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: backgroundColor,
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
        marginTop: 20,
        height: 36,
        backgroundColor: buttonBackgroundColor,
        borderColor: buttonBackgroundColor,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    ImageText: {
        fontSize: 18,
    },
    avatar: {
        width:50,
        height:50,
        borderRadius:25,
    },
    name:{
        fontSize:16,
        color: buttonBackgroundColor
    },
    cardImage:{
        flex: 1,
        height: 150,
        width: null,
    },
    suggestRowView : {
        marginTop: 10,
        marginRight: 20,
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        alignItems: 'center',
    }
});  