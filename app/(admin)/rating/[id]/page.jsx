"use client";
import { useParams } from 'next/navigation'
import React from 'react'
import PageLayout from '../../../../components/layout/PageLayout';

export default function page() {
  const {id} = useParams();

  return (
    <PageLayout>page</PageLayout>
  )
}
