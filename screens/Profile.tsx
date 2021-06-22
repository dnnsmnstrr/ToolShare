import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function Profile() {
  const {user = {}} = useAuth()
  const {username, email, id} = user

  return (
    <View style={styles.container}>
      {user && <User {...{username, email, id}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
});
