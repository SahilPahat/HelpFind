import React, { Component } from 'react';
import {  ScrollView, View, NetInfo, Image, Text, Platform, Styles, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HeaderWithBackButton from '../../../component/headerComponentWithBackButton';

import I18n from '../../../i18n';

export default class UserProfileCity extends Component {
    render(){
        const navigation = this.props.navigation;
        AsyncStorage.getItem("selectedLanguage").then((value) => { 
            return(
              I18n.locale = JSON.parse(value)
            )}
        );
        return(
            <View style={{ flex: 1 }}>
                <HeaderWithBackButton label={I18n.t('citySelectpage.CityPageHeader')} other={navigation} />
                
                
                    <Text style={{ fontSize: 17, padding: 10 }}>
                        {I18n.t('citySelectpage.CityPageTitle')}
                    </Text>
                    <GooglePlacesAutocomplete
                        placeholder={I18n.t('citySelectpage.CityPagePlaceholder')}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed='auto'
                        fetchDetails={true}
                        renderDescription={(row) => {
                                //for calculate city Name.
                                var cityName = row.terms[0].value;
                                return(
                                    cityName
                                )
                            }
                        }
                        onPress={(data, details = null) => { 
                            const cityName = data.terms[0].value;
                            this.props.navigation.navigate('EditProfile', {cityName} )
                        }}
                        
                        getDefaultValue={() => ''}
                        
                        query={{
                            key: 'AIzaSyAjKCVJA0JTMjT3ccJXNF3PTG4BnXGdYUs',
                            language: 'en',
                            types: '(cities)'
                        }}
                        
                        styles={{
                            textInputContainer: {
                                width: '95%',
                                margin: 10,
                                marginTop: 0
                            },
                            description: {
                                fontWeight: 'bold'
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            }
                        }}
                        currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GoogleReverseGeocodingQuery={{
                        }}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                            types: 'food'
                        }}
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                        debounce={200}
                    />
            </View>
        )
    }
}