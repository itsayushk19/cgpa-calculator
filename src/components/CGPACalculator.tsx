'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  allSubs, type CourseItem, type GradeRow,
  calcCgpa, cgpaLabelText, noCgpaOnes,
  type CourseLvl, type TermTag, type TermBits,
  termKeyish, termSort
} from '@/lib/data'
import { stashCgpa } from '@/lib/cgpa-store'
import {
  GraduationCap, TrendingUp, Target, ChevronDown,
  BookOpen, RotateCcw, X
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────

interface SubRowThing {
  entryId: string
  subject: CourseItem
  grade: string
  term: TermBits
  tab: 'completed' | 'ongoing' | 'future'
}

// ─── Constants ──────────────────────────────────────────

const gradeMainList = ["S", "A", "B", "C", "D", "E"]
const zeroGradeList = ["U", "WQ", "WA"]
const skipGradeBits = ["I"]

const gradeColorMap: Record<string, string> = {
  S: "bg-yellow-500 text-black",
  A: "bg-green-500 text-black",
  B: "bg-teal-500 text-white",
  C: "bg-blue-500 text-white",
  D: "bg-orange-500 text-black",
  E: "bg-amber-600 text-white",
  U: "bg-red-600 text-white",
  WQ: "bg-zinc-600 text-white",
  WA: "bg-zinc-600 text-white",
  I: "bg-zinc-700 text-zinc-300",
}

const ringColorMap: Record<string, string> = {
  S: "ring-yellow-400/40",
  A: "ring-green-500/40",
  B: "ring-teal-500/40",
  C: "ring-blue-500/40",
  D: "ring-orange-400/40",
  E: "ring-amber-600/40",
  U: "ring-red-500/40",
  WQ: "ring-zinc-500/40",
  WA: "ring-zinc-500/40",
  I: "ring-zinc-600/40",
}

const levelBadgeBits: Record<CourseLvl, { label: string; color: string }> = {
  FOUNDATION: { label: "Foundation", color: "text-sky-400" },
  DIPLOMA: { label: "Diploma", color: "text-violet-400" },
  DEGREE: { label: "Degree", color: "text-emerald-400" },
}

const termTagList: TermTag[] = ["JAN", "MAY", "SEP"]
const yearList = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

const subStatusLabel = (grade: string) => {
  if (skipGradeBits.includes(grade) || noCgpaOnes.includes(grade)) {
    return { label: "incomplete", className: "text-muted-foreground/50" }
  }
  if (zeroGradeList.includes(grade)) {
    return { label: "repeat", className: "text-red-400/70" }
  }
  if (gradeMainList.includes(grade)) {
    return { label: "pass", className: "text-emerald-400/70" }
  }
  return null
}

// ─── AnimatedNumber ─────────────────────────────────────

function NumWiggle({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(0)
  const sv = useSpring(mv, { stiffness: 100, damping: 30 })
  const [d, setD] = useState("0.00")
  useEffect(() => { mv.set(value) }, [value, mv])
  useEffect(() => {
    const unsub = sv.on("change", (v: number) => setD(v.toFixed(decimals)))
    return unsub
  }, [sv, decimals])
  return <span>{d}</span>
}

// ─── CGPARing ───────────────────────────────────────────

function RingMeter({ value, size = 50 }: { value: number; size?: number }) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const p = Math.min(value / 10, 1)
  const color = value >= 8 ? "#10b981" : value >= 6 ? "#f59e0b" : value >= 4 ? "#ef4444" : "#6b7280"

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={5} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={5} fill="none"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - p) }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </svg>
    </div>
  )
}

// ─── GradePills ─────────────────────────────────────────

function GradeBtns({ selected, onChange }: { selected: string; onChange: (g: string) => void }) {
  const inactive = "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
  const inactiveDim = "bg-white/[0.03] text-white/25 hover:bg-white/8 hover:text-white/45"

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {gradeMainList.map(g => (
        <button key={g} onClick={() => onChange(g)}
          className={`h-6 min-w-6 px-1.5 text-[10px] font-bold rounded-md transition-all ${
            selected === g ? `${gradeColorMap[g]} ring-1 ${ringColorMap[g]}` : inactive
          }`}
        >{g}</button>
      ))}
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      {zeroGradeList.map(g => (
        <button key={g} onClick={() => onChange(g)}
          className={`h-6 px-1.5 text-[10px] font-bold rounded-md transition-all ${
            selected === g ? `${gradeColorMap[g]} ring-1 ${ringColorMap[g]}` : inactiveDim
          }`}
        >{g}</button>
      ))}
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      {skipGradeBits.map(g => (
        <button key={g} onClick={() => onChange(g)}
          className={`h-6 px-1.5 text-[10px] font-bold rounded-md transition-all italic ${
            selected === g ? `${gradeColorMap[g]} ring-1 ${ringColorMap[g]}` : inactiveDim
          }`}
        >{g}</button>
      ))}
    </div>
  )
}

// ─── TermPicker ─────────────────────────────────────────

function TermPick({ term, onChange }: { term: TermBits; onChange: (t: TermBits) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {termTagList.map(t => (
        <button key={t} onClick={() => onChange({ ...term, term: t })}
          className={`h-6 px-1.5 text-[10px] font-medium rounded-md transition-all ${
            term.term === t
              ? 'bg-primary/80 text-primary-foreground'
              : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >{t}</button>
      ))}
      <select
        value={term.year}
        onChange={e => onChange({ ...term, year: parseInt(e.target.value) })}
        className="h-6 text-[11px] bg-white/5 text-white/70 border-0 rounded-md px-1 outline-none cursor-pointer"
      >
        {yearList.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────

export default function CalcPage() {
  const [levelFilter, setLevelFilter] = useState<CourseLvl | "ALL">("ALL")
  const [levelPickOpen, setLevelPickOpen] = useState(false)
  const [levelSearchTxt, setLevelSearchTxt] = useState("")
  const [subjectPickerOpen, setSubjectPickerOpen] = useState(false)
  const [subjectSearch, setSubjectSearch] = useState("")

  const [entries, setEntries] = useState<SubRowThing[]>([])
  const [activeTab, setActiveTab] = useState<'completed' | 'ongoing' | 'future'>('completed')
  const [defaultTerm, setDefaultTerm] = useState<TermBits>({ term: "JAN", year: 2026 })

  const usedIds = useMemo(() => new Set(entries.map(e => e.subject.id)), [entries])

  const levelOptions = [
    { value: "ALL" as const, label: "All Levels" },
    { value: "FOUNDATION" as const, label: "Foundation" },
    { value: "DIPLOMA" as const, label: "Diploma" },
    { value: "DEGREE" as const, label: "Degree" },
  ]
  const currentLevelLabel = levelOptions.find(o => o.value === levelFilter)?.label ?? "All Levels"

  const filteredSubjects = useMemo(() => {
    let subs = allSubs.filter(s => !usedIds.has(s.id))
    if (levelFilter !== "ALL") subs = subs.filter(s => s.level === levelFilter)
    if (subjectSearch) {
      const q = subjectSearch.toLowerCase()
      subs = subs.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
    }
    return subs
  }, [usedIds, levelFilter, subjectSearch])

  // Derived lists
  const tabEntries = useMemo(() => entries.filter(e => e.tab === activeTab), [entries, activeTab])
  const completed = useMemo(() => entries.filter(e => e.tab === 'completed'), [entries])
  const ongoing = useMemo(() => entries.filter(e => e.tab === 'ongoing'), [entries])
  const future = useMemo(() => entries.filter(e => e.tab === 'future'), [entries])

  // CGPA calculations
  const toGrades = (ents: SubRowThing[]): GradeRow[] =>
    ents.map(e => ({ subject: e.subject, grade: e.grade, status: "COMPLETED" as const }))

  const currentCGPA = useMemo(() => calcCgpa(toGrades(completed)), [completed])
  const withOngoingCGPA = useMemo(() => calcCgpa(toGrades([...completed, ...ongoing])), [completed, ongoing])
  const overallCGPA = useMemo(() => calcCgpa(toGrades(entries)), [entries])

  const completedCredits = useMemo(() => completed.reduce((a, e) => a + e.subject.credits, 0), [completed])
  const ongoingCredits = useMemo(() => ongoing.reduce((a, e) => a + e.subject.credits, 0), [ongoing])
  const futureCredits = useMemo(() => future.reduce((a, e) => a + e.subject.credits, 0), [future])
  const totalCredits = useMemo(() => entries.reduce((a, e) => a + e.subject.credits, 0), [entries])

  useEffect(() => {
    stashCgpa({ current: currentCGPA, predicted: withOngoingCGPA, future: overallCGPA })
  }, [currentCGPA, withOngoingCGPA, overallCGPA])

  // Handlers
  const addSubject = useCallback((subject: CourseItem) => {
    setEntries(prev => [...prev, {
      entryId: Math.random().toString(36).slice(2, 10),
      subject, grade: "B", term: defaultTerm, tab: activeTab,
    }])
  }, [defaultTerm, activeTab])

  const updateGrade = useCallback((id: string, grade: string) => {
    setEntries(prev => prev.map(e => e.entryId === id ? { ...e, grade } : e))
  }, [])

  const updateTerm = useCallback((id: string, term: TermBits) => {
    setEntries(prev => prev.map(e => e.entryId === id ? { ...e, term } : e))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.entryId !== id))
  }, [])

  const resetAll = useCallback(() => {
    setEntries([])
  }, [])

  // Group by term
  const groupByTerm = (ents: SubRowThing[]) => {
    const m = new Map<string, { term: TermBits; entries: SubRowThing[] }>()
    ents.forEach(e => {
      const k = termKeyish(e.term)
      const g = m.get(k) || { term: e.term, entries: [] }
      g.entries.push(e)
      m.set(k, g)
    })
    return Array.from(m.values()).sort((a, b) => termSort(a.term, b.term))
  }

  const groups = groupByTerm(tabEntries)

  // Target CGPA
  const [targetCGPA, setTargetCGPA] = useState("8.0")
  const targetVal = parseFloat(targetCGPA) || 0
  const baseCGPA = ongoing.length > 0 ? withOngoingCGPA : currentCGPA
  const baseCredits = completedCredits + ongoingCredits
  const futureNeeded = futureCredits > 0
    ? (targetVal * (baseCredits + futureCredits) - baseCGPA * baseCredits) / futureCredits
    : 0
  const targetAchievable = futureNeeded >= 0 && futureNeeded <= 10

  const gradeLabel = cgpaLabelText(currentCGPA)

  const showPredicted = ongoing.length > 0 || future.length > 0
  const showTarget = (completed.length > 0 || ongoing.length > 0) && future.length > 0
  const showRequired = showTarget
  const showBottomRow = showPredicted || showTarget || showRequired

  const tabs = [
    { key: 'completed' as const, label: 'Completed', count: completed.length },
    { key: 'ongoing' as const, label: 'Ongoing', count: ongoing.length },
    { key: 'future' as const, label: 'Future', count: future.length },
  ]

  // ─── RENDER ───────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-4  md:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <GraduationCap className="size-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            IITM BS CGPA Calculator
          </h1>
        </div>
   
      </motion.div>

      {/* ─── Top Selectors Row ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid  grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-5 rounded-xl bg-card/60 backdrop-blur-sm border border-border/40"
      >
        {/* Degree Type */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-1.5 block">
            Degree Type
          </label>
          <div className="flex items-center gap-2.5 h-10 px-3 rounded-lg bg-background/50 border border-border/30 text-sm">
            <GraduationCap className="size-4 text-muted-foreground shrink-0" />
            <span>BS in Data Science</span>
          </div>
        </div>

        {/* Course Level */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-1.5 block">
            Course Level
          </label>
          <Popover open={levelPickOpen} onOpenChange={setLevelPickOpen}>
            <PopoverTrigger asChild>
              <button className="w-full h-10 px-3 rounded-lg bg-background/50 border border-border/30 text-sm text-left flex items-center justify-between hover:border-primary/30 transition-colors">
                <span className="text-muted-foreground truncate">{currentLevelLabel}</span>
                <ChevronDown className="size-4 text-muted-foreground shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search level..." value={levelSearchTxt} onValueChange={setLevelSearchTxt} />
                <CommandList>
                  <CommandEmpty>No levels found.</CommandEmpty>
                  {levelOptions.filter(o => {
                    if (!levelSearchTxt) return true
                    const q = levelSearchTxt.toLowerCase()
                    return o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
                  }).map(o => (
                    <CommandItem
                      key={o.value}
                      onSelect={() => {
                        setLevelFilter(o.value)
                        setLevelPickOpen(false)
                        setLevelSearchTxt("")
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{o.label}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Subject Picker */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400 mb-1.5 block">
            Subject
          </label>
          <Popover open={subjectPickerOpen} onOpenChange={setSubjectPickerOpen}>
            <PopoverTrigger asChild>
              <button className="w-full h-10 px-3 rounded-lg bg-background/50 border border-border/30 text-sm text-left flex items-center justify-between hover:border-primary/30 transition-colors">
                <span className="text-muted-foreground truncate">Select a subject to add...</span>
                <ChevronDown className="size-4 text-muted-foreground shrink-0 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()} >
              <Command shouldFilter={false}>
                <CommandInput placeholder="Search by name or code..." value={subjectSearch} onValueChange={setSubjectSearch} />
                <CommandList>
                  <CommandEmpty>No subjects found.</CommandEmpty>
                  {(["FOUNDATION", "DIPLOMA", "DEGREE"] as CourseLvl[]).filter(
                    lvl => levelFilter === "ALL" || levelFilter === lvl
                  ).map(level => {
                    const items = filteredSubjects.filter(s => s.level === level)
                    if (!items.length) return null
                    return (
                      <CommandGroup key={level} heading={level.charAt(0) + level.slice(1).toLowerCase()}>
                        {items.map(s => (
                          <CommandItem
                            key={s.id}
                            onSelect={() => { addSubject(s); setSubjectPickerOpen(false); setSubjectSearch("") }}
                            className="cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{s.name}</div>
                              <div className="text-[10px] text-muted-foreground">{s.id} · {s.credits}cr · {s.type}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>

      {/* ─── Main 2-Column Layout ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] h-full gap-6 items-stretch">

        {/* ── Left: Subject List ──────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className='space-y-4'>
          <Card className="bg-card/60 backdrop-blur-sm border-border/40 h-full">
            <CardContent className="p-5">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  <h2 className="text-lg font-semibold">Your Subjects</h2>
                </div>
                {entries.length > 0 && (
                  <button onClick={resetAll} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                    <RotateCcw className="size-3" />
                    Reset All
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 p-1 bg-muted/20 rounded-lg">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === t.key
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t.label}
                    {t.count > 0 && <span className="text-[10px] opacity-60 ml-1">({t.count})</span>}
                  </button>
                ))}
              </div>

              {/* Default term row */}
              <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                <span>Default term for new subjects:</span>
                <TermPick term={defaultTerm} onChange={setDefaultTerm} />
              </div>

              {/* Subject entries */}
              {tabEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
                  <BookOpen className="size-10 mb-3" />
                  <p className="text-sm font-medium">No {activeTab} subjects yet</p>
                  <p className="text-xs mt-1">Use the subject selector above to add subjects</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groups.map(group => (
                    <div key={termKeyish(group.term)}>
                      {/* Term divider */}
                      <div className="flex items-center gap-2 py-2">
                        <div className="h-px flex-1 bg-border/30" />
                        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">
                          {group.term.term} {group.term.year}
                        </span>
                        <div className="h-px flex-1 bg-border/30" />
                      </div>

                      <AnimatePresence mode="popLayout">
                        <div className="space-y-2">
                          {group.entries.map(entry => {
                            const status = subStatusLabel(entry.grade)
                            return (
                              <motion.div
                              key={entry.entryId}
                              layout
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20, scale: 0.95 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              className={`group p-3 rounded-lg border border-border/30 bg-background/30 hover:border-primary/20 transition-colors ${
                                noCgpaOnes.includes(entry.grade) ? 'opacity-50' : ''
                              }`}
                            >
                              {/* Row 1: name + meta */}
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold shrink-0 ${levelBadgeBits[entry.subject.level].color}`}>
                                  {levelBadgeBits[entry.subject.level].label}
                                </span>
                                <span className="text-sm font-medium truncate flex-1" title={entry.subject.name}>
                                  {entry.subject.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground/50 shrink-0">{entry.subject.credits} cr</span>
                                <button
                                  onClick={() => removeEntry(entry.entryId)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/50 hover:text-destructive shrink-0"
                                >
                                  <X className="size-4" />
                                </button>
                              </div>

                              {/* Row 2: term + grade pills */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <TermPick term={entry.term} onChange={t => updateTerm(entry.entryId, t)} />
                                <div className="flex items-center gap-1.5">
                                  <GradeBtns selected={entry.grade} onChange={g => updateGrade(entry.entryId, g)} />
                                  {status && (
                                    <span className={`text-[10px] ${status.className}`}>{status.label}</span>
                                  )}
                                  {(entry.grade === "WQ" || entry.grade === "WA" || entry.grade === "U") && (
                                    <span className="text-[10px] text-red-400/60">0 GP</span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                            )
                          })}
                        </div>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Right: Results Sidebar ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {/* ─ Main CGPA Card ─ */}
          <Card className="border border-border/40 bg-card/60 backdrop-blur-sm h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Your CGPA</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-3xl font-bold tracking-tight ${
                      currentCGPA >= 8 ? 'text-emerald-400'
                      : currentCGPA >= 6 ? 'text-amber-400'
                      : currentCGPA > 0 ? 'text-red-400'
                      : 'text-muted-foreground/30'
                    }`}>
                      <NumWiggle value={currentCGPA} decimals={1} />
                    </span>
                    <span className="text-lg text-muted-foreground/40">/ 10</span>
                  </div>
                  {completed.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className={`text-[10px] ${
                        currentCGPA >= 6
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          : 'border-red-500/30 text-red-400 bg-red-500/10'
                      }`}>
                        Grade: {gradeLabel}
                      </Badge>
                    </div>
                  )}
                </div>
                <RingMeter value={currentCGPA} />
              </div>
            </CardContent>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Credit Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-emerald-400 font-medium">{completedCredits} credits · {completed.length} subjects</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ongoing</span>
                  <span className="text-blue-400 font-medium">{ongoingCredits} credits · {ongoing.length} subjects</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Future</span>
                  <span className="text-violet-400 font-medium">{futureCredits} credits · {future.length} subjects</span>
                </div>
                <div className="h-px bg-border/30 my-1.5" />
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total</span>
                  <span>{totalCredits} credits · {entries.length} subjects</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Bottom Row: Preview / Target / Required ───── */}
      {showBottomRow && (
        <div className="grid grid-cols-1 mt-5 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* ─ CGPA Preview ─ */}
            {showPredicted && (
              <Card className="border-blue-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="size-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-muted-foreground">CGPA Preview</h3>
                  </div>
                  <div className="space-y-2">
                    {ongoing.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">With ongoing subjects</span>
                        <span className="text-lg font-bold text-blue-400"><NumWiggle value={withOngoingCGPA} /></span>
                      </div>
                    )}
                    {future.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">With all subjects</span>
                        <span className="text-lg font-bold text-violet-400"><NumWiggle value={overallCGPA} /></span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ─ Target CGPA ─ */}
            {showTarget && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Target CGPA</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Target:</span>
                      <Input
                        type="number" value={targetCGPA} onChange={e => setTargetCGPA(e.target.value)}
                        min={0} max={10} step={0.1} className="h-8 w-16 text-sm"
                      />
                    </div>
                    <div className={`p-2 rounded-lg text-[11px] ${
                      targetAchievable
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {targetAchievable ? (
                        <>Need avg <span className="font-bold">{futureNeeded.toFixed(1)} GP</span> in future</>
                      ) : (
                        <>Not possible with current plan</>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* ─ Required Grades ─ */}
          {showRequired && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/60 backdrop-blur-sm border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Required Grades</h3>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mb-2">
                    Avg GP in <span className="text-primary">future</span>:
                  </p>
                  <div className="space-y-2">
                    {[
                      { grade: "S", min: 9.0 },
                      { grade: "A", min: 8.0 },
                      { grade: "B", min: 7.0 },
                    ].map(({ grade, min }) => {
                      const needed = futureCredits > 0
                        ? (min * (baseCredits + futureCredits) - baseCGPA * baseCredits) / futureCredits
                        : 0
                      const possible = needed >= 0 && needed <= 10
                      return (
                        <div key={grade} className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${gradeColorMap[grade]}`}>
                            {grade}
                          </span>
                          <span className="text-[11px] text-muted-foreground/60 flex-1">{'>='}{min.toFixed(1)}</span>
                          {possible ? (
                            <span className="text-[11px] text-emerald-400 font-medium">{needed.toFixed(1)}</span>
                          ) : (
                            <span className="text-[11px] text-red-400">x</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[10px] text-muted-foreground/40 mt-6 pb-4">
        S(10) A(9) B(8) C(7) D(6) E(4) U(0) WQ(0) WA(0) I(skip)
      </div>
    </div>
  )
}
