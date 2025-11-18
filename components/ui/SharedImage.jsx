import React from 'react'

export default function SharedImage({src, alt="" , className="" , onErrorImg ="/images/logo.svg"}) {
  return (
    <img src={src}
    alt={alt}
    className={className ? className :"w-full h-full object-contain "}
    onError={(e) => e.currentTarget.src= onErrorImg}
    />
  )
}
