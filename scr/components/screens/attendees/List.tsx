import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import ListItem from './ListItem';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useEvent} from '../../context/EventContext';
import ProgressBar from '../../../../components/elements/progress/ProgressBar';
import colors from '../../../../colors/colors';
import {BASE_URL} from '../../../config';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();
const List = ({searchQuery, onUpdateProgress, filterCriteria}) => {
  const [userId, setUserId] = useState(
    storage.getString('current_user_login_details_id'),
  );
  const [filteredData, setFilteredData] = useState([]);
  const {refreshList} = useEvent();
  const flatListRef = useRef(null);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalCheckedAttendees, setTotalCheckedAttendees] = useState(0);
  const {eventId} = useEvent();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log('event id', eventId);

  // Callback function to handle switch toggle in ListItem
  const handleSwitchToggle = () => {
    // Update your data here based on the itemId and newValue
    // For now, just log the values
  };

  useEffect(() => {
    const fetchAllEventAttendeeDetails = async () => {
      setIsLoading(true);
      try {
        const url = `${BASE_URL}/ajax_get_event_attendee_details/?event_id=${eventId}&current_user_login_details_id=${userId}&status_id=2`;
        const url1 = `${BASE_URL}/ajax_get_event_attendee_details/?event_id=${eventId}&current_user_login_details_id=${userId}&status_id=2`;
        const response = await axios.get(url);
        const response1 = await axios.get(url1);

        if (response.data.status) {
          let attendees = response.data.event_attendee_details;
          let attendees1 = response1.data.event_attendee_details;

          // Appliquez les filtres basés sur filterCriteria ici
          if (filterCriteria) {
            if (filterCriteria.status === 'checked-in') {
              attendees = attendees.filter(
                attendee => attendee.attendee_status == 1,
              );
            } else if (filterCriteria.status === 'not-checked-in') {
              attendees = attendees.filter(
                attendee => attendee.attendee_status == 0,
              );
            }
            // Ajoutez ici toute logique de filtrage supplémentaire
          }

          // Triez les participants pour que ceux avec attendee_status = 2 soient en bas
          attendees.sort((a, b) => {
            if (a.attendee_status == 1 && b.attendee_status != 1) {
              return 1;
            }
            if (b.attendee_status == 1 && a.attendee_status != 1) {
              return -1;
            }
            return 0; // Aucun changement dans l'ordre pour les autres cas
          });

          // Filtrez davantage par searchQuery si fourni
          attendees = attendees.filter(attendee =>
            `${attendee.first_name} ${attendee.last_name}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          );

          setFilteredData(attendees);
          setTotalAttendees(attendees1.length);
          setTotalCheckedAttendees(
            attendees1.filter(a => a.attendee_status === '1').length,
          );
          setHasData(attendees.length > 0);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching attendee details:', error);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEventAttendeeDetails();
  }, [eventId, searchQuery, refreshList, filterCriteria]); // Assurez-vous d'inclure filterCriteria dans le tableau des dépendances

  useEffect(() => {
    // Update progress only after fetching and state updates to avoid premature calculation
    const ratio =
      totalAttendees > 0 ? (totalCheckedAttendees / totalAttendees) * 100 : 0;
    onUpdateProgress(totalAttendees, totalCheckedAttendees, ratio);
  }, [totalAttendees, totalCheckedAttendees, onUpdateProgress]);

  // Calculate the ratio of checked-in attendees to the total number of attendees

  return (
    <View style={styles.list}>
      {isLoading ? (
        <ActivityIndicator color={colors.green} size="large" />
      ) : hasData ? (
        <FlatList
          ref={flatListRef}
          contentContainerStyle={styles.contentContainer}
          data={filteredData}
          keyExtractor={item => `${item.id}_${item.attendee_status}`}
          renderItem={({item}) => (
            <ListItem
              item={item}
              searchQuery={searchQuery}
              onSwitchToggle={handleSwitchToggle}
            />
          )}
        />
      ) : (
        <View style={styles.noDataView}>
          <Image
            source={require('../../../assets/images/empty.gif')}
            style={styles.gifStyle}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    height: 600,
  },
  contentContainer: {
    paddingBottom: 200, // Adjust this value based on the height of your bottom tab bar
  },
  gifStyle: {
    height: 300,
    width: 300,
  },
});

export default List;
