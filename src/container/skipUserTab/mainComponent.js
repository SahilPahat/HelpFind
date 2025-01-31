import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import moment from 'moment';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';

const SkipUserHomeComponent = (props) => {
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
                var postTime = moment(item.post_date).format('Do MMM YYYY h A');
                var locationCity = '';

                if(post.item.post_meta.length === 0){
                    locationCity = ''
                }else {
                    locationCity = post.item.post_meta.city;
                }

                return (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('SkipUserHomeDetails', {item} )}>
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
                            <Text style={styles.title}>{item.post_array && item.post_array.post_title}</Text>
                            {
                                item.post_image === false ? 
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ flex : 1, width: 120, height: 120 }} source={require('../../images/emptyImage.jpg')} />
                                </View>
                                :
                                <Image style={styles.cardImage} source={{ uri : item.post_image }}/>

                            }
                        </TouchableOpacity>

                        <Text style={{ marginLeft : 5 }}>Location City : <Text style={{ color : buttonBackgroundColor, fontSize : 17 }}>{locationCity}</Text></Text>

                        <View style={{ borderBottomColor: '#E6E6E6', borderBottomWidth: 1, marginTop: 10, marginBottom: 5 }} />
                        
                        <View style={styles.cardFooter}>
                            <View style={styles.socialBarContainer}>
                                <View style={styles.socialBarSection}>
                                    <TouchableOpacity style={styles.socialBarButton} onPress={() => item.Comment_array.length > 0 ? props.navigation.navigate('SkipUserHomeComment', {item}) : Alert.alert('There is no comment to show.') }>
                                        <Image style={styles.icon} source={require('../../images/commentIcon.png')}/>
                                        {
                                            item.Comment_array.length > 0 ? 
                                            <Text style={{ justifyContent : 'center', color : 'black' }}> {item.Comment_array.length} Comment</Text>
                                            :
                                            <Text style={{ justifyContent : 'center', color : '#D3D3D3' }}>  No Comment</Text>
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

export default SkipUserHomeComponent;

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