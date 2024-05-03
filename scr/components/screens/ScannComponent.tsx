import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import {EventProvider, useEvent} from '../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import {BASE_URL} from '../../config';
import CommentModal from '../modals/CommentModal';
import {MMKV} from 'react-native-mmkv';
import Sound from 'react-native-sound';

const storage = new MMKV();

const ScannerComponent = () => {
  const [userId, setUserId] = useState(
    storage.getString('current_user_login_details_id'),
  );
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [attendeeId, setAttendeeId] = useState(null);
  const [comment, setComment] = useState('');
  const {triggerListRefresh, eventId} = useEvent();
  const [isValidationMessageVisible, setIsValidationMessageVisible] =
    useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAlertClose = () => {
    setModalVisible(false);
    setAlertVisible(false);
    triggerListRefresh();
  };
  const onSuccess = e => {
    if (!alertVisible) {
      const data = e.data;
      const payload = {
        event_id: eventId,
        name: data,
      };
      const apiUrl = `${BASE_URL}/ajax_join_attendee/?current_user_login_details_id=${userId}&event_id=${payload.event_id}&content=${data}`;

      axios
        .post(apiUrl, payload)
        .then(response => {
          setAlertVisible(true);
          if (response.data.status === true) {
            setAttendeeId(response.data.attendee_details.attendee_id);
            setModalMessage('Participation enregistrée.');
            setModalVisible(true);
          } else {
            setModalMessage("Impossible d'enregistrer la participation.");
            setModalVisible(true);
          }
        })
        .catch(error => {
          setModalMessage('Erreur de réseau, veuillez réessayer.');
          setModalVisible(true);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAlertVisible(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddComment = async () => {
    const apiUrl = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&comment=${encodeURIComponent(
      comment,
    )}`;
    try {
      const response = await axios.post(apiUrl);
      if (response.data.status) {
        playSound();
        setIsValidationMessageVisible(true);
        setTimeout(() => {
          setIsValidationMessageVisible(false);
          setModalVisible(false);
          setAlertVisible(false);
          triggerListRefresh();
        }, 2000); // Hide the modal and message after 2 seconds
        console.log('Enregistrement réussi:', response.data);
      } else {
        console.error('Enregistrement échoué:', response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
    Keyboard.dismiss();
    setModalVisible(false);
    setAlertVisible(false);
    triggerListRefresh();
    setComment('');
  };
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const playSound = () => {
    const sound = new Sound(
      '../../../assets/sounds/Success.mp3',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        sound.play(() => sound.release()); // Play the sound and release it after playing
      },
    );
  };

  return (
    <EventProvider>
      <TouchableOpacity style={styles.play} onPress={playSound}>
        <Text>Play Sound</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback
        onPress={handleDismissKeyboard}
        accessible={false}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.container}>
            <HeaderComponent
              title={'Scan QR Code'}
              color={colors.greyCream}
              handlePress={handleBackPress}
            />
            {!alertVisible && (
              <QRCodeScanner
                onRead={onSuccess}
                bottomContent={<View />}
                showMarker={true}
                checkAndroid6Permissions={true}
                cameraStyle={styles.cameraStyle}
                customMarker={<CustomMarker />}
              />
            )}
            <CommentModal
              visible={modalVisible}
              message={modalMessage}
              onClose={handleAlertClose}
              onPress={handleAddComment}
              value={comment}
              onChangeText={setComment}
              isValidationMessageVisible={undefined}
              validationMessage={undefined}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </EventProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  overlay: {
    flex: 1,
  },
  cameraStyle: {
    flex: 1, // This ensures it expands
    height: '96%', // This ensures it uses the full height
    top: 40,
  },
});
export default ScannerComponent;
