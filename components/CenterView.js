import React from 'react'
import {View} from 'react-native'

const CenterView = ({children}) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      {children}
    </View>
  )
}

export default CenterView
