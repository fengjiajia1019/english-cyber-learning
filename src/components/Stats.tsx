interface StatsProps {
  wpm: number
  accuracy: number
  streak: number
  correctCount: number
  wrongCount: number
}

const Stats = ({ wpm, accuracy, streak, correctCount, wrongCount }: StatsProps) => {
  const stats = [
    { label: 'WPM', value: wpm, color: 'cyan', icon: '⚡' },
    { label: 'ACCURACY', value: `${accuracy}%`, color: 'green', icon: '🎯' },
    { label: 'STREAK', value: streak, color: 'yellow', icon: '🔥' },
    { label: 'CORRECT', value: correctCount, color: 'green', icon: '✓' },
    { label: 'WRONG', value: wrongCount, color: 'pink', icon: '✗' },
  ]

  const colorClasses = {
    cyan: 'text-cyber-cyan border-cyber-cyan',
    green: 'text-cyber-green border-cyber-green',
    yellow: 'text-cyber-yellow border-cyber-yellow',
    pink: 'text-cyber-pink border-cyber-pink',
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`glass-card p-4 border-l-4 ${colorClasses[stat.color as keyof typeof colorClasses]}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{stat.icon}</span>
            <span className="text-xs text-gray-400 cyber-text">{stat.label}</span>
          </div>
          <div className={`text-3xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Stats
