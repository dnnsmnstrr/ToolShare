import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer from '../components/Spacer';
import {useTools, useInfo} from '../hooks'

export default function ToolDetails({navigation}) {
  const {selectedTool} = useTools()
  const {isAndroid, isKeyboardActive} = useInfo()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  useEffect(() => console.log('selectedTool', selectedTool), [selectedTool])

  useEffect(() => {
    if (selectedTool.name) {
      navigation.setOptions({ headerTitle: selectedTool.name })
    }
  }, [selectedTool])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1, width: '100%', justifyContent: 'flex-start'}}
      behavior={isAndroid ? 'height' : 'padding'} enabled>
      <ScrollView contentContainerStyle={styles.container}>
        <Spacer />
        {selectedTool.image && <Image source={{ uri: selectedTool.image }} style={{ width: 200, height: 200 }} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
