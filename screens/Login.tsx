import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session'
import { ActivityIndicator, Button, Platform } from 'react-native'
import { TextInput, View, Text } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import CenterView from '../components/CenterView';
import Spacer from '../components/Spacer';

const DEBUG = true

const LoginInput = ({title = '', value, placeholder, onChangeText, ...restProps}) => {
  return <TextInput
    style={{
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  }}
    onChangeText={onChangeText}
    value={value}
    placeholder={placeholder || title}
    autoCapitalize='none'
    {...restProps}
  />
}

export default function Login ({ navigation }) {
  const {login, checkingToken = true, API_URL} = useAuth()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('dennis')
  const [name, setName] = useState()
  const [surname, setSurname] = useState()
  const [password, setPassword] = useState('password')
  const [email, setEmail] = useState()
  const [registering, setRegistering] = useState()

  const registeringFieldMissing = registering && (!name || !surname || !email)
  const handleLogin = async () => {
    if (!username || !password || registeringFieldMissing) return
    await login({username, email, password, name, surname}, registering)
    setLoading(true)
  }

  return (
    <CenterView>
      {loading || checkingToken ? <ActivityIndicator /> : <View style={{width: '80%',flexDirection: 'column'}}>
        {registering && <>
          <LoginInput
            onChangeText={setName}
            value={name}
            placeholder="name"
            onSubmit={handleLogin}
          />
          <LoginInput
            onChangeText={setSurname}
            value={surname}
            placeholder="surname"
            onSubmit={handleLogin}
          />
          <LoginInput
            onChangeText={setEmail}
            value={email}
            placeholder="email"
            onSubmit={handleLogin}
          />
        </>}
        <LoginInput
          onChangeText={setUsername}
          value={username}
          placeholder="username"
        />
        <LoginInput
          onChangeText={setPassword}
          value={password}
          placeholder="password"
          onSubmit={handleLogin}
        />
        <Button disabled={!username || !password || registeringFieldMissing} title='Weiter' onPress={handleLogin} />
        <Spacer height={30}/>
        <Button title={registering ? 'Login' : 'Register'} onPress={() => setRegistering(!registering)} />
      </View>}
      {DEBUG && <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Text>{API_URL}</Text>
        <Button title='demo' onPress={() => {
          login({}, false, true)
        }} />
      </View>}

    </CenterView>
  )
}
