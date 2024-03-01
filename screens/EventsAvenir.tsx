import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import axios from 'axios'; // Assurez-vous d'importer axios
import {MMKV} from 'react-native-mmkv'; // Assurez-vous d'importer MMKV si vous l'utilisez pour le stockage

import Search from '../components/search/Search';
import ListEvents from '../components/events/ListEvents';
import globalStyle from '../assets/styles/globalStyle';

// Assurez-vous que `current_user_login_details_id` est disponible
const current_user_login_details_id = '91'; // Remplacez par l'ID utilisateur actuel

const EventAvenirScreen = ({searchQuery, onPress}) => {
  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const url = `https://ems.choyou.fr/event_api/ajax_get_event_details/?user_id=${current_user_login_details_id}&is_event_from=2`;
        const response = await axios.get(url);
        if (response.data.status) {
          setEventDetails(response.data.event_details);
        } else {
          console.error('Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    getEventDetails();
  }, []);

  const filteredEvents = eventDetails.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.event_id.toString()}
        renderItem={({item}) => {
          console.log(item.event_name); // Add this line to display the details of each item
          return (
            <ListEvents
              eventName={item.event_name} // Pass the event name directly as a prop
              searchQuery={searchQuery}
              onPress={() => onPress(item)}
              eventDate={item.nice_start_datetime}
              eventType={item.event_type_name}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 2,
  },
  // Autres styles si nécessaire
});

export default EventAvenirScreen;
