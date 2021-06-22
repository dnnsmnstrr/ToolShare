import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, {Marker} from 'react-native-maps';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer, {EvenlySpace} from '../components/Spacer';
import Image from '../components/Image';
import RoundedButton from '../components/RoundedButton';
import {useTools, useInfo} from '../hooks'

export default function ToolDetails({navigation}) {
  const {selectedTool} = useTools()
  const {latitude, longitude} = selectedTool
  const {isAndroid, isKeyboardActive} = useInfo()

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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
