import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import {useThemeColor} from './Themed'

const RoundedButton = ({title, lightColor, darkColor, color = '#fff', style, textStyle, onPress}) => {
  const themeColor = useThemeColor({ light: color, dark: color }, 'text');
  return (
    <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#2f95dc', borderRadius: 20, ...style }}>
       <Text style={{ fontSize: 40, color: themeColor, paddingHorizontal: 10, ...textStyle}}>
         {title}
       </Text>
    </TouchableOpacity>
  )
}

export default RoundedButton
