import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import Icon from './Icon'
import {useThemeColor} from './Themed'

const IconButton = ({name = 'error', family = 'material', size = 32, title, lightColor, darkColor, color, style, textStyle, onPress, focused}) => {
  const themeColor = useThemeColor({ light: lightColor || color, dark: darkColor || color }, 'text');
  return (
    <TouchableOpacity onPress={onPress} style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
      <Icon name={name} family={family} color={themeColor} size={size} focused={focused}/>
      {title &&
       <Text style={{ fontSize: title.length === 1 ? 40 : 20, color: themeColor, paddingHorizontal: 10, marginTop: title.length === 1 ? -8 : -2, ...textStyle}}>
         {title}
       </Text>}
    </TouchableOpacity>
  )
}

export default IconButton
