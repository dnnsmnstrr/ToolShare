import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View, TextInput } from './Themed';

export default function User({ email }: { email: string }) {
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text>Email: </Text>
        <TextInput value={email} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});
