import { useEffect, useState } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const MatrixRain = () => {
  const [columns, setColumns] = useState<{ id: number; left: number; duration: number; delay: number }[]>([])

  useEffect(() => {
    const newColumns = []
    
    for (let i = 0; i < 50; i++) {
      newColumns.push({
        id: i,
        left: (i * 2) + Math.random() * 2,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5
      })
    }
    
    setColumns(newColumns)
  }, [])

  return (
    <div className="matrix-rain">
      {columns.map(col => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: `${col.left}%`,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i}>
              {CHARS[Math.floor(Math.random() * CHARS.length)]}
              <br />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MatrixRain
