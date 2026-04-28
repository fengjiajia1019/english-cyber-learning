import { useState, useCallback, useEffect, useRef } from 'react'
import MatrixRain from '../components/MatrixRain'

export interface Sentence {
  id: number
  title: string
  type: 'sst' | 'we'
  chinese: string
  english: string
  phrases: string[][]
}

const sentences: Sentence[] = [
  {
    id: 1,
    title: 'SST: Skilled Trades',
    type: 'sst',
    chinese: '世界各地需要技术工人，收入高于加拿大平均水平',
    english: 'Skilled trades and traders are needed around the world.',
    phrases: [
      ['Skilled trades', '技术工人'],
      ['and traders', '和贸易商'],
      ['are needed', '需要'],
      ['around the world', '世界各地'],
      ['These jobs', '这些工作'],
      ['are good for', '适合'],
      ['not good at', '不擅长'],
      ['working in offices', '坐办公室'],
      ['higher pay', '更高薪资'],
      ['than average', '比平均水平'],
      ['in Canada', '在加拿大']
    ]
  },
  {
    id: 2,
    title: 'SST: Phone Interview',
    type: 'sst',
    chinese: '电话面试要自信愉快，简短停顿，仔细听问题',
    english: 'In a phone interview, speak confidently, use a pleasant tone.',
    phrases: [
      ['In a phone interview', '电话面试'],
      ['speak confidently', '自信地说'],
      ['use a pleasant tone', '用愉快语气'],
      ['and energy', '和活力'],
      ['pause briefly', '简短停顿'],
      ['listen to questions', '仔细听问题']
    ]
  },
  {
    id: 3,
    title: 'SST: Orientations',
    type: 'sst',
    chinese: '入职培训有时无聊浪费时间，小规模更有效',
    english: 'Orientations are training sessions. Smaller sessions make them more effective.',
    phrases: [
      ['Orientations are', '入职培训是'],
      ['training sessions', '培训课程'],
      ['for new employees', '为新员工'],
      ['can be boring', '可能无聊'],
      ['a waste of time', '浪费时间'],
      ['Smaller sessions', '小规模课程'],
      ['more effective', '更有效']
    ]
  },
  {
    id: 4,
    title: 'SST: First School Day',
    type: 'sst',
    chinese: '开学第一天记住老师名字和教室号，别忘带钱买午餐',
    english: 'On the first day of school, remember the teachers and classrooms.',
    phrases: [
      ['On the first day', '第一天'],
      ['of school', '上学'],
      ['remember names', '记住名字'],
      ['of the teachers', '老师们'],
      ['and numbers', '和号码'],
      ['of classrooms', '教室'],
      ['Do not forget', '别忘了'],
      ['bring money', '带钱'],
      ['to buy lunch', '买午餐']
    ]
  },
  {
    id: 5,
    title: 'SST: Job Interview',
    type: 'sst',
    chinese: '面试展示超越简单回答的沟通技巧',
    english: 'In a job interview, a manager looks for communication skills.',
    phrases: [
      ['In a job interview', '求职面试'],
      ['a manager looks', '经理寻找'],
      ['for your ability', '你的能力'],
      ['to express thoughts', '表达思想'],
      ['describe actions', '描述行动'],
      ['and motions', '和动作'],
      ['share stories', '分享故事'],
      ['communication skills', '沟通技巧']
    ]
  },
  {
    id: 6,
    title: 'SST: Park Cleaning',
    type: 'sst',
    chinese: '清洁公园三项工作：捡垃圾、清理异物、粉刷',
    english: 'There are three jobs for cleaning up a park.',
    phrases: [
      ['three jobs', '三项工作'],
      ['for cleaning', '用于清洁'],
      ['up a park', '公园'],
      ['cleaning up trash', '清理垃圾'],
      ['picking up things', '捡拾东西'],
      ['on the ground', '在地上'],
      ['painting walls', '粉刷墙壁'],
      ['and tables', '和桌子']
    ]
  },
  {
    id: 7,
    title: 'SST: Wash Fruits',
    type: 'sst',
    chinese: '吃水果前用冷水清洗，已洗的要阅读标签',
    english: 'We should use cold water to wash fruits before eating.',
    phrases: [
      ['use cold water', '用冷水'],
      ['wash fruits', '清洗水果'],
      ['and vegetables', '和蔬菜'],
      ['before eating', '吃之前'],
      ['Pre-washed ones', '已洗的'],
      ['need to read', '需要阅读'],
      ['the label', '标签']
    ]
  },
  {
    id: 8,
    title: 'SST: Rail Pass',
    type: 'sst',
    chinese: '铁路通票提供折扣，老年乘客需预约，出行前仔细计划',
    english: 'The Rail Pass offers train access and discounts.',
    phrases: [
      ['The Rail Pass', '铁路通票'],
      ['offers train', '提供火车'],
      ['access and discounts', '通行和折扣'],
      ['older passengers', '老年乘客'],
      ['need reservations', '需要预约'],
      ['Plan carefully', '仔细计划'],
      ['before travelling', '旅行前']
    ]
  },
  {
    id: 9,
    title: 'WE: Lost Bag',
    type: 'we',
    chinese: '询问餐厅丢失的包，请帮忙联系',
    english: 'Dear Manager, I am writing to enquire about a bag.',
    phrases: [
      ['Dear Manager,', '尊敬的经理'],
      ['I am writing', '我写信'],
      ['to enquire about', '询问'],
      ['a bag', '一个包'],
      ['I left', '我留下'],
      ['at your restaurant', '在您的餐厅'],
      ['my friends', '我和朋友'],
      ['had dinner', '吃了晚餐'],
      ['seated at table', '坐在桌子'],
      ['by window', '靠窗'],
      ['small black backpack', '小黑色背包'],
      ['red zipper', '红色拉链'],
      ['silver keychain', '银色钥匙扣'],
      ['blue notebook', '蓝色笔记本'],
      ['pair of glasses', '一副眼镜'],
      ['please contact me', '请联系我'],
      ['by email', '通过邮件'],
      ['or phone', '或电话'],
      ['Thank you', '谢谢'],
      ['Kind regards,', '此致敬礼'],
      ['Lily', 'Lily']
    ]
  },
  {
    id: 10,
    title: 'WE: Vacation Request',
    type: 'we',
    chinese: '请求两周假期，5月6日至19日，探望父母',
    english: 'Dear Dani, I am writing to request a two-week vacation.',
    phrases: [
      ['Dear Dani,', '尊敬的Dani'],
      ['I am writing', '我写信'],
      ['to request', '请求'],
      ['a two-week vacation', '两周假期'],
      ['from May 6th', '从5月6日'],
      ['to May 19th', '到5月19日'],
      ['returning to work', '返工'],
      ['on May 20th', '5月20日'],
      ['the reason is', '原因是'],
      ['to visit my parents', '探望父母'],
      ['assist them', '协助他们'],
      ['with family matters', '家事'],
      ['Tom has agreed', 'Tom已同意'],
      ['to cover my tasks', '承担我的任务'],
      ['during my absence', '我不在时'],
      ['please feel free', '请随时'],
      ['to email or call', '发邮件或打电话'],
      ['Thank you', '谢谢'],
      ['Best regards,', '此致敬礼'],
      ['Lily', 'Lily']
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
  sentence.phrases.forEach((phrase) => {
    if (phrase[0].trim()) groups.push({ text: phrase[0], chinese: phrase[1], level: 1 })
  })
  for (let i = 0; i < sentence.phrases.length - 1; i++) {
    const text = sentence.phrases[i][0] + ' ' + sentence.phrases[i + 1][0]
    const chinese = sentence.phrases[i][1] + sentence.phrases[i + 1][1]
    if (text.trim()) groups.push({ text, chinese, level: 2 })
  }
  for (let i = 0; i < sentence.phrases.length - 2; i++) {
    const text = sentence.phrases[i][0] + ' ' + sentence.phrases[i + 1][0] + ' ' + sentence.phrases[i + 2][0]
    const chinese = sentence.phrases[i][1] + sentence.phrases[i + 1][1] + sentence.phrases[i + 2][1]
    if (text.trim()) groups.push({ text, chinese, level: 3 })
  }
  groups.push({ text: sentence.english, chinese: sentence.chinese, level: 4 })
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
  const [typeFilter, setTypeFilter] = useState<'all' | 'sst' | 'we'>('all')
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionWrong, setSessionWrong] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setPhraseGroups(buildPhraseGroups(currentSentence)) }, [currentSentence])
  useEffect(() => { inputRef.current?.focus() }, [currentIndex])

  const filteredSentences = typeFilter === 'all' ? sentences : sentences.filter(s => s.type === typeFilter)
  const currentPhrase = phraseGroups[currentIndex]

  const handleSubmit = useCallback(() => {
    if (!currentPhrase) return
    if (input.toLowerCase().trim() === currentPhrase.text.toLowerCase().trim()) {
      setIsCorrect(true)
      setMasteredPhrases(prev => new Set([...prev, currentIndex]))
      setSessionCorrect(prev => prev + 1)
      setTimeout(() => {
        setIsCorrect(false)
        setInput('')
        setCurrentIndex(prev => prev < phraseGroups.length - 1 ? prev + 1 : 0)
      }, 500)
    } else {
      setIsShaking(true)
      setSessionWrong(prev => prev + 1)
      setTimeout(() => { setIsShaking(false); setInput(''); inputRef.current?.focus() }, 500)
    }
  }, [input, currentPhrase, currentIndex, phraseGroups.length])

  const handleSkip = () => { setInput(''); setCurrentIndex(prev => prev < phraseGroups.length - 1 ? prev + 1 : 0); inputRef.current?.focus() }
  const handlePrev = () => { setInput(''); setCurrentIndex(prev => prev > 0 ? prev - 1 : phraseGroups.length - 1); inputRef.current?.focus() }
  const selectSentence = (sentence: Sentence) => { setCurrentSentence(sentence); setCurrentIndex(0); setMasteredPhrases(new Set()); setInput('') }
  const accuracy = sessionCorrect + sessionWrong > 0 ? Math.round((sessionCorrect / (sessionCorrect + sessionWrong)) * 100) : 100
  const levelNames: Record<number, string> = { 1: '单词', 2: '双词组', 3: '三词组', 4: '全句' }

  return (
    <div className="min-h-screen bg-cyber-black grid-bg relative">
      <MatrixRain />
      <div className="scanlines" />
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-cyber-green/20">
          <button onClick={onBack} className="cyber-button text-sm">← 返回</button>
          <h1 className="cyber-text text-2xl font-bold text-cyber-green cyber-text-glow">听写模式</h1>
          <div className="flex items-center gap-4">
            <span className="text-cyber-green">正确: <span className="font-bold">{sessionCorrect}</span></span>
            <span className="text-cyber-pink">错误: <span className="font-bold">{sessionWrong}</span></span>
            <span className="text-gray-400">正确率: <span className={accuracy >= 80 ? 'text-cyber-green' : 'text-cyber-yellow'}>{accuracy}%</span></span>
          </div>
        </header>

        <div className="px-6 py-4 border-b border-cyber-green/10 bg-cyber-dark/50">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-sm ${typeFilter === 'all' ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'}`}>全部</button>
            <button onClick={() => setTypeFilter('sst')} className={`px-4 py-2 rounded-lg text-sm ${typeFilter === 'sst' ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'}`}>SST</button>
            <button onClick={() => setTypeFilter('we')} className={`px-4 py-2 rounded-lg text-sm ${typeFilter === 'we' ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'}`}>WE</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredSentences.map(sentence => (
              <button key={sentence.id} onClick={() => selectSentence(sentence)} className={`px-4 py-2 rounded-lg whitespace-nowrap ${currentSentence.id === sentence.id ? 'bg-cyber-green/20 border border-cyber-green text-cyber-green' : 'bg-cyber-gray/50 border border-gray-700 text-gray-400 hover:border-cyber-green/50'}`}>{sentence.title}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            <div className="flex justify-center gap-2 mb-6">
              <button onClick={() => setLevelFilter(null)} className={`px-4 py-2 rounded-lg text-sm ${levelFilter === null ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'}`}>全部</button>
              {[1, 2, 3, 4].map(level => (
                <button key={level} onClick={() => setLevelFilter(level)} className={`px-4 py-2 rounded-lg text-sm ${levelFilter === level ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green' : 'bg-cyber-gray/50 text-gray-400 border border-gray-700'}`}>{levelNames[level]}</button>
              ))}
            </div>

            <div className={`glass-card p-12 text-center transition-all duration-200 ${isShaking ? 'wrong-animation border-cyber-red' : isCorrect ? 'correct-animation border-cyber-green' : ''}`}>
              <div className="mb-8">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">请拼写出以下内容</p>
                <h2 className={`text-4xl md:text-5xl font-bold ${isShaking ? 'text-cyber-red' : 'text-white'}`}>{currentPhrase?.chinese || '加载中...'}</h2>
                {showHint && currentPhrase && (
                  <p className="text-cyber-cyan text-sm mt-4">提示: {currentPhrase.text.split(' ').length} 个词</p>
                )}
              </div>

              <div className={`mb-8 px-8 ${isShaking ? 'text-cyber-red' : 'text-cyber-green'}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit() } }}
                  className={`w-full bg-transparent border-b-2 text-center text-3xl md:text-4xl font-mono outline-none py-4 ${isShaking ? 'border-cyber-red' : input.length > 0 ? 'border-cyber-green' : 'border-gray-700'}`}
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

              <button
                onClick={() => setShowHint(!showHint)}
                className="text-gray-500 text-sm hover:text-cyber-cyan transition-colors mb-4"
              >
                {showHint ? '隐藏提示' : '显示提示(词数)'}
              </button>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button onClick={handlePrev} className="cyber-button text-sm">← 上一题</button>
              <button onClick={handleSkip} className="cyber-button text-sm border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow/10">跳过 →</button>
              <button onClick={handleSkip} className="cyber-button text-sm">下一题 →</button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-cyber-green/20 bg-cyber-dark/50">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm whitespace-nowrap">词组进度: {currentIndex + 1}/{phraseGroups.length}</span>
            <div className="flex-1 cyber-progress h-3">
              <div className="cyber-progress-bar" style={{ width: `${((currentIndex + 1) / phraseGroups.length) * 100}%`}} />
            </div>
          </div>
          
          <div className="flex gap-1 mt-3 justify-center flex-wrap">
            {phraseGroups.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-cyber-green scale-125' : masteredPhrases.has(idx) ? 'bg-cyber-green/50' : phrase.level === 1 ? 'bg-cyber-cyan/50' : phrase.level === 2 ? 'bg-cyber-yellow/50' : phrase.level === 3 ? 'bg-cyber-purple/50' : 'bg-cyber-pink/50'
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
