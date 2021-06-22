import React, {useState, useEffect} from 'react';
import { Switch, StyleSheet } from 'react-native';

import { Text, View, TextInput } from '../components/Themed';
import IconButton from '../components/IconButton';
import {families} from '../components/Icon';
import Spacer from '../components/Spacer';
import Select from '../components/Select';
import useAuth from '../hooks/useAuth'

const DEV_MODE = true
const options = DEV_MODE ? Object.keys(families).map(family => ({value: family, label: family})) : []
export default function Settings() {
  const {user, logout} = useAuth()
  const [icon, setIconName] = useState('error')
  const [selectedFamily, setSelectedFamily] = useState(options[0].value)
  const [outlined, setOutlined] = useState(false)
  return (
    <View style={styles.container}>
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
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
