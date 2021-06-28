import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View, TextInput } from './Themed';

const InfoItem = ({label, value, onChange}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  {onChange ? <TextInput onChangeText={onChange} value={String(value)} /> : <Text>{value}</Text>}
</View>

export default function User({onChangeUser, ...info}) {
  return (
    <View style={styles.container}>
      {Object.keys(info).map((key) => <InfoItem key={key} label={key} value={info[key]} onChange={onChangeUser ? (text) => onChangeUser(key, text) : null} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  }
});
