import {
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ScannerComponent from '../components/screens/ScannComponent.tsx';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';

const QRCodeScannerScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content'); // Set status bar style to light-content
      return () => {
        StatusBar.setBarStyle('default'); // Reset status bar style when screen loses focus
      };
    }, []),
  );
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <View style={{flex: 1}}>
      <ScannerComponent />
    </View>
  );
};

export default QRCodeScannerScreen;
