import type { ReactNode } from 'react'

interface TerminalProps {
  children: ReactNode
  title: string
}

const Terminal = ({ children, title }: TerminalProps) => {
  return (
    <div className="terminal-window neon-border">
      <div className="terminal-header">
        <div className="terminal-dot bg-cyber-red" />
        <div className="terminal-dot bg-cyber-yellow" />
        <div className="terminal-dot bg-cyber-green" />
        <span className="ml-4 text-gray-400 text-sm font-mono">{title}</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  )
}

export default Terminal
