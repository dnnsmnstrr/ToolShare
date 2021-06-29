import React, {useState, useEffect} from 'react';
import { Platform, Pressable, Modal, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Text, TextInput, View } from '../components/Themed';
import Spacer, {EvenlySpace} from '../components/Spacer';
import Image from '../components/Image';
import RoundedButton from '../components/RoundedButton';
import MapView from '../components/MapView';
import Select from '../components/Select';
import {useTools, useInfo, useLoan} from '../hooks'

const InfoItem = ({label, value}) => <View style={styles.listItem}>
  <Text>{label}: </Text>
  <Text>{String(value)}</Text>
</View>

export default function ToolDetails({navigation}) {
  const {selectedTool, getCategoryTitle} = useTools()
  const {addLoan, userLoans} = useLoan()
  const {isAndroid, isKeyboardActive, closeKeyboard} = useInfo()
  const [modalVisible, setModalVisible] = useState(false)
  const [loanDuration, setLoanDuration] = useState(1)
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(0)
  const [requested, setRequested] = useState()

  useEffect(() => {
    const alreadyRequested = userLoans && userLoans.some((loan) => loan.tool.id === selectedTool.id)
    setRequested(alreadyRequested)
  }, [userLoans])

  useEffect(() => {
    if (selectedTool.name) {
      navigation.setOptions({ headerTitle: selectedTool.name })
    }
  }, [selectedTool])

  const toggleModal = () => setModalVisible(!modalVisible)
  if (!selectedTool) {
    return null
  }

  const handleAddLoan = async () => {
    const success = await addLoan({message, loan_days: loanDuration, tool_id: selectedTool.id})
    if (success) {
      toggleModal()
      setRequested(true)
    }
  }

  return (
    <View
      style={{ flex: 1 }}
      behavior={isAndroid ? 'height' : 'padding'} enabled
    >
      <View style={{flex: 1, width: '100%', justifyContent: 'flex-start'}}>
        <ScrollView contentContainerStyle={styles.container}>
        <Spacer height={20} />
        <EvenlySpace>
        {selectedTool.user && <InfoItem label='Besitzer' value={selectedTool.user.name || selectedTool.user.username} />}
        <InfoItem label='Kategorie' value={getCategoryTitle(selectedTool.category)} />
        {selectedTool.image && <Image url={selectedTool.image} style={{ width: '100%', height: 200 }} />}
        {Platform.OS !== 'web' && <MapView {...selectedTool} />}
        <RoundedButton title={requested ? 'Angefragt' : 'Leihe anfragen'} disabled={requested} onPress={toggleModal} />
        </EvenlySpace>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={isKeyboardActive ? closeKeyboard : toggleModal}><View style={{ width: '100%', flex: 1, backgroundColor: 'transparent' }}/></TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              onContentSizeChange = {({nativeEvent: {contentSize: {height}}}) => setInputHeight(height)}
              numberOfLines={inputHeight && isAndroid ? Math.round(inputHeight/18) : null}
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
            <RoundedButton title={'Absenden'} disabled={!message || !loanDuration} onPress={handleAddLoan} />
            <Spacer />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Abbrechen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginHorizontal: 20,
    width: '100%',
    flex: 1.1,
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
