import React, {useState, useEffect} from 'react';
import { Switch, StyleSheet } from 'react-native';

import { Text, View, TextInput } from '../components/Themed';
import IconButton from '../components/IconButton';
import {families} from '../components/Icon';
import Spacer from '../components/Spacer';
import Select from '../components/Select';
import RoundedButton from '../components/RoundedButton';
import User from '../components/User';
import useAuth from '../hooks/useAuth'

const DEV_MODE = false
const options = DEV_MODE ? Object.keys(families).map(family => ({value: family, label: family})) : []
export default function Settings() {
  const {user, authorizedRequest, API_URL} = useAuth()
  const [editedUser, setEditedUser] = useState(user)
  const [icon, setIconName] = useState('error')
  const [selectedFamily, setSelectedFamily] = useState(options.length ? options[0].value : null)
  const [outlined, setOutlined] = useState(false)

  useEffect(() => {
    const {username, email} = user || {}
    setEditedUser({username, email})
  }, [user])

  const onChangeUser = (key, value) => {
    const newUser = {...editedUser}
    newUser[key] = value
    setEditedUser(newUser)
  }

  const updateUser = async () => {
    const updatedUser = {...user, ...editedUser}
    const res = await authorizedRequest('api/user/edit', updatedUser, 'PUT')
    console.log('res', res)
  }

  return (
    <View style={styles.container}>
      {editedUser && <User {...editedUser} onChangeUser={onChangeUser}/>}
      <RoundedButton title='Speichern' onPress={updateUser} style={{ marginTop: 10 }} />
      {DEV_MODE && <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={styles.listItem}>
          <TextInput value={icon} onChangeText={setIconName} />
          <IconButton name={icon} family={selectedFamily} focused={!outlined}/>
        </View>
        <View style={styles.listItem}>
          <Text>Outlined</Text>
          <Switch value={outlined} onValueChange={setOutlined}/>
        </View>
        <Select options={options} selectedValue={selectedFamily} onChange={setSelectedFamily} />
        <View style={styles.listItem}>
          <Text>Backend-URL: </Text>
          <Text>{API_URL}</Text>
        </View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listItem: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
