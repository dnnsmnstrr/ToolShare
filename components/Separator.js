import React from 'react'
import {View} from './Themed'

const Separator = ({width = '80%', height = 1}) => (
  <View
    lightColor="#eee" darkColor="rgba(255,255,255,0.1)"
    style={{
      marginBottom: 20,
      height,
      width,
    }}
  />
)

export default Separator
