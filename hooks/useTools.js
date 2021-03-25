import React, {useState, useEffect} from 'react'
import useAuth from './useAuth'

export default function useTools() {
  const {authorizedRequest} = useAuth()
  const [tools, setTools] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const getTools = async () => {
    setRefreshing(true)
    const {_embedded: {tools = []} = {}} = await authorizedRequest('tools')
    setTools(tools)
    setRefreshing(false)
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

  return {tools, getTools, refreshing, addTool, categories}
}
