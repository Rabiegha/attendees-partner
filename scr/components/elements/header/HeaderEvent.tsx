import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../colors/colors';
import SmallButton from '../buttons/SmallButton';

const HeaderEvent = ({onLeftPress, onRightPress, opacity}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onLeftPress}
        style={[styles.backButton, {opacity: opacity}]}>
        <Image
          source={require('../../../assets/images/icons/Retour.png')}
          style={styles.buttonImageBlack}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
        <Image
          source={require('../../../assets/images/icons/Log-out.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    top: 30,
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items to start
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    position: 'relative',
    maxHeight: 60,
    height: 60,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
  buttonImage: {
    width: 23,
    height: 23,
    tintColor: colors.red,
    zIndex: 2,
  },
  buttonImageBlack: {
    width: 15,
    height: 23,
    tintColor: colors.green,
    zIndex: 2,
  },
});

export default HeaderEvent;
