import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import {useThemeColor} from './Themed'

const RoundedButton = ({title, color = '#fff', style, textStyle, disabled, onPress, ...restProps}) => {
  const themeColor = useThemeColor({ light: color, dark: color }, 'text');
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: disabled ? 'grey' : '#2f95dc',
        borderRadius: '50%',
        ...style
      }}
      {...restProps}
    >
       <Text style={{ fontSize: 22, color: themeColor, padding: 10, ...textStyle}}>
         {title}
       </Text>
    </TouchableOpacity>
  )
}

export default RoundedButton
