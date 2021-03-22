import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session'
import { ActivityIndicator, Button, Platform } from 'react-native'
import { TextInput, View } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import CenterView from '../components/CenterView';
import Spacer from '../components/Spacer';

const LoginInput = ({title = '', value, placeholder, onChangeText}) => {
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
  />
}

export default function Login ({ navigation }) {
  const {login} = useAuth()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [registering, setRegistering] = useState()

  const handleLogin = async () => {
    if (!username || !password) return
    await login({username, email, password}, registering)
    setLoading(true)
  }

  return (
    <CenterView>
      {loading ? <ActivityIndicator /> : <View style={{width: '80%', flexDirection: 'column'}}>
        <LoginInput
          onChangeText={setUsername}
          value={username}
          placeholder="username"
        />
        <LoginInput
          onChangeText={setPassword}
          value={password}
          placeholder="password"
        />
        {registering && <LoginInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
        />}
        <Button disabled={!username || !password} title='Weiter' onPress={handleLogin} />
        <Spacer height={30}/>
        <Button title={registering ? 'Login' : 'Register'} onPress={() => setRegistering(!registering)} />
      </View>}

    </CenterView>
  )
}
