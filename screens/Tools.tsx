import React, {useState} from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableHighlight,
  LayoutAnimation
} from 'react-native';

import { Text, View, TextInput } from '../components/Themed';
import Spacer from '../components/Spacer'
import useTools from '../hooks/useTools'

const includesLowerCase = (string, query) => {
  return string.toLowerCase().includes(query.toLowerCase())
}

export default function Tools({navigation}) {
  const [query, setQuery] = useState('')
  const [lastScroll, setLastScroll] = useState(0)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const {tools = [], getTools, setSelectedTool, refreshing, categories} = useTools()

  const renderHeader = <View
      style={{
        padding: 20,
           alignItems: 'center',
        justifyContent: 'center'
      }}>

      <TextInput
        value={query}
        autoCorrect={false}
        onChangeText={setQuery}
        placeholder='Search'
        clearButtonMode='always'
        style={{height: 40, borderWidth: 1, borderColor: 'gray', borderRadius: 25, width: '100%', marginTop: 5, paddingHorizontal: 20}}
      />
    </View>

  const onScroll = (event) => {
    const {contentOffset: {y: currentScroll}, contentSize, layoutMeasurement} = event.nativeEvent
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowSearchBar(lastScroll > currentScroll && currentScroll + layoutMeasurement.height < contentSize.height)
    setLastScroll(event.nativeEvent.contentOffset.y)
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tools.filter(({name, category, ...rest}) => {
          const {label, value} = categories.find((cat) => cat.value === category) || {}
          if (label && value) {
            const categoryString = label + value
            if (includesLowerCase(categoryString, query)) {
              return true
            }
          }
          return includesLowerCase(name, query)
        })}
        style={{width: '100%', flex: 1}}
        keyExtractor={(item, index) => item.name + index}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={showSearchBar ? [0] : null}
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
        onScroll={onScroll}
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
