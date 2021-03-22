import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function TabTwoScreen() {
  const {getUser} = useAuth()
  const [email, setEmail] = useState()
  const updateUser = async () => {
    const user = await getUser()
    console.log('user', user);
    if (user && user.email) {
      setEmail(user.email)
    }
  }
  useEffect(() => {
    updateUser()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text style={styles.title}>{email}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
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
