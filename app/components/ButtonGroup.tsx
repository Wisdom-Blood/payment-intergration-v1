'use client'
import { useRouter } from 'next/navigation'

export default function StyledButtonContainer() {
  const router = useRouter()

  return (
    // Use semantic HTML with appropriate ARIA roles
    <div 
      role="group" 
      aria-label="Navigation buttons"
      className="inline-flex rounded-md shadow-sm"
    >
      <button 
        onClick={() => router.push('/prev')}
        className="px-4 py-2 bg-gray-100 border border-r-0 rounded-l-md hover:bg-gray-200"
      >
        Previous
      </button>
      
      <button 
        onClick={() => router.push('/next')}
        className="px-4 py-2 bg-gray-100 border rounded-r-md hover:bg-gray-200"
      >
        Next
      </button>
    </div>
  )
} 