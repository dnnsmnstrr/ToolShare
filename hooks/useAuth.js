import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
const API_URL = "http://localhost:8080/api/auth/";

export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  const login = async (params) => {
    try {
      const response = await fetch(API_URL, {method: 'post', body: JSON.stringify(params)})
      console.log('response', response)
      if (response.data) {
        const { access_token, ...restParams } = response.data;
        setToken(access_token)

        if (Platform.OS !== 'web') {
          SecureStore.setItemAsync('access_token', storageValue);
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
    SecureStore.setItemAsync('access_token', '');
    setToken(null)
  }

  const [token, setToken] = useState()

  const getToken = async () => {
    const token = await getValueFor('access_token')
    console.log('token', token)
    if (token) {
      setToken(token)
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
