import { useState, useCallback, useEffect, useRef } from 'react'
import MatrixRain from './components/MatrixRain'
import Terminal from './components/Terminal'
import TypingArea from './components/TypingArea'
import Stats from './components/Stats'
import Sidebar from './components/Sidebar'
import LessonSelect from './components/LessonSelect'
import Dictation from './pages/Dictation'

export type PageType = 'keyboard' | 'dictation'

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
  learnedIndices: number[]
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
  const [currentPage, setCurrentPage] = useState<PageType>('keyboard')
  
  const [gameState, setGameState] = useState<GameState>({
    learnedIndices: [],
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
  const [isShaking, setIsShaking] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [wpm, setWpm] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentLesson = lessons.find(l => l.id === selectedLesson.id) || lessons[0]
  const currentWord = currentLesson.words[gameState.currentWordIndex]

  const calculateWPM = useCallback(() => {
    const elapsed = (Date.now() - gameState.startTime) / 1000 / 60
    if (elapsed > 0) {
      return Math.round(gameState.correctCount / elapsed)
    }
    return 0
  }, [gameState.startTime, gameState.correctCount])

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [gameState.currentWordIndex])

  // Get next word - random from learned words, or progress to new
  const getNextWordIndex = useCallback(() => {
    const learnedCount = gameState.learnedIndices.length
    const totalWords = currentLesson.words.length

    if (learnedCount === 0) return 0
    if (learnedCount < totalWords) {
      // 70% chance from learned, 30% chance next new word
      if (Math.random() < 0.7 && learnedCount > 0) {
        return gameState.learnedIndices[Math.floor(Math.random() * learnedCount)]
      }
      return learnedCount // Next new word
    }
    // All learned - random from all
    return Math.floor(Math.random() * totalWords)
  }, [gameState.learnedIndices, currentLesson.words.length])

  const handleSubmit = useCallback(() => {
    if (input.toLowerCase() === currentWord.english.toLowerCase()) {
      // Correct!
      setGameState(prev => {
        const newLearned = prev.learnedIndices.includes(prev.currentWordIndex)
          ? prev.learnedIndices
          : [...prev.learnedIndices, prev.currentWordIndex]
        
        return {
          ...prev,
          learnedIndices: newLearned,
          correctCount: prev.correctCount + 1,
          streak: prev.streak + 1,
          maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
          currentWordIndex: getNextWordIndex()
        }
      })
      setInput('')
      setWpm(calculateWPM())
    } else {
      // Wrong - shake and clear
      setIsShaking(true)
      setGameState(prev => ({
        ...prev,
        wrongCount: prev.wrongCount + 1,
        streak: 0
      }))
      setTimeout(() => {
        setIsShaking(false)
        setInput('')
        inputRef.current?.focus()
      }, 500)
    }
    if (!isStarted) setIsStarted(true)
  }, [input, currentWord, isStarted, getNextWordIndex, calculateWPM])

  const handleKeyPress = useCallback((key: string) => {
    if (!isStarted) setIsStarted(true)
    setInput(prev => prev + key)
  }, [isStarted])

  const handleBackspace = useCallback(() => {
    setInput(prev => prev.slice(0, -1))
  }, [])

  const handleSpace = useCallback(() => {
    // Not used for single word typing
  }, [])

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setGameState({
      learnedIndices: [],
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
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const accuracy = gameState.correctCount + gameState.wrongCount > 0
    ? Math.round((gameState.correctCount / (gameState.correctCount + gameState.wrongCount)) * 100)
    : 100

  // Render dictation page in fullscreen mode
  if (currentPage === 'dictation') {
    return <Dictation onBack={() => setCurrentPage('keyboard')} />
  }

  return (
    <div className="min-h-screen bg-cyber-black grid-bg relative">
      <MatrixRain />
      <div className="scanlines" />
      
      <div className="relative z-10 flex">
        <Sidebar onPageChange={setCurrentPage} />
        
        <main className="flex-1 p-8 ml-64">
          {/* Header */}
          <header className="mb-8">
            <h1 className="cyber-text text-4xl font-bold text-cyber-green cyber-text-glow mb-2">
              CYBER//LEARN
            </h1>
            <p className="text-gray-400 text-sm">
              &gt; SYSTEM ONLINE // PRESS ENTER TO SUBMIT_
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
              learnedCount={gameState.learnedIndices.length}
              onSelect={startLesson}
            />

            {/* Terminal with Typing Area */}
            <div className="space-y-4">
              <Terminal 
                title={`LESSON_${currentLesson.id}: ${currentLesson.title.toUpperCase()}`}
              >
                <div className={`text-center py-8 ${isShaking ? 'wrong-animation' : ''}`}>
                  {/* Current Word */}
                  <div className="mb-8">
                    <span className="text-gray-500 text-sm block mb-2">
                      {currentWord.pronunciation}
                    </span>
                    <h2 className={`text-5xl font-bold mb-4 transition-all duration-200 ${
                      isShaking ? 'text-cyber-red' : 'text-white'
                    }`}>
                      {currentWord.chinese}
                    </h2>
                    
                    {/* Input Display */}
                    <div className={`flex justify-center items-center gap-1 text-4xl font-mono mt-6 px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                      isShaking 
                        ? 'border-cyber-red bg-cyber-red/20' 
                        : input.length > 0 
                          ? 'border-cyber-green/50 bg-cyber-green/10' 
                          : 'border-gray-700'
                    }`}>
                      <span className={input.length > 0 ? 'text-cyber-green' : 'text-gray-600'}>
                        {input || ' '}
                      </span>
                      <span className="typing-cursor" />
                    </div>

                    {/* Hidden real input for keyboard */}
                    <input
                      ref={inputRef}
                      type="text"
                      className="absolute opacity-0 pointer-events-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                      autoFocus
                    />
                  </div>

                  {/* Submit Hint */}
                  <div className="mb-4">
                    <span className={`px-4 py-2 rounded-lg text-sm ${
                      input.length === currentWord.english.length
                        ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green'
                        : 'bg-gray-800/50 text-gray-500 border border-gray-700'
                    }`}>
                      {input.length === currentWord.english.length 
                        ? '✓ PRESS ENTER TO SUBMIT' 
                        : `${input.length}/${currentWord.english.length} CHARS`}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="cyber-progress w-full max-w-md mx-auto mb-4">
                    <div 
                      className="cyber-progress-bar"
                      style={{ width: `${(gameState.learnedIndices.length / currentLesson.words.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    LEARNED: {gameState.learnedIndices.length} / {currentLesson.words.length}
                  </p>
                </div>
              </Terminal>

              {/* Virtual Keyboard */}
              <TypingArea 
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                onEnter={handleSubmit}
                expectedKeys={currentWord.english}
                disabled={isShaking}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 text-xs">
            <p>&gt; POWERED BY NEURAL NETWORK // REPEAT TO MASTER_</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
