import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import colors from '../../../colors/colors';
import {BASE_URL} from '../../config';
import {onPress} from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';

const ModalComponent = ({
  visible,
  message,
  onClose,
  onPress,
  value,
  onChangeText,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Commentaire</Text>
          <Text style={styles.text}>{message}</Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            placeholder="Entrez votre commentaire ici..."
            value={value} // Bind TextInput to the state variable
            onChangeText={onChangeText}
            placeholderTextColor={colors.grey}
          />
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.buttonText2}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
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
  textArea: {
    width: '100%',
    height: 100,
    backgroundColor: colors.greyCream,
    borderColor: colors.darkGrey,
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    textAlignVertical: 'top',
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.green,
    paddingHorizontal: 110,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  buttonText2: {
    color: colors.green,
  },
});

export default ModalComponent;
