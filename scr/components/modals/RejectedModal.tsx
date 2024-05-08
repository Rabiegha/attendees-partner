import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import axios from 'axios';
import colors from '../../../colors/colors';
import {BASE_URL} from '../../config';
import {onPress} from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';

const RejectedModal = ({
  visible,
  message,
  onClose,
  onPress, // Make sure this prop is passed correctly and used for a meaningful action
  value,
  onChangeText,
  isValidationMessageVisible,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>{message}</Text>
          <Image
            source={require('../../assets/images/Rejected.gif')}
            style={styles.gifStyle}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    top: 200,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    marginBottom: 10,
  },
  gifStyle: {
    height: 100,
    width: 100,
  },
  accepted: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RejectedModal;
