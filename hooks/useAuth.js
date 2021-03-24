import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const { manifest } = Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
? manifest.debuggerHost.split(':').shift().concat(':8080/')
: `api.example.com`;
const API_URL = 'http://' + api || 'http://192.168.0.191:8080/'

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

  const addParams = (params) => {
    if (!params || !Object.keys(params).length) return ''
    return '?' + Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
  }
  const authorizedRequest = async (route = '', method = 'GET', params = {}) => {
    const isPost = method === 'POST'
    const headers = { Authorization: 'Bearer ' + token, ...(isPost && jsonHeaders) }
    console.log('headers', headers)
    const url = API_URL + route
    const response = await fetch(isPost ? url + addParams(params) : url, {method, headers})
    console.log('response', response)
    const data = await response.json()
    console.log('data', data)
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
