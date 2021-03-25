import React, {useState, useEffect} from 'react'
import {
  Platform,
  Keyboard
} from 'react-native'

export default function useInfo() {
  const [isKeyboardActive, setIsKeyboardActive] = useState(false)
  const toggleKeyboardActive = () => setIsKeyboardActive(true)
  const keyboardInactive = () => setIsKeyboardActive(false)
  useEffect(() => console.log('isKeyboardActive', isKeyboardActive), [isKeyboardActive])
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", toggleKeyboardActive);
    Keyboard.addListener("keyboardDidHide", keyboardInactive);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", toggleKeyboardActive);
      Keyboard.removeListener("keyboardDidHide", keyboardInactive);
    };
  }, []);

  return {
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
    isKeyboardActive
  }
}
