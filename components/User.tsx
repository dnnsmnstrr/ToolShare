import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View, TextInput } from './Themed';

const InfoItem = ({label, value}) => <View style={{ flexDirection: 'row' }}>
  <Text>{label}: </Text>
  <TextInput value={String(value)} />
</View>
export default function User({ email, id }: { email: string }) {
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text>Email: </Text>
        <TextInput value={email} />
      </View>
      <InfoItem label='id' value={id} />
    </View>
  );
}

const styles = StyleSheet.create({

});
