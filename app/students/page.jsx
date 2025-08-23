"use client";
import React from 'react'
import PageLayout from '../../components/layout/PageLayout'
import BreadcrumbsShowcase from '../../components/ui/BreadCrumbs';


export default function page() {
  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase variant='pill' />
      </div>
    </PageLayout>
  )
}
