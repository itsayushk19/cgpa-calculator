/*
    IITM BS Academic Data ( DS + ES)
*/

// GRADE POINT MAPPING

export const GRADE_POINTS: Record<string, number> = {
    S: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    U: 0.
}

export const NON_CGPA_GRADES = ["I", "I_OP", "I_BOTH"]
export const FAIL_GRADE = ["U", "WA", "WQ"]

// Types

export type DegreeDomain = "BS_DS" | "BS_ES"
export type CourseLevel = "FOUNDATION" | "DIPLOMA" | "DEGREE"
export type CourseType = "THEORY" | "LAB" | "PROJECT"

export interface Subject {
    id: string
    code?: string
    name: string
    domain: DegreeDomain
    level: CourseLevel
    credits: number
    type: CourseType
    hasOPPE?: boolean
}

// BS DATA SCIENCE SUBJECTS

export const DS_SUBJECTS: Subject[] = [
    // FOUNDATION
    { id: "BSMA1001", name: "Mathematics for Data Science 1", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSHS1001", name: "English 1", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSCS1001", name: "Computational Thinking", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSMA1002", name: "Statistics for Data Science 1", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSMA1003", name: "Mathematics for Data Science 2", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSHS1002", name: "English 2", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },
    { id: "BSCS1002", name: "Intro to Python Programming", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY", hasOPPE: true },
    { id: "BSMA1004", name: "Statistics for Data Science 2", domain: "BS_DS", level: "FOUNDATION", credits: 4, type: "THEORY" },


    // DIPLOMA
    { id: "BSCS2001", name: "Database Management Systems", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2002", name: "Programming, Data Structures and algorithms using Python", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2003", name: "Modern Application Development 1", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2003P", name: "Modern Application Development 1 - Project", domain: "BS_DS", level: "DIPLOMA", credits: 2, type: "PROJECT" },
    { id: "BSCS2005", name: "Programming Concepts Using Java", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2006", name: "Modern Application Development 2", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2006P", name: "Modern Application Development 2 - Project", domain: "BS_DS", level: "DIPLOMA", credits: 2, type: "PROJECT" },
    { id: "BSSE2001", name: "System Commands", domain: "BS_DS", level: "DIPLOMA", credits: 3, type: "THEORY" },
    { id: "BSCS2004", name: "Machine Learning Foundations", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSMS2001", name: "Business Data Management", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2007", name: "Machine Learning Techniques", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSCS2008", name: "Machine Learning Practice", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "PROJECT" },
    { id: "BSCS2008P", name: "Machine Learning Practice - Project", domain: "BS_DS", level: "DIPLOMA", credits: 2, type: "PROJECT" },
    { id: "BSSE2002", name: "Tools In Data Science", domain: "BS_DS", level: "DIPLOMA", credits: 3, type: "THEORY" },
    { id: "BSMS2001P", name: "Business Data Management - Project", domain: "BS_DS", level: "DIPLOMA", credits: 2, type: "PROJECT" },
    { id: "BSMS2002", name: "Business Analytics", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSDA2001", name: "Introduction to Deep Learning And Gen AI", domain: "BS_DS", level: "DIPLOMA", credits: 4, type: "THEORY" },
    { id: "BSDA2001P", name: "Introduction to Deep Learning And Gen AI - Project", domain: "BS_DS", level: "DIPLOMA", credits: 2, type: "PROJECT" },

    // DEGREE
    { id: "BSCS3001", name: "Software Engineering", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS3002", name: "Software Testing", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS3003", name: "AI: Search Methods for Problem Solving", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS3004", name: "Deep Learning", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSGN3001", name: "Strategies for Professional Growth", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },


    { id: "BSBT4001", name: "Algorithmic Thinking in Bioinformatics", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSBT4002", name: "Big Data and Biological Networks", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS4001", name: "Data Visualization Design", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSEE4001", name: "Speech Technology", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS4002", name: "Design Thinking for Data-Driven App Development", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS4001", name: "Industry 4.0", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS4003", name: "Financial Forensics", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS3002", name: "Market Research", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5001", name: "Introduction to Big Data", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS4003", name: "Privacy & Security in Online Social Media", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMA2001", name: "Mathematical Thinking", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMA3012", name: "Linear Statistical Models", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMA3014", name: "Statistical Computing", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS4021", name: "Advanced Algorithms", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS3031", name: "Computer Systems Design", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS4022", name: "Operating Systems", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5007", name: "Reinforcement Learning", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS3005", name: "Programming in C", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSCS4024", name: "Computer Networks", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5005", name: "Introduction to Natural Language Processing (i-NLP)", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5006", name: "Deep Learning for Computer Vision", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5004", name: "Large Language Models", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS4023", name: "Game Theory and Strategy", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS3033", name: "Managerial Economics", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSMS3034", name: "Corporate Finance", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5014", name: "ML Ops", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5002", name: "Mathematical Foundations of Generative AI", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5003", name: "Algorithms for Data Science", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA5013", name: "Deep Learning Practice", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },
    { id: "BSDA4001", name: "Data Science and AI Lab", domain: "BS_DS", level: "DEGREE", credits: 4, type: "LAB" },
    { id: "BSCS4010", name: "Application Development Lab", domain: "BS_DS", level: "DEGREE", credits: 4, type: "LAB" },
    { id: "BSDA4002", name: "Comprehensive Exam - Data Science & Artificial Intelligence", domain: "BS_DS", level: "DEGREE", credits: 2, type: "PROJECT" },
    { id: "BSCS4009", name: "Comprehensive Exam - Computer Science & Information Technology", domain: "BS_DS", level: "DEGREE", credits: 2, type: "PROJECT" },
    { id: "BSCS3021", name: "Theory of Computation", domain: "BS_DS", level: "DEGREE", credits: 4, type: "THEORY" },

]


export const ALL_SUBJECTS: Subject[] = [
    ...DS_SUBJECTS,
]