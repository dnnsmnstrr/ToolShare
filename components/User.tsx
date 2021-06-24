import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View, TextInput } from './Themed';

const InfoItem = ({label, value}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  <TextInput value={String(value)} />
</View>

export default function User(info) {
  return (
    <View style={styles.container}>
      {Object.keys(info).map((key) => <InfoItem key={key} label={key} value={info[key]} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  }
});
