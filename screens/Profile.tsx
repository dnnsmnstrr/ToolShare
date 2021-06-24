import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import useTools from '../hooks/useTools'

export default function Profile() {
  const {user = {}} = useAuth()
  const {userTools, getUserTools} = useTools()
  const {username, email, id} = user

  useEffect(() => {
    getUserTools()
  }, [])
  return (
    <View style={styles.container}>
      {user && <User {...{username, email, id}} />}
      {userTools && userTools.map((tool, index) => <Text key={index}>{tool.name}</Text>)}
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
