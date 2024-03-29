import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Send from '../../../images/send.svg'
import LikeButton from '../../LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import ShareModal from '../../ShareModal'
import {
  likePost,
  unlikePost,
  savePost,
  unsavePost,
} from '../../../redux/actions/postAction'

const CardFooter = ({ post }) => {
  const { auth, theme, socket } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [isLike, setIsLike] = useState(post.likes.find((like) => like._id === auth.user._id))
  const [loadLike, setLoadLike] = useState(false)
  const [isShare, setIsShare] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveLoad, setSaveLoad] = useState(false)

  const handleLike = async () => {
    if (loadLike) return

    setLoadLike(true)
    await dispatch(likePost({ post, auth, socket }))
    setLoadLike(false)
    setIsLike(true)
  }

  const handleUnLike = async () => {
    if (loadLike) return

    setLoadLike(true)
    await dispatch(unlikePost({ post, auth, socket }))
    setLoadLike(false)
    setIsLike(false)
  }

  // Saved
  useEffect(() => {
    if (auth.user.saved.find((id) => id === post._id)) {
      setSaved(true)
    } else {
      setSaved(false)
    }
  }, [auth.user.saved, post._id])

  const handleSavePost = async () => {
    if (saveLoad) return

    setSaveLoad(true)
    await dispatch(savePost({ post, auth }))
    setSaveLoad(false)
  }

  const handleUnSavePost = async () => {
    if (saveLoad) return

    setSaveLoad(true)
    await dispatch(unsavePost({ post, auth }))
    setSaveLoad(false)
  }

  return (
    <div className='card_footer'>
      <div className='card_figures'>
        <h6 style={{ cursor: 'pointer' }}>
          {post.likes.length} likes
        </h6>
        <h6 style={{ cursor: 'pointer' }}>
          {post.comments.length} comments
        </h6>
      </div>
      <div className='card_icon_menu'>
        <div>
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <Link to={`/posts/${post._id}`} className='text-dark'>
            <i className='far fa-comment' />
          </Link>
          <img src={Send} alt='Send' onClick={() => setIsShare(!isShare)} />
        </div>
        {
          saved ? (
            <i className='fas fa-bookmark text-info' onClick={handleUnSavePost} />
          ) : (
            <i className='far fa-bookmark' onClick={handleSavePost} />
          )
        }
      </div>
      {
        isShare && (
          <ShareModal
            url={`${process.env.REACT_APP_WEB_URL}/posts/${post._id}`}
            theme={theme}
          />
        )
      }
    </div>
  )
}

export default CardFooter
