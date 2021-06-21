import React, {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function TabTwoScreen() {
  const {getUser} = useAuth()
  const [email, setEmail] = useState()
  const updateUser = async () => {
    const user = await getUser()
    if (user && user.email) {
      setEmail(user.email)
    }
  }
  useEffect(() => {
    updateUser()
  }, [])

  return (
    <View style={styles.container}>
      <User path="/screens/TabTwoScreen.tsx" email={email} />
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
