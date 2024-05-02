import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../colors/colors';
import axios from 'axios';
import {useEvent} from '../../context/EventContext';
import CustomSwitch from '../../elements/Switch';
import { BASE_URL } from '../../../config';

const ListItem = React.memo(({item, searchQuery}) => {
  const navigation = useNavigation();
  const {triggerListRefresh} = useEvent();
  const {eventId} = useEvent();

  // Convert attendee_status to boolean for the initial state of the switch
  // Assuming attendee_status is 1 for "on" and 0 for "off"
  const initialSwitchState = item.attendee_status == 1;
  const [isSwitchOn, setIsSwitchOn] = React.useState(initialSwitchState);

  const handleSwitchToggle = async newValue => {
    setIsSwitchOn(newValue);
    const newAttendeeStatus = newValue ? 1 : 0;

    // Construct the payload for the API call
    const payload = {
      event_id: item.event_id,
      attendee_id: item.id,
      attendee_status: newAttendeeStatus,
    };
    console.log(payload.attendee_status);

    // API endpoint for updating attendee status
    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${payload.event_id}&attendee_id=${payload.attendee_id}&attendee_status=${payload.attendee_status}`;

    try {
      // Example of a POST request to update the attendee status
      // You might need to adjust headers or the request format based on your API's specifications
      const response = await axios.post(url);

      // Check if the update was successful
      if (response.data.status) {
        console.log(
          'Attendee status updated successfully:',
          response.data.message,
        );
      } else {
        console.error(
          'Failed to update attendee status:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('Error updating attendee status:', error);
    }
    triggerListRefresh();
  };

  const highlightSearch = (text, query) => {
    if (!query.trim()) {
      return <Text style={{color: 'black'}}>{text}</Text>;
    }

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts
      .filter(part => part)
      .map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={{color: colors.green, fontWeight: 'bold'}}>
            {part}
          </Text>
        ) : (
          <Text key={index} style={{color: 'black'}}>
            {part}
          </Text>
        ),
      );
  };

  const handleItemPress = () => {
    navigation.navigate('More', {
      attendeeId: item.id,
      eventId: item.event_id,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      phone: item.phone,
      attendeeStatus: item.attendee_status,
      organization: item.organization,
      comment: item.comment,
    });
  };

  return (
    <TouchableOpacity onPress={handleItemPress}>
      <View style={styles.listItemContainer}>
        <Text style={styles.itemName}>
          {highlightSearch(`${item.first_name} ${item.last_name}`, searchQuery)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  listItemContainer: {
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 15,
    marginBottom: 10,
    width: 350,
  },
  itemName: {
    fontSize: 16,
    color: 'black',
  },
  switch: {
    display: 'none',
  }
});

export default ListItem;
