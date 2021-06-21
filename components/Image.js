import React from 'react'
import {Image} from 'react-native'

const ToolImage = ({url}) => {

  return <Image
    style={{
      width: 200,
      height: 200,
      borderRadius: 20,
    }}
    source={{ uri: url }}
  />
}

export default ToolImage
