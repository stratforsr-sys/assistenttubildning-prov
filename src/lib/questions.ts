// ===========================================
// TELINK EXAM PLATFORM - QUESTION BANK
// ===========================================

import { Question } from '@/types'

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Vad beskriver bäst det övergripande värdet vi säljer?',
    options: [
      { key: 'A', text: 'Effektivare samtalshantering som minskar köer' },
      { key: 'B', text: 'En ny vardag där företag kan växa med mindre kapital genom struktur och avlastning' },
      { key: 'C', text: 'En digital receptionist som ersätter personalens telefonsvar' },
      { key: 'D', text: 'En AI som automatiserar FAQ och bokningar' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    text: 'Vilken typ av problem leder oftast till störst intäktsförlust utan att synas tydligt?',
    options: [
      { key: 'A', text: 'Samtal som tar för lång tid' },
      { key: 'B', text: 'Missade samtal som aldrig följs upp och därför aldrig blir affärer' },
      { key: 'C', text: 'Felkopplingar' },
      { key: 'D', text: 'Rutinfrågor' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    text: 'Vad innebär det i praktiken att börja med "why"?',
    options: [
      { key: 'A', text: 'Förklara problem och konsekvens innan lösning' },
      { key: 'B', text: 'Visa funktioner först' },
      { key: 'C', text: 'Visa integrationer' },
      { key: 'D', text: 'Börja med ROI' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 4,
    text: 'En kund oroar sig för att AI känns opersonligt. Vad adresserar detta bäst?',
    options: [
      { key: 'A', text: 'Anpassad ton och situationsbaserat bemötande' },
      { key: 'B', text: 'Vidarekoppling' },
      { key: 'C', text: 'Kortare svarstid' },
      { key: 'D', text: 'Dokumentbaserade svar' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 5,
    text: 'Vilket är ett tydligt mätbart affärsvärde?',
    options: [
      { key: 'A', text: 'Lägre stress' },
      { key: 'B', text: 'Färre missade samtal → färre tappade affärer' },
      { key: 'C', text: 'Starkare varumärke' },
      { key: 'D', text: 'Bättre struktur' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 6,
    text: 'Vad gör att ett samtal hanteras rätt direkt?',
    options: [
      { key: 'A', text: 'Kö' },
      { key: 'B', text: 'Identifiering av syfte och rätt flöde' },
      { key: 'C', text: 'Tillgänglig personal' },
      { key: 'D', text: 'Ticket' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 7,
    text: 'Vad är affärseffekten av att hantera många samtal samtidigt?',
    options: [
      { key: 'A', text: 'Längre samtal' },
      { key: 'B', text: 'Klarar toppar utan tappade samtal eller nyanställning' },
      { key: 'C', text: 'Personligare service' },
      { key: 'D', text: 'Fler loggar' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    text: 'Vilken kalenderbegränsning kan förekomma?',
    options: [
      { key: 'A', text: 'Ingen realtid' },
      { key: 'B', text: 'Kräver extern kalenderlösning i vissa fall' },
      { key: 'C', text: 'Endast interna möten' },
      { key: 'D', text: 'Endast öppet API' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    text: 'Vad avgör integrationsdjupet?',
    options: [
      { key: 'A', text: 'Antal intents' },
      { key: 'B', text: 'API-åtkomst och behörigheter' },
      { key: 'C', text: 'Kunskapsbasens storlek' },
      { key: 'D', text: 'Samtalsvolym' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    text: 'Varför är utgående samtal manuellt styrda?',
    options: [
      { key: 'A', text: 'Felkoppling' },
      { key: 'B', text: 'Kontroll och regelefterlevnad' },
      { key: 'C', text: 'Rapportering' },
      { key: 'D', text: 'Loggning' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 11,
    text: '"Vi vill slippa kö." Vilken konsekvens är viktigast?',
    options: [
      { key: 'A', text: 'Kortare väntetid' },
      { key: 'B', text: 'Färre tappade affärer och mindre avbrott' },
      { key: 'C', text: 'Mindre admin' },
      { key: 'D', text: 'Bättre statistik' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 12,
    text: 'Vad sker först i ett nytt projekt?',
    options: [
      { key: 'A', text: 'Integration' },
      { key: 'B', text: 'Onboarding-enkät' },
      { key: 'C', text: 'Byggnation' },
      { key: 'D', text: 'Go-live' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 13,
    text: 'Hur förbättras lösningen efter första versionen?',
    options: [
      { key: 'A', text: 'Självjustering' },
      { key: 'B', text: 'Feedback → iteration' },
      { key: 'C', text: 'Statistikstyrt' },
      { key: 'D', text: 'Kvartalsvis' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 14,
    text: 'När är lösningen lanserad?',
    options: [
      { key: 'A', text: 'Alla integrationer klara' },
      { key: 'B', text: 'Samtal går till assistenten' },
      { key: 'C', text: 'Appen är tillgänglig' },
      { key: 'D', text: 'Avtal klart' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 15,
    text: 'Varför följer man upp regelbundet?',
    options: [
      { key: 'A', text: 'Teknik' },
      { key: 'B', text: 'Mäta resultat, bygga tillit, skapa affärer' },
      { key: 'C', text: 'Uppdatera data' },
      { key: 'D', text: 'Prisjustera' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 16,
    text: 'Vad krävs för att betalning ska ske?',
    options: [
      { key: 'A', text: 'Offert' },
      { key: 'B', text: 'Leveransbekräftelse (LG)' },
      { key: 'C', text: 'Go-live' },
      { key: 'D', text: 'Avtalstid' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 17,
    text: 'Kunden har receptionist – största kompletterande värde?',
    options: [
      { key: 'A', text: 'Fler samtalstyper' },
      { key: 'B', text: 'Minskad sårbarhet och 24/7-kapacitet' },
      { key: 'C', text: 'Bättre kommunikation' },
      { key: 'D', text: 'Mer data' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 18,
    text: 'Hur förbättras lösningen över tid?',
    options: [
      { key: 'A', text: 'Delar kunddata' },
      { key: 'B', text: 'Lär beteenden utan att blanda kunddata' },
      { key: 'C', text: 'Kräver lång historik' },
      { key: 'D', text: 'Kräver full integration' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 19,
    text: 'Vad används rapporter främst till?',
    options: [
      { key: 'A', text: 'Intäktsmätning' },
      { key: 'B', text: 'Förstå vem som ringer, när och varför' },
      { key: 'C', text: 'Personalbedömning' },
      { key: 'D', text: 'Marknadsoptimering' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 20,
    text: 'Systemet saknar öppet API – nästa steg?',
    options: [
      { key: 'A', text: 'Vänta' },
      { key: 'B', text: 'Kontakta leverantör för åtkomst' },
      { key: 'C', text: 'Bygg runt' },
      { key: 'D', text: 'Byt system' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 21,
    text: 'När bekräftas leverans?',
    options: [
      { key: 'A', text: 'Vid offert' },
      { key: 'B', text: 'Efter leverans, separat från avtal' },
      { key: 'C', text: 'Före lansering' },
      { key: 'D', text: 'Vid uppföljning' },
    ],
    correctAnswer: 'B',
    isFollowUp: true,
  },
  {
    id: 22,
    text: 'Varför räcker inte FAQ ensam?',
    options: [
      { key: 'A', text: 'Klarar inte volym' },
      { key: 'B', text: 'Information blir snabbt inaktuell utan systemkoppling' },
      { key: 'C', text: 'Saknar ton' },
      { key: 'D', text: 'Saknar analys' },
    ],
    correctAnswer: 'B',
    isFollowUp: true,
  },
]

// Helper function to get a question by ID
export function getQuestionById(id: number): Question | undefined {
  return QUESTIONS.find(q => q.id === id)
}

// Helper function to shuffle array with seed for reproducibility
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let currentSeed = seed
  
  // Simple seeded random function
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280
    return currentSeed / 233280
  }
  
  // Fisher-Yates shuffle with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

// Function to get shuffled questions for an exam attempt
export function getShuffledQuestions(attemptSeed: number) {
  // Shuffle question order
  const shuffledQuestions = seededShuffle(QUESTIONS, attemptSeed)
  
  // For each question, also shuffle the options
  return shuffledQuestions.map((question, index) => {
    const optionSeed = attemptSeed + index * 1000
    const shuffledOptions = seededShuffle(question.options, optionSeed)
    
    // Track original order to map back correct answer
    const originalOrder = shuffledOptions.map(opt => opt.key)
    const shuffledCorrectIndex = originalOrder.indexOf(question.correctAnswer)
    
    return {
      id: question.id,
      text: question.text,
      options: shuffledOptions.map((opt, idx) => ({
        key: (['A', 'B', 'C', 'D'] as const)[idx],
        text: opt.text,
      })),
      originalOrder,
      shuffledCorrectIndex,
      isFollowUp: question.isFollowUp,
    }
  })
}

// Function to check if answer is correct
export function checkAnswer(
  questionId: number,
  selectedOption: string,
  originalOrder: ('A' | 'B' | 'C' | 'D')[]
): boolean {
  const question = getQuestionById(questionId)
  if (!question) return false
  
  // Map the selected shuffled option back to original
  const selectedIndex = ['A', 'B', 'C', 'D'].indexOf(selectedOption)
  const originalOption = originalOrder[selectedIndex]
  
  return originalOption === question.correctAnswer
}
