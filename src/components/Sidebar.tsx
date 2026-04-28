import { useState } from 'react'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('learn')

  const menuItems = [
    { id: 'learn', icon: '⌨️', label: 'KEYBOARD' },
    { id: 'words', icon: '📚', label: 'WORDS' },
    { id: 'stats', icon: '📊', label: 'STATS' },
    { id: 'settings', icon: '⚙️', label: 'CONFIG' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-cyber-dark/90 backdrop-blur-xl border-r border-cyber-green/20 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-cyber-green/20">
        <h1 className="cyber-text text-xl font-bold text-cyber-green cyber-text-glow">
          CYBER<span className="text-cyber-cyan">//</span>LEARN
        </h1>
        <p className="text-xs text-gray-500 mt-1">v2.0.77</p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-cyber-green/20 text-cyber-green border-l-4 border-cyber-green' 
                : 'text-gray-400 hover:bg-cyber-gray hover:text-white'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="cyber-text text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Progress Ring */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        <svg width="100" height="100" className="circular-progress">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="100%" stopColor="#00e5cc" />
            </linearGradient>
          </defs>
          <circle
            className="circular-progress-bg"
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            fill="none"
          />
          <circle
            className="circular-progress-fill"
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            fill="none"
            strokeDasharray="251.2"
            strokeDashoffset="200"
            style={{ stroke: 'url(#progressGradient)' }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-cyber-green text-2xl font-bold">20</span>
          <p className="text-xs text-gray-500">LVL</p>
        </div>
      </div>

      {/* User */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyber-green/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-green to-cyber-cyan flex items-center justify-center">
            <span className="text-black font-bold">FJ</span>
          </div>
          <div>
            <p className="text-white text-sm">fengjiajia1019</p>
            <p className="text-cyber-green text-xs">● ONLINE</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
