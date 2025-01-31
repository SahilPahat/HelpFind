import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  
  Keyboard,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import HeaderWithBackButton from '../../component/headerComponentWithBackButton';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../env';
import I18n from '../../i18n';
import AutoScroll from 'react-native-auto-scroll';

export default class HomeCommentScreen extends Component {

  constructor(props) {
    super(props);
    
    AsyncStorage.getItem("selectedLanguage").then((value) => { 
        return(
          I18n.locale = JSON.parse(value)
        )}
    );

    this.state = {
        blurIn : false,
        comment: '',
        commentComplete : '',
        warningComment : false,
        uploadComment : '',
        tryAgain: false,
        postId : props?.route?.params?.item.post_array.ID,
        authorName : props?.route?.params?.item.post_author_name,
        authorMailId: props?.route?.params?.item.user_Email,
        commentParent : props?.route?.params?.item.Comment_array.length > 0 ? props?.route?.params?.item.Comment_array[0].comment_parent : '0',
        data: [
            { id:1, date:"10/10/2018 7:50 am", type:'in', userName : 'ABC Sharma', userImage : require('../../images/notificationTest3.png'), message: "1st comment by user" },
            { id:2, date:"16/10/2018 8:10 pm", type:'in', userName : 'Rahul Sen', userImage : require('../../images/notificationTest2.png'), message: "2nd comment by user" } ,
            { id:3, date:"18/10/2018 9:50 am", type:'out',  message: "welcome" }, 
            { id:4, date:"11:00 am", type:'out',  message: "please help me to find this" }, 
        ]
    };
  }

  renderDate = (date) => {
    return(
        <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  render() {

    var item = this.props?.route?.params?.item;

    var postTime = moment(item.post_array.post_date).format('Do MMM YYYY h A');


    return (
      <View style={styles.container}>

        <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.goBack()}>
                <Image style={{ width: 20, height: 20 }} source={require('../../images/back.png')}/>
                <Text style={{ color : 'white', fontSize : 16 }}>Back</Text>
            </TouchableOpacity>
            <View style={{ flex: 2, alignItems: 'center'}}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('Home.comments.header')}</Text>
            </View>
            <TouchableOpacity style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }} onPress={() => this.props.navigation.navigate('LoginScreen') }>
                <Image style={{ width:38, height:38 }} source={require('../../images/skipUserLogin.png')}/>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{I18n.t('skipUserTab.homeDetails.loginTitle')}</Text>
            </TouchableOpacity>
        </View>

          {
            this.state.warningComment ? 
              <View style={{ backgroundColor: 'red' }}>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>* Please type some comment.</Text>
              </View>
              : null
          }

        <View style={styles.notificationBox}>
            <View>
              {
                item.auther_image === null ? 
                <Image style={styles.image} source={require('../../images/notificationTest1.png')} />
                :
                <Image style={styles.image} source={{ uri : item.auther_image }} />  
              }
            </View>
            <View style={{ flex: 2, marginLeft: 10 }}>
                {
                    item.post_author_name === '' ?
                      <View>
                        <Text style={{ fontSize : 16}}>Not access by Network</Text>
                        <Text style={{ fontSize:12, color:"#808080" }}>{postTime}</Text>
                      </View>
                      : 
                      <View>
                        <Text style={styles.userName}>{item.post_author_name}</Text>
                        <Text style={{ fontSize:12, color:"#808080" }}>{postTime}</Text>
                      </View>
                }
            </View>
            <View style={{ marginRight : 10 }}>
              {
              item.post_image === false ? 
                  <Image style={{ width: 70, height: 70, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} source={require('../../images/emptyImage.jpg')} />
                  :
                  <Image style={{ height: 45, width: 45, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} source={ {uri : item.post_image} } />
                  
              }
            </View>
        </View>
        
        <View style={{ borderBottomColor: '#efefef', borderBottomWidth: 0.5, marginBottom: 2 }} />
          <Text style={styles.title}>{item.post_array.post_title}</Text>
        <View style={{ borderBottomColor: '#efefef', borderBottomWidth: 0.5, marginTop: 2, marginBottom: 2 }} />        

          <AutoScroll
              contentContainerStyle={{ marginBottom : 5, paddingBottom : 5 }}>

            <FlatList style={styles.list}
              data={item.Comment_array.reverse()}
              keyExtractor= {(item) => {
                return item.id;
              }}
              renderItem={(message) => {

                const item = message.item;
                let inMessage = message.item.user_id !== 12;
                let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
                var commentTime = moment(item.comment_date).format('Do MMM YYYY h A');

                return (  
                    <View style={{ marginBottom: 10 }}>
                        {
                        inMessage ? 
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {
                                <Image style={{ width: 24, height : 24, borderRadius : 12}} source={require('../../images/testing.png')} />
                              }
                              <View>
                                  <Text style={{ fontSize: 14 }}>{item.comment_author}</Text>
                                  <Text style={{ fontSize:9, color:"#808080" }} >{commentTime}</Text>
                              </View>
                          </View>
                            :
                        <Text></Text>
                       }
                        
                    <View style={[styles.item, itemStyle]}>
                        {!inMessage && this.renderDate(item.date)}
                        <View style={[styles.balloon]}>
                            <Text>{item.comment_content}</Text>
                        </View>
                        {inMessage}
                    </View>
                    {
                      inMessage ? null : 
                      <View style={{ alignItems: 'flex-end', marginRight: 5 }}>
                        <Text style={{ textAlign: 'right', fontSize:8, color:"#808080" }}>{commentTime}</Text>
                      </View>
                    }
                </View>
              )
            }}
          />
            {
                this.state.commentComplete === '' ? <Text></Text> : 
                <View style={[styles.item, styles.itemOut]}>
                    <Text style={styles.time}>
                      {I18n.t('Home.comments.messageJustNowTitle')}
                    </Text>
                    <View style={[styles.balloon]}>
                        <Text>{this.state.commentComplete}</Text>
                    </View>
                </View>
            }
           {
             this.state.commentComplete === '' ? null : 
            <View style={{ alignItems: 'flex-end', marginRight: 20, marginBottom : 10 }}>
              {
                this.state.uploadComment === 'Try Again' ? 
                  <TouchableOpacity onPress={() => this.onCommentSubmit()} style={{ backgroundColor : 'red', borderRadius: 4, fontSize: 12, padding: 5   }}>
                    <Text style={{ color: 'white' }}>{this.state.uploadComment}</Text>
                  </TouchableOpacity>
                  : 
                  <Text style={{ fontSize: 8 }}>{this.state.uploadComment}</Text>
              }
            </View>
            }
        </AutoScroll>

      </View>

    );
  }
}

const styles = StyleSheet.create({
    scroll: {
        marginTop: 10,
        backgroundColor: 'white',
    },
  container:{
    flex:1,
    backgroundColor: 'white'
  },
  avatar: {
    width:50,
    height:50,
    borderRadius:25,
    marginRight: 5
  },
  notificationBox: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
},
userName:{
    fontSize:19,
},
title: {
    fontSize:16,
    marginLeft: 10
},
userTime:{
    fontSize:13,
    color: "#808080",
    marginTop: 5
},
  list:{
    paddingHorizontal: 17,
  },
  footer:{
    flexDirection: 'row',
    height:36,
    backgroundColor: '#eeeeee',
    padding:3,
  },
  btnSend:{
    backgroundColor: buttonBackgroundColor,
    width:25,
    height:25,
    borderRadius:360,
    alignItems:'center',
    justifyContent:'center',
  },
  iconSend:{
    width:20,
    height:20,
    alignSelf:'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    height:30,
    flexDirection: 'row',
    alignItems:'center',
    flex:1,
    marginRight:1,
  },
  inputs:{
    height:40,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  balloon: {
   
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    alignSelf: 'flex-end',

  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize:12,
    color:"#808080",
  },
  item: {
    marginVertical: 1,
    flex: 1,
    flexDirection: 'row',
    backgroundColor:"#eeeeee",
    borderRadius:5,
    padding:2,
  },
});  