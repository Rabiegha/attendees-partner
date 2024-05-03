import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import {EventProvider, useEvent} from '../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import {BASE_URL} from '../../config';
import ModalComponent from '../modals/CommentModal';
import {MMKV} from 'react-native-mmkv';

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

  return (
    <TouchableWithoutFeedback
      onPress={handleDismissKeyboard}
      accessible={false}>
      <View style={styles.container}>
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
            cameraStyle={{height: '98%', top: 30}}
            customMarker={<CustomMarker />}
          />
        )}
        <ModalComponent
          visible={modalVisible}
          message={modalMessage}
          onClose={handleAlertClose}
          onPress={handleAddComment}
          value={comment}
          onChangeText={setComment}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});

export default ScannerComponent;