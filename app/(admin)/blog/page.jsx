// app/blog/page.jsx
import { Suspense } from 'react';
import BlogContent from './BlogContent';

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <BlogContent />
    </Suspense>
  );
}

export const dynamic = 'force-static';