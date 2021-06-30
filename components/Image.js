import React from 'react'
import {Image, TouchableOpacity} from 'react-native'
import useAuth from '../hooks/useAuth'
const ToolImage = ({id, onPress, style, ...restProps}) => {
  const {API_URL} = useAuth()
  const uri = API_URL + 'files/' + id
  return <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.2 : 1} style={{ width: '100%', height: 200, ...style}}>
    <Image
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 20,
      }}
      source={{uri}}
      {...restProps}
    />
  </TouchableOpacity>
}

export default ToolImage
