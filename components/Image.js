import React from 'react'
import {Image, TouchableOpacity} from 'react-native'
import useAuth from '../hooks/useAuth'
const ToolImage = ({url, onPress, style, ...restProps}) => {
  const {token, API_URL} = useAuth()
  console.log('url', API_URL + 'files/759a33a8-6849-41cd-9f82-5d9589d2f067')
  const headers = { Authorization: 'Bearer ' + token }

  return <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.2 : 1} style={{ width: '100%', height: 200, ...style}}>
    <Image
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 20,
      }}
      source={{uri: API_URL + 'files/759a33a8-6849-41cd-9f82-5d9589d2f067', headers}}//typeof url === 'object' ? {uri: url.data} : { uri: url, headers }}
      {...restProps}
    />
  </TouchableOpacity>
}

export default ToolImage
