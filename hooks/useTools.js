import React, {useState, useEffect, useContext} from 'react'
import useAuth from './useAuth'

export const ToolContext = React.createContext({})

export const ToolProvider = ({children}) => {
  const {authorizedRequest} = useAuth()
  const [tools, setTools] = useState([])
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

  const getTool = (id = selectedTool) => {
    return tools.find((tool) => tool.id === id)
  }

  const addTool = async (params) => {
    const response = await authorizedRequest('api/tool/add', 'POST', params)
    if (response === 'demo') {
      setTools([...tools, {id: tools.length, ...params}])
    }
    console.log('response', response)
  }

  useEffect(() => {
    getTools()
  }, [])

  // TODO: fetch categories dynamically
  const categories = [
    { label: 'Hammer', value: 'hammers'},
    { label: 'Zangen', value: 'pliers'},
    { label: 'Bohrer', value: 'drills'},
    { label: 'Sägen', value: 'saws'},
    { label: 'Andere', value: 'other'}
  ]

  return (
    <ToolContext.Provider value={{tools, getTools, refreshing, addTool, getTool, selectedTool, setSelectedTool, categories}}>
      {children}
    </ToolContext.Provider>
  )
}

export default () => useContext(ToolContext)
