import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session'
import { ActivityIndicator, Button, Platform } from 'react-native'
import { TextInput, View, Text } from '../components/Themed';
import useAuth from '../hooks/useAuth'
import CenterView from '../components/CenterView';
import RoundedButton from '../components/RoundedButton';
import Spacer from '../components/Spacer';

const DEBUG = false

const LoginInput = ({title = '', value, placeholder, onChangeText, ...restProps}) => {
  return <TextInput
    style={{
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
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
  const [username, setUsername] = useState()
  const [name, setName] = useState()
  const [surname, setSurname] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()
  const [registering, setRegistering] = useState()
  const [error, setError] = useState()
  const registeringFieldMissing = registering && (!name || !surname || !email)

  const handleLogin = async () => {
    setError('')
    if (!username || !password || registeringFieldMissing) return
    const success = await login({username, email, password, name, surname}, registering)
    if (success) {
      setLoading(true)
    } else {
      setError('Login fehlgeschlagen')
    }
  }

  const isPasswordLengthCorrect = password && password.length < 6
  return (
    <CenterView>
      {loading || checkingToken ? <ActivityIndicator /> : <View style={{width: '80%',flexDirection: 'column'}}>
        {registering && <>
          <LoginInput
            onChangeText={setName}
            value={name}
            placeholder="Vorname"
          />
          <LoginInput
            onChangeText={setSurname}
            value={surname}
            placeholder="Nachname"
          />
          <LoginInput
            onChangeText={setEmail}
            value={email}
            placeholder="E-mail"
          />
        </>}
        <LoginInput
          onChangeText={setUsername}
          value={username}
          placeholder="Benutzername"
        />
        <LoginInput
          onChangeText={setPassword}
          value={password}
          placeholder="Passwort"
          onSubmitEditing={handleLogin}
        />
        {registering && isPasswordLengthCorrect && <Text style={{ color: 'red' }}>Passwort muss mindestens 6 Zeichen lang sein</Text>}
        {!!error && <Text style={{ color: 'red' }}>{error}</Text>}
        <Spacer height={10}/>
        <RoundedButton disabled={!username || !password || isPasswordLengthCorrect || registeringFieldMissing} title='Weiter' onPress={handleLogin} />
        <Spacer height={30}/>
        <Button title={registering ? 'Anmelden' : 'Registrieren'} onPress={() => setRegistering(!registering)} />
      </View>}
      {DEBUG && <View style={{ alignItems: 'center', paddingTop: 20 }}>
        <Button title='demo' onPress={() => {
          login({}, false, true)
        }} />
        <Text>{API_URL}</Text>
      </View>}

    </CenterView>
  )
}
