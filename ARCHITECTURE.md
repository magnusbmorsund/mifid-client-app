MiFID II **Last Updated:** December 10, 2024  
**Reflects:** Current implementation

---

## System Overview

─  ─ + X-API-Key Header─(Port3000)│
││
│Components:                                                    ────────────────│
│┌──────────────┐┌──────────────┐┌──────────────────────┐      │Portfolio││Portfolio││ExistingPortfolio││
││Builder││View││Upload│  └┘└──────────────┘└──────────────────────┘│
│┌──────────────┐┌──────────────┐││Portfolio│Chat││Comparison│  └──────────────┘           │
││
│State:useStatehooksinApp.js│
│HTTP:Axioswih defulX-API-Kyhdr    ─ RESTPI Call─ (Port 5001)                        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                 MIDDLWA STACK    ││                                                      │ │
││1.CORS(configuredfor3000)                       │ │
│  │  2. Body Parser (1MB limit)                                   │ │
│  │  3. Rate Limiter (1 req/min per API key)                     │ │
│  │  4. Authentication(X-API-Keyvalidation)││
│ └────────────────────────────────────────────────────────────────┘ ───     ││
  PUBLIC (No Auth):                                              │ │  GET  /                         - AI docs interface          │ │
│  │    GE Lis lls    │  /:id-Getclient               │ │
│  │    ET /pi/portfoios/:tId - Get porfolio    acouclentI   - Get account                 │ │
│ │GET/api/risk-configurationrik onfgs            │ │
│  │    GET  /ap/tenants              -Lst tnas          F         /compareompasPOST instumenhsoricalhscaldata│PROTECTED(RequiresX-API-Key):POST/api/clients-Createclient││
││POST/api/clients/new-Createminimalclient   POST /pi/ients/:id/*        - Upd clent ctions││
││POST/api/portfolios-CreateportfolioPOST/p/ccu-Createaccount   │POST/api/accunts/:i/isting-otfoloUload porfolio││
││││
││ADMIN:││
││PUT/api/risk-configuration/:tenant-Updateconfig││
││POST/api/risk-configuration/:tenant-Createconfig     │ DELETE /ap/ri-nfiguation/:tnant-Dlte config       │ │
│  │    DELETE /api/cients/:id       Deetcli             ─── ───    AG          ││
│  In-Memory Arrays:                                             │   •         • portfolios[]  -Proposed                        │ │
│  │   •accounts    - Account structures                         │ │
│  │                                                                 │ │
│  │  File System:                                                   │ │
│ │•pos/*.jsn  - Savedportfio fle││
│    • api-keys.json      - API key storage                  ││   │││   ││EXTERNALPITGRTONS││││
││Finnhub(Real-timequotes):││
││•GET/quote-Currentprice,change,high/low││
││: 60call/minu││
││ Delay:100m beween ls││
││  ││ TwlveD(Histical data)││
││•GET/time_series-Historicalprices││
││•Rate:800calls/day││
││•Ranges:1mo,3mo,6mo,1y,5y      ││     ││EODHD(Insumt unvre):││
││•GET/exchangesybl-ls - Lst instrumnt││
││•Searchbyexchange,type,country  ││  ┘ │
└──────────────────────────────────────────────────────────────────```---

## echnologyStack

### Backend
- **Runtime:** Node.js 14+
- **ramework:**xpress.js
- **HTT Client** Axios- **Authentication:** Custom API key middleware-**Rate Limiting:** Cutom p-keyrate limiter
- **Storage:** In-memory + JSON e
-**APIs:** Finnhb,Twev Daa, EODHD

### rntend
- **Faework:** React 18-**HTTPClient:**Axios
-**Stat Management:** React Hook (useState)
- **Rutig:** None (singe-pageapp with step avigatin)
-**Stylg:** Custom CSS3
- **Chrts:** Rehrts

###ecury
- **Athentic:** API key(X-API-ey header)
- **Rate Limiting:** 100 requests/minute per key
- **CORS:** Cofigured for lcahost:3000
- **Requst Limits:** 10MB boy siz

---

##Daa Flow### 1 Client Creationlw

```
Usefill for → ClenFrmompont ↓
Submit( + X-API-Key)
  ↓Backend: authenticateApiKey middleware ↓
:() ↓
Backend:Storeinclent[]aray
 ↓Response:ClientobjectwithrProfile
  ↓
Frontend: Updatestat, motostep2
↓
Frntn: Fetch instruments (POST/api/i/filter) ↓
:hInstruments() → Finnub API
  ↓
Rspone: Array ofts wih price
 ↓
Fntend: Display instruent selector
```

### 2. PortfolioCretinlow

```
User selects nstruments → InstrumetSelector
  ↓
User sets alloctios → PortfolioBuildr↓
Submit(portfolios + X-API-Key)
  ↓
Backend: authenticateApiKey mddleware
  ↓
Backed: Creae potfolio objct
  ↓
Backed: Save o portfolio[] array
  ↓
Backend: Write JSON file to portolos/
  ↓
Response: Portfoio wih savdToFile path
  ↓
Fontend: Show success, offer comparison```

###3.PortfolioComparisonlow

```
User uploads existing portfolio → ExistingPortfolioUpload
  ↓
Submit (POST /api/accounts/:id/existng-portfoio + X-API-Key)
  ↓
Backend: Crea potfolio with type='exiting'
  ↓
Backend: Link toccount
  ↓
Uer creats propose portfolio
  ↓
User clicks "Compare" → PortfolioView
 ↓
Frtend:POST /api/potfolo/compare
  ↓
Bacend:Calcuate diffrnces  ↓Response:Comparison data with changes
  ↓
:D 3 tabs (Comparison, Current, Propoed)
```

---

##Component Structure

### Frontend Components

```
App.js (Man container)
├── ClientForm
│   └── Collect all client data
│       ├──esnal Ino
│       ├── Financial Situaton
│       ├── Knowedge & Experienc
│      ├──vetmen Objectives
│       ├── Risk Toleance
│       └── Sstainability Preferences
│
├── RiskProfile
│   └── Displays calculated risk assess
│
├── ExitingPortfolioUpload│─pload current portfolio holding
│       ├── Manual nty
│      └── JSON import
│
├── IntrumntSeor
│  └── Select bad on isk
│
├──PortfolioBer
│   ├── Set allocation
│  ├── Validate 100% total
│   └── Create 
│
├──PorfolioCart
│  └── Historic perfrmane visuliza
│
├── PortfolioView (New)
│   ├── Comparion Tab│├─CrrenPorfolio Tab
│   └── Proposed PrfoioTab│└──olioComparisn (Legacy)
    └── Od comparsn view
```

### BackendModules

```
server.j (Min serr)
├── Risk Configuration
│   ├──Multi-tenan cnfigs (retail,private_anking)
│   └── Scoring rules
│
├── Risk Calculation
│   └── clulateRisProfil()
│       ├── Kowlege & Experience scoring
│       ├── Financial Situation scoring
│       ├── Objectives scoring│    ─Risk olerancescoring
│
├── Instrument Fetching
│   └── fetchInstruments()
│       ├── Finnhub API clls
│       ├── Rate limiting (100ms delay)
│       └── Symbol dedulcation
│
├── Portfolio Management
│   ├── Create │├─ave  JSON files
│   └── Compaportfolos
│
└── AccoutManagent
    ├── Link clients t potfolios
    └── Track existing vs proposed

authMiddleware.js
├── authenticateApiKe()
│  ├── Validate X-API-Key header
│   ├── Check if key is active
│   └── Update usage statistics
│
├── rateLimitByKey)
│   ├── Track requests per key
│   └── Enfce100req/mlimit
│
└── otionalAuth()
    └── Attach client info if key pvied

generateApiKey.js
└── Generate secre 64-har API keys

manageApiKeys.js
└── Lis, revoke, actvate keys
```

---

## Authenticati Flow```1. Generate AP Key
   cd backend
   node generateApiKey.js "Client Name"
   → Generates 64-char hex key
   → tores in api-keys.json

2.onfigure Frontend
   frontend/.env
   RET_APP_P_KEY=generated_key
   → Axios sets default header

3. Request Flow
   Frontend → PST /api/clients
   Header:-I-Key: abc123...
   ↓
   Backend: authenticateApiKey middleware
   ↓
   oad api-keys.json
   ↓
   Find key in keys[] array
   ↓
   Check if active
   ↓
   Update lastUsed, requestCount
   ↓   Attach req.apiClient  { clientId, clientName }
   ↓
   Continue to endpoint handler

4. Rate Limiting
   rateLimitByKey middleware
   ↓
   Track requests in Map
   ↓
   If > 100 in 60 seconds → 429 error
   ↓
   Add rate limit headers to response
```

---

## Data Models### t Object
```javascrip
{
  id: "1733841234567",
 pesonalInf: {
    rstName: "John",
    astNam "Doe",    email:"joh@example.",
    phon "+47 123 4578",
    dateOfBirth: "1985-5-15"
    nationality:"orwegian",
address:"Oslo,Norway"
},
  fancialSiuation: {   annualcome: 100000,
    netWorth: 500000,
    inAssets2,
amountForAdvice:50000,
    emlymeStatu: "employed",   sourcOfWelth: "alary"
 },
  knowledge{
yearsInvesting:5,
eLevel"u",
instrumentKnowledge:[
     { instrument: "stocks", knowledge: "exerienced" }
    ],
    tradingFrequency: "mnthly",
    professoalExperience: false
  },
  objecive: {   praryObjctive:"growth",
    time"l",
liquidityNeeds:"low",
exectedReturn: 8,
    vetmentAmount: 50000 },
  r{
    level: "m",
 maxDrawdw: 20,  vlailityComfot:"medium",
    lossRein:"hold"
},
sustainability:{
esgImrtance: "mporta",    excludeSectrs: ["obcco","weapons"],
    preferredets["renewable_energy"],
   esgMRaing: "B"
  },
  rikProfile: {    rScore:65,
    risk,
   riskCategory: " Risk",    aInstruments["s""etf""bnds", "mutual_fus", "reit"]
    factors:["xtensive invetment experience" "Long-termhorizo"],
    nant: "etail",
    tenatNme: "Reail Bankg"
  },
  createdAt: "2024-12-10T12:00:00.000Z",
  updtedAt: "2024-12-10T12:30:00.000Z"
}
```

### Portfoio Object
```javascript{  id: "1733841298765",  clientd: "1733841234567",
  clientName: "John oe",
  name: "Growth Portfolio",
  type: "proposed", // or "existing"
  holdings: [
    {
     symbol:"AA",
      name: "Apple nc.",
      allocation: 30,
      quantity 10,      currentPrice: 175.50,      currentValue: 1755,      typ:"tock"
    }
  ],
  toalValu: 50000,
  aountForAdvice: 50000,
 reatedAt: "2024-12-10T13:00:00.000Z",
  savedToFile: "portfios/portfoio_1733841298765.json"
}
```

### Account Obj
```javacript
{
 accontId: "acc_1733841234567",
  clntI: "1733841234567",
 existingPortfolos:["portfolio_id_1"],
 proposedPortfolos: ["portlio_id_2"],
  ceedAt: "2024-12-10T12:00:00.000Z"
}
```

### API Key Object
```javascrpt
{
  clietId "client_1733841234567_a1b2c3d4", clientName: "Acme ",
 apKey: "64characerhexdecimalkey...",
  acve:tue,
  creaedAt:"024-12-10T10:00:00.000Z",lastUsed:"2024-12-10T14:30:00.000Z",
  rquestCount:42,
 rvokedA:null // if revked
}
```

---

## File Stucure
```
mifid-client-app/
├── backend/
 ─sver.js                   # M Expres server ─uthMddeware.js            # Authentcaon logic ├─gnerateAiKy.js            # Ky geeraion CLI│   ─maaAKys.js             # KymanagemenCLI ─pi-key.json               # AP ky sorage (gtinored) ─pakge.js
│  ├── .n                         # Environmnt variabes └─public/
│       └── api-ieface.html       # API docationUI
│
├── frotn/ ├─sc/
│   │   ├── App.js                   # Mi pp omponen
│   │   ├── compnets/
│   │   │   ├──ClenFm.js│   │   │   ├── RiskProfile.js│   │   │   ─ruSelor.j
│   │   │   ├──PofolioBuilderjs
│   │   ─otfoloCht.js
│   │   │   ├──PortfioView.js│   │    ─PortfoloCopas.js│   │    └─ExistngPortfoloUploa.js
│   │   └── sl/│        ── App.css
│   ├─packe.json
│   └── .nv                         # APIUL and ky│─portfolo/                      #Svdpofolio JSONfiles  └──portfolio_*.json
│
─docsrchiv/                    # Archivdocumntation
├── README.md                        #Projectoverview
─ ARCHITECTURE.md                  #Thi file
├──API_SEURITY_SETUP.md            # Seur guide├── DOCS.md                        #Documntindx├─eup-p-secur.sh       #etupscrit
└── .gitigne
```

---

## Por Configurtio
-**Frontend:**3000(Reat vsver)-**Backend:**5001(Expss svr)
-**API Bas:** htp://lcalhot:5001/api-**APIDocs:**http://localhost:5001/

---

##EvronentVrables

### Backed (.env)```PORT=5001NOD_V=development

# External AP Keys
FINNHU_AP_KEY=your_finnhub_key
TWEVE_DAA_API_KEyour_twelve_data_keyODHD_API_KEY=ur_eoh_key
#CORS
FROTEND_URL=http://lcalhost:3000
```

###Frontn.nv)
```
REA_APP_AP_URL=http://localhost:5001/api
REC_APP_AP_KEY=your_generate_api_key```

---

##ScurityArchectue

### API Key Athication
1. Keystori `ap-keyson`2.64-charact hexadecmalorm
3. Validated n eveyprotcte endpon
4.Uag tackd (lastUsed, equetCount5.Cn revoked/tivat

###Rate Limiting
- 100 quests er minute per API key
- TrkdMap
- Aumatic eset fter 60 sconds-Retrns 429 staus wen exceedd

### CORS
- Cofgured for lolhos:3000 n development
- Cnfigurable via FRONTEND_URL evvarible
- Creentials enable

### RequestValation
- Boy size imitd to 10MB
- JSON psing with rror handling-quied field validao

---

## ScalabilityConsidrions

### Crent Limitations
- In-mmory toragedat lost onrestart)
-Sinle servr instac
- No hoizontal sclg-Fe-basedprfolo storage

### Producton Reommendations
1. **Dabase:** Replace arrays wth MgoDB/PotgreSQL
2.**Cching:** Ad Reis forinstrumet data
3. **La Balancr:** Nginx for ultiple instnces
4. **Fe Storag:** S3 or similar for potfolios5. **API Keys:** Movet database with encypion
6. **Sessions:** Add sessionmanagemen
7. **Lgging:**Struturd oggingWinston)
8. **Monitoring:** APMtoo (NewRec, Datadog)

---

**Last Updated:** Deceme 10, 2024  **Version:** 1.0.0