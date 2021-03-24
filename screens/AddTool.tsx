import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import useTools from '../hooks/useTools'

export default function AddTool() {
  const {addTool, categories} = useTools()
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

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (

      <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1, width: '100%',justifyContent: 'flex-start',}} keyboardVerticalOffset={100} behavior="padding" enabled>
        <ToolInput title='Name' style={{marginTop: 30}} onChangeText={setName} />
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <DescriptionInput title='Description' onChangeText={setDescription} />
        <Select selectedValue={category} options={categories} onChange={setCategory}/>
        </KeyboardAvoidingView>
        <Button title="Done" onPress={() => addTool({name, description, category})} />
      </ScrollView>
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
