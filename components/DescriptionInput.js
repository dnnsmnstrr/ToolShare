import React from 'react'
import {TextInput} from './Themed'

const ToolInput = ({title = '', value, placeholder, style, onChangeText, ...restProps}) => (
  <TextInput
    style={{
      width: '100%',
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      ...style
    }}
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder || title}
    multiline
    autoCapitalize='none'
    {...restProps}
  />
)

export default ToolInput
