import React, {useEffect, useState} from 'react';
import { StyleSheet, FlatList, TouchableHighlight } from 'react-native';

import { Text, View, TextInput } from '../components/Themed';
import EditScreenInfo from '../components/EditScreenInfo';
import Spacer from '../components/Spacer'
import useAuth from '../hooks/useAuth'

export default function TabOneScreen() {
  const [tools, setTools] = useState([])
  const {authorizedRequest} = useAuth()

  const [refreshing, setRefreshing] = useState(false)

  const getTools = async () => {
    setRefreshing(true)
    const {_embedded : {tools}} = await authorizedRequest('tools')
    setTools(tools)
    setRefreshing(false)
  }

  useEffect(() => {
    getTools()
  }, [])
  return (
    <View style={styles.container}>
      <TextInput style={{height: 40, borderWidth: 1, borderColor: 'gray', width: '90%', marginTop: 5, paddingHorizontal: 10}}/>
      <FlatList
        data={tools}
        style={{width: '100%', flex: 1}}
        keyExtractor={(item, index) => item.name + index}
        ListHeaderComponent={<Spacer height={10} />}
        renderItem={({item: {name}}) => {
          return(
          <TouchableHighlight
          >
            <View style={{ paddingLeft: 20 }}>
              <Text style={styles.title}>{name}</Text>
            </View>
          </TouchableHighlight>
        )}}
        refreshing={refreshing}
        onRefresh={getTools}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
