import React, {useEffect, useState} from 'react';
import { StyleSheet, FlatList, TouchableHighlight } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'

export default function TabOneScreen() {
  const [tools, setTools] = useState([])
  const {authorizedRequest} = useAuth()

  const [refreshing, setRefreshing] = useState(false)

  const getTools = async () => {
    setRefreshing(true)
    const {tools} = await authorizedRequest('tools')
    setTools(tools)
    setRefreshing(false)
  }

  useEffect(() => {
    getTools()
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      <FlatList
        data={tools}
        style={{width: '100%', flex: 1}}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => {
          console.log('item', item)
          return(
          <TouchableHighlight
          >
            <View style={{ backgroundColor: 'white', paddingLeft: 20 }}>
              <Text>{item.name}</Text>
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
