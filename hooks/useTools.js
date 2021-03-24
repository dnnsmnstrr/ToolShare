import React, {useState, useEffect} from 'react'
import useAuth from './useAuth'


export default function useTools() {
  const {authorizedRequest} = useAuth()
  const [tools, setTools] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const getTools = async () => {
    setRefreshing(true)
    const {_embedded : {tools}} = await authorizedRequest('tools')
    setTools(tools)
    setRefreshing(false)
  }

  const addTool = async (params) => {
    const response = await authorizedRequest('api/tool/add', 'POST', params)
  }

  useEffect(() => {
    getTools()
  }, [])

  return {tools, getTools, refreshing, addTool}
}
