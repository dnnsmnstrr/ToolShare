import React, {useState} from 'react';
import { StyleSheet, FlatList, TouchableHighlight } from 'react-native';

import { Text, View, TextInput } from '../components/Themed';
import Spacer from '../components/Spacer'
import useTools from '../hooks/useTools'

export default function TabOneScreen({navigation}) {
  const [query, setQuery] = useState('')
  const {tools = [], getTools, setSelectedTool, refreshing} = useTools()

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setQuery}
        clearButtonMode='always'
        style={{height: 40, borderWidth: 1, borderColor: 'gray', width: '90%', marginTop: 5, paddingHorizontal: 10}}
      />
      <FlatList
        data={tools.filter(({name}) => name.toLowerCase().includes(query.toLowerCase()))}
        style={{width: '100%', flex: 1}}
        keyExtractor={(item, index) => item.name + index}
        ListHeaderComponent={<Spacer height={10} />}
        renderItem={({item}) => {
          const {name, description} = item
          return(
          <TouchableHighlight onPress={() => {
            setSelectedTool(item)
            navigation.navigate('ToolDetails')}}>
            <View style={{ paddingLeft: 20 }}>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
          </TouchableHighlight>
        )}}
        refreshing={refreshing}
        onRefresh={getTools}
      />
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
  description: {
    fontSize: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
