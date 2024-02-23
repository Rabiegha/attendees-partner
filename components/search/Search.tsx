import React from 'react';
import {View, TextInput, StyleSheet, Dimensions, Image} from 'react-native';
import colors from '../../colors/colors';

const windowWidth = Dimensions.get('window').width;

const Search = ({onChange}) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../../assets/images/icons/Rechercher.png')}
          resizeMode="contain"
          style={{
            width: 23,
            height: 23,
            tintColor: colors.lightGrey,
          }}
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor="#999"
        onChangeText={onChange} // Appel de la fonction onChange lorsque le texte change
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    height: 50,
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1, // Add a 1px border
    borderColor: colors.greyCream, // Set the border colo
    marginTop: -15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10, // Adjust the margin as needed
  },
});

export default Search;