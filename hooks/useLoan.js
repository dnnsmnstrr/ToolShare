import React, {useState, useEffect, useContext} from 'react'
import useAuth from './useAuth'

export const LoanContext = React.createContext({})

export const LoanProvider = ({children}) => {
  const {authorizedRequest, user} = useAuth()
  const [loans, setLoans] = useState([])
  const [userLoans, setUserLoans] = useState([])
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
    if (loans && loans.length) {
      setUserLoans(loans)
      setRefreshing(false)
    }
  }

  const getLoan = (id) => {
    return loans.find((loan) => loan.id === id)
  }

  const deleteLoan = async (id) => {
    const response = await authorizedRequest('api/loan/del', {id}, 'DELETE')
    if (response === 'demo') {
      setLoans(loans.filter((loan) => loan.id !== id))
    }
    getUserLoans()
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
    const response = await authorizedRequest('api/loan/add', {...params, user: user.id}, 'POST')
    if (response === 'demo') {
      setLoans([...loans, {id: loans.length, ...params}])
    }
  }

  useEffect(() => {
    // getLoans()
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
    <LoanContext.Provider value={{loans, getLoans, refreshing, addLoan, getLoan, deleteLoan, toggleAvailability, userLoans, getUserLoans, selectedLoan, setSelectedLoan, resetLoans}}>
      {children}
    </LoanContext.Provider>
  )
}

export default () => useContext(LoanContext)
