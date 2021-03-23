import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
const USER_DATA_KEY='user_data'
const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json'}

export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  const login = async (params, register = false) => {
    try {
      const authRoute = 'api/auth/' + (register ? 'signup' : 'signin')
      const response = await fetch(API_URL + authRoute, {method: 'POST', headers: jsonHeaders, body: JSON.stringify(params)})
      const {accessToken, email} = await response.json();
      if (accessToken) {
        setToken(accessToken)
        storeValue({accessToken, email})
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function storeValue(value, key = USER_DATA_KEY) {
    const data = typeof(value) === 'String' ? value : JSON.stringify(value)
    console.log('data', data)
    if (Platform.OS !== 'web') {
      try {
        await SecureStore.setItemAsync(key, data);
      } catch (err) {
        console.error(err)
      }
      const test = await getValueFor(USER_DATA_KEY)
      console.log('test', test)
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

  const authorizedRequest = async (route = '', method = 'GET', params = {}) => {
    const headers = { Authorization: 'Bearer ' + token, ...(method === 'POST' && jsonHeaders) }
    console.log('headers', headers)
    const response = await fetch(API_URL + route, {method, headers })
    const data = await response.json()
    console.log('response', data)
    if (data) {
      return data
    }
  }

  const logout = () => {
    SecureStore.deleteItemAsync(USER_DATA_KEY);
    setToken(null)
  }

  const [token, setToken] = useState()
  const [checkingToken, setCheckingToken] = useState(true)

  const getToken = async () => {
    const data = await getValueFor(USER_DATA_KEY)
    if (data && data.accessToken) {
      setToken(data.accessToken)
    }
    setCheckingToken(false)
  }

  const getUser = async () => {
    const user = await getValueFor(USER_DATA_KEY)
    console.log(user)
    return user
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <AuthContext.Provider value={{ token, checkingToken, login, logout, getUser, authorizedRequest }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
