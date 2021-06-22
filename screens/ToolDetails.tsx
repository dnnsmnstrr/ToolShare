import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer from '../components/Spacer';
import Image from '../components/Image';
import RoundedButton from '../components/RoundedButton';
import {useTools, useInfo} from '../hooks'

export default function ToolDetails({navigation}) {
  const {selectedTool} = useTools()
  const {isAndroid, isKeyboardActive} = useInfo()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

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
        <Spacer />
        {selectedTool.image && <Image url={selectedTool.image} style={{ width: 200, height: 200 }} />}
        <RoundedButton title='hello' />
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
