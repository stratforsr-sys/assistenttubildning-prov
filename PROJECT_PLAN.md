# 📋 TELINK PROVPLATTFORM - PROJEKTPLAN

## 🎯 PROJEKTÖVERSIKT

**Projekt:** Webbaserad provplattform för Telinks produktutbildning om AI-Assistent
**Kund:** Telink AB
**Databas:** Neon (Serverless Postgres)
**Hosting:** Vercel
**Framework:** Next.js 14 (App Router)

---

## 🏗️ TEKNISK ARKITEKTUR

### Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Databas:** Neon Serverless Postgres
- **ORM:** Drizzle ORM (lightweight, type-safe)
- **Auth:** Bcrypt-hashed password i environment variables
- **Charts:** Recharts (för admin dashboard)
- **Deployment:** Vercel

### Filstruktur
```
telink-exam-platform/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout med fonts
│   │   ├── page.tsx                   # Redirect till /participant-login
│   │   ├── globals.css                # Global styling + CSS variables
│   │   │
│   │   ├── participant-login/
│   │   │   └── page.tsx               # Deltagarinloggning (provkod + namn)
│   │   │
│   │   ├── exam/
│   │   │   └── page.tsx               # Provsidan (fullscreen-locked)
│   │   │
│   │   ├── review/
│   │   │   └── page.tsx               # Resultatgenomgång efter prov
│   │   │
│   │   ├── admin-login/
│   │   │   └── page.tsx               # Admin-inloggning
│   │   │
│   │   ├── admin-dashboard/
│   │   │   ├── page.tsx               # Dashboard med statistik
│   │   │   └── attempt/
│   │   │       └── [id]/
│   │   │           └── page.tsx       # Detaljvy för enskilt försök
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── validate-code/
│   │       │   │   └── route.ts       # Validera provkod
│   │       │   └── admin-login/
│   │       │       └── route.ts       # Admin-auth
│   │       │
│   │       ├── participant/
│   │       │   ├── start/
│   │       │   │   └── route.ts       # Starta prov
│   │       │   ├── submit-answer/
│   │       │   │   └── route.ts       # Spara svar (auto-save)
│   │       │   └── complete/
│   │       │       └── route.ts       # Slutför prov
│   │       │
│   │       ├── exam/
│   │       │   └── questions/
│   │       │       └── route.ts       # Hämta frågor (randomized)
│   │       │
│   │       └── admin/
│   │           ├── stats/
│   │           │   └── route.ts       # Hämta statistik
│   │           ├── attempts/
│   │           │   └── route.ts       # Lista alla försök
│   │           ├── attempt/
│   │           │   └── [id]/
│   │           │       └── route.ts   # Hämta specifikt försök
│   │           ├── delete-attempt/
│   │           │   └── route.ts       # Radera försök
│   │           └── exam-codes/
│   │               └── route.ts       # Hantera provkoder
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── Modal.tsx
│   │   │
│   │   ├── exam/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerOption.tsx
│   │   │   ├── ExamHeader.tsx         # Progress + Timer
│   │   │   └── FullscreenLock.tsx
│   │   │
│   │   ├── review/
│   │   │   ├── ResultCard.tsx
│   │   │   └── ScoreSummary.tsx
│   │   │
│   │   └── admin/
│   │       ├── StatsCard.tsx
│   │       ├── ParticipantTable.tsx
│   │       ├── QuestionAnalysis.tsx
│   │       └── Charts/
│   │           ├── ScoreDistribution.tsx
│   │           ├── TimeVsScore.tsx
│   │           └── TrendLine.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts               # Neon connection
│   │   │   ├── schema.ts              # Drizzle schema
│   │   │   └── queries.ts             # Database queries
│   │   │
│   │   ├── questions.ts               # Frågebank (22 frågor)
│   │   ├── utils.ts                   # Hjälpfunktioner
│   │   ├── constants.ts               # Konstanter (tidsgräns, etc)
│   │   └── auth.ts                    # Auth helpers
│   │
│   └── types/
│       └── index.ts                   # TypeScript types
│
├── public/
│   ├── logo.png                       # Telink logotyp
│   └── favicon.ico                    # Favicon från logo
│
├── drizzle/
│   └── migrations/                    # Database migrations
│
├── .env.example                       # Environment variables template
├── .env.local                         # Local env (gitignored)
├── drizzle.config.ts                  # Drizzle config
├── next.config.js                     # Next.js config
├── tailwind.config.ts                 # Tailwind config
├── tsconfig.json                      # TypeScript config
├── package.json
├── vercel.json
└── README.md                          # Deployment guide
```

---

## 🗄️ DATABASSCHEMA

### Tabeller

#### 1. exam_codes
```sql
CREATE TABLE exam_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

#### 2. participants
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name_normalized VARCHAR(200) NOT NULL, -- för duplett-check
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. attempts
```sql
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id),
  exam_code_id UUID REFERENCES exam_codes(id),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  total_score INTEGER,
  total_correct INTEGER,
  total_questions INTEGER DEFAULT 22,
  total_time_seconds INTEGER,
  is_completed BOOLEAN DEFAULT false,
  is_timed_out BOOLEAN DEFAULT false
);
```

#### 4. answers
```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES attempts(id),
  question_id INTEGER NOT NULL,
  selected_option CHAR(1), -- A, B, C, D
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. admin_sessions
```sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
```

---

## 🎨 DESIGN SYSTEM

### Färgpalett (CSS Variables)
```css
:root {
  /* Primary */
  --bg-primary: #0F1C2E;
  --bg-secondary: #162337;
  --bg-tertiary: #1D2D44;
  
  /* Accent */
  --accent-green: #3DD68C;
  --accent-green-hover: #2FC67C;
  --accent-green-muted: rgba(61, 214, 140, 0.1);
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #A4B3C7;
  --text-muted: #6B7A8F;
  
  /* Status */
  --status-correct: #3DD68C;
  --status-incorrect: #EF4444;
  --status-warning: #F59E0B;
  
  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-accent: rgba(61, 214, 140, 0.3);
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 20px rgba(61, 214, 140, 0.15);
}
```

### Typografi
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Headings:** 700-800 weight
- **Body:** 400-500 weight
- **Sizes:** Tailwind defaults med custom scaling

### Komponenter
- **Cards:** Glassmorphism med subtle border
- **Buttons:** Solid green accent, smooth hover transitions
- **Inputs:** Dark background, green focus ring
- **Progress:** Gradient green bar med glow effect

---

## ⚙️ FUNKTIONER - DETALJERAD SPECIFIKATION

### 1. DELTAGARE-FLÖDE

#### 1.1 Inloggning (/participant-login)
- Input: Provkod (valideras mot databas)
- Input: Förnamn (required)
- Input: Efternamn (required)
- Validering: Case-insensitive namnmatchning för att förhindra dubbla försök
- Felmeddelanden: Tydliga på svenska
- Success: Redirect till /exam

#### 1.2 Prov (/exam)
- **Fullscreen-lock:** 
  - Kräver fullscreen för att starta
  - Varning vid försök att lämna
  - Auto-submit vid tab-switch eller fullscreen-exit
- **Timer:**
  - 30 minuter countdown
  - Synlig i header (integrerad med progress bar)
  - Varning vid 5 minuter kvar (visuell + text)
  - Auto-submit vid timeout
- **Progress bar:**
  - Linjär, överst på sidan
  - Visar "Fråga X av 22"
  - Grön gradient med glow
- **Frågor:**
  - En fråga i taget
  - Slumpmässig ordning (seeded per attempt)
  - Svarsalternativ shufflade
  - Inget tillbaka-navigering (disabled)
  - Auto-save efter varje svar
- **Avslut:**
  - Bekräftelse-modal innan inlämning
  - Redirect till /review

#### 1.3 Resultat (/review)
- **Översikt:**
  - Total poäng: X/22
  - Procent: XX%
  - Tid: XX:XX
- **Detaljerad genomgång:**
  - Varje fråga expanderbar
  - Färgkodning: Grön (rätt), Röd (fel)
  - Visar: Ditt svar, Rätt svar
  - Ingen godkänt/underkänt-indikation

### 2. ADMIN-FLÖDE

#### 2.1 Inloggning (/admin-login)
- Input: Email (telink@admin.se)
- Input: Lösenord (hashat med bcrypt)
- Session: 24h JWT token i cookie
- Säkerhet: Rate limiting, brute-force protection

#### 2.2 Dashboard (/admin-dashboard)
- **Översiktskort:**
  - Totalt antal deltagare
  - Medelpoäng
  - Median
  - Min/Max
- **Grafer:**
  - Resultatfördelning (stapeldiagram)
  - Tid vs Poäng (scatter plot)
  - Trendlinje över tid
- **Deltagarelista:**
  - Namn, Datum, Poäng, Tid
  - Sorterbar
  - Klickbar för detaljvy
  - Radera-funktion
- **Frågeanalys:**
  - % rätt per fråga
  - Fördelning per svarsalternativ
  - Flaggor: För lätt (>90%), För svår (<30%)
  - Topp 5 svåraste frågor
  - Vanligaste felval
- **Provkoder:**
  - Lista aktiva koder
  - Skapa ny kod
  - Aktivera/deaktivera

---

## 🔒 SÄKERHET

1. **Provkod:** Valideras server-side
2. **Namn-duplett:** Normaliserad check (lowercase, trimmed)
3. **Admin-auth:** Bcrypt-hashat lösenord
4. **Session:** HttpOnly cookies, 24h expiry
5. **CSRF:** Next.js inbyggd protection
6. **Rate limiting:** På auth-endpoints
7. **Input validation:** Zod schemas
8. **SQL injection:** Drizzle ORM parameterized queries

---

## 📦 DEPLOYMENT CHECKLIST

1. [ ] Skapa Neon-projekt
2. [ ] Kör migrations
3. [ ] Seed frågor
4. [ ] Sätt environment variables i Vercel
5. [ ] Deploya till Vercel
6. [ ] Testa provflöde
7. [ ] Testa admin-flöde
8. [ ] Verifiera mobile responsiveness

---

## 🔧 ENVIRONMENT VARIABLES

```env
# Database
DATABASE_URL=postgresql://...@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Admin Auth
ADMIN_EMAIL=telink@admin.se
ADMIN_PASSWORD_HASH=$2b$10$... # bcrypt hash av admin123

# Exam
EXAM_CODE_DEFAULT=Telink2026
EXAM_TIME_LIMIT_MINUTES=30

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 📅 BYGGORDNING

1. **Fas 1: Setup**
   - Project scaffolding
   - Database connection
   - Schema + migrations
   - Seed data

2. **Fas 2: Core**
   - Frågebank
   - API routes
   - Auth system

3. **Fas 3: Participant**
   - Login page
   - Exam page
   - Review page

4. **Fas 4: Admin**
   - Login page
   - Dashboard
   - Statistics
   - Management

5. **Fas 5: Polish**
   - Animations
   - Error handling
   - Mobile optimization
   - Final testing

---

*Dokumentet uppdaterat: 2026-01-13*
*Version: 1.0*
