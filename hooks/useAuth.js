import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const { manifest } = Constants;

const LOCAL_SERVER = true

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev && false
? manifest.debuggerHost.split(':').shift().concat(':8080/')
: '192.168.0.191:8080/';
const API_URL = LOCAL_SERVER ? 'http://' + api : 'http://134.122.75.185:8080/'

const USER_DATA_KEY='user_data'
const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json'}
const getDemoData = (route) => {
  switch (route) {
    case 'api/tool/available':
      return [
        {id: 0, name: 'MC Hammer', type: 'hammer', image: 'https://i.kym-cdn.com/entries/icons/original/000/001/030/DButt.jpg', latitude: 41.84201, longitude: -89.485937}
      ]
    case 'api/tool/add':
      return 'demo'
    default:
      return
  }
}

export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()

  const login = async (params, register = false, demo) => {
    if (demo) {
      setToken('demo')
      storeValue({accessToken: 'demo', email: 'demo@example.com'})
    }
    try {
      const authRoute = 'api/auth/' + (register ? 'signup' : 'signin')
      const response = await fetch(API_URL + authRoute, {method: 'POST', headers: jsonHeaders, body: JSON.stringify(params)})
      console.log('response', response)
      if (response.error) {
        throw new Error(response.message)
      }
      const {accessToken, ...user} = await response.json();
      if (accessToken) {
        console.log('accessToken', accessToken)
        setToken(accessToken)
        setUser(user)
        storeValue({accessToken, ...user})
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function storeValue(value, key = USER_DATA_KEY) {
    const data = typeof(value) === 'String' ? value : JSON.stringify(value)
    if (Platform.OS !== 'web') {
      try {
        await SecureStore.setItemAsync(key, data);
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function getValueFor(key) {
    if (Platform.OS === 'web') return
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

  const authorizedRequest = async (route = '', params = {}, method = 'GET') => {
    if (!token) {
      throw new Error('missing token')
    }
    if (token === 'demo') return getDemoData(route)
    try {
      const isPost = method === 'POST'
      const headers = { Authorization: 'Bearer ' + token, ...(isPost && jsonHeaders) }
      console.log('headers', headers)
      console.log('params', params)
      const url = API_URL + route
      console.log('url', url)
      const response = await fetch(url + addParams(params), {method, headers})
      const data = await response.json()
      // console.log('data', data)
      if (data) {
        return data
      }
    } catch (err) {
      console.log(err)
      return {}
    }
  }

  const logout = () => {
    SecureStore.deleteItemAsync(USER_DATA_KEY);
    setToken(null)
    setUser(undefined)
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
    if (user) {
      setUser(user)
    }
    return user
  }

  useEffect(() => {
    getToken()
    getUser()
  }, [])

  return (
    <AuthContext.Provider value={{ token, checkingToken, login, logout, user, getUser, authorizedRequest, API_URL }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
