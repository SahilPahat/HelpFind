import React, {Component} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  NetInfo,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
// import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import {LoginManager} from 'react-native-fbsdk';
import {Radio} from 'native-base';

import {
  buttonBackgroundColor,
  backgroundColor,
  textLabelColor,
} from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class SelectLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {
        selectedLanguage: 'en',
        isRTL: false,
      },
    };
  }

  static navigationOptions = {
    header: null,
  };

  onSelectLanguage(index, value) {
    if (value === 'english') {
      this.setState({
        basicData: {
          selectedLanguage: 'en',
          isRTL: false,
        },
      });
    } else {
      this.setState({
        basicData: {
          selectedLanguage: 'ar',
          isRTL: true,
        },
      });
    }
  }

  onConfirmButton = () => {
    // var basicData = this.state.basicData;
    var basicData = {
      selectedLanguage: 'en',
      isRTL: false,
    };

    AsyncStorage.setItem(
      'selectedLanguage',
      JSON.stringify(basicData.selectedLanguage),
    );
    AsyncStorage.setItem('isRTL', JSON.stringify(basicData.isRTL));

    this.props.navigation.navigate('LoginScreen', {basicData});
  };

  render() {
    LoginManager.logOut();

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.ImageContainer}>
            <Image
              source={require('../../images/logo.png')}
              style={styles.logoImage}
            />
          </View>

          <Text style={{fontSize: 22, paddingLeft: 15, color: textLabelColor}}>
            Select Language
          </Text>

          <View
            style={{marginBottom: 50, marginTop: 5, backgroundColor: 'white'}}>
            {/* <RadioGroup
                            onSelect = {(index, value) => this.onSelectLanguage(index, value)}
                            style={{  }}
                            color={buttonBackgroundColor}
                            selectedIndex={0}
                        >
                        <RadioButton value={'english'}>
                            <View style={{ marginLeft: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={require('../../images/english.png')} />
                                <Text style={{ fontSize: 18, marginLeft: 15, color: textLabelColor }}>English / الإنجليزية</Text>
                            </View>
                        </RadioButton>
                        
                        <RadioButton value={'arabic'}>
                            <View style={{ marginLeft: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Image source={require('../../images/flag.jpg')}   style={{ width: 38, height: 38 }}/>
                                <Text style={{ fontSize: 18, marginLeft: 15, color: textLabelColor }}>Arabic / عربى</Text>
                            </View>
                        </RadioButton> 
                        
                        </RadioGroup> */}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => this.onConfirmButton()}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                padding: 15,
                fontSize: 18,
                textAlign: 'center',
              }}>
              CONFIRM / تأكيد
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: backgroundColor,
  },
  container: {
    flex: 1,
  },
  logoImage: {
    width: 400,
    height: 100,
    marginBottom: 20,
  },
  ImageContainer: {
    marginTop: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: buttonBackgroundColor,
    margin: 5,
  },
  footer: {
    backgroundColor: '#eeeeee',
    paddingHorizontal: 10,
    padding: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  block: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '700',
    marginRight: 8,
  },
});
