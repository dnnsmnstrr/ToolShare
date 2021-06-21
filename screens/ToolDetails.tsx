import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer from '../components/Spacer';
import {useTools, useInfo} from '../hooks'

export default function ToolDetails() {
  const {selectedTool} = useTools()
  const {isAndroid, isKeyboardActive} = useInfo()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState()

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


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
        <Text>{selectedTool.name}</Text>
        {selectedTool.image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
