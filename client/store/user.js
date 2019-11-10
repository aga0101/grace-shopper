import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const CREATE_USER = 'CREATE_USER'
const GOT_CART = 'GET_CART'
const ADDED_TO_CART = 'ADD_TO_CART'
const REMOVED_FROM_CART = 'REMOVE_FROM_CART'
const EDIT_QTY = 'EDIT_QTY'

/**
 * INITIAL STATE
 */
const defaultUser = {
  currentCart: []
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const gotCart = currentCart => ({type: GOT_CART, currentCart})
const addedToCart = product => ({type: ADDED_TO_CART, product})

/**
 * THUNK CREATORS
 */

export const addToCart = product => async (dispatch, getState) => {
  try {
    let state = getState()
    if (state.user.id) {
      const {data} = await axios.post(
        `/api/user/${state.user.id}/cart`,
        product
      )
      dispatch(addedToCart(data))
    } else {
      dispatch(addedToCart(product))
    }
  } catch (err) {
    console.error(err)
  }
}

export const getCart = () => async (dispatch, getState) => {
  try {
    let state = getState()
    if (state.user.id) {
      const {data} = await axios.get(`/api/user/${state.user.id}/cart`)
      dispatch(gotCart(data))
    } else {
      dispatch(JSON.parse(localStorage.getItem('cart')))
    }
  } catch (err) {
    console.error(err)
  }
}

export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case CREATE_USER:
      return {...state, user: action.user}
    case GOT_CART:
      return {...state, currentCart: action.currentCart}
    case ADDED_TO_CART:
      return {...state, currentCart: [...state.currentCart, action.product]}
    default:
      return state
  }
}
