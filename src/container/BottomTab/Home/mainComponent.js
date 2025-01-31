import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import moment from 'moment';
import { buttonBackgroundColor } from '../../../../env';
import I18n from '../../../i18n';

const HomeComponent = (props) => {

    var userId = props.userId;
    var token = props.token;
    return (
        <FlatList style={styles.list}
            data={props.data}
            keyExtractor= {(item) => {
                    return item.id;
                }}
            ItemSeparatorComponent={() => {
                return (
                        <View style={styles.separator} />
                    )
                }}
            renderItem={(post) => {
                const item = post.item;
                var postTime = moment(item.post_array.post_date).format('Do MMM YYYY h A');
                var locationCity = '';

                if(item.post_meta.city !== undefined ){
                    var locationCity = item.post_meta.city;
                }else {
                    var locationCity = '';
                }

                var sharedUserName = null
                if(post.item.post_meta.shared_by_userName !== undefined){
                    if(post.item.post_meta.shared_by_userName.length > 0){
                        sharedUserName = post.item.post_meta.shared_by_userName;
                    }
                }

                return (
                    <View style={styles.card}>
                        
                        {
                            sharedUserName === null ? null :
                            <View style={{ marginLeft : 5, marginTop: 5 }}>
                                <Text><Text style={{ color : buttonBackgroundColor, fontSize : 17 }}>{sharedUserName}</Text> {I18n.t('Home.mainComponent.sharedPostLabel')}</Text>
                            </View>
                        }

                        <TouchableOpacity onPress={() => props.navigation.navigate('HomeDetails', {item: item, userId: userId, token:token } )}>
                            <View style={styles.notificationBox}>
                                {
                                    post.item.auther_image === null ? 
                                    <Image style={styles.image} source={require('../../../images/notificationTest1.png')} />
                                    :
                                    <Image style={styles.image} source={{ uri : post.item.auther_image }} />

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
                            <Text style={styles.title}>{item.post_array && item.post_array.post_title}</Text>
                            {
                                item.post_image === false ? 
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ flex : 1, width: 120, height: 120 }} source={require('../../../images/emptyImage.jpg')} />
                                </View>
                                :
                                <Image style={styles.cardImage} source={{ uri : item.post_image }}/>

                            }
                        </TouchableOpacity>
                        <Text style={{ marginLeft : 5 }}>{I18n.t('Home.mainComponent.locationLabel')} : <Text style={{ color : buttonBackgroundColor, fontSize : 17 }}>{locationCity}</Text></Text>
                        
                        <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 3, marginTop: 10, marginBottom: 5 }} />
                        
                        <View style={styles.cardFooter}>
                            <View style={styles.socialBarContainer}>
                                <View style={styles.socialBarSection}>
                                    <TouchableOpacity style={styles.socialBarButton} onPress={() => props.navigation.navigate('HomeComment', {item: item, userId: userId, token : token}) }>
                                        <Image style={styles.icon} source={require('../../../images/commentIcon.png')}/>
                                        {
                                            item.Comment_array.length > 0 ? 
                                            <Text style={{ justifyContent : 'center', color : 'black' }}>{I18n.t('Home.mainComponent.commentLabel')}</Text>
                                            :
                                            <Text style={{ justifyContent : 'center', color : '#D3D3D3' }}>{I18n.t('Home.mainComponent.noCommentLabel')}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                
                                <View style={styles.socialBarSection}>
                                    <TouchableOpacity style={styles.socialBarButton} onPress={() => sharedUserName === null ? props.navigation.navigate('SharedPost', {item: item, userId: userId}) : null }>
                                        <Image style={styles.icon} source={require('../../../images/sharIcon.png')}/>
                                        {
                                            sharedUserName === null ? 
                                                <Text style={{ justifyContent : 'center', color : 'black' }}>{I18n.t('Home.mainComponent.sharedLabel')}</Text> :
                                                <Text style={{ justifyContent : 'center', color : '#D3D3D3' }}>{I18n.t('Home.mainComponent.alreadySharedLabel')}</Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>
                    </View>
                )
            }}
        />
    );
}

export default HomeComponent;

const styles = StyleSheet.create({
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
    separator: {
        marginTop: 2,
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
        paddingBottom: 12.5,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImage:{
        flex: 1,
        height: 150,
        width: null,
    },
    userName:{
        fontSize:18,
        flex:1,
    },
    title: {
        fontSize:16,
        flex:1,
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
        marginRight: 8
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
        justifyContent: 'center',
    },
    socialBarButton:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});