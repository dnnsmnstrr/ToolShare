import React from 'react'
import {View, Picker, Platform} from 'react-native'
import {useThemeColor} from './Themed'

const Select = ({selectedValue = 'none', options = [{label: 'None', value: 'none'}], height = 90, onChange = () => {}}) => {
  const textColor = useThemeColor({}, 'text');
  return (
    <View style={{ height, width: '100%', overflow: 'hidden'}}>
      <Picker
      selectedValue={selectedValue}
      style={Platform.OS === 'web' ? {height: 40, width: '100%'} :{ height, width: '100%', top: -60 }}
      itemStyle={{color: textColor}}
      onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
      >
        {options.map((option, index) => <Picker.Item key={index} {...option}/>)}
      </Picker>
    </View>
  )
}

export default Select
