import './Cover.css'    
import { useEffect, useState } from 'react'

export default function Cover({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Show cover for 2 seconds then start exit animation
    const timer = setTimeout(() => {
      setExiting(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (exiting) {
      // Wait for animation to finish (1s) before calling onComplete
      const timer = setTimeout(() => {
         onComplete()
      }, 1000) 
      return () => clearTimeout(timer)
    }
  }, [exiting, onComplete])

  return (
    <div className={`cover-overlay ${exiting ? 'pull-up' : ''}`}>
      <h1 className="logo-pecita">Sha8lny</h1>
    </div>
  )
}
