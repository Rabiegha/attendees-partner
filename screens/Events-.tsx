import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import EventComponent from '../components/events/EventsComponent';
import Search from '../components/search/Search';

const EventsScreen = ({navigation}) => {
  const navigateToMainScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Tabs'}],
    });
  };
  return (
    <View style={[globalStyle.backgroundWhite]}>
      <View style={globalStyle.container}>
        <EventComponent navigation={undefined} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#000',
  },
});

export default EventsScreen;