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
    const {_embedded: {tools = []} = {}} = await authorizedRequest('tools')
    console.log('tools', tools)
    setTools(tools)
    setRefreshing(false)
  }

  const getTool = (id = selectedTool) => {
    return tools.find((tool) => tool.id === id)
  }

  const addTool = async (params) => {
    const response = await authorizedRequest('api/tool/add', 'POST', params)
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
