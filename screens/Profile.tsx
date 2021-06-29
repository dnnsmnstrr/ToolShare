import React, {useState, useEffect} from 'react';
import { Alert, SectionList, StyleSheet, Switch, TouchableHighlight } from 'react-native';
import User from '../components/User';
import { Text, TextBackground, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import {useTools, useLoan, useInfo} from '../hooks'
import Spacer from '../components/Spacer'
import IconButton from '../components/IconButton'
import SwipeableRow from '../components/SwipeableRow'
import Separator from '../components/Separator'

export default function Profile({navigation}) {
  const {user = {}} = useAuth()
  const {isAndroid} = useInfo()
  const {userTools, getUserTools, setSelectedTool, deleteTool, toggleAvailability, refreshing: refreshingTools} = useTools()
  const {
    userLoans,
    getUserLoans,
    requests,
    getRequests,
    cancelLoan,
    setLoanStatus,
    refreshing: refreshingLoans
  } = useLoan()
  const refreshing = refreshingTools || refreshingLoans
  const {username, email, id} = user

  useEffect(() => {
    getUserTools()
    getUserLoans()
    getRequests()
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
          <Switch value={item.available} onValueChange={() => toggleAvailability(item.id, !item.available)} trackColor={{false: isAndroid ? 'grey' : null, true: 'green'}} thumbColor='white' />
        </View>
      </TouchableHighlight>
    </SwipeableRow>
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case 'accepted':
        return 'geliehen'
      case 'denied':
        return 'abgelehnt'
      default:
        return 'angefragt'
    }
  }
  const renderLoan = ({ item, index, section: { title, data } }) => {
    const opacity = item.loanStatus === 'accepted' ? 1 : 0.7
    return <SwipeableRow onDelete={() => {
      cancelLoan(item.id)}}>
        <View style={{
          flexDirection: 'row',
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10 ,
        }}>
          <Text style={{ opacity }}>{item.tool.name} ({getStatusDescription(item.loanStatus)})</Text>
          <Text style={{ opacity }}>{item.loanDays} Tage</Text>
        </View>
    </SwipeableRow>
  }

  const renderRequest = ({ item, index, section: { title, data } }) => {
    console.log('item', item)
    return <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
      <Text>{item.tool.name} {item.requestAccepted ? '(geliehen)' : '(Anfrage offen)'}</Text>
      <View style={{ flexDirection: 'row' }}>
        <IconButton
          name='check'
          family='feather'
          style={{ backgroundColor: 'green', width: 45}}
          color='white'
          rounded
          onPress={() => setLoanStatus(item.id, 'accepted')}
        />
        <Spacer width={10} />
        <IconButton
          name='close'
          family='ant'
          style={{ backgroundColor: 'red', width: 45}}
          color='white'
          rounded
          onPress={() => setLoanStatus(item.id, 'denied')}
        />
      </View>
    </View>
  }

  const onRefresh = () => {
    getUserTools()
    getUserLoans()
    getRequests()
  }

  const onLoan = requests.filter((loan) => loan.loanStatus === 'accepted')
  const openRequests = requests.filter((loan) => !['accepted', 'denied'].includes(loan.loanStatus))

  return (
    <View style={styles.container}>
      <Spacer />
      {user && <User {...{username, email}} />}
      <Separator />
      <SectionList
        style={styles.sectionList}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({item, index, section}) => <Text key={index}>{item.name}</Text>}
        renderSectionHeader={({section: {title}}) => (
          <TextBackground style={{fontWeight: 'bold', paddingBottom: 5, paddingHorizontal: 20}}>{title}</TextBackground>
        )}
        sections={[
          {title: 'Your tools', data: userTools, renderItem: renderPersonalTool},
          {title: 'Angefragt', data: openRequests, renderItem: renderRequest},
          {title: 'Verliehen', data: onLoan, renderItem: renderLoan},
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
