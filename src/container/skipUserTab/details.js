import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
  
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderWithBackButton from '../../component/headerComponent';
import moment from 'moment';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';
import I18n from '../../i18n';

export default class HomeDetails extends Component {
    constructor(props) {
        super(props);

        AsyncStorage.getItem("selectedLanguage").then((value) => { 
            return(
              I18n.locale = JSON.parse(value)
            )}
          );
        this.state = {
          
        };
    }
    
    render() {        
        var item = this.props?.route?.params?.item;
        var postTime = moment(item.post_date).format('Do MMM YYYY h A');
        return (
            <View style={styles.container}>
                
                <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
                    <TouchableOpacity style={{ flex: 1, marginLeft: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                        <Image style={{ width: 20, height: 20 }} source={require('../../images/back.png')}/>
                        <Text style={{ color : 'white', fontSize : 16 }}>Back</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 2, alignItems: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.homeDetails.header')}</Text>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LoginScreen') }>
                        <Image style={{ width:38, height:38 }} source={require('../../images/skipUserLogin.png')}/>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.homeDetails.loginTitle')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <View style={styles.notificationBox}>
                        {
                            item.auther_image === null ? 
                            <Image style={styles.image} source={require('../../images/notificationTest1.png')} />
                            :
                            <Image style={styles.image} source={{ uri : item.auther_image }} />

                        }
                        <View style={{ marginLeft: 10 }}>
                            {
                                item.post_author_name === undefined || null || '' ?
                                <Text style={styles.userName}>Not access by Network</Text>
                                : <Text style={styles.userName}>{item.post_author_name}</Text>
                            }
                            <Text style={styles.time}>{postTime}</Text>
                        </View>
                    </View>
                    <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 1, marginBottom: 3 }} />
                        <Text style={styles.title}>{ item.post_array && item.post_array.post_title}</Text>
                    <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 1, marginBottom: 3 }} />

                    
                    {
                        item.post_image === false ?
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 120, height: 120 }} source={require('../../images/emptyImage.jpg')}/>
                        </View>
                        :
                        <Image style={styles.cardImage} source={{ uri : item.post_image }}/>
                    }
                    
                    <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 1, marginBottom: 3 }} />
                        <Text style={{ margin: 5 }}>{item.post_array.post_content}</Text>
                    <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 1, marginBottom: 3 }} />


                    <View style={styles.cardFooter}>
                        <View style={styles.socialBarContainer}>
                            <View style={styles.socialBarSection}>
                                <TouchableOpacity style={styles.socialBarButton} onPress = {() => item.Comment_array.length > 0 ? this.props.navigation.navigate('SkipUserHomeComment', {item} ) : Alert.alert('There is no comment to show.') }>
                                    {
                                        item.Comment_array.length > 0 ? 
                                            <Text style={styles.socialBarLabel}>{item.Comment_array.length} Comment</Text> : 
                                            <Text style={[styles.socialBarLabel, { color : '#D3D3D3' }]}>No Comment</Text>
                                    }
                                    <Image style={styles.icon} source={require('../../images/commentIcon.png')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    notificationBox: {
        paddingTop:10,
        paddingBottom:10,
        marginTop:5,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius:10,
      },
      image:{
        width:45,
        height:45,
        borderRadius:20,
        marginLeft:20
    },
    list: {
        paddingHorizontal: 6,
        backgroundColor:"#E6E6E6",
    },
    card:{
        shadowColor: '#00000021',
        shadowOffset: {
            width: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 4,
        backgroundColor:"white"
    },
    cardFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImage:{
        height: 150,
        width: null,
    },
    userName:{
        fontSize:18,
        flex:1,
    },
    title: {
        fontSize:16,
        marginLeft: 5
    },
    time:{
        fontSize:13,
        color: "#808080",
        marginTop: 5
    },
    icon: {
        width:25,
        height:25,
        marginLeft: 8
    },
    socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarlabel: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});