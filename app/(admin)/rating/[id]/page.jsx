"use client";
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {
  const {id} = useParams();
  
  return (
    <div>page</div>
  )
}
