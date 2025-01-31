import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';
import HeaderComponent from '../../../component/headerComponent';
import NotificationListComponent from './component';
import I18n from '../../../i18n';
export default class Notifications extends Component {

  constructor(props) {
    super(props);
    
    AsyncStorage.getItem("selectedLanguage").then((value) => { 
      return(
        I18n.locale = JSON.parse(value)
      )}
    );
    this.state = {
      data:[
        {id:3, userImage: require('../../../images/notificationTest1.png'), userName:"Ankit Rathi", postTitle: "Missed brother", postDetails:"Hello, Ankit Rathi Test the Notification. For Now its very nic. but improve when api integret in this.", postImage: require('../../../images/notificationTest4.jpeg'), postTime : '5 days ago' },
        {id:2, userImage: require('../../../images/notificationTest2.png'), userName:"XYZ Singh",   postTitle: "Missed Mobile Phone",  postDetails:"XYZ Singh running this application. please help him", postImage: require('../../../images/notificationTest4.jpeg'), postTime : '2 days ago' },
        {id:4, userImage: require('../../../images/notificationTest1.png'), userName:"ABC Khanna", postTitle: "Missed Everything",  postDetails:"Hello, ABC Khanna Test the Notification. But its need to some changes.", postImage:"", postTime : '6 hours ago' },
        {id:5, userImage: require('../../../images/notificationTest3.png'), userName:"PQR Pretty",  postTitle: "Missed Mobile Phone", postDetails:"PQR Pretty Test the Notification. For Now its very nic..", postImage:"", postTime : '3 hours ago'},
        {id:6, userImage: require('../../../images/notificationTest2.png'), userName:"Chetak Singh",  postTitle: "Missed Marksheet",  postDetails:"Hello, Chetak Singh Test the Notification. For Now its very good.", postImage:require('../../../images/notificationTest4.jpeg'), postTime : '1 hours ago'},
        {id:7, userImage: require('../../../images/notificationTest1.png'), userName:"Birbal Khatri", postTitle: "Missed Books", postDetails:"Hello, Birbal Khatri Test the Notification. Its very important part of this application", postImage:"", postTime : 'half an hour ago'},
        {id:8, userImage: require('../../../images/notificationTest3.png'), userName:"Google Chacha",   postTitle: "Missed LIC Document",   postDetails:"Google Chacha Test the Notification. For Now its very nic. but need some improve.", postImage:"", postTime : '6 hours ago'},
      ]
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <HeaderComponent label={ I18n.t('Notification.index.header') } />
        <NotificationListComponent data={this.state.data} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
      flex: 1,
  },
});  