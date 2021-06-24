import React, {useState, useEffect} from 'react';
import { Animated, Alert, SectionList, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler';
import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import useTools from '../hooks/useTools'
import Spacer from '../components/Spacer'
import IconButton from '../components/IconButton'
import SwipeableRow from '../components/SwipeableRow'

export default function Profile() {
  const {user = {}} = useAuth()
  const {userTools, getUserTools, deleteTool, refreshing} = useTools()
  const {username, email, id} = user

  useEffect(() => {
    getUserTools()
  }, [])


  const renderPersonalTool = ({ item, index, section: { title, data } }) => {

    return <SwipeableRow >
      <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 }}>
        <Text key={index}>{item.name}</Text>
        <IconButton name='trash' family='feather'
          onPress={() => Alert.alert(
            'Werkzeug löschen',
            `Sind sie sicher dass sie ${item.name} löschen wollen?`,
            [
              {text: 'Abbrechen', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Löschen', onPress: () => deleteTool(item.id), style: 'destructive'},
            ],
            { cancelable: false }
          )}
        />
      </View>
    </SwipeableRow>
  }

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
          <Text style={{fontWeight: 'bold', paddingBottom: 5, paddingHorizontal: 20}}>{title}</Text>
        )}
        sections={[
          {title: 'Your tools', data: userTools, renderItem: renderPersonalTool},
          {title: 'Requested tools', data: []},
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
  },
  sectionList: {
    width: '100%',
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
});
