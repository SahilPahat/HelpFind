import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyPostComponent from './component';
import HeaderComponent from '../../../component/headerComponent';
import I18n from '../../../i18n';
import HelpFindAPI from '../../../../config';
import { buttonBackgroundColor, backgroundColor, textLabelColor } from '../../../../env';
import LoadingComponent from '../../../component/loadingComponent';

var { height, width } = Dimensions.get('window');

class Comments extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem("selectedLanguage").then((value) => { 
      return(
        I18n.locale = JSON.parse(value)
      )}
    );

    this.state = {
      data: '',
      IsLoaderVisible : true,
      networkStatus : true,
      noData : false,
      refreshing: false,
      selectedLanguage : 'en'
    }
    this.onStorageDataLoad();
  }

  componentDidMount(){
      this.timer = setInterval(()=> this.allPostLoadDataAPI(), 10000)
   }

  //for load data from AsynchStorage storage
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
    this.allPostLoadDataAPI();
  }

  //to load the data from api
  allPostLoadDataAPI() {


      this.setState({ refreshing : true });

      if(this.props.isConnected) {

        var URL= HelpFindAPI.BASE_URL+'get_all_post_by_userID';

        fetch(URL,  {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "user_id" : this.state.userId,
              "token" : this.state.token
            })
        }).then((response) => response.json()).then((responseJson) => {

              if(responseJson.sucess){
                  if(responseJson.data.length > 0 ){
                    this.setState({ data : responseJson.data })
                    this.setState({ noData : false, IsLoaderVisible: false, networkStatus : true, refreshing : false })
                  } else {
                    this.setState({ noData : true })
                    this.setState({ IsLoaderVisible: false, networkStatus : true, refreshing : false })
                  }
              }else{

                this.setState({ IsLoaderVisible: false, networkStatus : true, noData : false, refreshing : false })
              }
            }).catch((error) => {
              this.setState({ IsLoaderVisible: false, networkStatus : true, noData : false, refreshing : false })

            });
        } else {
          this.setState({ networkStatus : false })
          this.setState({ IsLoaderVisible: false, noData : false, refreshing : false })
        }
  }

  render() {

    if(this.state.IsLoaderVisible){
      return(
        <View style={{ flex : 1 }}>
          <ScrollView>
            <HeaderComponent label={I18n.t('MyPost.index.header')} />
            <View style={{ marginTop: height/3, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={buttonBackgroundColor} />
            </View>
          </ScrollView>
        </View>
      )
    }

    if(this.state.noData){
      return(
        <View style={{ flex: 1   }}>
          <HeaderComponent label={I18n.t('MyPost.index.header')} />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.allPostLoadDataAPI() }
              />
            }
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>{I18n.t('MyPost.index.noDataFound')}</Text>
            </View>
          </ScrollView>
        </View>
      )
    }

    if(!this.state.networkStatus){
      return(
        <View style={{ }}>
          <HeaderComponent label={I18n.t('MyPost.index.header')} />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: buttonBackgroundColor, textAlign : 'center', fontSize: 17 }}>Network not connected, please try again</Text>
              <TouchableOpacity style={{ backgroundColor: 'green', padding: 5, borderRadius : 5 }} onPress={() => this.allPostLoadDataAPI() }>
                <Text style={{ color : 'white' }}>Refresh</Text>
              </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.mainContainer}>
        <HeaderComponent label={I18n.t('MyPost.index.header')} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.allPostLoadDataAPI() }
            />
          }
        >
          <MyPostComponent data={this.state.data} navigation={this.props.navigation} />
        </ScrollView>
          
      </View>
    );
  }
}

export default (Comments);

const styles = StyleSheet.create({
  mainContainer: {
      flex: 1,
  },
}); 