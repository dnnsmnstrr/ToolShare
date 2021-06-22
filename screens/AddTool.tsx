import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer from '../components/Spacer';
import {useTools, useInfo} from '../hooks'

export default function AddTool({navigation}) {
  const {addTool, categories, getTools} = useTools()
  const {isAndroid, isKeyboardActive} = useInfo()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0] ? categories[0].value : 'hammer')
  const [image, setImage] = useState()
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => console.log('category', category), [category])
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [])


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

  const handleAdd = async () => {
    await addTool({name, description, category, latitude: location.coords.latitude, longitude: location.coords.longitude, image, isAvailable: true})
    await getTools()
    navigation.goBack()
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1, width: '100%',justifyContent: 'flex-start',}}
    behavior={isAndroid ? 'height' : 'padding'} enabled>
      <ScrollView contentContainerStyle={styles.container}>
        <ToolInput title='Name' style={{marginTop: 30}} onChangeText={setName} />
        <DescriptionInput placeholder='Description' onChangeText={setDescription} />
        <Select selectedValue={category} options={categories} onChange={setCategory}/>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Text>{text}</Text>
        <Button disabled={!name} title="Done" onPress={handleAdd} />
        {true && <Spacer height={500} />}
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
