import React, {useState, useEffect} from 'react';
import { SectionList, StyleSheet } from 'react-native';

import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import useTools from '../hooks/useTools'
import Spacer from '../components/Spacer'
import IconButton from '../components/IconButton'

export default function Profile() {
  const {user = {}} = useAuth()
  const {userTools, getUserTools, deleteTool, refreshing} = useTools()
  const {username, email, id} = user

  useEffect(() => {
    getUserTools()
  }, [])

  const renderPersonalTool = ({ item, index, section: { title, data } }) => (
    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
      <Text key={index}>{item.name}</Text>
      <IconButton name='trash' family='feather' onPress={() => deleteTool(item.id)} />
    </View>
  )

  return (
    <View style={styles.container}>
      <Spacer />
      {user && <User {...{username, email, id}} />}
      <SectionList
        style={styles.sectionList}
        onRefresh={getUserTools}
        refreshing={refreshing}
        renderItem={({item, index, section}) => <Text key={index}>{item.name}</Text>}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{fontWeight: 'bold', paddingBottom: 5}}>{title}</Text>
        )}
        sections={[
          {title: 'Your tools', data: userTools, renderItem: renderPersonalTool},
          {title: 'Lent tools', data: []},
          {title: 'Borrowed tools', data: []},
        ]}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20
  },
  sectionList: {
    width: '100%',
  }
});
