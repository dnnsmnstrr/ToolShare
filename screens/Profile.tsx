import React, {useState, useEffect} from 'react';
import { Alert, SectionList, StyleSheet, Switch, TouchableHighlight } from 'react-native';
import User from '../components/User';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import {useTools, useLoan} from '../hooks'
import Spacer from '../components/Spacer'
import IconButton from '../components/IconButton'
import SwipeableRow from '../components/SwipeableRow'

export default function Profile({navigation}) {
  const {user = {}} = useAuth()
  const {userTools, getUserTools, setSelectedTool, deleteTool, toggleAvailability, refreshing: refreshingTools} = useTools()
  const {userLoans, getLoans, getUserLoans, cancelLoan, refreshing: refreshingLoans} = useLoan()
  const refreshing = refreshingTools || refreshingLoans
  const {username, email, id} = user

  useEffect(() => {
    getUserTools()
    getLoans()
    getUserLoans()
  }, [])


  const renderPersonalTool = ({ item, index, section: { title, data } }) => {
    const onDelete = () => {
      Alert.alert(
        'Werkzeug löschen',
        `Sind sie sicher dass sie ${item.name} löschen wollen?`,
        [
          {text: 'Abbrechen', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Löschen', onPress: () => deleteTool(item.id), style: 'destructive'},
        ],
        { cancelable: false }
      )
    }
    return <SwipeableRow onDelete={onDelete}>
      <TouchableHighlight onPress={() => {
        setSelectedTool(item)
        navigation.navigate('ToolEdit')
      }}>
        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <Text key={index}>{item.name}</Text>
          <Switch value={item.available} onValueChange={() => toggleAvailability(item.id, !item.available)} />
        </View>
      </TouchableHighlight>
    </SwipeableRow>
  }

  const renderLoan = ({ item, index, section: { title, data } }) => {
    return <SwipeableRow onDelete={() => {
      cancelLoan(item.id)}}>
        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <Text>{item.tool.name} {item.requestAccepted ? '(geliehen)' : '(Anfrage offen)'}</Text>
          <Text>{item.loanDays} Tage</Text>
        </View>
    </SwipeableRow>
  }

  const renderRequest = ({ item, index, section: { title, data } }) => {
    return <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
      <Text>{item.tool.name} {item.requestAccepted ? '(geliehen)' : '(Anfrage offen)'}</Text>
      <View style={{ flexDirection: 'row' }}>
        <IconButton name='check' family='feather' style={{ backgroundColor: 'green', width: 45}} color='white' rounded />
        <Spacer width={10} />
        <IconButton name='close' family='ant' style={{ backgroundColor: 'red', width: 45}} color='white' rounded />
      </View>
    </View>
  }

  const onRefresh = () => {
    getUserTools()
    getUserLoans()
  }

  return (
    <View style={styles.container}>
      <Spacer />
      {user && <User {...{username, email}} />}
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
          {title: 'Angefragt', data: [{tool: {name: 'test'}, requestAccepted: true}], renderItem: renderRequest},
          {title: 'Verliehen', data: [], renderItem: renderPersonalTool},
          {title: 'Deine Leihen', data: userLoans, renderItem: renderLoan},
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
