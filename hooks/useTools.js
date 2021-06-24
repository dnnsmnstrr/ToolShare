import React, {useState, useEffect, useContext} from 'react'
import useAuth from './useAuth'

export const ToolContext = React.createContext({})

export const ToolProvider = ({children}) => {
  const {authorizedRequest, user} = useAuth()
  const [tools, setTools] = useState([])
  const [userTools, setUserTools] = useState([])
  const [selectedTool, setSelectedTool] = useState()
  const [refreshing, setRefreshing] = useState(false)

  const getTools = async () => {
    setRefreshing(true)
    const tools = await authorizedRequest('api/tool/available')
    if (tools && tools.length) {
      setTools(tools)
      setRefreshing(false)
    }
  }

  const getUserTools = async () => {
    setRefreshing(true)
    console.log('user.id', user.id)
    const tools = await authorizedRequest('api/tool/user', {user: user.id})
    console.log('tools', tools)
    if (tools && tools.length) {
      setUserTools(tools)
      setRefreshing(false)
    }
  }

  const getTool = (id = selectedTool) => {
    return tools.find((tool) => tool.id === id)
  }

  const addTool = async (params) => {
    const response = await authorizedRequest('api/tool/add', params, 'POST')
    if (response === 'demo') {
      setTools([...tools, {id: tools.length, ...params}])
    }
  }

  useEffect(() => {
    getTools()
    if (user && user.id) {
      getUserTools()
    }
  }, [])

  // TODO: fetch categories dynamically
  const categories = [
    { label: 'Hammer', value: 'hammers'},
    { label: 'Zangen', value: 'pliers'},
    { label: 'Bohrer', value: 'drills'},
    { label: 'Sägen', value: 'saws'},
    { label: 'Andere', value: 'other'}
  ]

  const resetTools = () => {
    setTools([])
    setUserTools([])
  }

  useEffect(() => {
    if (!user) {
      console.log('resetting tools')
      resetTools()
    }
  }, [user])
  return (
    <ToolContext.Provider value={{tools, getTools, refreshing, addTool, getTool, userTools, getUserTools, selectedTool, setSelectedTool, resetTools, categories}}>
      {children}
    </ToolContext.Provider>
  )
}

export default () => useContext(ToolContext)
