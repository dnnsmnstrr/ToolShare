import React from 'react'
import {Image, TouchableOpacity} from 'react-native'

const ToolImage = ({url, onPress, style, ...restProps}) => {

  return <TouchableOpacity onPress={onPress} style={{ width: '100%', height: 200, ...style}}>
    <Image
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 20,
      }}
      source={{ uri: url }}
      {...restProps}
    />
  </TouchableOpacity>
}

export default ToolImage
