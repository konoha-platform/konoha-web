export const imageShow = (src, theme) => {
  return (
    <img
      src={src}
      alt='images'
      className='img-thumbnail'
      style={{ filter: theme ? 'invert(1)' : 'invert(0)', maxHeight: '150px' }}
    />
  )
}

export const videoShow = (src, theme) => {
  return (
    <video
      controls
      src={src}
      alt='images'
      className='img-thumbnail'
      style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
    />
  )
}
