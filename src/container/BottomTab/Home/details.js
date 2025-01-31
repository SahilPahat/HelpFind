import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  AsyncStorage
} from 'react-native';
import moment from 'moment';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import I18n from '../../../i18n';
import { buttonBackgroundColor } from '../../../../env';

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
        var item = this.props.navigation.state.params.item;
        var userId = this.props.navigation.state.params.userId;
        var token = this.props.navigation.state.params.token;

        var postTime = moment(item.post_array.post_date).format('Do MMM YYYY h A');
        var sharedUserName = null
        if(item.post_meta.shared_by_userName !== undefined){
            if(item.post_meta.shared_by_userName.length > 0){
                sharedUserName = item.post_meta.shared_by_userName;
            }
        }

        return (
            <View style={styles.container}>
                <HeaderWithBackButton label={I18n.t('Home.details.header')} other={this.props.navigation} />
                <ScrollView style={styles.card}>
                    {
                        sharedUserName === null ? null :
                        <View style={{ marginLeft : 5, marginTop: 5 }}>
                            <Text><Text style={{ color : buttonBackgroundColor, fontSize : 17 }}>{sharedUserName}</Text> {I18n.t('Home.details.sharedPostLabel')}</Text>
                        </View>
                    }

                    <View style={styles.notificationBox}>
                        {
                            item.auther_image === null ? 
                            <Image style={styles.image} source={require('../../../images/notificationTest1.png')} />
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

                    <Text style={styles.title}>{item.post_array.post_title}</Text>
                    {
                        item.post_image === false ? 
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ flex : 1, width: 120, height: 120 }} source={require('../../../images/emptyImage.jpg')} />
                        </View>
                        :
                        <Image style={styles.cardImage} source={{ uri : item.post_image }}/>

                    }
                    
                    <Text style={{ margin: 5 }}>{item.post_array.post_content}</Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.socialBarContainer}>
                            <View style={styles.socialBarSection}>
                                <TouchableOpacity style={styles.socialBarButton} onPress = {() => this.props.navigation.navigate('HomeComment', {item, userId: userId, token: token} ) }>
                                    {
                                        item.Comment_array.length > 0 ? 
                                            <Text style={styles.socialBarLabel}>{item.Comment_array.length}</Text> : 
                                            <Text style={[styles.socialBarLabel, { color : '#D3D3D3' }]}>{I18n.t('Home.details.noCommentLabel')}</Text>
                                    }
                                    <Image style={styles.icon} source={require('../../../images/commentIcon.png')}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.socialBarSection}>
                                <TouchableOpacity style={styles.socialBarButton} onPress={() => sharedUserName === null ? props.navigation.navigate('SharedPost', {item: item, userId: userId}) : null }>
                                    <Image style={styles.icon} source={require('../../../images/sharIcon.png')}/>
                                        {
                                            sharedUserName === null ? 
                                                <Text style={{ justifyContent : 'center', color : 'black' }}>{I18n.t('Home.details.sharedLabel')}</Text> :
                                                <Text style={{ justifyContent : 'center', color : '#D3D3D3' }}>{I18n.t('Home.details.alreadySharedLabel')}</Text>
                                        }
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
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