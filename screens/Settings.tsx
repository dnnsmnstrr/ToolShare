import React, {useState, useEffect} from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function Settings() {
  const {getUser, logout} = useAuth()
  const refreshUser = async () => {
    const user = await getUser()
    if (user && user.email) {
      setEmail(user.email)
    }
  }
  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <View style={styles.container}>
      <Button onPress={logout} title='Logout' color='red'/>
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
