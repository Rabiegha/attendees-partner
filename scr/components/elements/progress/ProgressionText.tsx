import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../../colors/colors';

const ProgressText = ({totalAttendees, text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{totalAttendees} </Text>
      <Text style={styles.Text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  Text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.green,
  },
});

export default ProgressText;
