# Telink Provplattform

En webbaserad provplattform för Telinks produktutbildning om AI-Assistent. Byggd med Next.js 14, Neon Serverless Postgres och deployad på Vercel.

![Telink Logo](public/logo.png)

## 🎯 Funktioner

### Deltagare
- ✅ Inloggning med provkod och namn
- ✅ 22 frågor om AI-Assistent produkten
- ✅ Slumpmässig fråge- och svarsordning per deltagare
- ✅ 30 minuters tidsgräns med countdown
- ✅ Varning vid 5 minuter kvar
- ✅ Auto-submit vid timeout
- ✅ Helskärmsläge krävs (exam lockdown)
- ✅ En fråga i taget (wizard-style)
- ✅ Ingen möjlighet att gå tillbaka
- ✅ Auto-save av svar
- ✅ Detaljerad resultatgenomgång efter prov

### Admin
- ✅ Säker inloggning med hashade lösenord
- ✅ Dashboard med statistik
  - Totalt antal deltagare
  - Medelpoäng, median, min/max
- ✅ Interaktiva grafer
  - Resultatfördelning (stapeldiagram)
  - Tid vs Poäng (scatter plot)
  - Trendlinje över tid
- ✅ Deltagarelista med möjlighet att:
  - Se detaljerad provgenomgång
  - Radera resultat
- ✅ Frågeanalys
  - % rätt per fråga
  - Fördelning per svarsalternativ
  - Flaggor för svåra/enkla frågor
- ✅ Hantering av provkoder

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Databas:** Neon Serverless Postgres
- **ORM:** Drizzle ORM
- **Charts:** Recharts
- **Auth:** bcryptjs + JWT
- **Deployment:** Vercel

## 📦 Installation

### 1. Klona projektet

```bash
git clone <repo-url>
cd telink-exam-platform
npm install
```

### 2. Skapa Neon-databas

1. Gå till [Neon Console](https://console.neon.tech)
2. Skapa ett nytt projekt
3. Kopiera connection string

### 3. Konfigurera environment variables

Skapa `.env.local`:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Admin Auth
ADMIN_EMAIL=telink@admin.se
ADMIN_PASSWORD_HASH=$2a$10$rQnM1.6WpJxT5YjXEQzGnOR7Y3kJxKjS6uLvZgKqHxj2VYrqQB.Hy

# JWT Secret (generera en slumpmässig sträng)
JWT_SECRET=your-super-secret-jwt-key

# Exam Config
EXAM_CODE_DEFAULT=Telink2026
EXAM_TIME_LIMIT_MINUTES=30
EXAM_WARNING_MINUTES=5

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Generera nytt lösenordshash

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('ditt-nya-lösenord', 10).then(console.log)"
```

### 4. Skapa databastabeller

```bash
npm run db:push
```

### 5. Seeda initial provkod

Kör i terminal eller via Neon Console:

```sql
INSERT INTO exam_codes (code, name, is_active) 
VALUES ('TELINK2026', 'AI-Assistent Produktutbildning 2026', true);
```

### 6. Starta utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment till Vercel

### 1. Pusha till GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <github-repo-url>
git push -u origin main
```

### 2. Importera till Vercel

1. Gå till [Vercel Dashboard](https://vercel.com)
2. Klicka "Add New Project"
3. Importera från GitHub
4. Lägg till environment variables:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
   - `EXAM_CODE_DEFAULT`
   - `EXAM_TIME_LIMIT_MINUTES`
   - `EXAM_WARNING_MINUTES`
   - `NEXT_PUBLIC_APP_URL` (sätt till din Vercel-URL)

### 3. Deploya

Vercel deployar automatiskt vid varje push till main.

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── participant-login/  # Deltagarinloggning
│   ├── exam/               # Provsidan
│   ├── review/             # Resultatgenomgång
│   ├── admin-login/        # Admin-inloggning
│   ├── admin-dashboard/    # Admin dashboard
│   └── api/                # API routes
├── components/             # React-komponenter
│   ├── ui/                 # Generella UI-komponenter
│   ├── exam/               # Provspecifika komponenter
│   ├── review/             # Resultatkomponenter
│   └── admin/              # Admin-komponenter
├── lib/                    # Hjälpfunktioner
│   ├── db/                 # Databasanslutning & queries
│   ├── questions.ts        # Frågebank
│   ├── auth.ts             # Auth-logik
│   ├── constants.ts        # Konstanter
│   └── utils.ts            # Hjälpfunktioner
└── types/                  # TypeScript-typer
```

## 🔐 Säkerhet

- Lösenord hashas med bcrypt
- JWT-tokens för sessioner
- HttpOnly cookies
- Rate limiting på auth-endpoints
- Parameteriserade SQL-queries (via Drizzle ORM)
- Input-validering med Zod

## 📊 API Endpoints

### Public
- `POST /api/auth/validate-code` - Validera provkod
- `POST /api/participant/start` - Starta prov
- `POST /api/participant/submit-answer` - Spara svar
- `POST /api/participant/complete` - Slutför prov

### Admin (kräver auth)
- `POST /api/auth/admin-login` - Admin-inloggning
- `DELETE /api/auth/admin-login` - Logga ut
- `GET /api/admin/stats` - Hämta statistik
- `GET /api/admin/attempts` - Lista alla försök
- `GET /api/admin/attempt/[id]` - Hämta specifikt försök
- `DELETE /api/admin/delete-attempt` - Radera försök
- `GET /api/admin/exam-codes` - Hantera provkoder

## 🎨 Design System

### Färger
- **Bakgrund:** #0F1C2E (primär), #162337 (sekundär)
- **Accent:** #3DD68C (grön)
- **Text:** #FFFFFF (primär), #A4B3C7 (sekundär)
- **Status:** Grön (rätt), Röd (fel), Orange (varning)

### Font
- Plus Jakarta Sans (Google Fonts)

## 📝 Licens

Proprietär - Telink AB

---

**Kontakt:** [Telink AB](https://telink.se)
