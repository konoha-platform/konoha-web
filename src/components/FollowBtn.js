import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { follow, unfollow } from '../redux/actions/profileAction'

const FollowBtn = ({ user, style }) => {
  const { auth, profile, socket } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [followed, setFollowed] = useState(false)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true)
    }
    return () => setFollowed(false)
  }, [auth.user.following, user._id])

  const handleFollow = async () => {
    if (load) return

    setFollowed(true)
    setLoad(true)
    await dispatch(follow({ users: profile.users, user, auth, socket }))
    setLoad(false)
  }

  const handleUnfollow = async () => {
    if (load) return

    setFollowed(false)
    setLoad(true)
    await dispatch(unfollow({ users: profile.users, user, auth, socket }))
    setLoad(false)
  }

  return (
    <>
      {followed ? (
        <button
          className='btn btn-outline-danger'
          onClick={handleUnfollow}
          style={style}
        >
          Unfollow
        </button>
      ) : (
        <button
          className='btn btn-outline-info'
          onClick={handleFollow}
          style={style}
        >
          Follow
        </button>
      )}
    </>
  )
}

export default FollowBtn
