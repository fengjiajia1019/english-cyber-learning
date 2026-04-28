import { useState, useCallback, useEffect, useRef } from 'react'
import MatrixRain from '../components/MatrixRain'

export interface Phrase {
  text: string
  chinese: string
  level: number
}

export interface Sentence {
  id: number
  title: string
  chinese: string
  english: string
  phrases: string[][]
}

const sentences: Sentence[] = [
  {
    id: 1,
    title: 'The Quick Brown Fox',
    chinese: '快速棕色狐狸',
    english: 'The quick brown fox jumps over the lazy dog',
    phrases: [
      ['The quick', '快速的'],
      ['brown fox', '棕色狐狸'],
      ['jumps over', '跳过'],
      ['the lazy', '那只懒'],
      ['dog', '狗']
    ]
  },
  {
    id: 2,
    title: 'All That Glitters',
    chinese: '闪光的不一定都是金子',
    english: 'All that glitters is not gold',
    phrases: [
      ['All that', '所有那些'],
      ['glitters', '闪光'],
      ['is not', '不是'],
      ['gold', '金子']
    ]
  },
  {
    id: 3,
    title: 'Knowledge Is Power',
    chinese: '知识就是力量',
    english: 'Knowledge is power',
    phrases: [
      ['Knowledge', '知识'],
      ['is', '是'],
      ['power', '力量']
    ]
  },
  {
    id: 4,
    title: 'To Be Or Not To Be',
    chinese: '生存还是毁灭',
    english: 'To be or not to be that is the question',
    phrases: [
      ['To be', '生存'],
      ['or not', '还是毁灭'],
      ['to be', '去存在'],
      ['that is', '那就是'],
      ['the question', '问题']
    ]
  },
  {
    id: 5,
    title: 'Practice Makes Perfect',
    chinese: '熟能生巧',
    english: 'Practice makes perfect',
    phrases: [
      ['Practice', '练习'],
      ['makes', '造就'],
      ['perfect', '完美']
    ]
  }
]

interface PhraseGroup {
  text: string
  chinese: string
  level: number
}

function buildPhraseGroups(sentence: Sentence): PhraseGroup[] {
  const groups: PhraseGroup[] = []
  
  // Level 1: Individual phrases
  sentence.phrases.forEach((phrase) => {
    groups.push({
      text: phrase[0],
      chinese: phrase[1],
      level: 1
    })
  })
  
  // Level 2: Two phrase combinations
  for (let i = 0; i < sentence.phrases.length - 1; i++) {
    groups.push({
      text: `${sentence.phrases[i][0]} ${sentence.phrases[i + 1][0]}`,
      chinese: `${sentence.phrases[i][1]}${sentence.phrases[i + 1][1]}`,
      level: 2
    })
  }
  
  // Level 3: Three phrase combinations
  for (let i = 0; i < sentence.phrases.length - 2; i++) {
    groups.push({
      text: `${sentence.phrases[i][0]} ${sentence.phrases[i + 1][0]} ${sentence.phrases[i + 2][0]}`,
      chinese: `${sentence.phrases[i][1]}${sentence.phrases[i + 1][1]}${sentence.phrases[i + 2][1]}`,
      level: 3
    })
  }
  
  // Level 4: Full sentence
  groups.push({
    text: sentence.english,
    chinese: sentence.chinese,
    level: 4
  })
  
  return groups
}

interface DictationProps {
  onBack: () => void
}

const Dictation = ({ onBack }: DictationProps) => {
  const [currentSentence, setCurrentSentence] = useState<Sentence>(sentences[0])
  const [phraseGroups, setPhraseGroups] = useState<PhraseGroup[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [masteredPhrases, setMasteredPhrases] = useState<Set<number>>(new Set())
  const [levelFilter, setLevelFilter] = useState<number | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionWrong, setSessionWrong] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPhraseGroups(buildPhraseGroups(currentSentence))
  }, [currentSentence])

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentIndex])

  const currentPhrase = phraseGroups[currentIndex]

  const filteredGroups = levelFilter 
    ? phraseGroups.filter(g => g.level === levelFilter)
    : phraseGroups

  const displayIndex = filteredGroups.findIndex(g => g.text === currentPhrase?.text)
  const progressPercent = phraseGroups.length > 0 
    ? Math.round((masteredPhrases.size / phraseGroups.length) * 100) 
    : 0

  const handleSubmit = useCallback(() => {
    if (!currentPhrase) return

    if (input.toLowerCase().trim() === currentPhrase.text.toLowerCase().trim()) {
      // Correct!
      setIsCorrect(true)
      setMasteredPhrases(prev => new Set([...prev, currentIndex]))
      setSessionCorrect(prev => prev + 1)
      
      setTimeout(() => {
        setIsCorrect(false)
        setInput('')
        if (currentIndex < phraseGroups.length - 1) {
          // Find next unmastered phrase
          let next = currentIndex + 1
          while (next < phraseGroups.length && masteredPhrases.has(next)) {
            next++
          }
          if (next < phraseGroups.length) {
            setCurrentIndex(next)
          } else {
            // All mastered or wrap around
            setCurrentIndex((currentIndex + 1) % phraseGroups.length)
          }
        } else {
          setCurrentIndex(0)
        }
      }, 500)
    } else {
      // Wrong
      setIsShaking(true)
      setSessionWrong(prev => prev + 1)
      setTimeout(() => {
        setIsShaking(false)
        setInput('')
        inputRef.current?.focus()
      }, 500)
    }
  }, [input, currentPhrase, currentIndex, phraseGroups.length, masteredPhrases])

  const handleSkip = () => {
    setInput('')
    if (currentIndex < phraseGroups.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
    inputRef.current?.focus()
  }

  const handlePrev = () => {
    setInput('')
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(phraseGroups.length - 1)
    }
    inputRef.current?.focus()
  }

  const handleNext = () => {
    setInput('')
    handleSkip()
  }

  const selectSentence = (sentence: Sentence) => {
    setCurrentSentence(sentence)
    setCurrentIndex(0)
    setMasteredPhrases(new Set())
    setInput('')
    setLevelFilter(null)
    inputRef.current?.focus()
  }

  const accuracy = sessionCorrect + sessionWrong > 0
    ? Math.round((sessionCorrect / (sessionCorrect + sessionWrong)) * 100)
    : 100

  const levelNames: Record<number, string> = {
    1: '单词',
    2: '双词组',
    3: '三词组',
    4: '全句'
  }

  return (
    <div className="min-h-screen bg-cyber-black grid-bg relative">
      <MatrixRain />
      <div className="scanlines" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-cyber-green/20">
          <button 
            onClick={onBack}
            className="cyber-button text-sm flex items-center gap-2"
          >
            <span>←</span> 返回
          </button>
          
          <h1 className="cyber-text text-2xl font-bold text-cyber-green cyber-text-glow">
            听写模式
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-cyber-cyan">
              正确: <span className="text-cyber-green font-bold">{sessionCorrect}</span>
            </span>
            <span className="text-cyber-pink">
              错误: <span className="font-bold">{sessionWrong}</span>
            </span>
            <span className="text-gray-400">
              正确率: <span className={accuracy >= 80 ? 'text-cyber-green' : accuracy >= 50 ? 'text-cyber-yellow' : 'text-cyber-pink'}>{accuracy}%</span>
            </span>
          </div>
        </header>

        {/* Sentence Selector */}
        <div className="px-6 py-4 border-b border-cyber-green/10 bg-cyber-dark/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sentences.map(sentence => (
              <button
                key={sentence.id}
                onClick={() => selectSentence(sentence)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  currentSentence.id === sentence.id
                    ? 'bg-cyber-green/20 border border-cyber-green text-cyber-green'
                    : 'bg-cyber-gray/50 border border-gray-700 text-gray-400 hover:border-cyber-green/50'
                }`}
              >
                {sentence.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            {/* Level Filter */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setLevelFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  levelFilter === null
                    ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green'
                    : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'
                }`}
              >
                全部
              </button>
              {[1, 2, 3, 4].map(level => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    levelFilter === level
                      ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green'
                      : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'
                  }`}
                >
                  {levelNames[level]}
                </button>
              ))}
            </div>

            {/* Main Card */}
            <div className={`glass-card p-12 text-center transition-all duration-200 ${
              isShaking ? 'wrong-animation border-cyber-red' : 
              isCorrect ? 'correct-animation border-cyber-green' : ''
            }`}>
              {/* Chinese Meaning - THE ONLY HINT */}
              <div className="mb-8">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  请拼写出以下内容
                </p>
                <h2 className={`text-4xl md:text-5xl font-bold ${
                  isShaking ? 'text-cyber-red' : 'text-white'
                }`}>
                  {currentPhrase?.chinese || '加载中...'}
                </h2>
                {showHint && currentPhrase && (
                  <p className="text-cyber-cyan text-sm mt-4">
                    提示: {currentPhrase.text.split(' ').length} 个词
                  </p>
                )}
              </div>

              {/* Input Area */}
              <div className={`mb-8 px-8 ${
                isShaking ? 'text-cyber-red' : 'text-cyber-green'
              }`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  className={`
                    w-full bg-transparent border-b-2 text-center text-3xl md:text-4xl font-mono
                    outline-none py-4 placeholder-gray-700
                    ${isShaking ? 'border-cyber-red' : 
                      input.length > 0 ? 'border-cyber-green' : 'border-gray-700'}
                  `}
                  placeholder="输入答案..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <div className="mt-4">
                  {input.toLowerCase().trim() === currentPhrase?.text.toLowerCase().trim() ? (
                    <span className="text-cyber-green text-sm animate-pulse">✓ 正确！</span>
                  ) : input.length > 0 ? (
                    <span className="text-gray-500 text-sm">按 Enter 确认</span>
                  ) : null}
                </div>
              </div>

              {/* Hint Toggle */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-gray-500 text-sm hover:text-cyber-cyan transition-colors mb-4"
              >
                {showHint ? '隐藏提示' : '显示提示(词数)'}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={handlePrev}
                className="cyber-button text-sm"
              >
                ← 上一题
              </button>
              <button 
                onClick={handleSkip}
                className="cyber-button text-sm border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10"
              >
                跳过 →
              </button>
              <button 
                onClick={handleNext}
                className="cyber-button text-sm"
              >
                下一题 →
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 border-t border-cyber-green/20 bg-cyber-dark/50">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm whitespace-nowrap">
              词组进度: {phraseGroups.length > 0 ? displayIndex + 1 : 0}/{filteredGroups.length}
            </span>
            <div className="flex-1 cyber-progress h-3">
              <div 
                className={`cyber-progress-bar ${
                  progressPercent >= 80 ? 'bg-cyber-green' : 
                  progressPercent >= 50 ? 'bg-cyber-yellow' : 'bg-cyber-cyan'
                }`}
                style={{ width: `${filteredGroups.length > 0 ? ((displayIndex + 1) / filteredGroups.length) * 100 : 0}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${
              progressPercent >= 80 ? 'text-cyber-green' : 
              progressPercent >= 50 ? 'text-cyber-yellow' : 'text-cyber-cyan'
            }`}>
              {filteredGroups.length > 0 ? Math.round(((displayIndex + 1) / filteredGroups.length) * 100) : 0}%
            </span>
          </div>
          
          {/* Mastered indicator */}
          <div className="flex gap-1 mt-3 justify-center flex-wrap">
            {phraseGroups.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-cyber-green scale-125' 
                    : masteredPhrases.has(idx)
                      ? 'bg-cyber-green/50'
                      : phrase.level === 1 ? 'bg-cyber-cyan/50'
                      : phrase.level === 2 ? 'bg-cyber-yellow/50'
                      : phrase.level === 3 ? 'bg-cyber-purple/50'
                      : 'bg-cyber-pink/50'
                }`}
                title={`${phrase.text} (${levelNames[phrase.level]})`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dictation
