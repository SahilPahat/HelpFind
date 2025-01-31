import React, { Component } from 'react';
import {
  Text,
  View, 
} from 'react-native';

const NoDataFoundComponent = (props) => {
    return (
        <View style={{ alignItems: 'center', alignSelf: 'center', backgroundColor: '#32dcf7' }}>
          <Text style={{ textAlign : 'center', fontSize: 16, color: 'white' }}>You have type some wrong place. Please type correct place name.</Text>
        </View>
    )
}

export default NoDataFoundComponent;