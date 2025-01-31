import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
  
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopupDialog from 'react-native-popup-dialog';
var { height, width } = Dimensions.get('window');
import { buttonBackgroundColor } from '../../../../env';
import I18n from '../../../i18n';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import HelpFindAPI from '../../../../config';


class MyPostComponent extends Component {

    constructor(props) {
        super(props);

        AsyncStorage.getItem("selectedLanguage").then((value) => { 
          return(
            I18n.locale = JSON.parse(value)
          )}
        );
    
        this.state = {
            warningMessage: false,
            networkStatus : true,
            IsLoaderVisible: false,
        }
        this.onStorageDataLoad();
    }

    async onStorageDataLoad() {
        await AsyncStorage.getItem("token").then((value) => {

          this.setState({
            token : JSON.parse(value)
          })
        });
        await AsyncStorage.getItem("userId").then((value) => {

          this.setState({
            userId : JSON.parse(value)
          })
        });
    }

    onDeleteButton = () => {
        this.popupDialog.show();
        //this.props.navigation.navigate('HomeAddNewPost', this.props.data)
    }

    onEditButton = () => {
        this.props.navigation.navigate('HomeAddNewPost', this.props.data)
    }

    onDeletePost = (item) => {


            if(this.props.isConnected) {

              this.setState({ isLoaderVisible: true })
              var URL= HelpFindAPI.BASE_URL+'delete_post_by_postID';

              fetch(URL,  {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "token"	:	this.state.token,
                    "user_id"	:	this.state.userId,
                    "post_id" : item.item.post_id
                  })
              }).then((response) => response.json()).then((responseJson) => {

                    if(responseJson.sucess){
                        Alert.alert('Your post has been deleted successfully.')
                        this.setState({ warningMessage : false, networkStatus : true, })
                        this.props.navigation.navigate('HomeTab');
                        this.setState({ isLoaderVisible: false })
                    }else{

                      this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true,  })
                    }
                  }).catch((error) => {
                    this.setState({ IsLoaderVisible: false, networkStatus : true, warningMessage: true })

                  });
              } else {

                this.setState({ networkStatus : false, warningMessage: false })
                this.setState({ IsLoaderVisible: false })
              }

        this.setState({ isLoaderVisible : false })
    }

    onCancel = () => {
        this.popupDialog.dismiss();
    }

    render() {

        return (
        <View style={{ }}>
            <Spinner visible={this.state.isLoaderVisible} color="black" />
            {
                this.state.warningMessage ?  
                    <View style={{ backgroundColor: 'red' }}>
                        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Something went wrong. Please try again.</Text>
                    </View>
                : null
            }
            {
                !this.state.networkStatus ?
                    <View style={{ backgroundColor: 'red' }}>
                        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Network not connected</Text>
                    </View>
                : null
            }
          <FlatList
            style={styles.root}
            data={this.props.data}
            extraData={this.state}
            ItemSeparatorComponent={() => {
                return (
                    <View style={styles.separator}/>
                )
            }}
            keyExtractor={(item)=>{
                return item.id;
            }}
            renderItem={(item) => {

                const myPost = item.item.post_array;

                var postDetails = '';
                if(myPost.post_content.length > 70){
                    var extra = '.....'
                    postDetails = myPost.post_content.slice(0, 70)
                    postDetails = postDetails.concat(extra);
                } else {
                    postDetails = myPost.post_content;
                }
                var postTime = moment(myPost.post_date).format('Do MMM YYYY h A');

                return(
                    <View>
                        <TouchableOpacity style={styles.container} onPress={() => this.props.navigation.navigate('MyPostDetails', {item })}>
                            {
                                item.item.post_image === false ? 
                                <Image style={styles.image} source={require('../../../images/emptyImage.jpg')} />
                                :
                                <Image style={styles.image} source={{ uri : item.item.post_image }} />

                            }
                            <View style={styles.content}>
                                <View style={styles.contentHeader}>
                                    <Text  style={styles.name}>{myPost.post_title}</Text>
                                    <Text style={styles.time}>
                                        {postTime}
                                    </Text>
                                </View>
                                <Text rkType='primary3 mediumLine'>{postDetails}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style = {styles.button} onPress={() => this.props.navigation.navigate('EditPost', { item }) }>
                                        <Text style = {{ }}>{I18n.t('MyPost.component.editLabel')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style = {styles.button} onPress={() => this.props.navigation.navigate('MyPostComment', { item: item, userId: this.state.userId }) }>
                                        <Text style = {{ }}>Comment</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style = {styles.button} onPress={() => this.onDeletePost(item) } >
                                        <Text style = {{ }}>{I18n.t('MyPost.component.deleteLabel')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>     
                );
            }}/>
            </View>
        );
    }
}

export default (MyPostComponent);

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:70,
    height:70,
    marginLeft:5
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
  buttonContainer : {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginRight: 10
    },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: '#D3D3D3'
  }
});  