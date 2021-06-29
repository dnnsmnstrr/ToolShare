import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const { manifest } = Constants;

const LOCAL_SERVER = false

const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
? manifest.debuggerHost.split(':').shift().concat(':8080/')
: '192.168.0.191:8080/';
const API_URL = LOCAL_SERVER ? 'http://' + api : 'http://134.122.87.107:8080/'

const USER_DATA_KEY='user_data'
const jsonHeaders = { Accept: 'application/json', 'Content-Type': 'application/json'}
const getDemoData = (route) => {
  switch (route) {
    case 'api/tool/available':
      return [
        {id: 0, name: 'MC Hammer', category: 'hammers', image: 'https://i.kym-cdn.com/entries/icons/original/000/001/030/DButt.jpg', latitude: 41.84201, longitude: -89.485937}
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
      if (response.error) {
        throw new Error(response.message)
      }
      const {accessToken, ...user} = await response.json();
      if (accessToken) {
        console.log('accessToken', accessToken)
        setToken(accessToken)
        setUser(user)
        storeValue({accessToken, ...user})
        return true
      }
    } catch (err) {
      console.log(err)
      return false
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
    if (token === 'demo') return getDemoData(route)
    try {
      if (!token) {
        throw new Error('missing token')
      }
      const hasBody = ['POST', 'PUT'].includes(method)
      const url = API_URL + route
      const headers = { Authorization: 'Bearer ' + token, ...(hasBody && jsonHeaders) }
      const body = JSON.stringify(params)
      // console.log('headers', headers)
      // console.log('url', url)
      // console.log('params', params)
      const response = await fetch(url + addParams(params), {method, headers, ...(hasBody && body)})
      // console.log('response', JSON.stringify(response))
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

  const createFormData = (photo, body = {}) => {
    const data = new FormData();

    data.append("file", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const uploadImage = async (image, name) => {
    try {
      const headers = { Authorization: 'Bearer ' + token }
      console.log('api', API_URL + '/upload')
      const response = await fetch(API_URL + 'upload', {
        method: "POST",
        headers,
        body: createFormData({...image, fileName: name})
      })
      const {message} = await response.json()
      if (message) {
        return message
      }
    } catch (err) {
      console.log('err', err)
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
    <AuthContext.Provider value={{ token, checkingToken, login, logout, user, getUser, authorizedRequest, uploadImage, API_URL }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
