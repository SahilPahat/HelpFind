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
import HeaderWithBackButton from '../../../component/headerComponent';
import I18n from '../../../i18n';

export default class NotificationDetails extends Component {
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
        var item = this.props?.route?.params?.item.item;
        return (
            <View style={styles.container}>
                <HeaderWithBackButton label={I18n.t('Notification.details.header')} other={this.props.navigation} />
                <View style={styles.card}>
                    <View style={styles.notificationBox}>
                        <Image style={styles.image} source={item.userImage} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.userName}>{item.userName}</Text>
                            <Text style={styles.time}>2 hour ago</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    
                    {
                        item.postImage === 'undefined' ? <Text></Text> : <Image style={styles.cardImage} source={item.postImage} />
                    }
                    
                    <Text style={{ margin: 5 }}>{item.text}</Text>

                    <TouchableOpacity style={styles.socialBarButton} onPress = {() => this.props.navigation.navigate('HomeComment', {item} ) }>
                        <Text style={styles.socialBarLabel}>11</Text>
                        <Image style={styles.icon} source={require('../../../images/commentIcon.png')}/>
                    </TouchableOpacity>

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
        backgroundColor:"white",
        padding: 10
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
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 5
    }
});