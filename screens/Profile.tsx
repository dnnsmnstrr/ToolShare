import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function TabTwoScreen() {
  const {user} = useAuth()
  useEffect(() => console.log('user', user), [user])
  return (
    <View style={styles.container}>
      {user && <User path="/screens/TabTwoScreen.tsx" {...user} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
