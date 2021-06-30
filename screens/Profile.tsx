import React, {useState, useEffect} from 'react';
import { Alert, SectionList, StyleSheet, Switch, TouchableHighlight } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import User from '../components/User';
import { Text, TextBackground, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import {useTools, useLoan, useInfo} from '../hooks'
import Spacer from '../components/Spacer'
import IconButton from '../components/IconButton'
import SwipeableRow from '../components/SwipeableRow'
import Separator from '../components/Separator'
import Colors from '../constants/Colors';

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
          <Switch
            value={item.available}
            disabled={requests.some((loan) => loan.tool.id === item.id && loan.loanStatus === 'accepted')}
            onValueChange={() => toggleAvailability(item.id, !item.available)} trackColor={{false: isAndroid ? 'grey' : null, true: 'green'}} thumbColor='white' />
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
      case 'returned':
        return 'zurückgegeben'
      default:
        return 'angefragt'
    }
  }
  const renderLoan = ({ item, index, section: { title, data } }) => {
    const opacity = item.loanStatus === 'accepted' ? 1 : 0.7
    return <SwipeableRow disabled={item.loanStatus === 'accepted'} deleteText={['denied', 'returned'].includes(item.loanStatus) ? 'Löschen' : 'Abbrechen'} onDelete={() => {
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

  const handleAccept = async (loan) => {
    const requestDate = new Date(loan.requestDate)
    const {status} = await MailComposer.composeAsync({
      recipients: [loan.user.email],
      subject: `Deine Leihe von ${loan.tool.name} wurde bestätigt`,
      body: `
Nachricht von ${loan.user.name || loan.user.username} (am ${requestDate.toLocaleDateString('de-DE')} um ${requestDate.toLocaleTimeString('de-DE')}):
  | ${loan.message}

Antwort:


`
    })
    console.log('status', status)
    if (status === 'sent') {
      await setLoanStatus(loan.id, 'accepted')
      await toggleAvailability(loan.tool.id)
    }
  }

  const handleReturning = async (loanId, toolId) => {
    await setLoanStatus(loanId, 'returned')
    await toggleAvailability(toolId, true)
  }

  const renderRequest = ({ item, index, section: { title, data } }) => {
    const isLoaned = item.loanStatus === 'accepted'
    return <TouchableHighlight onPress={!isLoaned ? () => Alert.alert(`Anfrage von ${item.user.name || item.user.username}`, item.message, [
      {text: 'Abbrechen', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Annehmen', onPress: () => handleAccept(item)}
    ]) : null}>
      <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
        <Text>{item.tool.name}</Text>
        {isLoaned
          ? <IconButton
            name='undo'
            style={{ backgroundColor: Colors.blue, width: 45 }}
            rounded
            color='white'
            onPress={() => handleReturning(item.id, item.tool.id)}
          />
          : <View style={{ flexDirection: 'row' }}>
          <IconButton
            name='check'
            family='feather'
            style={{ backgroundColor: 'green', width: 45}}
            color='white'
            rounded
            onPress={() => handleAccept(item)}
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
        </View>}
      </View>
    </TouchableHighlight>
  }

  const onRefresh = () => {
    getUserTools()
    getUserLoans()
    getRequests()
  }

  const onLoan = requests ? requests.filter((loan) => loan.loanStatus === 'accepted') : []
  const openRequests = requests ? requests.filter((loan) => !['accepted', 'denied', 'returned'].includes(loan.loanStatus)) : []

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
          {title: 'Deine Werkzeuge', data: userTools, renderItem: renderPersonalTool},
          ...(openRequests.length ? [{title: 'Angefragt', data: openRequests, renderItem: renderRequest}] : []),
          ...(onLoan.length ? [{title: 'Verliehen', data: onLoan, renderItem: renderRequest}] : []),
          ...(userLoans.length ? [{title: 'Deine Leihen', data: userLoans, renderItem: renderLoan}] : []),
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
