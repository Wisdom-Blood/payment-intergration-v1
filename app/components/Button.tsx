'use client'
import { useRouter } from 'next/navigation'

export default function Button() {
  const router = useRouter()

  // ❌ Wrong way (nested buttons)
  const WrongExample = () => {
    return (
      <button>
        <button onClick={() => router.push('/dashboard')}>Click me</button>
      </button>
    )
  }

  // ✅ Correct way 1: Using a single button
  const CorrectExample1 = () => {
    return (
      <button 
        onClick={() => router.push('/dashboard')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Go to Dashboard
      </button>
    )
  }

  // ✅ Correct way 2: Using div/span for styling
  const CorrectExample2 = () => {
    return (
      <div className="flex gap-2">
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Dashboard
        </button>
        <button 
          onClick={() => router.push('/profile')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Profile
        </button>
      </div>
    )
  }

  // ✅ Correct way 3: Using semantic HTML for button groups
  const CorrectExample3 = () => {
    return (
      <div role="group" className="button-group">
        <button 
          onClick={() => router.push('/page1')}
          className="px-4 py-2 bg-blue-500 text-white"
        >
          Page 1
        </button>
        <span className="mx-2">|</span>
        <button 
          onClick={() => router.push('/page2')}
          className="px-4 py-2 bg-blue-500 text-white"
        >
          Page 2
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CorrectExample1 />
      <CorrectExample2 />
      <CorrectExample3 />
    </div>
  )
} 