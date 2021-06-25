import React, {useState, useEffect} from 'react';
import { Platform, Pressable, Modal, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, View } from '../components/Themed';
import Spacer, {EvenlySpace} from '../components/Spacer';
import Image from '../components/Image';
import RoundedButton from '../components/RoundedButton';
import MapView from '../components/MapView';
import Select from '../components/Select';
import {useTools, useInfo} from '../hooks'

const InfoItem = ({label, value}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  <TextInput value={String(value)} />
</View>

export default function ToolDetails({navigation}) {
  const {selectedTool} = useTools()
  const {isAndroid} = useInfo()
  const [modalVisible, setModalVisible] = useState(false)
  const [loanDuration, setLoanDuration] = useState(2)
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)

  useEffect(() => {
    if (selectedTool.name) {
      navigation.setOptions({ headerTitle: selectedTool.name })
    }
  }, [selectedTool])


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={isAndroid ? 'height' : 'padding'} enabled
    >
      <View style={{flex: 1, width: '100%', justifyContent: 'flex-start'}}>
        <ScrollView contentContainerStyle={styles.container}>
        <Spacer height={20} />
        <EvenlySpace>
        <InfoItem label='Besitzer' value={selectedTool.user.name || selectedTool.user.username} />
        {selectedTool.image && <Image url={selectedTool.image} style={{ width: '100%', height: 200 }} />}
        {Platform.OS !== 'web' && <MapView {...selectedTool} />}
        <RoundedButton title='Leihe anfragen' onPress={() => setModalVisible(!modalVisible)} />
        </EvenlySpace>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              onContentSizeChange = {({nativeEvent: {contentSize: {height}}}) => setInputHeight(height)}
              numberOfLines={inputHeight ? Math.round(inputHeight/18) : 1}
              style={{
                width: '100%',
                maxHeight: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 20,
                borderColor: 'grey',
                paddingHorizontal: 20,
                paddingVertical: 5,
                textAlignVertical: 'center'
              }}
              placeholder='Nachricht an den Besitzer'
              multiline
            />
            <Spacer />
            <Text style={styles.modalText}>Dauer der Leihe (Tage)</Text>
            <Select selectedValue={loanDuration} options={[1,2,3,4,5]} onChange={setLoanDuration}/>
            <Spacer />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: -40,
    backgroundColor: 'transparent'
  },
  modalView: {
    margin: 20,
    width: '100%',
    height: '60%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    textAlign: "center"
  }
});
