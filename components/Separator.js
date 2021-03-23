import React from 'react'
import {View} from 'react-native'

const Separator = ({width = '80%', height = 1}) => (
  <View
    lightColor="#eee" darkColor="rgba(255,255,255,0.1)"
    style={{
      marginVertical: 30,
      height,
      width,
    }}
  />
)

export default Separator
