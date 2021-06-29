import React, {useState, useEffect} from 'react';
import { Button, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Text, TextInput, View } from '../components/Themed';
import ToolInput from '../components/ToolInput';
import Image from '../components/Image';
import DescriptionInput from '../components/DescriptionInput';
import Select from '../components/Select';
import Spacer from '../components/Spacer';
import RoundedButton from '../components/RoundedButton';
import IconButton from '../components/IconButton';
import {useTools, useInfo} from '../hooks'

const InfoItem = ({label, value}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  <Text>{String(value)}</Text>
</View>

export default function AddTool({navigation}) {
  const {addTool, categories, getTools} = useTools()
  const {isAndroid} = useInfo()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0] ? categories[0].value : 'hammer')
  const [image, setImage] = useState()
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('')
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }

        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
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
      const [address] = await Location.reverseGeocodeAsync(location.coords)
      setAddress(address)
    })();
  }, [])


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      compressImageQuality: 0.5,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const takeImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.cancelled) {
      setImage(result);
    }
  }

  const handleAdd = async () => {
    await addTool({
      name,
      description,
      category,
      image,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      isAvailable: true,
    })
    await getTools()
    navigation.goBack()
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (address) {
    text = `${address.street}, ${address.city}`
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1, width: '100%',justifyContent: 'flex-start',}}
    behavior={isAndroid ? 'height' : 'padding'} enabled>
      <ScrollView contentContainerStyle={styles.container}>
        <ToolInput title='Name' style={{marginTop: 30}} onChangeText={setName} />
        <DescriptionInput placeholder='Description' onChangeText={setDescription} />
        <InfoItem label='Standort' value={text}/>
        <InfoItem label='Kategorie' value=' '/>
        <Select selectedValue={category} options={categories} onChange={setCategory}/>
        <InfoItem label='Bild' value=' '/>
        {!image && <View style={{ flexDirection: 'row' }}>
          <IconButton name='camera' family='ionic' onPress={takeImage} />
          <View style={{ width: 1, backgroundColor: 'grey', marginLeft: 13, marginRight: 10 }} />
          <IconButton name='photo-album' family='material' onPress={pickImage} />
        </View>}
        {image && <Image
          source={image}
          onPress={pickImage}
          style={{ paddingVertical: 10 }}
        />}
        <Spacer height={50} />
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <RoundedButton disabled={!name || !location || !location.coords} title="Fertig" onPress={handleAdd} style={{ paddingHorizontal: 20 }} />
        <Spacer height={20} />
      </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  listItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
