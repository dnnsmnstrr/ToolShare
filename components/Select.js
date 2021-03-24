import React from 'react'
import {View, Picker} from 'react-native'
import {useThemeColor} from './Themed'

const Select = ({selectedValue = 'none', options = [{label: 'None', value: 'none'}], height = 100, onChange = () => {}}) => {
  const textColor = useThemeColor({}, 'text');
  return (
    <View style={{ height, width: '100%', overflow: 'hidden'}}>
      <Picker
      selectedValue={selectedValue}
      style={{ height, width: '100%', top: -(height / 2) }}
      itemStyle={{color: textColor}}
      onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
      >
        {options.map((option) => <Picker.Item {...option}/>)}
      </Picker>
    </View>
  )
}

export default Select
