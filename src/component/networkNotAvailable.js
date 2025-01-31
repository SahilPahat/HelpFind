import React from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';


const NetworkNotAvailableComponent = () => {
    return (
        <View style={{ alignItems: 'center', alignSelf: 'center', backgroundColor: '#32dcf7', }}>
            <Text style={{ color : 'white' }}>Something went wrong! Please check your internet connection.</Text>
        </View>
    )
}

export default NetworkNotAvailableComponent;
//<Image source={require('../images/oops.jpg')} style={{ width: 150, height: 150 }}/>

