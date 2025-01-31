import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ImageBackground
  } from 'react-native';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
  } from 'react-native-indicators';
  import { buttonBackgroundColor } from '../../env';

const LoadingComponent = () => {
    return (    
        <ImageBackground source={require('../images/backgroundImage.png')} style={{ flex : 1 }}>
          <View style={{ flex : 1, top: 140 }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </ImageBackground>
    )
}

export default LoadingComponent;

/*
<View style={{ alignItems: 'center', alignSelf: 'center', backgroundColor: buttonBackgroundColor }}>
            <SkypeIndicator size={40} color="white" />
        </View>
*/
