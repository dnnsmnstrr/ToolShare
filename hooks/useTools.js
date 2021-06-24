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
    const tools = await authorizedRequest('api/tool/user', {user: user.id})
    if (tools && tools.length) {
      setUserTools(tools)
      setRefreshing(false)
    }
  }

  const getTool = (id) => {
    return tools.find((tool) => tool.id === id)
  }

  const deleteTool = async (id) => {
    const response = await authorizedRequest('api/tool/del', {id}, 'DELETE')
    if (response === 'demo') {
      setTools(tools.filter((tool) => tool.id !== id))
    }
    getUserTools()
  }

  const toggleAvailability = async (id, available) => {
    const response = await authorizedRequest('api/tool/setavailable', {id, available: available ? 1 : 0}, 'PUT')
    const newTools = [...userTools]
    const toolIndex = newTools.findIndex((tool) => tool.id === id)
    console.log('toolIndex', toolIndex)
    newTools[toolIndex].available = available
    setUserTools(newTools)
    if (response !== 'demo') {
      getUserTools()
    }
  }

  const addTool = async (params) => {
    const response = await authorizedRequest('api/tool/add', {...params, user: user.id}, 'POST')
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
    <ToolContext.Provider value={{tools, getTools, refreshing, addTool, getTool, deleteTool, toggleAvailability, userTools, getUserTools, selectedTool, setSelectedTool, resetTools, categories}}>
      {children}
    </ToolContext.Provider>
  )
}

export default () => useContext(ToolContext)
