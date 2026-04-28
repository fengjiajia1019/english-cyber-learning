import { useState, useCallback } from 'react'
import MatrixRain from './components/MatrixRain'
import Terminal from './components/Terminal'
import TypingArea from './components/TypingArea'
import Stats from './components/Stats'
import Sidebar from './components/Sidebar'
import LessonSelect from './components/LessonSelect'

export interface Word {
  english: string
  chinese: string
  pronunciation: string
}

export interface Lesson {
  id: number
  title: string
  words: Word[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface GameState {
  currentWordIndex: number
  correctCount: number
  wrongCount: number
  streak: number
  maxStreak: number
  startTime: number
  lessonId: number
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Cyber Basics',
    difficulty: 'beginner',
    words: [
      { english: 'hack', chinese: '黑客攻击', pronunciation: '/hæk/' },
      { english: 'code', chinese: '代码', pronunciation: '/koʊd/' },
      { english: 'data', chinese: '数据', pronunciation: '/ˈdeɪtə/' },
      { english: 'system', chinese: '系统', pronunciation: '/ˈsɪstəm/' },
      { english: 'network', chinese: '网络', pronunciation: '/ˈnetwɜːrk/' },
      { english: 'encrypt', chinese: '加密', pronunciation: '/ɪnˈkrɪpt/' },
      { english: 'firewall', chinese: '防火墙', pronunciation: '/ˈfaɪərwɔːl/' },
      { english: 'virus', chinese: '病毒', pronunciation: '/ˈvaɪrəs/' },
      { english: 'debug', chinese: '调试', pronunciation: '/diːˈbʌɡ/' },
      { english: 'server', chinese: '服务器', pronunciation: '/ˈsɜːrvər/' },
    ]
  },
  {
    id: 2,
    title: 'Terminal Commands',
    difficulty: 'intermediate',
    words: [
      { english: 'sudo', chinese: '超级用户', pronunciation: '/ˈsuːduː/' },
      { english: 'grep', chinese: '全局搜索', pronunciation: '/ɡrep/' },
      { english: 'chmod', chinese: '修改权限', pronunciation: '/tʃmɒd/' },
      { english: 'ssh', chinese: '安全外壳', pronunciation: '/ɛsɛsˈeɪtʃ/' },
      { english: 'curl', chinese: '数据传输', pronunciation: '/kɜːrl/' },
      { english: 'docker', chinese: '容器引擎', pronunciation: '/ˈdɒkər/' },
      { english: 'kernel', chinese: '内核', pronunciation: '/ˈkɜːrnəl/' },
      { english: 'daemon', chinese: '守护进程', pronunciation: '/ˈdiːmən/' },
      { english: 'syntax', chinese: '语法', pronunciation: '/ˈsɪntæks/' },
      { english: 'compile', chinese: '编译', pronunciation: '/kəmˈpaɪl/' },
    ]
  },
  {
    id: 3,
    title: 'AI & Machine Learning',
    difficulty: 'advanced',
    words: [
      { english: 'neural', chinese: '神经网络的', pronunciation: '/ˈnjʊərəl/' },
      { english: 'algorithm', chinese: '算法', pronunciation: '/ˈælɡərɪðəm/' },
      { english: 'training', chinese: '训练', pronunciation: '/ˈtreɪnɪŋ/' },
      { english: 'inference', chinese: '推理', pronunciation: '/ˈɪnfərəns/' },
      { english: 'gradient', chinese: '梯度', pronunciation: '/ˈɡreɪdiənt/' },
      { english: 'tensor', chinese: '张量', pronunciation: '/ˈtɛnsər/' },
      { english: 'backprop', chinese: '反向传播', pronunciation: '/bækprəˈpæɡeɪʃən/' },
      { english: 'overfit', chinese: '过拟合', pronunciation: '/ˌoʊvərˈfɪt/' },
      { english: 'batch', chinese: '批次', pronunciation: '/bætʃ/' },
      { english: 'epoch', chinese: '轮次', pronunciation: '/ˈiːpɒk/' },
    ]
  }
]

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    maxStreak: 0,
    startTime: Date.now(),
    lessonId: 1
  })

  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0])
  const [input, setInput] = useState('')
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [wpm, setWpm] = useState(0)

  const currentLesson = lessons.find(l => l.id === selectedLesson.id) || lessons[0]
  const currentWord = currentLesson.words[gameState.currentWordIndex]

  const calculateWPM = useCallback(() => {
    const elapsed = (Date.now() - gameState.startTime) / 1000 / 60 // minutes
    if (elapsed > 0) {
      return Math.round(gameState.correctCount / elapsed)
    }
    return 0
  }, [gameState.startTime, gameState.correctCount])

  const handleKeyPress = useCallback((key: string) => {
    if (!isStarted) setIsStarted(true)
    
    const expectedChar = currentWord.english[input.length]
    
    if (key === expectedChar) {
      setInput(prev => prev + key)
      setLastResult('correct')
      
      // Word completed
      if (input.length + 1 === currentWord.english.length) {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            currentWordIndex: (prev.currentWordIndex + 1) % currentLesson.words.length,
            correctCount: prev.correctCount + 1,
            streak: prev.streak + 1,
            maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
          }))
          setInput('')
          setLastResult(null)
        }, 300)
      }
    } else {
      setLastResult('wrong')
      setGameState(prev => ({
        ...prev,
        wrongCount: prev.wrongCount + 1,
        streak: 0
      }))
      setTimeout(() => setLastResult(null), 500)
    }
    
    setWpm(calculateWPM())
  }, [input, currentWord, currentLesson.words.length, isStarted, calculateWPM])

  const handleBackspace = useCallback(() => {
    setInput(prev => prev.slice(0, -1))
  }, [])

  const handleSpace = useCallback(() => {
    // Space typically not needed for single word typing
  }, [])

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setGameState({
      currentWordIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      maxStreak: 0,
      startTime: Date.now(),
      lessonId: lesson.id
    })
    setInput('')
    setIsStarted(false)
    setWpm(0)
  }

  const accuracy = gameState.correctCount + gameState.wrongCount > 0
    ? Math.round((gameState.correctCount / (gameState.correctCount + gameState.wrongCount)) * 100)
    : 100

  return (
    <div className="min-h-screen bg-cyber-black grid-bg relative">
      <MatrixRain />
      <div className="scanlines" />
      
      <div className="relative z-10 flex">
        <Sidebar />
        
        <main className="flex-1 p-8 ml-64">
          {/* Header */}
          <header className="mb-8">
            <h1 className="cyber-text text-4xl font-bold text-cyber-green cyber-text-glow mb-2">
              CYBER//LEARN
            </h1>
            <p className="text-gray-400 text-sm">
              &gt; SYSTEM ONLINE // KEYBOARD INTERFACE ACTIVE_
            </p>
          </header>

          {/* Stats Bar */}
          <Stats 
            wpm={wpm}
            accuracy={accuracy}
            streak={gameState.streak}
            correctCount={gameState.correctCount}
            wrongCount={gameState.wrongCount}
          />

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-2 gap-8">
            {/* Lesson Select */}
            <LessonSelect 
              lessons={lessons} 
              currentLesson={currentLesson}
              onSelect={startLesson}
            />

            {/* Terminal with Typing Area */}
            <div className="space-y-4">
              <Terminal 
                title={`LESSON_${currentLesson.id}: ${currentLesson.title.toUpperCase()}`}
              >
                <div className="text-center py-8">
                  {/* Current Word */}
                  <div className="mb-8">
                    <span className="text-gray-500 text-sm block mb-2">
                      {currentWord.pronunciation}
                    </span>
                    <h2 className={`text-5xl font-bold mb-4 transition-all duration-200 ${
                      lastResult === 'correct' ? 'text-cyber-green' :
                      lastResult === 'wrong' ? 'text-cyber-pink' : 'text-white'
                    }`}>
                      {currentWord.chinese}
                    </h2>
                    
                    {/* Typing Display */}
                    <div className="flex justify-center items-center gap-1 text-4xl font-mono mt-6">
                      {currentWord.english.split('').map((char, idx) => (
                        <span
                          key={idx}
                          className={`transition-all duration-100 ${
                            idx < input.length 
                              ? 'text-cyber-green' 
                              : idx === input.length 
                                ? 'border-b-2 border-cyber-green text-cyber-green animate-pulse'
                                : 'text-gray-600'
                          }`}
                        >
                          {char}
                        </span>
                      ))}
                      {input.length === currentWord.english.length && (
                        <span className="typing-cursor" />
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="cyber-progress w-full max-w-md mx-auto mb-4">
                    <div 
                      className="cyber-progress-bar"
                      style={{ width: `${((gameState.currentWordIndex + 1) / currentLesson.words.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {gameState.currentWordIndex + 1} / {currentLesson.words.length}
                  </p>
                </div>
              </Terminal>

              {/* Virtual Keyboard */}
              <TypingArea 
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                expectedKeys={currentWord.english}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 text-xs">
            <p>&gt; POWERED BY NEURAL NETWORK // V{currentLesson.difficulty.toUpperCase()}_MODE</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
