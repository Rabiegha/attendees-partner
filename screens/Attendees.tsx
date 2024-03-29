import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  StatusBar,
} from 'react-native';
import List from '../components/screens/attendees/List';
import Search from '../components/elements/Search';
import ProgressBar from '../components/elements/progress/ProgressBar';
import ProgressText from '../components/elements/progress/ProgressionText';
import globalStyle from '../assets/styles/globalStyle';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderParticipants from '../components/elements/header/HeaderParticipant';
import FiltreComponent from '../components/filtre/FiltreComponent';
import SuccessComponent from '../components/elements/notifications/SuccessComponent';
import {useEvent} from '../components/context/EventContext';

const AttendeesScreen = () => {
  const {eventName} = useEvent();
  console.log('eventId', eventName);
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content'); // Set status bar style to light-content
      return () => {
        // This is useful if this screen has a unique StatusBar style                                                                                                                                                          '); // Reset status bar style when screen loses focus
      };
    }, []),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(-300));
  const [success, setSuccess] = useState(false);
  const [totalListAttendees, setTotalListAttendees] = useState(0);
  const [checkedInAttendees, setCheckedInAttendees] = useState(0);

  const openModal = () => {
    setModalVisible(true);
    // Animate the modal to slide in from the left
    Animated.timing(modalAnimation, {
      toValue: 0, // End position of the modal
      duration: 300, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  const showNotification = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  const closeModal = () => {
    // Animate the modal to slide out to the left
    Animated.timing(modalAnimation, {
      toValue: -300, // Move back to the initial off-screen position
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false)); // Hide the modal after the animation
  };

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Events'}],
    });
  };

  useEffect(() => {
    // Calculate progress when totalAttendees or checkedInAttendees change
    const progress = (checkedInAttendees / totalListAttendees) * 100;
    // Progress calculation might need further adjustment based on your logic
  }, [totalListAttendees, checkedInAttendees]);
  const [filter, setFilter] = useState({
    status: 'all', // all, checked-in, not checked-in
    order: 'mostRecent', // mostRecent, leastRecent
  });
  const updateFilter = newFilter => {
    setFilter(newFilter);
    closeModal(); // Assuming you want to close the modal on filter apply
  };
  const updateProgress = (total, checkedIn) => {
    setTotalListAttendees(total);
    setCheckedInAttendees(checkedIn);
    // Pas besoin de stocker ratio puisqu'il peut être calculé à partir de totalAttendees et checkedInAttendees
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderParticipants onLeftPress={handleGoBack} onRightPress={openModal} Title={eventName} />
      {success && (
        <View style={styles.notification}>
          <SuccessComponent
            onClose={() => setSuccess(null)}
            text={'Votre participation à l’évènement\nà bien été enregistrée'}
          />
        </View>
      )}
      <View style={styles.container}>
        {/* Bouton pour afficher la notification */}
        {/* Affichage conditionnel de la notification */}
      </View>
      <View style={[globalStyle.container, styles.container]}>
        <Search onChange={text => setSearchQuery(text)} />
        <ProgressText
          totalCheckedAttendees={checkedInAttendees}
          totalAttendees={totalListAttendees}
        />
        <ProgressBar
          progress={(checkedInAttendees / totalListAttendees) * 100}
        />
        {/*         <TouchableOpacity onPress={showNotification} style={styles.button}>
          <Text style={styles.buttonText}>Afficher la notification</Text>
        </TouchableOpacity> */}

        <List
          searchQuery={searchQuery}
          onUpdateProgress={updateProgress}
          onShowNotification={showNotification}
        />

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={closeModal}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalView,
                  {transform: [{translateX: modalAnimation}]}, // Use the animated value for the translation
                ]}>
                {
                  <FiltreComponent
                    handlePress={closeModal}
                    filter={filter}
                    setFilter={setFilter}
                  />
                }
              </Animated.View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  eventName: {
    top: 40,
  },
  modalView: {
    width: 300, // Width of the modal
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  notification: {
    zIndex: 50,
  },
});

export default AttendeesScreen;
