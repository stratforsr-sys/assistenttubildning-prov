// ===========================================
// TELINK EXAM PLATFORM - QUESTION BANK
// ===========================================

import {
  Question,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  WrittenQuestion,
  ShuffledQuestion,
  ShuffledMultipleChoiceQuestion,
  ShuffledTrueFalseQuestion,
  ShuffledWrittenQuestion
} from '@/types'

// ===========================================
// MULTIPLE CHOICE QUESTIONS (23 st)
// ===========================================

const MULTIPLE_CHOICE_QUESTIONS: MultipleChoiceQuestion[] = [
  // Kapitel 1-2: Utbildning & Vision
  {
    id: 1,
    type: 'multiple-choice',
    text: 'Vad menar utbildningen med "why before how"?',
    options: [
      { key: 'A', text: 'Förklara tekniska funktioner före pris' },
      { key: 'B', text: 'Visa problem och konsekvens före lösning' },
      { key: 'C', text: 'Diskutera budget före implementation' },
      { key: 'D', text: 'Presentera integrationer före funktioner' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    type: 'multiple-choice',
    text: 'En kund frågar: "Vad får jag egentligen ut av det här?" Vilket svar följer visionen bäst?',
    options: [
      { key: 'A', text: '8 000 samtal i timmen och full integration' },
      { key: 'B', text: 'En ny vardag där ni kan växa utan mer personal' },
      { key: 'C', text: 'Intentanalys och intelligent routing' },
      { key: 'D', text: 'API-koppling till era system' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    type: 'multiple-choice',
    text: 'Vilka TRE saker är de viktigaste för en kund?',
    options: [
      { key: 'A', text: 'Skalbarhet, integration, rapporter' },
      { key: 'B', text: 'Växa med mindre kapital, struktur som skapar värde, en ny vardag' },
      { key: 'C', text: 'Intentanalys, routing, köhantering' },
      { key: 'D', text: 'FAQ-hantering, bokning, ticketing' },
    ],
    correctAnswer: 'B',
  },

  // Kapitel 3: Kundens smärtor
  {
    id: 4,
    type: 'multiple-choice',
    text: 'Vilken smärta beskrivs som "viktigast för VD"?',
    options: [
      { key: 'A', text: 'Kommunikationsproblem' },
      { key: 'B', text: 'Effektivitetsproblem' },
      { key: 'C', text: 'Ekonomiska problem' },
      { key: 'D', text: 'Bemanningsproblem' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 5,
    type: 'multiple-choice',
    text: 'Vilken smärta leder till att "kostnader stiger ELLER service sjunker"?',
    options: [
      { key: 'A', text: 'Kommunikationsproblem' },
      { key: 'B', text: 'Effektivitetsproblem' },
      { key: 'C', text: 'Bemanningsproblem' },
      { key: 'D', text: 'System- och processproblem' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 6,
    type: 'multiple-choice',
    text: 'Kunden säger: "Vi tappar inga samtal, vi har folk som svarar." Vilken smärta trycker du på?',
    options: [
      { key: 'A', text: 'Effektivitetsproblem - de fastnar i rutinfrågor' },
      { key: 'B', text: 'Bemanningsproblem - sårbarhet och toppbelastning' },
      { key: 'C', text: 'Ekonomiska problem - dolda kostnader' },
      { key: 'D', text: 'System- och processproblem - ingen uppföljning' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    type: 'multiple-choice',
    text: 'Vilken av dessa är INTE en smärta som nämns i utbildningen?',
    options: [
      { key: 'A', text: 'Oprofessionellt intryck' },
      { key: 'B', text: 'Dålig marknadsföring' },
      { key: 'C', text: 'Ingen central samtalslogg' },
      { key: 'D', text: 'Säsongsöverbelastning' },
    ],
    correctAnswer: 'B',
  },

  // Kapitel 4: Värde
  {
    id: 8,
    type: 'multiple-choice',
    text: 'Enligt säljformeln: Vad är skillnaden mellan "nytta" och "effekt"?',
    options: [
      { key: 'A', text: 'Nytta är teknisk, effekt är ekonomisk' },
      { key: 'B', text: 'Nytta är vad som blir enklare, effekt är affärsresultatet' },
      { key: 'C', text: 'Nytta är kortsiktig, effekt är långsiktig' },
      { key: 'D', text: 'Nytta gäller kunden, effekt gäller oss' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    type: 'multiple-choice',
    text: 'Hur många samtal per timme kan assistenten hantera enligt utbildningen?',
    options: [
      { key: 'A', text: '1 000' },
      { key: 'B', text: '5 000' },
      { key: 'C', text: '8 000' },
      { key: 'D', text: '10 000' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    type: 'multiple-choice',
    text: 'Vilken av dessa är ett MJUKT värde (inte mätbart)?',
    options: [
      { key: 'A', text: 'Färre missade samtal' },
      { key: 'B', text: 'Kortare svarstid' },
      { key: 'C', text: 'Lägre stress i teamet' },
      { key: 'D', text: 'Förutsägbar kostnad' },
    ],
    correctAnswer: 'C',
  },

  // Kapitel 5: Kärnfunktioner
  {
    id: 11,
    type: 'multiple-choice',
    text: 'Varför kräver utgående samtal manuell push från företaget?',
    options: [
      { key: 'A', text: 'Teknisk begränsning' },
      { key: 'B', text: 'Kontroll och regelefterlevnad' },
      { key: 'C', text: 'Kostnadsskäl' },
      { key: 'D', text: 'Integrationskrav' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 12,
    type: 'multiple-choice',
    text: 'Kunden oroar sig för att AI:n låter robotaktig. Vilka TRE saker nämns som lösning?',
    options: [
      { key: 'A', text: 'FAQ-hantering, ticketing, routing' },
      { key: 'B', text: 'Mänsklig ton, känsloanalys, företagsanpassning' },
      { key: 'C', text: 'Intentanalys, köhantering, skalbarhet' },
      { key: 'D', text: 'Integration, kunskapsbas, rapporter' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 13,
    type: 'multiple-choice',
    text: 'Vilket företag nämns som ökade sin kundnöjdhet till 98%?',
    options: [
      { key: 'A', text: 'Telink' },
      { key: 'B', text: 'Siemens' },
      { key: 'C', text: 'Däckpartner' },
      { key: 'D', text: 'Zen' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 14,
    type: 'multiple-choice',
    text: 'Vad avgör den "enda gränsen" för vad assistenten kan göra?',
    options: [
      { key: 'A', text: 'Vår teknik' },
      { key: 'B', text: 'Kundens budget' },
      { key: 'C', text: 'Kundens system (API-åtkomst och behörigheter)' },
      { key: 'D', text: 'Antal anställda' },
    ],
    correctAnswer: 'C',
  },

  // Kapitel 6-7: Kunskapsbas & Integration
  {
    id: 15,
    type: 'multiple-choice',
    text: 'Hur många tecken är en API-nyckel enligt utbildningen?',
    options: [
      { key: 'A', text: '32 tecken' },
      { key: 'B', text: '42 tecken' },
      { key: 'C', text: '52 tecken' },
      { key: 'D', text: '64 tecken' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 16,
    type: 'multiple-choice',
    text: 'Vilken kalender kräver extern lösning (t.ex. Calendly)?',
    options: [
      { key: 'A', text: 'Google Calendar' },
      { key: 'B', text: 'Apple Calendar' },
      { key: 'C', text: 'Outlook-kalender' },
      { key: 'D', text: 'Samsung Calendar' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 17,
    type: 'multiple-choice',
    text: 'Hur lång tid kan en ny integration ta att bygga?',
    options: [
      { key: 'A', text: 'Upp till 1 vecka' },
      { key: 'B', text: 'Upp till 2 veckor' },
      { key: 'C', text: 'Upp till 1 månad' },
      { key: 'D', text: 'Upp till 3 månader' },
    ],
    correctAnswer: 'C',
  },

  // Kapitel 8-9: Appen & Implementering
  {
    id: 18,
    type: 'multiple-choice',
    text: 'Hur lång tid tar onboarding-enkäten enligt utbildningen?',
    options: [
      { key: 'A', text: '10 minuter' },
      { key: 'B', text: '20 minuter' },
      { key: 'C', text: '30 minuter' },
      { key: 'D', text: '60 minuter' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 19,
    type: 'multiple-choice',
    text: 'Kunden har varit nöjd i 2 månader. Ska du be om referens?',
    options: [
      { key: 'A', text: 'Ja, de är nöjda' },
      { key: 'B', text: 'Ja, men bara om de har rekommenderat oss' },
      { key: 'C', text: 'Nej, bygg först mätbara resultat och tillit' },
      { key: 'D', text: 'Nej, vänta tills avtalet förnyas' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 20,
    type: 'multiple-choice',
    text: 'Efter hur lång tid bygger man kundcase enligt implementeringsprocessen?',
    options: [
      { key: 'A', text: '3 månader' },
      { key: 'B', text: '6 månader' },
      { key: 'C', text: '12 månader' },
      { key: 'D', text: '24 månader' },
    ],
    correctAnswer: 'B',
  },

  // Kapitel 10: Avtalsprocess
  {
    id: 21,
    type: 'multiple-choice',
    text: 'Vad triggar utbetalning från Siemens?',
    options: [
      { key: 'A', text: 'Signerad offert' },
      { key: 'B', text: 'Signerat Siemens-avtal' },
      { key: 'C', text: 'Signerad LG (leveransbekräftelse)' },
      { key: 'D', text: 'Lansering av assistenten' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 22,
    type: 'multiple-choice',
    text: 'Måste HELA assistenten vara klar för att signera LG?',
    options: [
      { key: 'A', text: 'Ja, allt måste vara 100% klart' },
      { key: 'B', text: 'Nej, första versionen räcker' },
      { key: 'C', text: 'Ja, men integrationer kan saknas' },
      { key: 'D', text: 'Nej, men lanseringen måste ha skett' },
    ],
    correctAnswer: 'B',
  },

  // Bonus: Rapporter & ML
  {
    id: 23,
    type: 'multiple-choice',
    text: 'Vad delar assistenterna mellan kunder enligt ML-konceptet?',
    options: [
      { key: 'A', text: 'Kunddata' },
      { key: 'B', text: 'Beteenden och lärdomar' },
      { key: 'C', text: 'Samtalsloggar' },
      { key: 'D', text: 'Integrationer' },
    ],
    correctAnswer: 'B',
  },
]

// ===========================================
// TRUE/FALSE QUESTIONS (4 st)
// ===========================================

const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 24,
    type: 'true-false',
    text: 'AI-Assistenten är en produkt som ersätter receptionister.',
    correctAnswer: 'false',
    acceptedKeywords: ['vision', 'förändring', 'samarbetar', 'ersätter inte', 'komplement'],
    explanation: 'AI-Assistenten är en vision/förändring, inte en ersättning. Den samarbetar med befintlig personal och fungerar som ett komplement.',
  },
  {
    id: 25,
    type: 'true-false',
    text: 'Dokument är det bästa som FAQ-listor eftersom att integrationer tar så lång tid.',
    correctAnswer: 'false',
    acceptedKeywords: ['data ändras', 'pris', 'lager', 'info', 'uppdaterad', 'integration', 'aktuell'],
    explanation: 'Data ändras (pris, lager, info) - integration behövs för aktuella svar, även om det tar tid. Statiska FAQ-listor blir snabbt inaktuella.',
  },
  {
    id: 26,
    type: 'true-false',
    text: 'Assistenten kan ringa ut automatiskt.',
    correctAnswer: 'false',
    acceptedKeywords: ['manuell', 'push', 'kontroll', 'regelefterlevnad', 'företaget startar'],
    explanation: 'Assistenten kräver manuell push för utgående samtal. Detta är för kontroll och regelefterlevnad - företaget bestämmer vem som rings.',
  },
  {
    id: 27,
    type: 'true-false',
    text: 'Nya assistenter börjar från noll och måste lära sig allt.',
    correctAnswer: 'false',
    acceptedKeywords: ['ML', 'machine learning', 'lärdomar', 'beteenden', 'följer med', 'inte kunddata'],
    explanation: 'Machine Learning delar lärdomar och beteenden mellan kunder (aldrig kunddata). Nya assistenter drar nytta av tidigare erfarenheter.',
  },
]

// ===========================================
// WRITTEN QUESTIONS (3 st)
// ===========================================

const WRITTEN_QUESTIONS: WrittenQuestion[] = [
  {
    id: 28,
    type: 'written',
    text: 'Kunden säger: "Vi vill bara slippa kö." Skriv din vision-vinkel. (1-2 meningar)',
    acceptedKeywords: ['avbrott', 'missade affärer', 'kontroll', 'effekt', 'mer än kö', 'vardagen'],
    exampleAnswer: '"Absolut, ni kommer att slippa kön. Men ni kommer också att slippa avbrott och missade affärer. Ni kommer att få en starkare kontroll i verksamheten."',
    maxLength: 300,
  },
  {
    id: 29,
    type: 'written',
    text: 'Förklara varför "support" är viktigt för affärerna enligt implementeringsprocessen. (1-2 meningar)',
    acceptedKeywords: ['tillit', 'merförsäljning', 'referenser', 'kvartalsvis', 'uppföljning', 'affärer'],
    exampleAnswer: 'Support och kvartalsvis uppföljning bygger tillit med kunden, vilket öppnar för merförsäljning och fler referenser som leder till nya affärer.',
    maxLength: 300,
  },
  {
    id: 30,
    type: 'written',
    text: 'Kunden tvekar på LG (leveransbekräftelse). Vad säger du? (1-2 meningar)',
    acceptedKeywords: ['finanspartner', 'första versionen', 'bekräftar leverans', 'betala ut', 'standard'],
    exampleAnswer: '"LG bekräftar leverans så att vår finanspartner kan betala ut. Första versionen räcker - hela assistenten behöver inte vara klar."',
    maxLength: 300,
  },
]

// ===========================================
// COMBINED QUESTIONS ARRAY
// ===========================================

export const QUESTIONS: Question[] = [
  ...MULTIPLE_CHOICE_QUESTIONS,
  ...TRUE_FALSE_QUESTIONS,
  ...WRITTEN_QUESTIONS,
]

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Get a question by ID
export function getQuestionById(id: number): Question | undefined {
  return QUESTIONS.find(q => q.id === id)
}

// Seeded shuffle function for reproducibility
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentSeed = seed

  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

// Get shuffled questions for an exam attempt
export function getShuffledQuestions(attemptSeed: number): ShuffledQuestion[] {
  // Shuffle question order
  const shuffledQuestions = seededShuffle(QUESTIONS, attemptSeed)

  return shuffledQuestions.map((question, index) => {
    if (question.type === 'multiple-choice') {
      // Shuffle options for multiple choice
      const optionSeed = attemptSeed + index * 1000
      const shuffledOptions = seededShuffle(question.options, optionSeed)
      const originalOrder = shuffledOptions.map(opt => opt.key)
      const shuffledCorrectIndex = originalOrder.indexOf(question.correctAnswer)

      return {
        id: question.id,
        text: question.text,
        type: 'multiple-choice' as const,
        options: shuffledOptions.map((opt, idx) => ({
          key: (['A', 'B', 'C', 'D'] as const)[idx],
          text: opt.text,
        })),
        originalOrder,
        shuffledCorrectIndex,
        isFollowUp: question.isFollowUp,
      } as ShuffledMultipleChoiceQuestion
    } else if (question.type === 'true-false') {
      return {
        id: question.id,
        text: question.text,
        type: 'true-false' as const,
        isFollowUp: question.isFollowUp,
      } as ShuffledTrueFalseQuestion
    } else {
      // Written question
      return {
        id: question.id,
        text: question.text,
        type: 'written' as const,
        maxLength: question.maxLength,
        isFollowUp: question.isFollowUp,
      } as ShuffledWrittenQuestion
    }
  })
}

// Check if multiple choice answer is correct
export function checkMultipleChoiceAnswer(
  questionId: number,
  selectedOption: string,
  originalOrder: ('A' | 'B' | 'C' | 'D')[]
): boolean {
  const question = getQuestionById(questionId)
  if (!question || question.type !== 'multiple-choice') return false

  const selectedIndex = ['A', 'B', 'C', 'D'].indexOf(selectedOption)
  const originalOption = originalOrder[selectedIndex]

  return originalOption === question.correctAnswer
}

// Check if true/false answer is correct
export function checkTrueFalseAnswer(
  questionId: number,
  selectedOption: string
): boolean {
  const question = getQuestionById(questionId)
  if (!question || question.type !== 'true-false') return false

  return selectedOption === question.correctAnswer
}

// Check written answer for keywords (returns score 0-1)
export function checkWrittenAnswer(
  questionId: number,
  writtenAnswer: string
): { isCorrect: boolean; isPartiallyCorrect: boolean; matchedKeywords: string[] } {
  const question = getQuestionById(questionId)
  if (!question || (question.type !== 'written' && question.type !== 'true-false')) {
    return { isCorrect: false, isPartiallyCorrect: false, matchedKeywords: [] }
  }

  const keywords = question.acceptedKeywords
  const answerLower = writtenAnswer.toLowerCase()
  const matchedKeywords = keywords.filter(keyword =>
    answerLower.includes(keyword.toLowerCase())
  )

  const matchRatio = matchedKeywords.length / keywords.length

  return {
    isCorrect: matchRatio >= 0.5, // At least 50% of keywords
    isPartiallyCorrect: matchRatio > 0 && matchRatio < 0.5,
    matchedKeywords,
  }
}

// Legacy compatibility function
export function checkAnswer(
  questionId: number,
  selectedOption: string,
  originalOrder: ('A' | 'B' | 'C' | 'D')[]
): boolean {
  return checkMultipleChoiceAnswer(questionId, selectedOption, originalOrder)
}
