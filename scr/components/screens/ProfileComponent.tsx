import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LabelValueComponent from '../elements/LabelValueComponent';
import colors from '../../../colors/colors';
import {MMKV} from 'react-native-mmkv';
import EventsStats from '../elements/EventsStats';
import axios from 'axios';
import {BASE_URL} from '../../config';

const storage = new MMKV();
const user_id = storage.getString('user_id');

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    fulltName: '',
    email: '',
  });
  useEffect(() => {
    const email = storage.getString('email');
    const fulltName = storage.getString('full_name');

    if (fulltName && email) {
      setUserDetails({fulltName, email});
    }
  }, []);

  return userDetails;
};

const ProfileComponent = () => {
  const [avenirLength, setAvenirLength] = useState(0);
  const [passeesLength, setPasseesLength] = useState(0);
  const [totaleLength, setTotaleLength] = useState(0);
  const [avenirPercentage, setAvenirPercentage] = useState(0);
  const [passeesPercentage, setPasseesPercentage] = useState(0);
  const [evenementsPercentage, setEvenementsPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEventDetails = async () => {
      setIsLoading(true);
      const url = `${BASE_URL}/ajax_get_event_details/?user_id=${user_id}&is_event_from=2`;
      const url1 = `${BASE_URL}/ajax_get_event_details/?user_id=${user_id}&is_event_from=1`;
      const url2 = `${BASE_URL}/ajax_get_event_details/?user_id=${user_id}&is_event_from=0`;

      try {
        const [futureEvents, currentEvents, pastEvents] = await Promise.all([
          axios.get(url1).then(response => response.data.event_details || []),
          axios.get(url).then(response => response.data.event_details || []),
          axios.get(url2).then(response => response.data.event_details || []),
        ]);

        setAvenirLength(futureEvents.length + currentEvents.length);
        setPasseesLength(pastEvents.length);
        setTotaleLength(
          futureEvents.length + currentEvents.length + pastEvents.length,
        );
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getEventDetails();
  }, []);

  useEffect(() => {
    // Adjust percentages based on the event lengths
    const total = avenirLength + passeesLength; // Adjust if necessary for your logic
    if (total > 0) {
      setAvenirPercentage(Math.max(3 + (100 * avenirLength) / total) / 2);
      setPasseesPercentage(Math.max(3 + (100 * passeesLength) / total) / 2);
      setEvenementsPercentage(53); // Adjust this calculation as needed
    } else {
      setAvenirPercentage(3);
      setPasseesPercentage(3);
      setEvenementsPercentage(3);
    }
  }, [avenirLength, passeesLength, totaleLength]);

  const {fulltName, email} = useUserDetails();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/user.png')}
            style={styles.image}
          />
        </View>
        <LabelValueComponent
          label="Nom complet:"
          value={fulltName}
          value2={undefined}
        />
        <LabelValueComponent
          label="Adresse mail:"
          value={email}
          value2={undefined}
        />
        <View style={styles.event}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.green}
              style={styles.loadingIndicator}
            />
          ) : (
            <EventsStats
              Avenir={avenirLength > 0 ? avenirLength : '-'}
              Passees={passeesLength > 0 ? passeesLength : '-'}
              Evenement={totaleLength > 0 ? totaleLength : '-'}
              width1={`${avenirPercentage}%`}
              width2={`${passeesPercentage}%`}
              width3={`${evenementsPercentage}%`}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    height: 600,
  },
  container: {
    top: 30,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 40,
    marginBottom: 40,
  },
  event: {
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 35,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileComponent;
