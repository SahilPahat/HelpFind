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
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';
import I18n from '../../../i18n';
import moment from 'moment';

export default class MyPostDetails extends Component {
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
        var postTime = moment(item.item.post_array.post_date).format('Do MMM YYYY h A');
        return (
            <View style={styles.container}>
                <HeaderWithBackButton label={I18n.t('MyPost.details.header')} other={this.props.navigation} />
                <View style={styles.card}>
                    <View style={styles.notificationBox}>
                        {
                            item.item.auther_image === null ? 
                            <Image style={styles.image} source={require('../../../images/notificationTest1.png')} />
                            :
                            <Image style={styles.image} source={{ uri : item.item.auther_image }} />

                        }
                        <View style={{ marginLeft: 10 }}>
                            {
                                item.item.author_name == undefined ?
                                <Text style={styles.userName}>Not access by Network</Text> :
                                <Text style={styles.userName}>{item.item.author_name}</Text>
                            }
                            <Text style={styles.time}>{postTime}</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{item.item.post_array.post_title}</Text>
                    
                    {
                        item.item.post_image === false ? 
                        <Image style={{ width: 150, height : 150 }} source={require('../../../images/emptyImage.jpg')} />
                        :
                        <Image style={{ width: 100, height: 100 }} source={{ uri : item.item.post_image }} />

                    }
                    
                    <Text style={{ margin: 5 }}>{item.item.post_array.post_content}</Text>

                </View>
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
    },
    buttonContainer : {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 30
      },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 1,
      padding: 15,
      borderColor: '#D3D3D3'
    }
});