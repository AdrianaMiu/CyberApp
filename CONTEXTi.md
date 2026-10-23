# CyberQuiz – Plan & Context pentru agenți

Oct 23, 2026 · @testing

## 1. Scop și rezultat așteptat

CyberQuiz este o aplicație web statică de tip quiz cu explicații, hostată pe GitHub Pages, care pregătește un analist pentru roluri de **Data Leakage Monitoring / SOC / Incident Response**, cu accent pe DLP, SIEM, SOAR, forensics și tangențele cu cloud și AI.

**Public țintă principal:** candidatul pentru rolul descris în job description-ul de referință (DLP analyst în ISTO), analiști SOC L1–L2, ingineri IR la început de carieră, cei care vor să treacă de interviuri tehnice.

**Rezultatul final:** un folder cu `index.html` + `data/*.json` (bancă de întrebări) + `manifest.json` / `sw.js` (PWA), publicabil cu un push pe branch-ul `gh-pages`, utilizabil pe telefon din browser, fără instalare din App Store / Play Store.

**Ce livrează agenții în faza de pregătire:**

1. Research structurat: job descriptions, scenarii reale, taxonomie de skill-uri (vezi secțiunile 4 și 6).
2. Banca de întrebări în format JSON conform schemei din secțiunea 5, minimum 800 de întrebări la prima versiune.
3. Aplicația web conform secțiunilor 2 și 3.

**Nu este în scop (v1):** backend, autentificare, cont de utilizator, sincronizare între dispozitive, laboratoare practice (CTF, VM-uri). Acestea pot intra în v2.

## 2. Cerințe funcționale

Aplicația are patru moduri de lucru, un sistem de progres local și explicații bogate la fiecare întrebare.

**Moduri de învățare**

1. **Practică pe domeniu** – alegi unul sau mai multe domenii (ex. DLP + SIEM), nivelul și numărul de întrebări; feedback imediat după fiecare răspuns, cu explicație.
2. **Simulare interviu / examen** – 30–60 de întrebări mixte, cronometrate, feedback doar la final, cu raport pe domenii.
3. **Scenarii** – un caz real descris în 5–10 rânduri (ex. „un utilizator a trimis 40 de fișiere pe un cont Gmail personal la 23:40”), urmat de 3–6 întrebări înlănțuite: triaj, surse de date, containment, escaladare, raportare.
4. **Revizuire greșeli** – reia doar întrebările greșite sau marcate cu „nu sunt sigur”; repetare spațiată simplă (greșit → reapare după 1 zi, 3 zile, 7 zile).

**Tipuri de întrebări**

- Alegere unică și alegere multiplă.
- Adevărat / fals cu justificare.
- Ordonare de pași (ex. etapele NIST IR, ordinea de volatilitate în forensics).
- Potrivire (ex. artefact Windows ↔ ce dovedește).
- Analiză de log / query: un fragment de log, o regulă Sigma, un query KQL/SPL, un pachet PCAP descris în text; întrebarea cere interpretarea.
- Întrebare deschisă cu răspuns-model (nu se punctează automat; utilizatorul se autoevaluează).

**Explicații la întrebări** – fiecare întrebare are: de ce răspunsul corect e corect, de ce fiecare distractor e greșit, referință (MITRE ATT&CK, NIST SP 800-61, framework, documentație vendor), nivel de dificultate, tag-uri, și opțional „cum apare la interviu”.

**Progres și statistici** – procent corect pe domeniu și pe nivel, serie de zile, întrebări marcate, export/import progres ca fișier JSON (pentru că nu există cont). Buton de reset.

**Altele** – căutare în banca de întrebări după tag, mod întunecat/luminos, mărime text ajustabilă, funcționare offline după prima încărcare, comutare limbă UI (RO/EN) dacă se decide bilingv (vezi secțiunea 9).

## 3. Cerințe tehnice și constrângeri

Totul rulează în browser, dintr-un site static; nu există server, bază de date sau cont.

| Aspect | Cerință |
| --- | --- |
| Hosting | GitHub Pages; deploy prin GitHub Actions (`actions/deploy-pages`) la push pe `main`, după `validate.js`; fără branch `gh-pages` și fără `/docs` |
| Stack | HTML + CSS + JavaScript vanilla (ES2020), fără framework și fără pas de build; `index.html` + `app.js` + `styles.css`, în total sub 300 KB fără date |
| Date | Întrebările în `data/<domeniu>.json`, încărcate cu `fetch`; un `data/index.json` listează domeniile, versiunea și numărul de întrebări |
| Mobil | Mobile-first, lățime minimă 360 px, ținte de atingere ≥ 44 px, fără hover obligatoriu, `viewport-fit=cover` și safe-area pentru notch |
| Offline / PWA | `manifest.json` + `sw.js` cu cache-first pentru shell și date; „Add to Home Screen” pe iOS și Android fără store |
| Persistență | `localStorage` pentru progres (sub 1 MB), cu try/catch și fallback în memorie; export/import JSON manual |
| Dependențe externe | Zero la runtime (fără CDN), ca aplicația să meargă și pe rețele restricționate; fonturi de sistem |
| Accesibilitate | Navigare din tastatură, `aria-live` pentru feedback, contrast WCAG AA, `prefers-color-scheme` și `prefers-reduced-motion` respectate |
| Performanță | Prima încărcare sub 2 s pe 3G; lazy-load pe domeniu, nu toată banca odată |
| Securitate | CSP strictă în `<meta>`, fără `innerHTML` cu conținut din JSON (escape sau `textContent`), fără tracking |
| Calitate | Validare JSON cu un script `validate.js` rulat în CI: schema, răspuns corect existent, fără ID duplicat, fiecare întrebare are explicație |
| Licență | Conținut original sau cu sursă citată; MIT pentru cod, CC BY-SA pentru întrebări |

**Structura repo propusă**

```text
/
├── index.html
├── app.js            # routing simplu pe hash, state, randare
├── styles.css
├── sw.js
├── manifest.json
├── data/
│   ├── index.json
│   ├── dlp.json
│   ├── siem.json
│   ├── soar.json
│   ├── incident-response.json
│   ├── network-forensics.json
│   ├── windows-forensics.json
│   ├── linux-forensics.json
│   ├── cloud-security.json
│   ├── ai-security.json
│   ├── fundamentals.json
│   └── scenarios.json
├── tools/validate.js
└── .github/workflows/deploy.yml
```

## 4. Taxonomia domeniilor și layerelor profesionale

Banca de întrebări e organizată pe 10 domenii, fiecare cu subteme și cu o pondere care reflectă job description-ul de referință (DLP și IR cântăresc cel mai mult).

| Domeniu | Subteme obligatorii | Pondere v1 | Frameworks / referințe |
| --- | --- | --- | --- |
| DLP / Data Leakage Monitoring | Canale (email, web upload, USB, print, cloud sync, clipboard, screenshot), politici și clasificare, EDM/IDM/OCR, false positives și tuning, metadate de incident, triaj DLM, raportare către stakeholderi, impact financiar/reputațional/regulator, GDPR/DORA/NIS2, handover către ISTO | 18 % | Microsoft Purview, Symantec DLP, Forcepoint, Zscaler, Netskope; ISO 27001 A.8 |
| SIEM | Arhitectură (colectare, parsare, normalizare, corelare), surse de log, regulile de detecție, Sigma, KQL/SPL, use-case management, MITRE ATT&CK mapping, alert fatigue, retenție, citirea și interpretarea de scripturi Python/PowerShell | 14 % | Splunk, Sentinel, Elastic, QRadar; MITRE ATT&CK, Sigma |
| SOAR | Playbook-uri, enrichment, automatizare triaj, integrare DLP + EDR + ticketing, decizia „human in the loop”, metrici MTTD/MTTR | 7 % | Splunk SOAR, XSOAR, Sentinel Logic Apps, Tines |
| Incident Response | Ciclul NIST 800-61 (Preparation → Detection & Analysis → Containment, Eradication, Recovery → Lessons Learned), SANS PICERL, severitate și clasificare, escaladare, comunicare, documentare, chain of custody, obligații de notificare (GDPR 72 h; DORA: notificare inițială ≤ 4 h de la clasificarea ca major și ≤ 24 h de la luarea la cunoștință, raport intermediar ≤ 72 h de la notificarea inițială, raport final ≤ 1 lună de la ultimul intermediar; NIS2: 24 h / 72 h / 1 lună) | 20 % | NIST SP 800-61r3, ISO 27035, ENISA |
| Network forensics | PCAP, NetFlow, DNS, TLS/JA3, proxy logs, exfiltrare (DNS tunneling, HTTPS la domenii necunoscute, volume anormale), Wireshark, Zeek | 6 % | Zeek, Wireshark, Suricata |
| Windows forensics | Event logs (4624/4688/4663/4698), Sysmon, Prefetch, Amcache, ShimCache, registry (USBSTOR, MRU), LNK, Jump Lists, `$MFT` / `$UsnJrnl`, NTFS timeline, analiză de memorie, malware analysis / sandbox de bază | 8 % | SANS FOR500, KAPE, Velociraptor, Volatility |
| Linux forensics | auth.log, journald, bash history, auditd, cron, /proc, procese ascunse, timeline, rootkit-uri, container escape | 4 % | SANS FOR508, Sysdig, auditd |
| Cloud security | IAM, logs (CloudTrail, Azure Activity, GCP Audit), exfiltrare din storage (S3/Blob public), SaaS DLP (M365, Google Workspace), CASB, shared responsibility | 10 % | CIS Benchmarks, CSA CCM |
| AI în SOC și riscuri AI | LLM pentru triaj și sumarizare, riscuri de scurgere prin prompt-uri la ChatGPT/Copilot, shadow AI, prompt injection, OWASP LLM Top 10, detecția traficului către servicii AI | 5 % | OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS |
| Fundamente și threat intelligence | Rețele (TCP/IP, DNS, proxy), criptografie de bază, identitate (AD, Entra, Kerberos), threat intel (IOC, TTP, CTI), threat hunting, analiză de email/phishing, Cyber Kill Chain, Diamond Model | 8 % | MITRE ATT&CK, Kill Chain |

**Layere profesionale** (fiecare întrebare poartă un tag de layer, ca să se poată filtra după nivelul de carieră):

1. **L1 – Triage analyst**: recunoaște alerta, verifică dacă e false positive, aplică playbook-ul.
2. **L2 – Investigation / DLM analyst**: corelează surse, cuantifică impactul, decide containment, escaladează.
3. **L3 – IR lead / Forensics**: conduce incidentul, face analiza artefactelor, scrie raportul final.
4. **Engineering**: scrie și ajustează reguli de detecție, playbook-uri SOAR, politici DLP.
5. **Governance / Risk**: evaluează impactul regulator și de business, raportează la management.

Niveluri de dificultate: `basic` (definiții și concepte), `intermediate` (aplicare în scenariu), `advanced` (analiză de artefacte, decizii cu trade-off).

## 5. Modelul de conținut (schema întrebărilor)

Fiecare întrebare este un obiect JSON cu ID stabil, un singur tip, explicație obligatorie și cel puțin o referință; agenții care generează conținut livrează strict în acest format.

```json
{
  "id": "dlp-0042",
  "domain": "dlp",
  "subtopic": "triage",
  "layer": "L2",
  "sector": "finance",
  "difficulty": "intermediate",
  "type": "single",
  "scenario_id": null,
  "tags": ["exfiltration", "email", "false-positive"],
  "attack": ["T1048.003", "T1567.002"],
  "question": "Un DLP alert arată că un angajat din Finance a trimis un XLSX cu 2.300 de IBAN-uri către un domeniu @gmail.com. Care este primul pas corect?",
  "context": "opțional: fragment de log, query, PCAP descris, politică",
  "options": [
    {"id": "a", "text": "Blochezi contul utilizatorului imediat"},
    {"id": "b", "text": "Verifici metadatele alertei: destinatar, clasificare, istoric similar, dacă emailul a fost livrat sau pus în carantină"},
    {"id": "c", "text": "Închizi alerta ca false positive pentru că Finance lucrează cu IBAN-uri"},
    {"id": "d", "text": "Suni angajatul și îl întrebi de ce a trimis fișierul"}
  ],
  "answer": ["b"],
  "explanation": {
    "correct": "Triajul începe cu validarea alertei din datele deja logate de DLP, înainte de orice acțiune de containment sau contact.",
    "distractors": {
      "a": "Containment disproporționat fără confirmare; poate fi un false positive sau un flux aprobat.",
      "c": "Închidere fără verificare; un domeniu personal pentru date de clienți este un semnal real.",
      "d": "Contactul direct înainte de investigație poate compromite ancheta (tipping off)."
    },
    "interview_angle": "Intervievatorii vor să vadă că nu reacționezi, ci validezi și apoi acționezi proporțional."
  },
  "references": [
    {"title": "NIST SP 800-61r3 – Detection and Analysis", "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"}
  ],
  "source_type": "scenario-derived",
  "version": 1,
  "reviewed": false
}
```

**Reguli pentru câmpuri**

- `type` ∈ `single`, `multi`, `truefalse`, `ordering`, `matching`, `log-analysis`, `open`. Pentru `ordering`, `answer` este lista ID-urilor în ordinea corectă; pentru `matching`, `answer` este un obiect de ID-uri `{"l1": "r2"}` (vezi „Forma câmpurilor pe tipuri” mai jos).
- `answer` e întotdeauna listă, chiar și pentru o singură opțiune.
- `distractors` trebuie să acopere toate opțiunile greșite; distractorii trebuie să fie plauzibili (greșeli reale pe care le fac analiștii), nu absurzi.
- `attack` e opțional, dar recomandat pentru DLP, IR și forensics.
- `sector` ∈ `finance`, `tech-vendor`, `mssp-consulting`, `general`; distribuția țintă este 40 / 15 / 20 / 25 %, verificată de `validate.js` cu toleranță ± 5 %.
- `source_type` ∈ `job-description`, `scenario-derived`, `framework`, `tool-docs`, `original`.
- Text în limba aleasă pentru conținut (vezi secțiunea 9); termenii tehnici rămân în engleză.

**Forma câmpurilor pe tipuri** (decizie de design după builder-check; validată de `validate.js`)

| `type` | `options` | `answer` | `explanation.distractors` |
| --- | --- | --- | --- |
| `single`, `multi` | listă `{id, text}` | listă de ID-uri (unul sau mai multe) | un rând per opțiune greșită |
| `truefalse` | fix: `a` = True, `b` = False | `["a"]` sau `["b"]` | un rând pentru valoarea greșită |
| `ordering` | pașii, `{id, text}`, în ordine amestecată | toate ID-urile în ordinea corectă | `{}` (explicația ordinii e în `correct`) |
| `matching` | obiect `{left: [{id, text}], right: [{id, text}]}`; `right` poate avea elemente în plus | obiect `{"l1": "r2", ...}` | un rând per pereche capcană |
| `log-analysis` | ca `single` sau `multi`; fragmentul stă în `context` | ca `single` sau `multi` | ca `single` sau `multi` |
| `open` | absent | `[]` | `{}`; răspunsul-model e în `explanation.correct`, iar `rubric` listează 3–6 puncte de autoevaluare |

- **ID-uri**: o întrebare are mereu ID `<domeniu>-NNNN`, cu domeniul ei principal, și într-un scenariu cross-domain. Scenariile au `scn-NNN`, iar `scenarios.json` referă ID-uri reale de întrebări. Placeholderele `scn-001-q1` din draftul de research dispar. ID-urile nu se refolosesc: `data/retired-ids.json` le păstrează, iar `validate.js` respinge refolosirea.
- **Versiune și resetarea cutiei**: `version` e un întreg crescut la orice editare. Aplicația păstrează în progres un hash al `answer` și `options` și resetează cutia Leitner doar când hash-ul s-a schimbat (schimbare majoră), nu la corecții de text.
- **Întrebări nerevizuite**: stau în aceleași fișiere `data/*.json`, cu `reviewed: false`. Aplicația le ignoră la încărcare, iar `data/index.json` raportează separat `authored` și `served`.
- **Controalele din `validate.js`**: schema, ID-urile, răspunsul corect, explicația și distribuțiile pe domeniu, sector, dificultate rulează pe tot ce e scris (`authored`) și blochează CI. Pe subsetul servit (`reviewed: true`) rulează aceleași distribuții ca avertisment, nu blochează deploy-ul, ca review-ul rămas în urmă să nu amâne publicarea. Fiecare domeniu trebuie să aibă cel puțin 20 de întrebări eligibile pentru Practice și Exam (fără `open` și fără `scenario_id`).
- **Extragerea pentru Exam mode**: proporțională cu ponderile din §4; dacă un domeniu nu are destule întrebări eligibile, diferența se completează din domeniile cele mai apropiate.

**Scenarii** (`scenarios.json`): obiect cu `id`, `title`, `narrative` (5–10 rânduri), `artifacts` (log-uri, emailuri, alerte, descrise în text), `questions` (listă de ID-uri de întrebări în ordinea de parcurgere), `debrief` (ce ar fi făcut un analist senior, în 10 rânduri).

**Criterii de calitate per întrebare** (verificate la review): o singură interpretare corectă; explicația învață ceva chiar dacă ai răspuns corect; fără „toate de mai sus”; fără întrebări de memorare pură a numerelor de port sau a versiunilor, cu excepția celor de uz zilnic (Event ID 4624, 4688, portul 53 etc.).

## 6. Brief de research pentru agenți

Research-ul are trei ținte: ce cer angajatorii, ce fac analiștii în realitate și ce greșesc candidații la interviu; fiecare agent livrează un fișier Markdown cu sursele deschise efectiv, nu doar snippet-uri de căutare.

**R1 – Job descriptions (cerere de piață)**

- Surse: LinkedIn Jobs, Indeed, Glassdoor, eJobs/BestJobs (RO), site-urile de carieră ale băncilor și big4 din România și UE, paginile de carieră ale MSSP-urilor (Orange Cyberdefense, Atos, Accenture Security, Bitdefender).
- Metodă: minimum 40 de job descriptions pentru roluri „DLP analyst”, „Data leakage”, „SOC analyst L1/L2”, „Incident responder”, „Digital forensics analyst”, „Detection engineer”; extrage responsabilitățile și skill-urile într-un tabel; numără frecvența fiecărui skill; marchează ce apare în peste 50 % din anunțuri ca `must-have`.
- Livrabil: `research/01-job-descriptions.md` cu tabelul de frecvențe și lista de 30 de întrebări „pe care un intervievator le-ar pune pornind de la aceste cerințe”.

**R2 – Scenarii reale (practica din teren)**

- Surse: rapoarte publice de incidente (Verizon DBIR, ENISA Threat Landscape, IBM Cost of a Data Breach), write-up-uri DFIR (The DFIR Report, SANS Reading Room, blogurile Mandiant, CrowdStrike, Microsoft Security), postări LinkedIn și Reddit (r/cybersecurity, r/netsec, r/computerforensics) despre „insider threat”, „data exfiltration”, „DLP false positives”, documentație și case studies ale vendorilor DLP.
- Metodă: colectează 25 de scenarii distincte de scurgere de date (angajat care pleacă, upload la ChatGPT, USB, email greșit, cont compromis, cloud bucket public, print, screenshot, Teams/Slack extern, terț). Pentru fiecare: cum a fost detectat, ce metadate DLP/SIEM au contat, ce containment s-a aplicat, ce a mers prost, impact și obligații de notificare.
- Livrabil: `research/02-scenarios.md` + draft `scenarios.json` cu 30 de scenarii convertite la format (în engleză; sursa: `research/02`, `05`, `06`).

**R3 – Frameworks și referințe canonice**

- NIST SP 800-61r3, NIST CSF 2.0, ISO 27035, MITRE ATT&CK (tacticile Exfiltration și Collection), MITRE D3FEND, Sigma HQ, SANS posters (Windows Forensic Analysis, Hunt Evil), Microsoft Purview DLP docs, GDPR art. 33–34, DORA, NIS2.
- Livrabil: `research/03-frameworks.md` cu, pentru fiecare, cele 10 concepte care apar cel mai des la interviu și link la pagina exactă.

**R4 – Interviu și certificări**

- Surse: ghiduri de interviu pentru SOC/IR (LetsDefend, TryHackMe, Blue Team Labs), obiectivele de examen CompTIA CySA+, GIAC GCIH/GCFA/GCFE/GNFA, BTL1, Microsoft SC-200, Splunk Core Certified User.
- Metodă: mapează obiectivele de examen la cele 10 domenii din secțiunea 4; marchează suprapunerile.
- Livrabil: `research/04-interview-and-certs.md`.

**R5 – Cloud și AI** (vezi secțiunea 7 pentru detalii)

- Livrabil: `research/05-cloud-ai.md`.

**Reguli comune pentru toți agenții de research**

1. Citează URL-ul fiecărei surse și data accesării; sursele nedeschise nu se citează.
2. Nu copia text din job descriptions sau articole în întrebări; parafrazează și transformă în întrebare de aplicare.
3. Marchează ce e specific pentru sectorul bancar / financiar (job description-ul de referință pare din acest sector: ISTO, DLM, impact regulator).
4. Semnalează contradicțiile între surse într-o secțiune „Dezacorduri” la finalul fișierului.
5. Notă: acest plan a fost scris fără acces la web, deci listele de surse de mai sus sunt puncte de pornire din memorie; agenții verifică disponibilitatea și completează.

## 7. Tangența cu cloud și AI

Cloud-ul și AI-ul nu sunt domenii separate în aplicație, ci apar în două feluri: ca domenii proprii (8 % + 4 %) și ca „strat” peste scenariile de DLP și IR, pentru că exfiltrarea modernă trece aproape mereu prin SaaS sau printr-un asistent AI.

**Cloud – ce trebuie să acopere întrebările**

- Unde apar scurgerile: partajări externe în OneDrive/SharePoint/Google Drive, link-uri „anyone with the link”, bucket-uri S3/Blob publice, token-uri OAuth acordate aplicațiilor terțe, sincronizare pe dispozitive personale (BYOD), Teams/Slack cu guest access.
- Ce log-uri contează: M365 Unified Audit Log (FileDownloaded, FileSyncDownloadedFull pentru descărcări prin clientul de sync, SharingSet doar pentru partajare cu utilizatori din director, AnonymousLinkCreated pentru linkuri „Anyone”), Entra sign-in logs (impossible travel, MFA fatigue), AWS CloudTrail (GetObject în masă, PutBucketPolicy), GCP Audit Logs, CASB/SSE logs (Netskope, Zscaler, Defender for Cloud Apps).
- Instrumente: Purview DLP pentru SaaS, CASB inline vs API, Conditional Access, sensitivity labels, Cloud DLP la Google.
- Scenarii tipice: angajat care pleacă descarcă 5.000 de fișiere din SharePoint în 2 zile; cont de serviciu cu cheie expusă pe GitHub; developer care încarcă un dump de bază de date într-un bucket de test public.
- IR în cloud: ce înseamnă containment când nu ai mașina (revocă token, rotește cheia, dezactivează sharing), chain of custody pentru log-uri cloud, retenție limitată (Audit Standard: 180 de zile pentru înregistrările generate din 17 oct. 2023, 90 înainte; Audit Premium: 1 an doar pentru utilizatorii E5; sursă: `research/05-cloud-ai.md`, de reconfirmat pe documentația Microsoft înainte de întrebări).

**AI – două direcții**

1. *AI ca sursă de risc de scurgere*: angajați care lipesc cod, contracte sau date de clienți în ChatGPT, Copilot, Gemini; detecția traficului către domeniile AI; politici DLP pentru „generative AI” în Purview și CASB; shadow AI; prompt injection și exfiltrare prin agenți conectați la date interne; OWASP LLM Top 10 (LLM01 prompt injection, LLM02 sensitive information disclosure, LLM06 excessive agency); MITRE ATLAS.
2. *AI ca unealtă în SOC*: sumarizare de alerte, triaj asistat (Security Copilot, Splunk AI Assistant, Sentinel), generare de query-uri KQL, limitele (halucinații, încredere oarbă, date sensibile trimise către model), cum validezi o recomandare AI înainte de containment, ce rămâne responsabilitatea analistului.

**Întrebări de tip „judecată”** pentru aceste două domenii, nu de memorare: când e corect să blochezi complet un serviciu AI vs să permiți cu DLP inline; cum raportezi la management un incident de scurgere prin AI; cum cuantifici impactul regulator (GDPR, secret comercial) pentru date trimise unui model extern.

**Research R5 – livrabil:** 15 scenarii cloud + 10 scenarii AI, politicile DLP concrete ale vendorilor pentru AI (nume de politică, ce detectează), și 3 rapoarte publice de incidente de scurgere prin AI cu sursa citată.

## 8. Plan de lucru pe agenți

Șapte agenți cu roluri separate, în patru faze; nimic nu intră în banca finală fără trecerea prin agentul de review și prin `validate.js`.

| Agent | Rol | Input | Livrabil | Criteriu de acceptare |
| --- | --- | --- | --- | --- |
| A0 – Orchestrator | Ține planul, distribuie task-uri, consolidează | Acest document | `PROGRESS.md` actualizat după fiecare fază | Fiecare livrabil are status și link |
| A1 – Research piață | R1 + R4 din secțiunea 6 | Lista de surse | `research/01`, `research/04` | ≥ 40 JD-uri, tabel de frecvențe, surse cu URL și dată |
| A2 – Research scenarii | R2 + R5 | Lista de surse | `research/02`, `research/05`, draft `scenarios.json` | ≥ 25 scenarii documentate sau compozite marcate (făcut: 83 candidate în `research/02`, `05`, `06`), fiecare cu detecție, containment, impact; 30 convertite în `scenarios.json` |
| A3 – Research frameworks | R3 | Lista de surse | `research/03` | 10 concepte per framework, link la pagina exactă |
| A4 – Autor întrebări | Scrie întrebări pe schema din secțiunea 5, un fișier per domeniu | Research A1–A3, ponderi din secțiunea 4 | `data/*.json`, ≥ 800 întrebări | Trec `validate.js`; distribuție pe domenii în ± 3 % față de ponderi; ≥ 30 % `intermediate`, ≥ 20 % `advanced` |
| A5 – Reviewer tehnic | Verifică corectitudinea, plauzibilitatea distractorilor, referințele | `data/*.json` | Fișier de review cu verdict per întrebare, `reviewed: true` | ≤ 5 % întrebări respinse la a doua trecere; nicio referință moartă |
| A6 – Developer | Construiește aplicația conform secțiunilor 2–3 | Secțiunile 2, 3, 5 + un set de 20 de întrebări de test | Repo publicabil, GitHub Action verde | Lighthouse mobile ≥ 90 pe Performance, Accessibility, Best Practices; instalabil și funcționează offline (verificare manuală); testat pe iPhone real (iOS Safari) și pe Android Chrome emulat în Playwright |

**Faze și porți**

1. **Faza 0 – Decizii** (acest document): utilizatorul închide întrebările din secțiunea 9. Poartă: secțiunea 9 fără întrebări deschise.
2. **Faza 1 – Research** (A1, A2, A3 în paralel): livrabilele `research/01–05`. Poartă: A0 confirmă că fiecare domeniu din secțiunea 4 are cel puțin 3 surse și 2 scenarii.
3. **Faza 2 – Conținut și aplicație** (A4 și A6 în paralel): A6 pornește de la 20 de întrebări de test scrise de A4 în prima zi, ca să nu aștepte toată banca. Poartă: `validate.js` verde și demo-ul pe telefon.
4. **Faza 3 – Review și publicare** (A5, apoi A0): review, corecții, deploy pe GitHub Pages. Poartă: Lighthouse ≥ 90 (Performance, Accessibility, Best Practices), eșantion de 10 % verificat manual de utilizator (câte ~8 întrebări per domeniu, minimum 5, cu accent pe `advanced` și forensics; un domeniu trece dacă cel mult 1 din 10 întrebări citite are o eroare factuală, altfel flag-urile `reviewed` ale domeniului se resetează și A5 reia review-ul cu greșelile găsite ca criteriu nou), aplicația servește doar întrebări cu `reviewed: true`.

**Prompt-ul de context dat fiecărui agent** conține: secțiunea 1 (scop), secțiunea 4 (taxonomie), secțiunea 5 (schemă), secțiunea proprie de research sau de dezvoltare, regulile comune din secțiunea 6, plus instrucțiunea „nu inventa surse; marchează cu `[verifică]` orice afirmație fără sursă deschisă”.

**Iterații după v1**: adaugă domenii noi doar prin fișier JSON nou + o linie în `data/index.json`, fără a atinge codul; o întrebare contestată se marchează `disputed: true` și iese din rotație până la review.

## 9. Întrebări deschise și decizii de luat

Deciziile de mai jos au fost închise în sesiunea de grilling din 2026-10-23. Termenii canonici sunt în `GLOSSARY.md`.

**Runda 1**

- [x] **Limba conținutului**: întrebări și explicații în engleză; UI în română și engleză.
- [x] **Volum v1**: 800 de întrebări de la prima versiune (decizia utilizatorului, față de propunerea de 400).
- [x] **Repo**: public; MIT pentru cod, CC BY-SA pentru întrebări.
- [x] **Sector**: 60 % financiar (DORA, ISTO, regulator), 40 % general.
- [x] **Instrumente de referință**: vendor-neutru în întrebare; exemplu concret în explicație, cu Sentinel/KQL și Purview ca default.
- [x] **Review uman**: utilizatorul verifică manual un eșantion de 10 % (accent pe `advanced` și forensics) în Faza 3, pe lângă agentul A5.
- [x] **Job description de referință**: nu se pune în repo; înlocuit de research R1 pe anunțuri deschise actuale (ponderile din secțiunea 4 sunt provizorii).
- [x] **Lighthouse**: categoria PWA nu mai există (Lighthouse 12+). Criteriu nou: ≥ 90 pe Performance, Accessibility și Best Practices, plus verificare manuală (instalabil, funcționează offline în modul avion).
- [x] **Dispozitive de test**: iPhone real pentru iOS Safari; Android prin emulare Chromium în Playwright, „testat pe Android real” rămâne nerealizat.

**Runda 2**

- [x] **Întrebări deschise**: doar în Scenario mode; excluse din Practice și Exam mode. Ponderea a fost redusă de la 10 % la 5 % (40 de întrebări) în runda 5.
- [x] **Poarta de publicare**: ținta e 800 de întrebări; aplicația servește doar întrebările cu `reviewed: true`, cele nerevizuite rămân în repo în afara rotației. Dacă review-ul rămâne în urmă, se publică cu ce e verificat.
- [x] **Întrebări din scenarii**: se scriu în fișierele pe domenii cu un câmp `scenario_id` și intră în ponderile pe domenii; `scenarios.json` doar le referă.
- [x] **Structura frontend**: `index.html` + `app.js` + `styles.css`, buget de 300 KB în total, fără date.
- [x] **Deploy**: GitHub Actions cu `actions/deploy-pages` de pe `main`, după `validate.js`; fără branch `gh-pages` și fără folder `/docs`.
- [x] **Recalibrare ponderi**: după R1, A0 propune ponderi noi pe baza frecvențelor reale; utilizatorul le aprobă înainte să înceapă A4.
- [x] **Exam mode**: 90 s pe întrebare; timpul expirat închide examenul; întrebările fără răspuns sunt greșite; multiple, ordering și matching se punctează totul-sau-nimic, iar punctarea parțială apare doar în explicație.
- [x] **Repetare spațiată** (Leitner): corect mută 1 zi → 3 zile → 7 zile → absolvită; greșit resetează la 1 zi; Flagged cu răspuns corect rămâne în aceeași cutie.
- [x] **Contestare**: butonul „Raportează” deschide un GitHub Issue precompletat cu ID-ul întrebării; `disputed: true` se setează manual.
- [x] **Termeni**: vezi `GLOSSARY.md` (Scenario vs Scenario mode, Flagged, Missed etc.).

**Runda 3**

- [x] **Câmp `sector`**: fiecare întrebare poartă `sector` ∈ `finance`, `tech-vendor` (CrowdStrike, Bitdefender, Adobe, Fortinet etc.), `mssp-consulting` (NTT Data, Orange Cyberdefense, Accenture, big4), `general`; `validate.js` verifică distribuția; Practice mode are filtru opțional după sector. Raportul 60/40 din runda 1 devine provizoriu și se recalibrează după R1.
- [x] **Întrebări cu `scenario_id`**: apar doar în Scenario mode și Review mode (cu rezumatul scenariului deasupra), nu în Practice și Exam.
- [x] **Actualizare conținut**: versiunea băncii în `data/index.json`; service worker-ul afișează banner „Conținut actualizat, reîncarcă”; progresul se leagă de ID-ul întrebării, ID-urile nu se refolosesc, cele dispărute se ignoră la import; schimbarea majoră (răspuns sau opțiuni) resetează cutia Leitner, corecția minoră o păstrează.
- [x] **Buget de performanță**: „sub 2 s pe 3G” se aplică doar shell-ului (`index.html`, `app.js`, `styles.css`, `data/index.json`); fișierele de domeniu se încarcă la cerere și sunt precache-uite în fundal.
- [x] **Producție în Faza 2**: A4 scrie loturi de ~25 întrebări pe domeniu, A5 revizuiește fiecare lot imediat (pipeline); eșantionul de 10 % al utilizatorului se citește din întrebările deja revizuite.
- [x] **Statutul documentului**: acest fișier este spec-ul; fără spec separat în `docs/superpowers/specs/`; după research și ponderi se rulează builder-check, apoi planul de implementare.

**Runda 4 (după research R1, R2, R5, R6)**

- [x] **Ponderi pe domenii** (aprobate 2026-10-23, vezi tabelul din §4): DLP 18 % (144 întrebări), IR 20 % (160), SIEM 14 % (112), Cloud 10 % (80), Windows forensics 8 % (64), Fundamente și threat intelligence 8 % (64), SOAR 7 % (56), Network forensics 6 % (48), AI 5 % (40), Linux forensics 4 % (32). Temei: `research/01-job-descriptions.md` (69 JD-uri, cifre direcționale).
- [x] **Raport pe `sector`**: 40 % finance, 20 % mssp-consulting, 15 % tech-vendor, 25 % general.
- [x] **Exemple de query**: KQL (Sentinel) implicit și SPL (Splunk) al doilea; Purview implicit pentru DLP.
- [x] **Subteme adăugate**: malware analysis/sandbox (Windows forensics), threat hunting, CTI și email/phishing (Fundamente și threat intelligence), scripting citit/interpretat (SIEM).
- [x] **Corecții**: `data/fundamentals.json` adăugat în structura repo; termenele DORA confirmate din surse primare introduse în §4 (Incident Response); dezacordul 11 din `02-scenarios.md` rezolvat.

**Runda 5 (după builder-check)**

- [x] **Scenarii și întrebări deschise**: 30 de scenarii cu 4–6 întrebări fiecare, deci circa 150 de întrebări cu `scenario_id` (≈ 19 % din bancă); întrebările deschise scad la 5 % (40), una sau două la finalul fiecărui scenariu; ambele categorii excluse din Practice și Exam.
- [x] **Eșantionul de 10 %**: ~8 întrebări per domeniu (minimum 5), accent pe `advanced` și forensics; trece dacă cel mult 1 din 10 are o eroare factuală, altfel domeniul se resetează și A5 reia review-ul.
- [x] **Apeluri ale builder-ului, acceptate**: forma câmpurilor pe tipuri, ID-uri `<domeniu>-NNNN` și `scn-NNN`, `data/retired-ids.json`, hash de răspuns pentru resetarea Leitner, nerevizuite în aceleași fișiere cu `reviewed: false`, CI blocat pe distribuții la nivel `authored` și avertisment pe subsetul servit, minimum 20 de întrebări eligibile per domeniu, Exam proporțional cu ponderile (vezi §5).

**Research disponibil pentru agenți:** `research/01-job-descriptions.md`, `research/02-scenarios.md` (+ `02-scenarios-draft.json`, în română, de tradus în engleză și curățat de `_meta`), `research/05-cloud-ai.md`, `research/06-soar-linux-regulatory.md`. R3 (frameworks) și R4 (interviu și certificări) nu au fost rulate; A3 le poate face în paralel cu A4 sau pot fi sărite.

**Încă deschis:** nimic care să blocheze Faza 2, în afara întrebărilor care vor rezulta din builder-check.

După închiderea lor, documentul devine prompt-ul de context pentru agenți.
