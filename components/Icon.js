import React from 'react';
import { Ionicons, FontAwesome, AntDesign, MaterialIcons, MaterialCommunityIcons, Octicons, Feather } from '@expo/vector-icons';

const families = {
  ionic: Ionicons,
  fa: FontAwesome,
  feather: Feather,
  ant: AntDesign,
  material: MaterialIcons,
  materialCommunity: MaterialCommunityIcons,
  octo: Octicons
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
export default function Icon({name, family = 'material', size = 30, focused = true, ...props}) {
  const IconFamily = families[family]
  return <IconFamily name={focused || name.includes('outline') ? name.toLowerCase() : name.toLowerCase() + '-outline' } size={size} {...props} />;
}

export {families}
