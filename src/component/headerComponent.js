import React, { Component } from 'react';
import { ScrollView, View, Text, Platform } from 'react-native';
import { buttonBackgroundColor } from '../../env';

const Header = (props) => {
    const label = props.label;
    return (
        <View style={{ height: 60, flexDirection: 'row', alignItems:'center', backgroundColor: buttonBackgroundColor, paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0 }}>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 2, alignItems: 'center'}}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{label}</Text>
            </View>
            <View style={{ flex: 1 }} />
        </View>
    );
}

export default Header;