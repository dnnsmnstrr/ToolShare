import React, {useState, useEffect, useContext} from 'react'
import useAuth from './useAuth'

export const LoanContext = React.createContext({})

export const LoanProvider = ({children}) => {
  const {authorizedRequest, user} = useAuth()
  const [loans, setLoans] = useState([])
  const [userLoans, setUserLoans] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedLoan, setSelectedLoan] = useState()
  const [refreshing, setRefreshing] = useState(false)

  const getLoans = async () => {
    setRefreshing(true)
    const loans = await authorizedRequest('api/loan/all')
    if (loans && loans.length) {
      setLoans(loans)
      setRefreshing(false)
    }
  }

  const getUserLoans = async () => {
    setRefreshing(true)
    const loans = await authorizedRequest('api/loan/user', {user: user.id})
    if (loans) {
      setUserLoans(loans)
      setRefreshing(false)
    }
  }

  const getRequests = async () => {
    setRefreshing(true)
    const requests = await authorizedRequest('api/loan/tool/user', {user_id: user.id})
    if (requests) {
      setRequests(requests)
      setRefreshing(false)
    }
  }

  const getLoan = (id) => {
    return loans.find((loan) => loan.id === id)
  }

  const cancelLoan = async (id) => {
    const response = await authorizedRequest('api/loan/del', {id}, 'DELETE')
    if (response === 'demo') {
      setLoans(loans.filter((loan) => loan.id !== id))
    }
    getUserLoans()
  }

  const setLoanStatus = async (id, status) => {
    const response = await authorizedRequest('api/loan/setstatus', {id, status}, 'PUT')
    if (response === 'demo') {
      const newLoans = [...userLoans]
      const loanIndex = newLoans.findIndex((loan) => loan.id === id)
      newLoans[loanIndex].available = available
      setUserLoans(newLoans)
    } else {
      getRequests()
    }
  }

  const toggleAvailability = async (id, available) => {
    const response = await authorizedRequest('api/loan/setavailable', {id, available: available ? 1 : 0}, 'PUT')
    const newLoans = [...userLoans]
    const loanIndex = newLoans.findIndex((loan) => loan.id === id)
    newLoans[loanIndex].available = available
    setUserLoans(newLoans)
    if (response !== 'demo') {
      getUserLoans()
    }
  }

  const addLoan = async (params) => {
    const response = await authorizedRequest('api/loan/add', {...params, request_date: new Date(), loanStatus: 'open', user: user.id}, 'POST')
    console.log('response', response)
    if (response === 'demo') {
      setLoans([...loans, {id: loans.length, ...params}])
    }
    getUserLoans()
    return response
  }

  useEffect(() => {
    if (user && user.id) {
      getUserLoans()
    }
  }, [])

  const resetLoans = () => {
    setLoans([])
    setUserLoans([])
  }

  useEffect(() => {
    if (!user) {
      console.log('resetting loans')
      resetLoans()
    }
  }, [user])

  return (
    <LoanContext.Provider value={{loans, getLoans, refreshing, addLoan, getLoan, cancelLoan, toggleAvailability, setLoanStatus, userLoans, getUserLoans, requests, getRequests, selectedLoan, setSelectedLoan, resetLoans}}>
      {children}
    </LoanContext.Provider>
  )
}

export default () => useContext(LoanContext)
