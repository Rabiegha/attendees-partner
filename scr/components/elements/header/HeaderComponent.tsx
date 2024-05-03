import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../colors/colors';

const HeaderComponent = ({title, handlePress, color}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handlePress} style={styles.backButton}>
        <Image
          source={require('../../../assets/images/icons/Retour.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      {/* Title is absolutely positioned to ensure it's centered */}
      <Text style={[styles.title, {color}]}>{title}</Text>
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
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  title: {
    top: 25,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    justifyContent: 'center',
    padding: 10,
    zIndex: 10,
  },
  buttonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
});

export default HeaderComponent;
