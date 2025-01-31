import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { buttonBackgroundColor } from '../../env';

const Header = (props) => {
    const label = props.label;
    var other = props.other
    return (
        <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
            <TouchableOpacity style={{ flex: 1, marginLeft: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => other.goBack()}>
                <Image style={{ width: 20, height: 20 }} source={require('../images/back.png')}/>
                <Text style={{ color : 'white', fontSize : 16 }}>Back</Text>
            </TouchableOpacity>
            <View style={{ flex: 2.5, alignItems: 'center'}}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{label}</Text>
            </View>
            <View style={{ flex: 1 }} />
        </View>
    );
}

export default Header;