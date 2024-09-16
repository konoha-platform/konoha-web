import Cookies from 'js-cookie'

import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'
import { mapMessages, messages } from '../../utils/mapMessages'

const TOKEN_LIFESPAN = 7 //days
export const AUTH_TYPES = {
  AUTHENTICATED: 'AUTHENTICATED',
  AUTO_LOGIN: 'AUTO_LOGIN',
}

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    const res = await postDataAPI(dispatch, 'auth/login', data)
    Cookies.set('access_token', res.data.access_token)
    Cookies.set('refresh_token', res.data.refresh_token)
    Cookies.set('user_id', res.data.user?._id)

    dispatch({
      type: AUTH_TYPES.AUTHENTICATED,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    })
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: mapMessages(res.data.msg),
        loading: false
      },
    })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: mapMessages(err.response.data.msg),
        loading: false
      },
    })
  }
}

export const initialize = () => async (dispatch) => {
  const accessToken = Cookies.get('access_token')
  const userId = Cookies.get('user_id')
  if (!accessToken || !userId)  return

  const usersRes = await getDataAPI(dispatch, `/users/${userId}`, accessToken)
  dispatch({  
    type: AUTH_TYPES.AUTHENTICATED,
    payload: {
      token: accessToken,
      user: usersRes.data.user,
    },
  })
}

export const autoLogin = () => async (dispatch, getState) => {
  const alertState = getState().alert
  if (!!alertState.loading) return
  
  try {

    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    const refreshToken = Cookies.get('refresh_token')
    const res = await postDataAPI(dispatch, 'auth/auto-login', { refreshToken })
    Cookies.set('access_token', res.data.access_token, {
      expires: TOKEN_LIFESPAN,
    })
    dispatch({
      type: AUTH_TYPES.AUTHENTICATED,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    })
    window.location.reload()
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: mapMessages(messages.SESSION_EXPIRED),
        loading: false
      },
    })
    setTimeout(() => {
      dispatch(logout())
    }, 1000)
  }
}

export const register = (data) => async (dispatch) => {
  const check = valid(data)
  if (check.errLength > 0)
    return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg })

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI(dispatch, 'auth/register', data)
    Cookies.set('access_token', res.data.access_token)
    Cookies.set('refresh_token', res.data.refresh_token)
    Cookies.set('user_id', res.data.user?._id)
    dispatch({
      type: AUTH_TYPES.AUTHENTICATED,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    })
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: mapMessages(res.data.msg),
        loading: false
      },
    })
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: mapMessages(err.response.data.msg),
        loading: false
      },
    })
  }
}

export const logout = () => async (dispatch) => {
  try {
    await postDataAPI(dispatch, 'auth/logout')
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    Cookies.remove('user')
    window.location.href = '/'
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: mapMessages(err.response.data.msg),
        loading: false
      },
    })
  }
}
