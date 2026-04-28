import { useState, useEffect, useCallback } from 'react'

interface TypingAreaProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onSpace: () => void
  expectedKeys: string
}

const TypingArea = ({ onKeyPress, onBackspace, onSpace, expectedKeys }: TypingAreaProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  // Generate keyboard layout
  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    
    let key = ''
    if (e.key === 'Backspace') {
      onBackspace()
      key = '⌫'
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
  }, [onKeyPress, onBackspace, onSpace])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const isExpectedKey = (key: string) => expectedKeys.toUpperCase().includes(key)

  return (
    <div className="glass-card p-6">
      <div className="text-center mb-4">
        <span className="text-cyber-cyan text-sm">
          &gt; VIRTUAL KEYBOARD ACTIVE // USE PHYSICAL OR CLICK_
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2" style={{ marginLeft: rowIndex * 15 }}>
            {row.map(key => {
              const isHighlighted = key !== '⌫' && isExpectedKey(key)
              const isPressed = pressedKey === key
              
              return (
                <button
                  key={key}
                  onClick={() => {
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
                    ${key === 'SPACE' ? 'w-64' : ''}
                  `}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-green" />
          <span className="text-gray-400">Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-cyan" />
          <span className="text-gray-400">Next Key</span>
        </div>
      </div>
    </div>
  )
}

export default TypingArea
