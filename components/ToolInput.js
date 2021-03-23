import React from 'react'
import {TextInput} from './Themed'

const ToolInput = ({title = '', value, placeholder, style, onChangeText, ...restProps}) => (
  <TextInput
    style={{
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    ...style
  }}
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder || title}
    autoCapitalize='none'
    {...restProps}
  />
)

export default ToolInput
