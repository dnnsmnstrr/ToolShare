import React from 'react'
import {View} from 'react-native'

const DEFAULT_HEIGHT = 20
const Spacer = ({width = 0, height = 0}) => {
  if (!width && !height) {
    height = DEFAULT_HEIGHT
  }
  return <View style={{ width, height }} />
}

export default Spacer
