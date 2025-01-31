import React, { Component } from 'react';
import {  ScrollView, View, NetInfo, Image, Text, Platform, Styles, TouchableOpacity } from 'react-native';
import { buttonBackgroundColor } from '../../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HeaderWithBackButton from '../../component/headerComponentWithBackButton';

import I18n from '../../i18n';

export default class RegistrationAddress extends Component {
    render(){
        const navigation = this.props.navigation;
        AsyncStorage.getItem("selectedLanguage").then((value) => { 
            return(
              I18n.locale = JSON.parse(value)
            )}
        );
        return(
            <View style={{ flex: 1 }}>
                <HeaderWithBackButton label={I18n.t('addressSelectpage.AddressPageHeader')} other={navigation} />
                
                
                    <Text style={{ fontSize: 17, padding: 10 }}>
                        {I18n.t('addressSelectpage.AddressPageTitle')}
                    </Text>
                    <GooglePlacesAutocomplete
                        placeholder={I18n.t('addressSelectpage.AddressPagePlaceholder')}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed='auto'
                        fetchDetails={true}
                        renderDescription={(row) => {
                                //for calculate city Name.
                                var fullAddress = row.description;
                                return(
                                    fullAddress
                                )
                            }
                        }
                        onPress={(data, details = null) => { 
                            var fullAddress = data.description;
                            var addressCityName = data.terms[0].value;
                            var addressCountryName = data.terms[data.terms.length - 1];
                            var addressStateName = '';
                            if(data.terms.length > 2){
                                addressStateName = data.terms[1].value;
                            }

                            this.props.navigation.navigate('Registration', {fullAddress, addressCityName, addressCountryName, addressStateName} )
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