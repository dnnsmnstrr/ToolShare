import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
const API_URL = "http://192.168.178.84:8080/api/auth/";

export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  const login = async (params, register = false) => {
    try {
      const response = await fetch(API_URL + (register ? 'signup' : 'signin'), {method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json'},body: JSON.stringify(params)})
      const data = await response.json();
      console.log('response', data);
      if (data.accessToken) {
        setToken(data.accessToken)

        if (Platform.OS !== 'web') {
          SecureStore.setItemAsync('user_data', data);
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function getValueFor(key) {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return JSON.parse(result);
    } else {
      console.log('No values stored under the key: ', key);
    }
  }

  const logout = () => {
    SecureStore.setItemAsync('user_data', '');
    setToken(null)
  }

  const [token, setToken] = useState()

  const getToken = async () => {
    const {accessToken} = await getValueFor('user_data')
    console.log('token', accessToken)
    if (accessToken) {
      setToken(accessToken)
    }
  }

  const getUser = async () => {
    const user = await getValueFor('user_data')
    console.log(user)
    return user
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
