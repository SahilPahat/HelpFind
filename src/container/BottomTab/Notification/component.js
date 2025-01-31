import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { buttonBackgroundColor } from '../../../../env';

const NotificationComponent = (props) => {
    return (
        <FlatList
            style={styles.root}
            data={props.data}
            extraData={this.state}
            ItemSeparatorComponent={() => {
                return (
                    <View style={styles.separator} />
                )
            }}
            keyExtractor={(item)=> {
                return item.id;
            }}
            renderItem={(item) => {

                const Notification = item.item;
                let attachment = <View/>;

                let mainContentStyle;
                if(Notification.postImage) {
                    mainContentStyle = styles.mainContent;
                    attachment = <Image style={styles.attachment} source={Notification.postImage}/>
                }
                return(
                    <TouchableOpacity style={styles.container} onPress={() => props.navigation.navigate('NotificationDetails', {item} )}>
                        <Image source={Notification.userImage} style={styles.avatar}/>
                        <View style={styles.content}>
                            <View style={mainContentStyle}>
                                <View style={styles.text}>
                                    <Text style={styles.name}>{Notification.userName}</Text>
                                    <Text>{Notification.postDetails}</Text>
                                </View>
                                <Text style={styles.timeAgo}>
                                    2 hours ago
                                </Text>
                            </View>
                            {attachment}
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}

export default NotificationComponent

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFFFF"
  },
  mainContainer: {
      flex: 1,
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: 'flex-start'
  },
  avatar: {
    width:50,
    height:50,
    borderRadius:25,
  },
  text: {
    marginBottom: 5,
    flexDirection: 'row',
    flexWrap:'wrap'
  },
  content: {
    flex: 1,
    marginLeft: 16,
    marginRight: 0
  },
  mainContent: {
    marginRight: 60
  },
  img: {
    height: 50,
    width: 50,
    margin: 0
  },
  attachment: {
    position: 'absolute',
    right: 0,
    height: 50,
    width: 50
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  timeAgo:{
    fontSize:12,
    color:"#696969"
  },
  name:{
    fontSize:16,
    color: buttonBackgroundColor
  }
});  