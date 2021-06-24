import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { Text, TextInput, View } from '../components/Themed';

import Spacer, {EvenlySpace} from '../components/Spacer';
import Image from '../components/Image';
import RoundedButton from '../components/RoundedButton';
import {useTools, useInfo} from '../hooks'

const InfoItem = ({label, value}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  <TextInput value={String(value)} />
</View>

export default function ToolDetails({navigation}) {
  const {selectedTool} = useTools()
  const {latitude, longitude} = selectedTool
  const {isAndroid} = useInfo()

  useEffect(() => {
    if (selectedTool.name) {
      navigation.setOptions({ headerTitle: selectedTool.name })
    }
  }, [selectedTool])


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: '100%', justifyContent: 'flex-start'}}
      behavior={isAndroid ? 'height' : 'padding'} enabled>
      <ScrollView contentContainerStyle={styles.container}>
        <Spacer height={20} />
        <EvenlySpace>
          <InfoItem label='Besitzer' value={selectedTool.user.name || selectedTool.user.username} />
          {selectedTool.image && <Image url={selectedTool.image} style={{ width: '100%', height: 200 }} />}
          <View
          style={{ width: '100%', height: 200, borderRadius: 20, overflow: 'hidden' }}
          >
            <MapView
              // provider='google'
              style={{ width: '100%', height: '100%', borderRadius: 20 }}
              mapType='satellite'
              initialRegion={{
                latitude: selectedTool.latitude || 37.78825,
                longitude: selectedTool.longitude || -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={{latitude, longitude}} title={selectedTool.name} description={selectedTool.description}/>
            </MapView>
          </View>
          <RoundedButton title='hello' />
        </EvenlySpace>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  listItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
