import { useState, useEffect, useCallback } from 'react'

interface TypingAreaProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onSpace: () => void
  onEnter: () => void
  expectedKeys: string
  disabled?: boolean
}

const TypingArea = ({ onKeyPress, onBackspace, onSpace, onEnter, expectedKeys, disabled }: TypingAreaProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (disabled) return
    e.preventDefault()
    
    let key = ''
    if (e.key === 'Backspace') {
      onBackspace()
      key = '⌫'
    } else if (e.key === 'Enter') {
      onEnter()
      key = '↵'
    } else if (e.key === ' ') {
      onSpace()
      key = 'SPACE'
    } else if (e.key.length === 1) {
      key = e.key.toUpperCase()
      onKeyPress(e.key)
    }

    if (key) {
      setPressedKey(key)
      setTimeout(() => setPressedKey(null), 100)
    }
  }, [onKeyPress, onBackspace, onSpace, onEnter, disabled])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const isExpectedKey = (key: string) => expectedKeys.toUpperCase().includes(key)
  const isEnterReady = expectedKeys.length > 0

  return (
    <div className={`glass-card p-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="text-center mb-4">
        <span className="text-cyber-cyan text-sm">
          &gt; VIRTUAL KEYBOARD ACTIVE // PRESS ENTER TO SUBMIT_
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2" style={{ marginLeft: rowIndex * 15 }}>
            {row.map(key => {
              const isHighlighted = key !== '⌫' && key !== '↵' && isExpectedKey(key)
              const isPressed = pressedKey === key
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (disabled) return
                    if (key === '⌫') {
                      onBackspace()
                    } else {
                      onKeyPress(key.toLowerCase())
                    }
                    setPressedKey(key)
                    setTimeout(() => setPressedKey(null), 100)
                  }}
                  className={`
                    keyboard-key
                    ${isHighlighted ? 'border-cyber-cyan text-cyber-cyan' : ''}
                    ${isPressed ? 'pressed' : ''}
                    ${key === '⌫' ? 'bg-cyber-pink border-cyber-pink text-white' : ''}
                  `}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
        
        {/* Space and Enter */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              if (disabled) return
              onSpace()
              setPressedKey('SPACE')
              setTimeout(() => setPressedKey(null), 100)
            }}
            className={`keyboard-key w-64 ${pressedKey === 'SPACE' ? 'pressed' : ''}`}
          >
            SPACE
          </button>
          <button
            onClick={() => {
              if (disabled) return
              onEnter()
              setPressedKey('↵')
              setTimeout(() => setPressedKey(null), 100)
            }}
            className={`
              keyboard-key w-32
              ${isEnterReady ? 'border-cyber-green text-cyber-green bg-cyber-green/20' : 'border-gray-600 text-gray-500'}
              ${pressedKey === '↵' ? 'pressed' : ''}
            `}
          >
            ↵ ENTER
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-green" />
          <span className="text-gray-400">Expected Key</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-gray-400">Ready to Submit</span>
        </div>
      </div>
    </div>
  )
}

export default TypingArea
