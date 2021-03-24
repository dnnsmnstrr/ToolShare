import React, {useState} from 'react'
import {Picker} from 'react-native'
import {useThemeColor} from './Themed'
const Select = ({options = [{label: 'None', value: 'none'}]}) => {
  const textColor = useThemeColor({}, 'text');
  console.log('textColor', textColor)
  const [selectedValue, setSelectedValue] = useState(options.length ? options[0] : 'none')
  return (
    <Picker
      selectedValue={selectedValue}
      style={{ height: 50, width: '100%' }}
      itemStyle={{color: textColor}}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      {options.map((option) => <Picker.Item {...option}/>)}
    </Picker>
  )
}

export default Select
