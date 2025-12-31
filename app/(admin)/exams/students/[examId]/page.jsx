import { useParams } from 'next/navigation';
import React from 'react'

export default function page() {
  const {examId} = useParams();
  return (
    <div>page</div>
  )
}
