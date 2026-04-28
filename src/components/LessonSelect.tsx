import type { Lesson } from '../App'

interface LessonSelectProps {
  lessons: Lesson[]
  currentLesson: Lesson
  learnedCount: number
  onSelect: (lesson: Lesson) => void
}

const LessonSelect = ({ lessons, currentLesson, learnedCount, onSelect }: LessonSelectProps) => {
  const difficultyColors = {
    beginner: 'text-cyber-green border-cyber-green bg-cyber-green/10',
    intermediate: 'text-cyber-yellow border-cyber-yellow bg-cyber-yellow/10',
    advanced: 'text-cyber-pink border-cyber-pink bg-cyber-pink/10',
  }

  return (
    <div className="glass-card p-6">
      <h3 className="cyber-text text-lg text-cyber-cyan mb-4">
        &gt; SELECT_LESSON
      </h3>
      
      <div className="space-y-3">
        {lessons.map(lesson => {
          const isActive = currentLesson.id === lesson.id
          const difficultyClass = difficultyColors[lesson.difficulty]
          
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              className={`
                w-full p-4 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'border-cyber-green bg-cyber-green/20 glow-green' 
                  : 'border-gray-700 hover:border-cyber-green/50 hover:bg-cyber-gray/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className={`font-bold ${isActive ? 'text-cyber-green' : 'text-white'}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {lesson.words.length} words
                  </p>
                </div>
                
                <span className={`
                  px-3 py-1 rounded-full text-xs border cyber-text
                  ${difficultyClass}
                `}>
                  {lesson.difficulty.toUpperCase()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">
                    {isActive ? 'LEARNED' : 'NOT STARTED'}
                  </span>
                  <span className={isActive ? 'text-cyber-green' : 'text-gray-500'}>
                    {isActive ? `${learnedCount}/${lesson.words.length}` : '0/' + lesson.words.length}
                  </span>
                </div>
                <div className="cyber-progress h-2">
                  <div 
                    className={`cyber-progress-bar ${isActive ? 'bg-cyber-green' : ''}`} 
                    style={{ width: isActive ? `${(learnedCount / lesson.words.length) * 100}%` : '0%' }} 
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Total Progress */}
      <div className="mt-6 p-4 bg-cyber-black/50 rounded-lg border border-cyber-green/20">
        <p className="text-xs text-gray-500 mb-2">TOTAL MASTERY</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="cyber-progress h-2">
              <div className="cyber-progress-bar" style={{ width: '15%' }} />
            </div>
          </div>
          <span className="text-cyber-green text-sm font-bold">15%</span>
        </div>
      </div>
    </div>
  )
}

export default LessonSelect
