# R2 – Scenarii reale de scurgere de date / insider threat / exfiltrare

Agent A2 · acces la surse: **2026-10-23** (data de „astăzi" a sesiunii; toate sursele marcate „deschis" au fost efectiv încărcate cu WebFetch în această dată) · limba: română, termenii tehnici în engleză.

## 0. Cum se citește fișierul

**Legendă de încredere** (folosită la fiecare scenariu):

- **DOC** = scenariu *documentat*: faptele (cine/ce/când/impact) provin dintr-o sursă deschisă efectiv, citată la finalul scenariului. Ce nu spune sursa este marcat `[verifică]` sau eticheta *inferență*.
- **COMP** = scenariu *compozit* („inspirat de"): construit de agent pe baza unui tipar real; **numele, cifrele, orele și artefactele sunt ilustrative, nu fapte**. Fiecare COMP indică „ancora" documentată (scenariile DOC / documentația vendor) pe care se sprijină.
- **inferență** = ce ar fi contat într-un SIEM/DLP, dedus de agent din tipul incidentului și din documentația vendorului; **nu** este afirmat de sursa incidentului.
- `[verifică]` = afirmație fără sursă deschisă efectiv (din memorie sau din snippet de căutare).

**Stratul de „metadate DLP/SIEM"** de la fiecare scenariu folosește denumirile reale din documentația Microsoft Purview (Endpoint DLP, Insider Risk Management, Edge for Business, Copilot DLP) deschisă în această sesiune (secțiunea 3), ca să poată fi transformat direct în `context` de întrebare.

**Notă despre practicieni (Reddit):** `reddit.com` este blocat atât pentru WebSearch cât și pentru WebFetch în acest mediu (verificat: eroare de acces). **Nu am folosit nicio discuție r/cybersecurity sau r/computerforensics**; nicio afirmație din acest fișier nu se sprijină pe ele. Dacă se dorește un indiciu de la practicieni, trebuie adus de un agent/om cu acces.

## 1. Sumar și numere

- **39 de scenarii** distincte: **24 DOC** (S01–S24) + **15 COMP** (C01–C15).
- Sector: **24 financiar/bancar** (9 DOC + 15 COMP) vs **15 general** (15 DOC) → 62 % / 38 %, aproape de ținta 60/40. „Financiar" include și instituții de plăți/crypto/brokeraj reglementate (Block, Coinbase).
- Canale acoperite: email greșit, USB, print, screenshot, cloud sync personal, SharePoint/OneDrive mass download, upload/paste la AI (ChatGPT/Copilot), cont compromis, OAuth, bucket/blob public, cheie expusă pe GitHub, Teams/Slack extern, terț/furnizor, DNS/HTTPS exfil, admin/DBA privilegiat, insider mituit, plecarea angajatului.
- **Rapoarte publice de scurgere prin AI cu sursă deschisă (cerința „3 rapoarte"):** vezi secțiunea 4 – 5 cazuri (Samsung, OpenAI mar. 2023, Microsoft/Wiz 38 TB, DeepSeek, EchoLeak), din care 2 cu sursă primară deschisă (cele două postări Wiz: Microsoft 38 TB și DeepSeek), 1 secundară care citează post-mortemul primar (OpenAI) și 2 doar cu sursă secundară (Samsung, EchoLeak).

## 2. Tabel-index (pentru A4 – autorul de întrebări)

| ID | Titlu scurt | Tip | Sector | Canal | Domeniu taxonomie (secț. 4) | Layer |
|---|---|---|---|---|---|---|
| S01 | Insider cu USB într-un marketing, 9,7 M persoane (Desjardins) | DOC | Fin | USB + shared drive | DLP, IR | L2/L3, Gov |
| S02 | Fost angajat descarcă rapoarte după plecare (Block/Cash App) | DOC | Fin | Cont neînchis / raport | DLP, Cloud, IR | L2, Gov |
| S03 | Agenți de suport mituiți (Coinbase) | DOC | Fin | Insider mituit | DLP, IR, SIEM | L2/L3, Gov |
| S04 | Cloud misconfigurat, descoperit prin tip GitHub (Capital One) | DOC | Fin | Cloud/WAF | Cloud, IR | L3, Gov |
| S05 | Decomisionare servere prin vendor (Morgan Stanley) | DOC | Fin | Terț / hardware | DLP, IR, Gov | Gov |
| S06 | Notificări de polițe trimise la alte persoane (UniCredit RO) | DOC | Fin (RO) | Email/SMS/online banking greșit | DLP, IR (GDPR 33) | L2, Gov |
| S07 | Notificare GDPR întârziată (Bank of Ireland) | DOC | Fin | Feed către registru | IR (GDPR 33–34) | Gov |
| S08 | Snowflake fără MFA, bancă afectată (Santander) | DOC | Fin | SaaS/third-party | Cloud, SIEM, IR | L2/L3 |
| S09 | Ransomware la bancă-partener fintech (Evolve) | DOC | Fin | Terț / ransomware | IR, DORA | L3, Gov |
| S10 | Ingineri lipesc cod în ChatGPT (Samsung) | DOC | General | AI paste | AI, DLP | L1/L2 |
| S11 | Bug Redis expune titluri de chat + date de plată (OpenAI) | DOC | General | AI provider | AI, IR | Gov |
| S12 | Token SAS cu expirare 2051 (Microsoft AI research / Wiz) | DOC | General | Cloud storage | Cloud, AI | Eng, L2 |
| S13 | EchoLeak – prompt injection zero-click în Copilot | DOC | General | AI agent | AI, DLP | Eng |
| S14 | Parolă spray pe tenant de test + OAuth app (Midnight Blizzard) | DOC | General | Cont compromis / OAuth | Cloud, SIEM | L2/L3 |
| S15 | Cheie de acces în repo public 5 ani (Toyota) | DOC | General | GitHub | Cloud, DLP | Eng |
| S16 | Endpoint Azure public „BlueBleed" (Microsoft/SOCRadar) | DOC | General | Storage public | Cloud, IR | L2 |
| S17 | Document tipărit, identificat prin audit de printare (Winner) | DOC | General (gov) | Print | DLP, Windows forensics | L2/L3 |
| S18 | Inginer de securitate extorchează firma (Ubiquiti/Sharp) | DOC | General | Insider admin cloud | Cloud, IR | L3 |
| S19 | Inginer Google: Apple Notes → PDF → cloud personal | DOC | General | Cloud personal | DLP, AI (IP) | L2/L3 |
| S20 | Foaie Excel cu tab ascuns publicată prin FOI (PSNI) | DOC | General | Email/web publish | DLP | L1/L2, Gov |
| S21 | Rclone → MEGA în 2h după exploit Confluence (DFIR Report) | DOC | General | Web upload | Network forensics, Win forensics | L3 |
| S22 | OAuth Salesloft Drift → Salesforce (UNC6395) | DOC | General | SaaS/OAuth | Cloud, SIEM | L2/L3 |
| S23 | Doi foști angajați dau 100 GB presei (Tesla) | DOC | General | Insider | DLP, IR | L2, Gov |
| S24 | USB pierdut cu date despre 460 000 locuitori (Amagasaki) | DOC | General (public) | USB pierdut | DLP | L1/Gov |
| C01 | XLSX cu IBAN-uri spre Gmail personal | COMP | Fin | Email | DLP | L1/L2 |
| C02 | Relationship manager care pleacă: SharePoint + Dropbox | COMP | Fin | Mass download + cloud sync | DLP, Cloud | L2 |
| C03 | Analist compliance lipește date client în ChatGPT personal | COMP | Fin | AI paste | AI, DLP | L1/L2 |
| C04 | Screenshot cu ecrane de client trimis pe WhatsApp | COMP | Fin | Screenshot/BYOD | DLP | L1/L2 |
| C05 | Mailbox de trezorerie compromis + regulă de forward | COMP | Fin | Cont compromis | Cloud, SIEM, IR | L2/L3 |
| C06 | Cheie API core-banking în GitHub public | COMP | Fin | GitHub | Cloud, DLP | Eng |
| C07 | Blob public cu scanări KYC în mediu de test | COMP | Fin | Storage public | Cloud, IR | L2/L3 |
| C08 | Furnizor KYC/OCR: SFTP greșit și întârziere de notificare | COMP | Fin | Terț | IR, DORA | L3/Gov |
| C09 | Slack Connect / Teams guest cu lista de clienți | COMP | Fin | Teams/Slack extern | DLP, Cloud | L2 |
| C10 | Print listă clienți HNW înainte de demisie | COMP | Fin | Print | DLP, Win forensics | L2 |
| C11 | Copilot rezumă document HR/credit din cauza oversharing | COMP | Fin | AI agent | AI, DLP | Eng, L2 |
| C12 | DBA exportă tabela de clienți la 02:00 cu unealta aprobată | COMP | Fin | Admin privilegiat | SIEM, Cloud | L2/L3 |
| C13 | Workstation cu trafic DNS TXT anormal (DNS tunneling) | COMP | Fin | DNS | Network forensics | L3 |
| C14 | Dropbox desktop sync pe laptopul corporativ | COMP | Fin | Cloud sync | DLP | L1/L2 |
| C15 | Fals pozitiv: lot trimestrial către auditorul extern | COMP | Fin | Email | DLP tuning | L1/Eng |

---

## 3. Referințe transversale (deschise) folosite la „metadate DLP/SIEM" și la obligații de notificare

**Microsoft Purview – Endpoint DLP** (deschis; pagina actualizată 2026-10-15): activități monitorizate: upload către domenii cloud restricționate / acces din browser nepermis, paste în browsere suportate, copy to clipboard, copy to USB, copy to network share, print, Bluetooth nepermis, RDP, create/rename item, access de aplicații restricționate, Windows Recall snapshots (preview). Atribute auditate pentru copy-to-USB: activity type, client IP, target file path, timestamp, file name, user, extension, size, SIT, sha1, sha256, previous file name, source/destination location type, device name, aplicația care a copiat, Defender device ID, producător/model/serial al mediei amovibile. Acțiuni: audit / warn / block / block with override. **Limite documentate:** date nesalvate local nu pot fi scanate (ex. Word → direct pe USB); DLP-ul nu scanează fișierele *încărcate direct în prompt-ul Copilot* (doar textul tastat). URL: https://learn.microsoft.com/en-us/purview/endpoint-dlp-learn-about

**Microsoft Purview – Insider Risk Management, șabloane** (deschis; actualizat 2026-05-05): *Data theft by departing users* (trigger: resignation/termination din HR connector sau ștergerea contului în Entra; indicatori: download SharePoint, print, copy la servicii personale de cloud), *Data leaks*, *Data leaks by priority users*, *Data leaks by risky users*, *Risky AI usage* (necesită extensia Edge/Chrome), *Risky Agents* (preview), *Security policy violations*. Notă relevantă pentru triaj: alertele DLP generate exclusiv din Endpoint DLP, Teams DLP și Copilot DLP **nu** sunt evaluate de indicatorul „DLP alert" al IRM. URL: https://learn.microsoft.com/en-us/purview/insider-risk-management-policy-templates

**Microsoft Purview – DLP pentru Copilot** (deschis; actualizat 2026-10-05): restricții pe prompt (SIT-uri), pe web search, pe fișiere/emailuri cu sensitivity label, pe emailuri externe (preview, evaluează doar metadata expeditorului). Promptul rulează cu permisiunile utilizatorului; actualizările de politică pot dura până la 4 h. URL: https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about

**Microsoft Purview – Edge for Business către AI neadministrat** (deschis; actualizat 2026-07-29) și **ghid „shadow AI step 3"** (deschis): politică „All unmanaged AI apps", condiții SIT (IBAN, SWIFT Code, ABA, bank account numbers), acțiuni „Text sent to or shared with cloud or AI apps → Block" și „File uploaded … → Block", rulare inițială în *simulation mode*; la Block utilizatorii sunt blocați să deschidă alte browsere nesuportate; sensitivity labels cu criptare împiedică AI-ul să proceseze conținutul. URL-uri: https://learn.microsoft.com/en-us/purview/dlp-create-policy-block-to-ai-via-edge · https://learn.microsoft.com/en-us/purview/deploymentmodels/depmod-data-leak-shadow-ai-step3

**Microsoft Purview Audit – operații** (deschis parțial; pagina are ~290 000 caractere, am citit doar primele 200 000): confirmate `FileDownloaded`, `FileCopied`, `FileUploaded`, `FileAccessed` (nu se re-loghează 5 min pentru același user/fișier), `MailItemsAccessed` (util pentru cont compromis), `Send`, `New-InboxRule`, `Set-InboxRule`, `FileSensitivityLabelRemoved`/`SensitivityLabelRemoved`. **Nu am confirmat în text** `SharingSet`, `AnonymousLinkCreated`, `FileSyncDownloadedFull` (apar în CONTEXTi.md §7 din memorie) → `[verifică]` înainte de a le folosi ca opțiuni. URL: https://learn.microsoft.com/en-us/purview/audit-log-activities

**MITRE ATT&CK (deschis):** T1048.003 (Exfiltration Over Unencrypted Non-C2 Protocol – HTTP/FTP/DNS), T1052.001 (Exfiltration over USB), T1114.003 (Email Forwarding Rule), T1530 (Data from Cloud Storage), T1567.002 (Exfiltration to Cloud Storage; menționează rclone/MEGA). URL-uri: https://attack.mitre.org/techniques/T1048/003/ · /T1052/001/ · /T1114/003/ · /T1530/ · /T1567/002/

**GDPR art. 33** (deschis, gdpr-info.eu): notificare la autoritate „fără întârziere nejustificată și, când e posibil, în 72 h" de la luarea la cunoștință, exceptând riscul improbabil; întârzierea se motivează; procesatorul informează operatorul fără întârziere; conținut minim (natura, categorii/număr aproximativ, DPO, consecințe, măsuri); notificare în etape permisă; **documentarea tuturor breșelor**. URL: https://gdpr-info.eu/art-33-gdpr/

**DORA – Regulamentul delegat (UE) 2025/301, art. 5** (**sursă secundară deschisă**: Advisera, https://advisera.com/cdr-2025-301/time-limits-for-the-initial-notification-and-for-the-intermediate-and-final-reports/ ; textul EUR-Lex nu s-a redat prin WebFetch → `[verifică]` pe EUR-Lex): notificare inițială „cât mai devreme", cel târziu **4 h de la clasificarea ca incident major** și cel mult **24 h de la luarea la cunoștință**; raport intermediar în **72 h de la notificarea inițială**; raport final în **o lună de la ultimul raport intermediar**; regula „weekend/sărbătoare până la prânz în ziua lucrătoare următoare" **nu** se aplică notificărilor inițiale/intermediare ale instituțiilor de credit. Criteriile de clasificare „major" (RTS separat) **nu** le-am deschis → `[verifică]`. Autoritatea competentă pentru bănci în România (BNR?) `[verifică]`.

**Statistici de context (rapoarte anuale):**
- Verizon DBIR 2025 (deschis, https://www.verizon.com/about/news/2025-data-breach-investigations-report): >22 000 incidente, 12 195 breșe confirmate; implicarea terților 30 % (dublu); credential abuse 22 %, exploatare vulnerabilități 20 %.
- Verizon DBIR 2026 (pagina principală deschisă, https://www.verizon.com/business/resources/reports/dbir/): perioadă 1 nov. 2024–31 oct. 2025; 31 % din breșe încep cu vulnerabilități (le depășește pe cele cu parole furate); sumarul executiv PDF nu s-a putut extrage → alte cifre 2026 (ex. credential abuse 13 %) sunt doar din agregator secundar → `[verifică]`.
- IBM Cost of a Data Breach 2026 (deschis, https://newsroom.ibm.com/2026-07-29-ibm-study-one-in-four-malicious-breaches-are-ai-enabled,-costing-companies-6-million-on-average): medie globală 4,99 M USD; servicii financiare 6,3 M USD; 602 organizații, mar. 2025–feb. 2026; >20 % au raportat breșă care vizează modele/aplicații AI. Cifrele despre shadow AI (+~670 000 USD) sunt din ediția **2025** și doar din surse secundare → `[verifică]`.
- ENISA Threat Landscape 2025 (deschis, https://www.enisa.europa.eu/news/etl-2025-eu-consistently-targeted-by-diverse-yet-convergent-threat-groups): phishing ≈60 % din intruziuni, exploatare vulnerabilități 21,3 %, 4 875 incidente (1 iul. 2024–30 iun. 2025), finanțe locul 4 cu 4,5 %.

---

## 4. Rapoarte publice de scurgere prin AI (cerința „3 rapoarte" – toate DOC)

| # | Caz | Ce s-a scurs / cum | Sursă deschisă | Grad |
|---|---|---|---|---|
| A1 | **Samsung / ChatGPT (mar.–apr. 2023)** → S10 | Ingineri din divizia de semiconductori au lipit cod sursă și conținut de ședință în ChatGPT; după ce firma a descoperit cel puțin trei cazuri, a restricționat folosirea. | AI Incident Database #768 (deschis, secundar): https://incidentdatabase.ai/cite/768/ ; sursa originală (Economist Korea, 30 mar. 2023) **nu** a fost deschisă; Bloomberg 403 | secundar |
| A2 | **OpenAI – incident Redis, 20 mar. 2023** → S11 | Bug în `redis-py` → utilizatori au văzut titluri din istoricul altora; ~1,2 % dintre abonații Plus activi în fereastra de ~9 h au putut avea expuse nume, email, adresă de plată, ultimele 4 cifre, expirare card. | BleepingComputer, care citează post-mortem-ul OpenAI (deschis): https://www.bleepingcomputer.com/news/security/openai-chatgpt-payment-data-leak-caused-by-open-source-bug/ ; postarea OpenAI (https://openai.com/blog/march-20-chatgpt-outage) → **403, neschisă** | secundar citând primar |
| A3 | **Microsoft AI research / Wiz – 38 TB (publicat 18 sep. 2023)** → S12 | Un URL cu token Account SAS (control complet, expirare 2051) în README-ul unui repo GitHub a expus un storage account cu backup-uri ale stațiilor a doi angajați, secrete, chei, >30 000 mesaje Teams. | Wiz (deschis, primar al cercetătorului): https://www.wiz.io/blog/38-terabytes-of-private-data-accidentally-exposed-by-microsoft-ai-researchers | primar (cercetător) |
| A4 | **DeepSeek – baze ClickHouse expuse (ian. 2025)** | Două instanțe ClickHouse fără autentificare (porturi 8123/9000) cu >1 mil. intrări de log: istoric de chat în clar, API keys, detalii backend; Wiz s-a oprit la enumerare; DeepSeek a securizat rapid. | Wiz (deschis): https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak | primar |
| A5 | **EchoLeak, CVE-2025-32711 (iun. 2025)** → S13 | Email extern cu prompt injection ascuns; Copilot amestecă conținutul extern cu date interne; exfiltrare prin URL-uri Teams/SharePoint; CVSS 9,3; fără exploatare observată; patch în iunie 2025. | The Hacker News (deschis, secundar): https://thehackernews.com/2025/06/zero-click-ai-vulnerability-exposes.html | secundar |

Statistică vendor despre comportament (marcat ca *vendor, indiciu*): Cyberhaven AI Adoption & Risk Report 2026 – 39,7 % din interacțiunile cu AI implică date sensibile; în medie un angajat introduce date sensibile în AI o dată la ~3 zile; 32,3 % din utilizarea ChatGPT e prin conturi personale (deschis, post din 11 feb. 2026; **metodologia nu e descrisă pe pagină**): https://cyberhaven.com/blog/4-2-of-workers-have-pasted-company-data-into-chatgpt (URL-ul păstrează slug-ul unui articol vechi, conținutul e din 2026).

---

## 5. Scenarii DOCUMENTATE – financiar / bancar (S01–S09)

### S01 – Insider din marketing copiază date de membri pe USB (Desjardins, Canada) · DOC · Fin
- **Ce s-a întâmplat:** un angajat din marketing a exfiltrat date personale timp de ≥26 luni (mar. 2017–mai 2019). Colegi cu acces legitim copiau regulat date din data warehouse-urile de credit/banking într-un shared drive de marketing, la care mulți aveau acces fără autorizare; angajatul le-a adunat pe stația de lucru și apoi pe chei USB. Raportul amintește că o parte din date ar fi fost vândute unor creditori privați.
- **Detecție:** NU de bancă – poliția din Laval a găsit probe într-o altă investigație și a anunțat Desjardins (para 82 din raport). Desjardins a notificat OPC la 27 mai 2019.
- **Ce a lipsit (documentat):** fără UEBA, SIEM înlocuit abia după incident, analiză pasivă de loguri după incident, DLP doar parțial implementat, filtrare web activă abia în 2019, USB personale neblocate deși politica interzicea, warehouse de credit nesegmentat, retenție/distrugere nedefinite (≈3,9 mil. fișiere inactive).
- **Metadate DLP/SIEM care ar fi contat (inferență):** copy-to-USB cu `removable media serial`, volum de copy de la un user fără rol de analiză, mutarea datelor în directoare partajate, acces la share de către useri non-autorizați, SIT (SIN/CNP echivalent) în fișiere de pe drive-ul partajat.
- **Containment/remediere:** notificare directă și indirectă a persoanelor, site + call-center, monitorizare credit Equifax 5 ani, plan Desjardins Protection (rambursare costuri de recuperare identitate până la 50 000 CAD); OPC a considerat măsurile adecvate; recomandări acceptate (retention schedule, distrugere până în iunie 2022, audituri independente).
- **Impact:** ≈9,7 mil. persoane (numărul include accesați și exfiltrați; Desjardins a contestat cifra → vezi „Dezacorduri"); încălcări PIPEDA la Safeguards, Accountability, Retention; reclamațiile „well-founded and conditionally resolved".
- **Taxonomie:** DLP (canale: USB, cloud/shared drive), IR (notificare, lecții), Governance. Layere: L2 (corelare), L3 (anchetă), Engineering (UEBA/DLP), Gov.
- **Sursă:** OPC Canada, PIPEDA Findings #2020-005 – https://priv.gc.ca/en/opc-actions-and-decisions/investigations/investigations-into-businesses/2020/pipeda-2020-005 (acces 2026-10-23, deschis integral prin WebFetch).

### S02 – Fost angajat descarcă rapoarte după încetarea contractului (Block / Cash App Investing) · DOC · Fin
- **Ce s-a întâmplat:** pe 10 dec. 2021 un fost angajat a descărcat rapoarte Cash App Investing la care avusese acces regulat în fostul rol; accesul a avut loc după ce angajarea se încheiase, fără autorizare. Rapoartele conțineau nume complete și numere de cont de brokeraj; la unii clienți valoarea portofoliului, deținerile sau activitatea unei zile de tranzacționare. Nu conțineau SSN, date de naștere, carduri, adrese, conturi bancare.
- **Detecție:** compania a aflat abia pe 4 apr. 2022 (≈4 luni mai târziu). Sursa nu spune *cum*. `[verifică]`
- **Containment:** investigație cu consultant juridic extern + firmă de forensics; notificare autorități și poliție; revizuirea măsurilor de protecție.
- **Ce a mers prost (din fapte):** accesul la rapoarte a rămas utilizabil după plecare (deprovisioning incomplet) și întârzierea detecției de ~4 luni.
- **Impact/notificare:** ~8,2 mil. clienți actuali și foști notificați; Block a estimat „fără impact material" (la data 8-K-ului). Notificare prin 8-K la SEC (4 apr. 2022) – tipar de **disclosure pentru emitent listat**.
- **Metadate (inferență):** eveniment de download din sistemul de raportare, cont/identitate asociate unui utilizator cu status HR „terminated", sursa IP/dispozitiv, corelare HR connector ↔ activitate (exact scenariul „Data theft by departing users" din IRM, doar că aici contul ar fi trebuit dezactivat).
- **Taxonomie:** DLP (offboarding), Cloud/identity, IR, Gov. Layere: L2, Gov.
- **Sursă:** SEC Form 8-K Block, Inc. – https://www.sec.gov/Archives/edgar/data/1512673/000119312522095215/d343042d8k.htm (acces 2026-10-23, deschis).

### S03 – Agenți de suport mituiți vând date de clienți (Coinbase, 2025) · DOC · Fin (crypto reglementat)
- **Ce s-a întâmplat:** atacatorii au mituit și recrutat agenți de suport/contractori din străinătate care au furnizat date de clienți folosite la social engineering. Date: nume, adrese, telefon, email, ultimele 4 cifre SSN, conturi bancare mascate, imagini de documente de identitate, solduri, istoric tranzacții; nu parole/seed/chei private. Atacatorii au cerut 20 mil. USD (extorsiune, 11 mai 2025); Coinbase a refuzat și a creat un fond de recompensă de 20 mil. USD.
- **Detecție:** monitorizarea de securitate proprie a semnalat personal de suport care accesa date fără nevoie de business, cu luni înainte de dezvăluire (The Register citând 8-K); breșa a început 26 dec. 2024 și a fost „descoperită" 11 mai 2025 (conform dosarului Maine AG). *Notă:* „luni" și „11 mai" sunt formulări din surse diferite → vezi „Dezacorduri".
- **Containment:** concedierea imediată a persoanelor implicate; avertizarea clienților; monitorizare fraudă sporită; investiții în anti-fraud; hub de suport nou în SUA; „making customers whole" pentru cei înșelați; 1 an identity protection (IDX) pentru cei afectați.
- **Impact/notificare:** 69 461 persoane notificate direct; 8-K la SEC (15 mai 2025), notificare Maine AG (20 mai 2025); estimare de cost 180–400 mil. USD citată din dosarul SEC (The Register).
- **Metadate (inferență):** acces la profil client de către agent *fără ticket asociat* (ticketing ↔ CRM access), volum de profile deschise per agent, ore/locații, vizualizări cu *export*/screenshot, scoring UEBA relativ la baseline de echipă.
- **Taxonomie:** DLP/insider, SIEM (UEBA), IR, Gov. Layere: L2/L3, Gov.
- **Surse:** The Register (21 mai 2025) – https://www.theregister.com/2025/05/21/coinbase_confirms_insider_breach_affects/ ; The Register (15 mai 2025) – https://www.theregister.com/2025/05/15/coinbase_extorted_for_20m_support/ (ambele deschise 2026-10-23; sunt secundare, citează 8-K). Blogul Coinbase → 403; 8-K SEC **neschis** `[verifică]`.

### S04 – Configurare greșită descoperită printr-un tip pe GitHub (Capital One, 2019) · DOC · Fin
- **Ce s-a întâmplat:** acces neautorizat pe 22–23 mar. 2019 printr-o vulnerabilitate de configurare (DOJ: „misconfigured web application firewall"). Date: aplicații de card 2005–2019, scoruri, limite, solduri; ~140 000 SSN SUA, ~80 000 conturi bancare, ~1 mil. SIN Canada. Aproximativ 100 mil. persoane în SUA și 6 mil. în Canada (cifrele Capital One).
- **Detecție:** un utilizator GitHub a avertizat banca pe 17 iul. 2019 (cercetător extern); banca a confirmat intruziunea pe 19 iul. și a contactat FBI. Detecția internă a lipsit timp de ~4 luni (inferență din datele atac 22–23 mar. vs tip 17 iul.).
- **Containment:** FBI a identificat autoarea din postarea de pe GitHub și a percheziționat; dispozitive cu o copie a datelor au fost confiscate; banca spune că datele au fost recuperate și nu există dovezi de utilizare frauduloasă.
- **Ce a mers prost (OCC):** procese ineficiente de evaluare a riscului înainte de mutarea unor operațiuni majore în public cloud; deficiențe necorectate la timp; penalitate civilă 80 mil. USD + cease and desist (6 aug. 2020). Banca a primit credit pozitiv pentru notificare/remediere.
- **Metadate (inferență):** în CloudTrail – `GetObject`/list în volum de un rol ce nu le face în mod normal, accesare din IP-uri TOR/VPN; WAF/instance metadata calls. *Detalii SSRF/IMDS nu sunt în sursele deschise* `[verifică]`.
- **Taxonomie:** Cloud (shared responsibility, IAM, logging), IR. Layere: L3, Gov, Eng.
- **Surse:** DOJ WDWA – https://www.justice.gov/usao-wdwa/united-states-v-paige-thompson ; Capital One – https://www.capitalone.com/digital/facts2019/ ; OCC – https://www.occ.gov/news-issuances/news-releases/2020/nr-occ-2020-101.html (toate deschise 2026-10-23).

### S05 – Decomisionare de hardware prin furnizor fără competență (Morgan Stanley Smith Barney, SEC 2022) · DOC · Fin
- **Ce s-a întâmplat:** timp de ~5 ani (din 2015) banca a angajat o firmă de mutări/depozitare, fără experiență în distrugerea datelor, să șteargă și scoată din uz mii de hard-disk-uri și servere cu date de clienți; furnizorul le-a vândut unui terț, iar unele au ajuns la licitație online cu date nesecurizate. Separat, la o reînnoire de hardware, reconcilierea a găsit **42 de servere lipsă** care ar fi putut conține PII necriptat; dispozitivele aveau criptare nativă care nu fusese activată.
- **Detecție:** descoperit în reconcilierea de inventar și prin recuperarea unor dispozitive scoase la licitație (sursa nu detaliază declanșatorul exact `[verifică]`).
- **Impact:** ~15 mil. clienți; penalitate SEC 35 mil. USD (fără admitere/negare); încălcarea Safeguards Rule și Disposal Rule din Regulation S-P.
- **Lecție de proces:** vendor oversight, chain of custody pentru active, criptare activată, certificate de distrugere – nu ține de un alert DLP, dar este exact tipul de întrebare „third-party risk / data lifecycle" cerut de DORA.
- **Taxonomie:** Gov/Risk, IR (impact reglementar), DLP (data at rest). Layer: Gov.
- **Sursă:** SEC press release 2022-168 – https://www.sec.gov/newsroom/press-releases/2022-168 (acces 2026-10-23, deschis). *Notă:* un URL ghicit al ordinului SEC s-a dovedit a fi alt document (Barclays) – **nu l-am folosit**.

### S06 – Notificări de reînnoire a poliței trimise altor persoane (UniCredit România, 2026) · DOC · Fin (RO)
- **Ce s-a întâmplat:** din cauza prelucrării manuale greșite a unui fișier, notificările despre expirarea poliților de asigurare (necesare la credite ipotecare) au fost trimise unor persoane care nu erau destinatarii lor, prin SMS/mesagerie, online banking și email. Conținut: nume, adresă, valoarea imobilului asigurat, data expirării, costul poliței.
- **Detecție:** petiția unei persoane fizice către ANSPDCP (nu monitorizare internă, conform sursei).
- **Sancțiuni:** două amenzi, total ≈ 62 714 lei (≈12 000 EUR) conform articolului: 10 000 EUR pentru art. 32 alin. (1) lit. b), (2), (4) GDPR (măsuri tehnice și organizatorice) și 2 000 EUR pentru art. 33 alin. (1) (notificare în afara celor 72 h, deși banca avea informații concrete despre compromiterea confidențialității). Comunicat publicat 2 iun. 2026; investigația încheiată în mai 2026.
- **Ce a mers prost:** proces manual fără verificare dublă; lipsă de control „four-eyes"/validare înainte de trimitere; notificare tardivă către autoritate.
- **Metadate (inferență):** mismatch între destinatar și titularul dosarului, volum anormal de notificări către același contact, feedback client („nu e al meu") ca primă *detecție*; log-uri job de batch și diff între fișierul sursă și fișierul trimis.
- **Taxonomie:** DLP (email/SMS greșit), IR (GDPR 33). Layere: L2, Gov.
- **Sursă:** Economica – https://www.economica.net/anspdcp-a-amendat-recent-o-banca-importanta-din-romania-pentru-divulgarea-datelor-unor-clienti-la-cat-s-a-ridicat-sanctiunea_946919.html (acces 2026-10-23, deschis). Comunicatul oficial ANSPDCP **neschis** `[verifică]`. Atenție: cele două amenzi din lei (52 270 + 10 454) însumează 62 724, nu 62 714 → discrepanță în sursă (vezi „Dezacorduri").

### S07 – Breșe raportate târziu și incomplet (Bank of Ireland, DPC 2022) · DOC · Fin
- **Ce s-a întâmplat:** DPC a analizat 22 de notificări de breșă (nov. 2018–iun. 2019) legate de corupția/erorile din feed-ul către Central Credit Register (dezvăluiri neautorizate + modificări accidentale). 19 s-au calificat drept breșe de date personale.
- **Constatări:** art. 32(1) – transferul către CCR nu era suficient protejat; art. 33 – în 17 cazuri raportare tardivă sau cu detalii insuficiente; art. 34 – în 14 cazuri persoanele nu au fost informate la timp. Amendă totală 463 000 EUR + reprimandă + ordin de modificare a măsurilor. Decizie din 14 mar. 2022. (Un caz a afectat ~47 000 de persoane deși notificarea inițială spunea 1 – detaliu din presă secundară `[verifică]` pe decizie.)
- **Lecție:** *calitatea* notificării (număr real, categorii, consecințe) contează cât și termenul; GDPR art. 33(4) permite notificare în etape.
- **Taxonomie:** IR (obligații de notificare), Gov. Layer: Gov, L2.
- **Surse:** DPC – https://www.dataprotection.ie/en/dpc-guidance/decisions/inquiry-bank-ireland-group-plc (deschis 2026-10-23); detaliul „47 000" vine din Infosecurity Magazine (din snippet, neschis) `[verifică]`.

### S08 – Cont Snowflake fără MFA, bancă afectată (Santander + campania UNC5537, 2024) · DOC · Fin
- **Ce s-a întâmplat:** actorul UNC5537 s-a autentificat în tenant-uri Snowflake ale clienților cu credențiale valide furate de infostealer (unele din 2020, nerotite); conturile nu aveau MFA și nu exista network policy/allow-list. Mandiant: nu s-a găsit breșă în mediul Snowflake. Secvență: `SHOW TABLES` → `SELECT` → `LIST` → `CREATE TEMPORARY STAGE` → `COPY INTO` (CSV gzip) → `GET`; IP-uri VPN comerciale, MEGA/VPS-uri pentru stocare.
- **Santander:** a identificat incidentul pe 10 mai 2024; baza de date găzduită de terț și folosită de o afiliată (late apr.–early mai 2024); la SUA: 12 786 angajați (nume, SSN, date bancare de salarizare) către Maine AG; la nivel de grup: clienți din Spania, Chile, Uruguay + angajați actuali/foști.
- **Detecție (recomandări Mandiant):** login history și query history pe client application IDs (ex. `DBeaver_DBeaverUltimate`, `SnowSQL`, `Snowsight`, `JDBC`, `PythonConnector`), login din IP-uri VPN/VPS, sesiuni cu `COPY INTO`/`GET` de la conturi care nu le fac în mod normal.
- **Containment:** blocarea accesului la sistemul afectat (Santander), rotația credențialelor, MFA obligatoriu, network policies.
- **Impact/notificare:** ≈165 organizații notificate de Mandiant (cifră din rezumat secundar); notificări Maine AG, reguli GDPR pentru entitățile UE (72 h) – pentru DORA: dependență ICT de terț.
- **Taxonomie:** Cloud/SaaS, SIEM (query history), Identity, IR. Layere: L2/L3, Eng.
- **Surse:** Mandiant/Google Cloud – https://cloud.google.com/blog/topics/threat-intelligence/unc5537-snowflake-data-theft-extortion ; SecurityWeek – https://www.securityweek.com/santander-employee-data-breach-linked-to-snowflake-attack/ (ambele deschise 2026-10-23). Cifra 165 vine din rezumatul din SecurityWeek și snippeturi `[verifică]` pe raportul Mandiant complet.

### S09 – Ransomware la banca partener al fintech-urilor (Evolve Bank & Trust, 2024) · DOC · Fin
- **Ce s-a întâmplat:** un angajat a deschis un link malițios; un afiliat LockBit a accesat baze de date și file shares și a descărcat datele. Intruziune în jur de 9 feb. 2024, descoperită 29 mai 2024 când unele sisteme s-au defectat (≈4 luni de dwell time). LockBit a pretins greșit că a spart Federal Reserve; datele aparțineau Evolve.
- **Impact:** 7 640 112 persoane (Maine AG); parteneri fintech (Affirm, Wise, Bilt) au confirmat clienți afectați; credit monitoring 2 ani.
- **Ce a mers prost (inferență):** detecție prin efect (sisteme defecte), nu prin telemetrie; dwell time lung; dependențe de terț (clienții fintech aveau relația contractuală cu partenerul, nu cu banca).
- **Relevanță DORA/NIS2:** incident major cu impact asupra clienților altor entități financiare → lanț de notificare între entități (inferență).
- **Taxonomie:** IR (ransomware + exfiltrare), Network forensics, Gov. Layere: L3, Gov.
- **Sursă:** BleepingComputer – https://www.bleepingcomputer.com/news/security/evolve-bank-says-data-breach-impacts-76-million-americans/ (acces 2026-10-23, deschis; secundară).

---

## 6. Scenarii DOCUMENTATE – general (S10–S24)

### S10 – Ingineri lipesc cod și minute de ședință în ChatGPT (Samsung, 2023) · DOC · General (AI)
- **Ce s-a întâmplat:** la scurt timp după ce firma a permis ChatGPT (≈11 mar. 2023), au fost raportate cel puțin trei cazuri: cod dintr-o bază de date de semiconductori lipit pentru depanare; cod de echipament defect pentru „optimizare"; conținut de ședință pentru minute. Din rezultate de căutare (neschise) se mai raportează o limită de 1 024 bytes per upload, investigații interne și, ulterior, o restricție pe AI generativ (memo reportat de Bloomberg, mai 2023) `[verifică]`.
- **Detecție:** nu e clară din sursele deschise `[verifică]`; sursa originală (Economist Korea) neschisă.
- **Metadate (inferență):** domenii AI în proxy/CASB, paste/upload către serviciu AI (Endpoint DLP „Paste to supported browsers" / „Upload to restricted cloud service domain"), SIT/fingerprint de cod, cont personal vs corporate.
- **Lecție:** blocare totală vs permitere cu DLP inline; „shadow AI"; politică de utilizare + alternativă internă.
- **Taxonomie:** AI/shadow AI, DLP. Layere: L1/L2.
- **Sursă:** AI Incident Database #768 – https://incidentdatabase.ai/cite/768/ (deschis, secundar, 2026-10-23). TechRadar/Android Authority/Bloomberg → 403 sau pagină neredată.

### S11 – Bug într-o bibliotecă open-source expune titluri de chat și date de plată (OpenAI, 20 mar. 2023) · DOC · General (AI provider)
- **Ce s-a întâmplat:** un bug în `redis-py` (conexiuni corupte la cereri anulate) a întors date din cache ale altui utilizator; fereastra ≈9 h (1–10 a.m. PT, 20 mar. 2023). Titluri de conversații vizibile altor utilizatori; ~1,2 % din abonații Plus activi puteau avea expuse nume, email, adresă de plată, ultimele 4 cifre ale cardului, expirare (nu număr complet).
- **Containment:** serviciul scos offline, patch trimis către mentenanții Redis, verificări redundante pentru potrivirea utilizatorului în cache, contactarea utilizatorilor afectați.
- **Obligații/follow-up reglementar (important pentru „raportare management"):** Garante (Italia) a sancționat OpenAI cu 15 mil. EUR (provv. nr. 755 din 2 nov. 2024, comunicat 20 dec. 2024), între altele pentru **nenotificarea breșei din martie 2023** către Garante; pagina Garante a fost retrasă temporar după hotărârea Tribunalului Roma nr. 4153/2026 (publicată 18 mar. 2026) care a admis opoziția → **statut final incert** (vezi „Dezacorduri").
- **Taxonomie:** AI (risc furnizor), IR (3rd-party, notificare). Layer: Gov, L2.
- **Surse:** BleepingComputer – https://www.bleepingcomputer.com/news/security/openai-chatgpt-payment-data-leak-caused-by-open-source-bug/ ; Garante – https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10085432 (ambele deschise 2026-10-23). Post-mortem OpenAI → 403.

### S12 – Un URL de download cu token SAS expune 38 TB (Microsoft AI research, 2020–2023) · DOC · General (cloud + AI)
- **Ce s-a întâmplat:** un repo GitHub de modele AI conținea un link Account SAS cu *full control* (nu doar citire), valabil până în 2051, pe întreg storage account-ul privat; conținea backup-uri ale stațiilor a doi angajați (parole, chei, >30 000 mesaje Teams de la 359 angajați); cu drept de scriere, un atacator putea modifica modelele (format pickle → execuție de cod: risc de supply chain).
- **Cronologie (Wiz):** 20 iul. 2020 token comis; 6 oct. 2021 expirarea extinsă la 2051; 22 iun. 2023 raportat la MSRC; 24 iun. 2023 invalidat; 7 iul. 2023 înlocuit pe GitHub; 16 aug. 2023 investigație internă încheiată; 18 sep. 2023 publicare.
- **Control-uri care ar fi prins/limitat:** evitarea Account SAS pentru partajare externă; Service SAS cu stored access policy (revocabil); User Delegation SAS (max 7 zile); cont separat pentru date publice; dezactivarea SAS la nivel de cont; Storage Analytics logs; secret scanning pe repo publice; CSPM.
- **Notă interesantă:** Microsoft ar fi marcat link-ul drept fals pozitiv în scanare și și-a modificat detecția pentru tokenuri SAS prea permisive (din rezumat secundar `[verifică]`).
- **Taxonomie:** Cloud (IAM/tokens), AI (date de training), DLP (secret scanning). Layere: Eng, L2.
- **Sursă:** Wiz – https://www.wiz.io/blog/38-terabytes-of-private-data-accidentally-exposed-by-microsoft-ai-researchers (deschis 2026-10-23; sursă primară a cercetătorului).

### S13 – EchoLeak: prompt injection zero-click în Microsoft 365 Copilot (CVE-2025-32711, 2025) · DOC · General (AI)
- **Mecanism:** un email extern cu instrucțiuni ascunse în markdown ajunge în inbox; când utilizatorul întreabă Copilot ceva legitim, motorul RAG aduce emailul atacatorului în același context cu date sensibile (Outlook/SharePoint) → „LLM scope violation"; exfiltrare prin URL-uri Teams/SharePoint; nu a fost nevoie de click; CVSS 9,3; fără dovadă de exploatare reală; fix la Patch Tuesday iunie 2025.
- **Control-uri relevante (documentație Purview):** DLP pentru Copilot poate exclude emailurile externe din grounding (preview, evaluează doar metadata expeditorului), restricționa fișierele cu label, și opri web search pe prompt cu SIT.
- **Taxonomie:** AI (OWASP LLM01 prompt injection, LLM02, LLM06 excessive agency), DLP. Layer: Eng.
- **Surse:** The Hacker News – https://thehackernews.com/2025/06/zero-click-ai-vulnerability-exposes.html (deschis, secundar) ; Purview Copilot DLP – https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about (deschis).

### S14 – Password spray pe un tenant de test și abuz OAuth (Midnight Blizzard / Microsoft, ian. 2024) · DOC · General
- **Lanț (Microsoft):** password spray low-and-slow, prin rețele proxy rezidențiale, pe un cont dintr-un tenant de test non-producție **fără MFA** → găsirea unei aplicații OAuth de test cu privilegii ridicate → crearea de aplicații OAuth malițioase și a unui user care să consimtă → acordarea rolului `full_access_as_app` (Exchange Online) → citirea mailbox-urilor prin EWS.
- **Detecție/hunting:** nu bazat pe IP (proxy-uri rezidențiale); Entra ID Protection (password spray, unfamiliar sign-in), Defender for Cloud Apps (aplicații cu permisiuni *application-only* care accesează multe emailuri, spike EWS), reguli Sentinel pentru `full_access_as_app` cu admin consent, interogare pe `MailItemsAccessed` din `CloudAppEvents`.
- **Containment:** audit al privilegiilor OAuth (service principals, Graph Data Connect), auditarea `ApplicationImpersonation`, RBAC for Applications, MFA pe toate conturile inclusiv test/legacy, reset parole pentru conturile țintite.
- **Taxonomie:** Cloud/identity, SIEM (KQL). Layere: L2/L3, Eng.
- **Sursă:** Microsoft Security Blog (25 ian. 2024) – https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/ (deschis 2026-10-23, primară).

### S15 – Cheie de acces într-un repo GitHub public timp de ~5 ani (Toyota T-Connect, 2022) · DOC · General
- **Ce s-a întâmplat:** un subcontractor a încărcat în dec. 2017 o parte din codul sursă T-Connect într-un repo public GitHub, cu o cheie hardcodată pentru serverul de date; nimeni nu a observat până la 15 sep. 2022. Date expuse: email + număr de client pentru ≈296 000 persoane (fără nume, telefon, card).
- **Containment:** repo făcut privat, cheia schimbată (17 sep.), formular web pentru clienți, avertisment despre phishing; accesul unei terțe părți „nu poate fi exclus complet".
- **Lecții:** secret scanning pre-commit + monitorizare externă de repo publice; tratarea ferestrelor lungi de expunere ca potențial compromis; rotația cheilor.
- **Taxonomie:** Cloud/secrets, DLP. Layer: Eng.
- **Sursă:** GitGuardian blog (vendor, deschis 2026-10-23) – https://blog.gitguardian.com/toyota-accidently-exposed-a-secret-key-publicly-on-github-for-five-years/ ; **notificarea oficială Toyota neschisă** `[verifică]`.

### S16 – „BlueBleed": endpoint Azure Blob nesecurizat descoperit de un terț (Microsoft/SOCRadar, 2022) · DOC · General
- **Ce s-a întâmplat:** SOCRadar a anunțat Microsoft (24 sep. 2022) despre un endpoint greșit configurat cu date de tranzacții de business: nume, emailuri, conținut email, firme, telefoane, posibil fișiere atașate. Microsoft: doar o configurare greșită, nu o vulnerabilitate; endpoint securizat, necesită autentificare; clienții afectați notificați direct; nicio dovadă de compromitere a conturilor.
- **Dispută de scară:** SOCRadar (≈65 000 entități în ≈111 țări; setul total „BlueBleed" ≈150 000 firme) vs Microsoft („greatly exaggerated", duplicate). SOCRadar și-a suspendat temporar tool-ul public de interogare la cererea Microsoft.
- **Taxonomie:** Cloud (storage public, CSPM), IR (comunicare, divulgare responsabilă). Layer: L2, Gov.
- **Sursă:** TechTarget – https://www.techtarget.com/cybersecurity/news/252526344/Microsoft-confirms-data-leak-caused-by-misconfiguration (deschis 2026-10-23, secundar). Pagina MSRC originală nu s-a redat (redirect) `[verifică]`.

### S17 – Document clasificat tipărit și identificat prin audit de printare (Reality Winner, 2017) · DOC · General (guvern)
- **Ce s-a întâmplat:** o copie primită de un ziar (scanare cu cute/îndoituri) sugera că documentul fusese tipărit și scos fizic din zona securizată. NSA a verificat cine tipărise documentul: șase persoane; auditul emailului de pe stațiile lor a arătat că doar Winner contactase redacția. Interviu FBI → admitere.
- **Metadate care au contat:** *print logs* (user, document, timp), email logs de pe desktop, pliuri/watermark/identificatori de imprimantă (în presă) `[verifică]`.
- **Relevanță:** exact tipul de audit pe care îl cere un incident „print" în DLP: Endpoint DLP print + dovezi de imprimantă.
- **Taxonomie:** DLP (print), Windows forensics (print spooler, email), IR. Layere: L2/L3.
- **Sursă:** Nextgov – https://www.nextgov.com/cio-briefing/2017/06/how-us-law-enforcement-caught-reality-winner-nsa-contractor-charged-with-leaking-top-secret-materials/138426 (deschis 2026-10-23, secundar); afidavitul în original **neschis**.

### S18 – Inginer cu acces administrativ fură date și extorchează compania (Ubiquiti / Nickolas Sharp, 2020–2023) · DOC · General
- **Ce s-a întâmplat:** angajat al echipei de securitate (aug. 2018–apr. 2021) a descărcat zeci de GB de date confidențiale în dec. 2020; în ian. 2021 a trimis notă de răscumpărare (50 BTC ≈ 1,9 mil. USD) deși făcea parte din echipa de răspuns; după refuz a publicat o parte din fișiere; FBI l-a identificat, a percheziționat; apoi a dat presei informații false ca „whistleblower" → scădere ≈20 % a acțiunilor (peste 4 mld. USD capitalizare). A pledat vinovat în feb. 2023; 6 ani închisoare, restituire >1,5 mil. USD (mai 2023).
- **Lecții IR:** insiderul poate fi în echipa de IR → *segregation of duties*, acces *just-in-time*, jurnale imutabile; comunicare disciplinată către presă.
- **Taxonomie:** Cloud/privileged insider, IR (comunicare), Gov. Layer: L3, Gov.
- **Sursă:** SecurityWeek – https://www.securityweek.com/former-ubiquiti-employee-who-posed-as-hacker-sentenced-to-prison/ (deschis 2026-10-23, secundar). Comunicatul DOJ SDNY și detaliile (VPN, loguri) → pagina nu s-a redat → `[verifică]`.

### S19 – Inginer plecat: Apple Notes → PDF → cont Google Cloud personal (caz Linwei Ding, 2022–2024) · DOC · General (IP/AI)
- **Ce s-a întâmplat (acuzare DOJ, nu verdict):** din 21 mai 2022, timp de aproape un an, au fost încărcate peste 500 de fișiere cu tehnologie AI/infrastructură într-un cont personal Google Cloud; fișierele sursă au fost copiate în Apple Notes pe laptopul corporativ și convertite în PDF pentru a ascunde activitatea; conflicte de interese nedeclarate; un coleg ar fi scanat periodic ecusonul. După ce Google a detectat transferurile, acuzatul ar fi mințit anchetatorul și ar fi semnat o declarație falsă de ștergere. Arestat 5 mar. 2024.
- **Detecție:** Google a detectat transferuri neautorizate, dar sursa nu spune cum `[verifică]`.
- **Metadate (inferență):** transfer către domenii cloud personale, conversia în PDF/obfuscare, volum, anomalii de acces fizic vs logic (badge vs VPN/login).
- **Notă de status:** BleepingComputer descrie acuzarea din 2024; acuzația ulterioară cu economic espionage și rezultatul procesului **nu** au fost verificate prin sursă deschisă → `[verifică]`.
- **Taxonomie:** DLP (IP, cloud upload), insider, AI. Layere: L2/L3.
- **Sursă:** BleepingComputer – https://www.bleepingcomputer.com/news/google/google-engineer-caught-stealing-ai-tech-secrets-for-chinese-firms/ (deschis 2026-10-23, secundar). DOJ **neschis**.

### S20 – Tab ascuns într-o foaie Excel publicată ca răspuns FOI (PSNI, 2023) · DOC · General (sector public)
- **Ce s-a întâmplat:** un spreadsheet publicat la o cerere FOI avea un tab ascuns cu nume de familie, inițiale, grad, rol pentru toți cei 9 483 de ofițeri/personal. ICO: proceduri interne și sign-off inadecvate; amendă 750 000 GBP (fără reducerea de sector public ar fi fost ≈5,6 mil. GBP); preliminary enforcement notice. Efecte grave pentru persoane (mutări, schimbarea rutinei).
- **Lecție DLP:** metadate/conținut ascuns în fișiere publicate; sanitizare automată, *document inspection* înainte de publicare, 4-eyes; relevant pentru bănci la răspunsuri către autorități/clienți.
- **Taxonomie:** DLP (web publish/email, metadate), Gov. Layere: L1/L2, Gov.
- **Sursă:** ICO – https://cy.ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/05/psni-facing-a-750k-fine-following-spreadsheet-error-that-exposed-the-personal-information-of-its-entire-workforce/ (deschis 2026-10-23, primară). Suma finală (oct. 2024) vine din presă `[verifică]` pe decizia ICO.

### S21 – Rclone → MEGA în ≈1 h 11 min după exploit Confluence (The DFIR Report, 2025) · DOC · General
- **Cronologie:** acces inițial prin RCE Confluence (CVE-2023-22527); Meterpreter la ~10 min; Mimikatz la ~20 min; RDP lateral <1 h; exfiltrare cu Rclone către MEGA începe la ~1 h 11 min; ransomware la ~2 h (TTR ≈2 h 06 min). Config Rclone criptat, dar recuperat din cauza reutilizării parolei. După exfiltrare: ștergere loguri cu `wevtutil`, ștergerea uneltelor (T1070.001).
- **Ce a detectat/ar fi detectat:** Zeek (conexiuni către MEGA), Suricata, capturi cu HTTP POST ale Rclone, loguri de procese, reguli Sigma pentru Rclone (cloud storage/SSH).
- **Taxonomie:** Network forensics, Windows forensics, IR; MITRE T1567.002, T1070.001. Layer: L3.
- **Sursă:** The DFIR Report – https://thedfirreport.com/2025/02/24/confluence-exploit-leads-to-lockbit-ransomware/ (deschis 2026-10-23, primară); MITRE T1567.002 – https://attack.mitre.org/techniques/T1567/002/.

### S22 – Token-uri OAuth ale Salesloft Drift → export masiv din Salesforce (UNC6395, aug. 2025) · DOC · General
- **Ce s-a întâmplat:** în 8–18 aug. 2025 actorul a folosit token-uri OAuth compromise ale aplicației Drift ca să exporte volume mari din instanțe Salesforce (Accounts, Opportunities, Users, Cases), apoi a căutat în date secrete (chei AWS `AKIA`, parole, token-uri Snowflake). A șters query jobs (anti-forensics), dar log-urile au rămas. Pe 9 aug. un set de token-uri Drift Email a fost folosit la citirea emailurilor din câteva conturi Workspace.
- **Containment:** Salesloft și Salesforce au revocat toate token-urile Drift (20 aug.); Google recomandă tratarea oricărui token conectat la Drift ca potențial compromis, revizuirea logurilor (Salesforce Event Monitoring, `UniqueQuery`), scanarea secretelor (TruffleHog), rotație, scope minim, IP restrictions.
- **Scală:** GTIG nu publică în pagina citită numărul organizațiilor; cifra „>700" apare doar în rezumate secundare `[verifică]`.
- **Taxonomie:** Cloud/SaaS (OAuth), SIEM, IR (third-party). MITRE T1530. Layere: L2/L3.
- **Sursă:** Google Threat Intelligence Group – https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift (deschis 2026-10-23, primară).

### S23 – Doi foști angajați dau ~100 GB unui ziar (Tesla, 2023) · DOC · General
- **Ce s-a întâmplat:** Handelsblatt a contactat Tesla (10 mai 2023) cu ~100 GB de date de la doi foști angajați; Tesla a notificat 75 735 persoane (Maine AG, 18 aug. 2023) – nume, contacte, informații despre angajați, SSN (câmpurile variază între surse). Tesla a obținut ordine judecătorești, au fost confiscate dispozitive, a lucrat cu forensics externi; 12 luni de credit monitoring (Experian).
- **Lecție:** *tipping off* inversat – compania a aflat de la **destinatar**, nu din telemetrie; cât acces larg „pentru productivitate" a permis scurgerea.
- **Taxonomie:** DLP/insider, IR, Gov. Layer: L2, Gov.
- **Sursă:** Infosecurity Magazine – https://www.infosecurity-magazine.com/news/tesla-insiders-responsible-for/ (deschis 2026-10-23, secundar).

### S24 – USB criptat pierdut cu datele a ≈460 000 de locuitori (Amagasaki, Japonia, 2022) · DOC · General (public)
- **Ce s-a întâmplat:** un contractor copiase datele pe un USB ca să le transfere unui call-center din Osaka (program de ajutor pandemic) și a pierdut geanta într-o seară după ce a fost la băut. Date: nume, sex, adrese, date de naștere; pentru unii și date fiscale/bancare. Orașul: USB criptat și protejat cu parolă, fără semne de acces; poliția investighează.
- **Lecții:** necesitatea ca datele să plece pe USB; alternative (transfer securizat), device control, criptare enforced, minimizarea datelor la terț.
- **Taxonomie:** DLP (USB), Gov (third-party). MITRE T1052.001 (analog). Layere: L1, Gov.
- **Sursă:** CBS News – https://www.cbsnews.com/news/amagasaki-japan-lost-usb-data-460000-residents/ (deschis 2026-10-23, secundar). „Drunk" apare doar în surse secundare (INCIBE) `[verifică]`.

---

## 7. Scenarii COMPOZITE – financiar / bancar (C01–C15)

> **Toate sunt ilustrative** – nume, cifre, ore, domenii și valori de log sunt inventate pentru antrenament. Fiecare indică ancora documentată. Pentru a evita confuzia cu cazuri reale nu menționează bănci reale.

### C01 – XLSX cu 2 300 IBAN-uri către un Gmail personal · COMP · Fin · Email
- **Inspirat de:** exemplul din CONTEXTi.md §5 + scenarii de email greșit (S06, S20). Ancoră de documentație: Purview DLP (SIT „IBAN").
- **Situație:** alertă DLP, user din Finance, XLSX, 2 300 IBAN, destinatar `@gmail.com`, ora 23:40, livrat (nu carantinat), clasificare „Confidential – Customer".
- **Detecție:** regulă DLP pe Exchange cu SIT IBAN și prag de instanțe.
- **Metadate-cheie:** destinatar și domeniu, label vs fără label, număr instanțe SIT, istoric al userului (aceeași acțiune în ultimele 30 zile?), ticket de aprobare, livrat/carantinat, dimensiune atașament, device (corporate/BYOD).
- **Triaj corect:** validare din datele logate înainte de contact cu userul (tipping off), apoi decizie proporțională; escaladare dacă istoric/ticket lipsesc.
- **Containment:** recall/purge dacă posibil, blocare temporară a regulii de forward, cerere de ștergere către destinatar (dacă e erorare), `legal hold` dacă insider.
- **Obligații:** evaluare risc GDPR art. 33 (72 h de la luarea la cunoștință) – date financiare ale clienților → probabil notificare; DORA doar dacă se atinge pragul de „incident major" `[verifică criteriile]`.
- **Taxonomie:** DLP (email), L1/L2.

### C02 – Relationship manager care a depus demisia: SharePoint + Dropbox · COMP · Fin · mass download + cloud sync
- **Inspirat de:** S02 (Block), S01, șablonul IRM „Data theft by departing users".
- **Situație:** HR connector marchează `resignation date` acum 6 zile; în 48 h: 4 800 de `FileDownloaded` din SharePoint-ul „Private Banking", 12 `Copy to cloud` către domeniul `dropbox.com`, 3 `Print` din Endpoint DLP.
- **Metadate-cheie:** timing față de data demisiei, volum vs baseline (percentil), sensitivity labels ale fișierelor, domeniu cloud personal, device (managed/unmanaged), `sha256` pentru corelare cu ce a apărut în destinație.
- **Containment:** coordonare cu HR/Legal *înainte* de acțiuni vizibile; restrângerea accesului în loc de blocare totală; colectare forensică a laptopului, chain of custody; notificare juridică pentru clauza de non-solicit.
- **Ce poate merge prost:** ignorarea alertelor IRM pentru că alertele DLP din Endpoint nu declanșează indicatorul „DLP alert" al IRM (limită documentată); confruntare directă înainte de colectarea dovezilor.
- **Taxonomie:** DLP, Cloud, IR. L2.

### C03 – Analist de compliance lipește date de client în ChatGPT (cont personal) · COMP · Fin · AI paste
- **Inspirat de:** S10 (Samsung); Purview „Edge for Business către AI neadministrat" (SIT IBAN/SWIFT).
- **Situație:** Edge DLP în *simulation mode* înregistrează 14 evenimente „Text sent to cloud or AI apps" de la același user: nume + IBAN + extras de tranzacții; politica nu e încă pe Block.
- **Metadate-cheie:** tip de cont AI (personal/corporate) – vendorul Cyberhaven indică ~1/3 din utilizarea ChatGPT prin conturi personale; SIT-uri; text vs fișier; browser (Chrome fără extensie Purview = acoperire parțială).
- **Decizie de judecată:** blocare totală vs permitere cu DLP inline; ce spui managementului; cum cuantifici impactul GDPR (date transmise unui model extern, bază legală, transfer în afara UE).
- **Taxonomie:** AI, DLP. L1/L2, Gov.

### C04 – Screenshot cu ecranul clientului trimis pe WhatsApp · COMP · Fin · screenshot/BYOD
- **Inspirat de:** S03 (agenți de suport), documentația Endpoint DLP (Windows Recall snapshots, limitele pe date nesalvate).
- **Situație:** un agent de call center fotografiază cu telefonul personal ecranul CRM; DLP pe endpoint nu vede nimic (acțiune în afara endpoint-ului). Detectarea vine din sesizarea unui client / dintr-o fotografie circulată.
- **Ce acoperă DLP, ce nu:** DLP endpoint nu acoperă fotografia cu telefonul; compensatoare: *clean desk*, watermark dinamic cu user ID pe ecran, restricții telefoane în zonele de lucru, UEBA pe volum de acces la profile fără ticket.
- **Taxonomie:** DLP (limitele canalelor), Gov. L1/L2.

### C05 – Mailbox de trezorerie compromis + regulă de forward · COMP · Fin · cont compromis
- **Inspirat de:** S14 (Midnight Blizzard), Octo Tempest (inbox rules/forwarding). MITRE T1114.003.
- **Situație:** sign-in dintr-o țară neobișnuită, fără MFA satisfăcut → `New-InboxRule` cu forward către un domeniu extern → `MailItemsAccessed` în volum → tranzacții de plată modificate (BEC).
- **Metadate-cheie:** Entra sign-in logs (risk level, IP, user agent), `New-InboxRule`/`Set-InboxRule`, `MailItemsAccessed`, `Send`, mesaje cu IBAN schimbat.
- **Containment:** revocarea sesiunilor și a token-urilor, resetarea credențialelor, ștergerea regulilor, blocarea forward-ului extern, verificarea OAuth consents; rechemare plăți către bancă corespondentă.
- **Obligații:** GDPR art. 33; dacă impact pe servicii critice → evaluare DORA „major" și terenul 4h/24h `[verifică]`.
- **Taxonomie:** Cloud, SIEM (KQL), IR. L2/L3.

### C06 – Cheie API core-banking într-un repo GitHub public · COMP · Fin · GitHub
- **Inspirat de:** S15 (Toyota), S12 (token SAS).
- **Situație:** un contractor a încărcat un repo cu `config.yml` ce conține o cheie API; GitHub secret scanning alertează după 12 minute, dar cheia a fost deja folosită de 3 IP-uri străine.
- **Metadate-cheie:** alerta secret scanning, log-urile API gateway (IP, user-agent, endpoints), istoricul commit-ului (git history), dacă repo-ul era fork public.
- **Containment:** revocare/rotație imediată înainte de curățarea istoricului; analiză retroactivă a utilizării cheii pe fereastra de expunere; notificare terț.
- **Taxonomie:** Cloud/secrets, DLP, IR. Eng/L2.

### C07 – Blob Azure public cu scanări KYC într-un mediu „de test" · COMP · Fin · storage public
- **Inspirat de:** S04 (Capital One), S16 (BlueBleed). MITRE T1530.
- **Situație:** un dev creează un container de test cu setarea „anonymous read"; un cercetător extern raportează; 14 000 de imagini de buletine/pașapoarte.
- **Metadate-cheie:** Storage Analytics logs (cereri anonime, IP-uri), Azure Activity (schimbarea nivelului de acces), data creării, existența unor accese externe pe fereastra de expunere.
- **Containment:** setare privat, SAS rotit, preservarea logurilor (retenție), analiza accesărilor; evaluare notificare: date de identitate → risc ridicat pentru persoane (art. 34 GDPR).
- **Taxonomie:** Cloud, IR. L2/L3.

### C08 – Furnizor KYC/OCR trimite fișierul greșit și anunță târziu · COMP · Fin · terț
- **Inspirat de:** S05 (Morgan Stanley), S09 (Evolve), S20.
- **Situație:** un furnizor ICT critic anunță banca la 52 h după descoperire (contractul zice 72 h); banca află că loturi cu date de clienți au ajuns la un alt client al furnizorului.
- **Subiecte:** contract și notificare de la furnizor (processor → controller „fără întârziere nejustificată", art. 33(2)), cum curge clasificarea DORA în bancă, registrul de informații privind furnizorii ICT `[verifică]`, drept de audit, ieșire din contract.
- **Taxonomie:** IR, Gov, DORA. L3/Gov.

### C09 – Slack Connect / Teams guest cu lista de clienți · COMP · Fin · Teams/Slack extern
- **Inspirat de:** Octo Tempest (acces la SaaS prin conectori), S22 (OAuth). Ancoră de documentație: Purview Teams DLP (alertele Teams nu sunt evaluate de indicatorul DLP din IRM).
- **Situație:** un manager adaugă un guest de la o agenție terță într-un canal cu extrase din CRM; un fișier cu 800 de clienți e încărcat de guest.
- **Metadate-cheie:** `Guest` adăugat, upload fișier, link extern, SIT-uri, tipul canalului (shared/private).
- **Decizii:** guest access vs politică, expirarea accesului, review periodic, label obligatoriu.
- **Taxonomie:** DLP (Teams), Cloud. L2.

### C10 – Print listă clienți HNW înainte de demisie · COMP · Fin · print
- **Inspirat de:** S17 (Winner), Endpoint DLP „Print".
- **Situație:** 120 de pagini printate în afara orelor, la imprimanta etajului; user în ultimele 2 săptămâni; Endpoint DLP înregistrează `Print` (fără conținut) dacă politica e doar pe audit.
- **Metadate-cheie:** `Print` cu nume fișier, printer, număr pagini; log-uri print server, camere/badge (cu aprobare HR/Legal).
- **Taxonomie:** DLP (print), Windows forensics (print spooler). L2.

### C11 – Copilot rezumă documente HR/credit din cauza oversharing · COMP · Fin · AI agent
- **Inspirat de:** S13 (EchoLeak), Purview DLP pentru Copilot (labels + SIT).
- **Situație:** un junior cere „summarize this week's decisions about layoffs"; Copilot citează un document HR dintr-un site SharePoint cu permisiuni prea largi. Nu e un atac, ci *oversharing*.
- **Metadate-cheie:** `Prompt` text/SIT, fișierele citate în răspuns, permisiuni efective pe site, label-urile lipsă.
- **Remedieri:** sensitivity labels + politică DLP care exclude fișierele cu label din procesare, curățarea moștenirii de permisiuni, Data Security Posture Management for AI.
- **Taxonomie:** AI, DLP, Governance. Eng/L2.

### C12 – DBA exportă tabela de clienți la 02:00 cu unealta aprobată · COMP · Fin · admin privilegiat
- **Inspirat de:** S01 (Desjardins – utilizator „de încredere"), S18 (Sharp), S08 (Snowflake – `COPY INTO`/`GET`).
- **Situație:** un DBA rulează un export masiv către un share de rețea; apoi un transfer prin tool-ul aprobat de backup către un cont de cloud al terțului; alertă UEBA.
- **Metadate-cheie:** audit pe baza de date (query text, rows returned), PAM session recording, ticket de schimbare, ore anormale.
- **Decizii:** PAM, *four-eyes*, query allow-list, redactare/dynamic masking.
- **Taxonomie:** SIEM, Cloud, DLP. L2/L3.

### C13 – Stație cu volum anormal de DNS TXT (DNS tunneling) · COMP · Fin · DNS
- **Inspirat de:** MITRE T1048.003 (HTTP/FTP/DNS); S21 pentru telemetria de rețea.
- **Situație:** o stație face 40 000 de query-uri DNS/oră către un subdomeniu cu etichete lungi, entropie mare; JA3/SNI nu arată trafic corespunzător; volum de ieșire anormal.
- **Metadate-cheie:** lungimea QNAME, entropia, tipul TXT/NULL, rata/oră, domeniu nou observat, resolverul intern.
- **Containment:** sinkhole domeniu, izolare host, captură PCAP/NetFlow, memorie, urmărire proces responsabil.
- **Taxonomie:** Network forensics, SIEM. L3.

### C14 – Dropbox Desktop sincronizat pe laptopul corporativ · COMP · Fin · cloud sync
- **Inspirat de:** S19 (cloud personal), Endpoint DLP (service domains, unallowed apps).
- **Situație:** utilizatorul instalează clientul Dropbox, redirecționează „Documents" în folderul sincronizat; Endpoint DLP vede `File created`/`Upload to restricted domain` cu `application = Dropbox.exe`.
- **Aspect-cheie:** diferența între *sync client* și *browser upload*; reguli „restricted apps", auto-quarantine; excepții de business.
- **Taxonomie:** DLP, Cloud. L1/L2.

### C15 – Fals pozitiv: lot trimestrial către auditorul extern · COMP · Fin · email / DLP tuning
- **Inspirat de:** exemplul „Finance lucrează cu IBAN-uri" (CONTEXTi.md §5, distractorul „închizi ca fals pozitiv").
- **Situație:** a patra zi a trimestrului, 1 800 de IBAN-uri către `@auditor-extern.example` cu atașamente criptate; DLP alertă *High*.
- **Ce se verifică:** domeniu pe lista de parteneri aprobați, existența contractului/NDA, canal aprobat (SFTP vs email), dimensionarea alertei, excepție temporară cu *expiry* în loc de dezactivare, tuning (EDM, allowlist de destinatari).
- **Taxonomie:** DLP tuning, Engineering. L1/Eng.

---

## 8. Mapare scenarii → domenii din secțiunea 4 (acoperire)

| Domeniu (pondere) | Scenarii principale |
|---|---|
| DLP / Data Leakage (20 %) | S01, S02, S05, S06, S17, S19, S20, S23, S24, C01–C04, C09, C10, C14, C15 |
| SIEM (12 %) | S03, S08, S14, S22, C05, C12, C13 |
| SOAR (8 %) | *niciun scenariu nu e centrat pe SOAR; folosiți C01/C05/C15 ca bază pentru întrebări de playbook (enrichment, human-in-the-loop)* |
| Incident Response (18 %) | S01–S09, S11, S18, S21, S22, C01, C05, C07, C08 |
| Network forensics (10 %) | S21, C13 |
| Windows forensics (10 %) | S17, S21, C10 |
| Linux forensics (7 %) | **lacună – nu am scenarii Linux documentate**; C13 (cu host Linux) sau un scenariu nou |
| Cloud security (8 %) | S04, S08, S12, S14, S15, S16, S18, S22, C02, C05–C07, C09, C12 |
| AI (4 %) | S10–S13, C03, C11 |
| Fundamente (3 %) | oricare |

**Lacune de acoperire:** SOAR și Linux forensics (nu sunt scenarii de „leak" în sensul sursei); pentru faza A4 sugerez scenarii derivate din C01/C05.

## 9. Dezacorduri

1. **Desjardins – numărul persoanelor:** OPC: ≈9,7 mil. (inclusiv cei „accesați"); Desjardins susține 4,2 mil. membri bancari activi potențial dezvăluiți și că 9,7 mil. = fișiere active+inactive la care avea acces fostul angajat (din rezumatul de presă din căutare; raportul OPC a fost deschis și confirmă 9,7 mil. cu definiția „accesați/exfiltrați" + ≈3,9 mil. fișiere inactive). Pentru întrebări, folosiți formularea din raportul OPC.
2. **Desjardins – detecția:** OPC (para 82): poliția din Laval a găsit probe într-o altă anchetă; presa spune „iunie 2019 de poliție" – și data notificării OPC (27 mai 2019) e anterioară → ordinea exactă a evenimentelor `[verifică]`.
3. **Wiz/Microsoft 38 TB – data invalidării token-ului:** pagina Wiz (deschisă) spune 24 iun. 2023; un rezumat secundar spune 23 iun. Folosiți Wiz.
4. **Wiz vs. Microsoft – impact:** Microsoft ar fi spus că nu au fost expuse date de clienți (din rezumate secundare, nu din pagina Microsoft); Wiz listează secrete, chei, mesaje Teams interne. Nu e contradicție de fapt, ci de perimetru (client vs intern).
5. **Samsung – natura și durata restricției:** surse diferite spun „temporar" (conform memo-ului reportat) vs „indefinit"; unele spun „accidental", altele (via Android Authority, neredat) că executivii ar fi aflat de transmiteri intenționate. Originalul (Economist Korea) neschis → tratat ca DOC cu grad secundar.
6. **Capital One – numere:** Capital One: ≈100 mil. SUA + ≈6 mil. Canada; alte surse: 98 mil. consumatori SUA / 106 mil. conturi; DOJ spune „misconfigured WAF", OCC vorbește despre evaluare de risc la migrarea în cloud. SSRF/IMDS **nu** apare în sursele deschise.
7. **BlueBleed – scală:** SOCRadar: ≈65 000 entități (≈111 țări în TechTarget; 123 în alt rezumat); Microsoft: „greatly exaggerated". Nu există verificare independentă.
8. **Coinbase – cronologie și cost:** breșa „începută" 26 dec. 2024 și „descoperită" 11 mai 2025 (dosarul Maine) vs „monitorizarea a semnalat accesul cu luni înainte" (The Register citând 8-K) – posibil două momente diferite (primul semnal vs confirmarea). Costul 180–400 mil. USD vine din The Register citând dosarul SEC; dosarul SEC neschis.
9. **UniCredit RO – aritmetică în sursă:** sumele în lei din articol (52 270 + 10 454 = 62 724) diferă de totalul declarat (62 714). Probabil tipografic; verificați pe comunicatul ANSPDCP.
10. **Garante vs. OpenAI:** amendă 15 mil. EUR (dec. 2024) dar Tribunalul Roma nr. 4153/2026 a admis opoziția; Garante a retras temporar pagina. Pentru întrebări folosiți „a fost sancționat; sancțiunea a fost contestată cu succes în instanță" doar după verificarea hotărârii `[verifică]`.
11. **DORA – puncte de referință ale termenelor:** surse (BDO/FMA în căutare) diferă între „72 h de la clasificare" și „72 h de la notificarea inițială"; Advisera (deschis) spune de la notificarea inițială; raportul final „o lună de la ultimul raport intermediar" vs „30 de zile de la clasificare" în unele rezumate → **de verificat în EUR-Lex** înainte de a scrie întrebări. **[REZOLVAT 2026-10-23, vezi `06-soar-linux-regulatory.md`]**: confirmat din sursă primară (Reg. delegat 2025/301 art. 5) că raportul intermediar curge de la notificarea inițială, iar cel final de la ultimul raport intermediar (≤ 1 lună); Advisera avea dreptate în fond, iar „30 de zile de la clasificare" este greșit.
12. **Verizon DBIR 2025 vs 2026:** 2025: credential abuse 22 % > vulnerabilități 20 %; 2026: vulnerabilități 31 % depășesc credențialele (cifra 13 % pentru credențiale e doar din agregator). Nu sunt contradictorii, sunt ani diferiți; ENISA (phishing ≈60 %) și Verizon (vulnerabilități/credențiale) folosesc metodologii și populații diferite – nu comparați direct.
13. **IBM CODB:** 2025 – sector financiar 5,56 mil. USD (din Kiteworks, secundar), shadow AI +≈670 000 USD (agregatori); 2026 – servicii financiare 6,3 mil. USD (IBM, deschis). Ani diferiți; nu amestecați în aceeași întrebare.
14. **Cyberhaven:** statistici 2023 variază între rapoarte (2,3 %, 4,9 %, 4,7 %, 6,5 % – din snippeturi, neverificate); URL-ul citat conține acum raportul 2026 (39,7 %, 32,3 %). Am folosit doar pagina deschisă; metodologia lipsește (vendor, indiciu).
15. **Tesla:** câmpurile de date divulgate diferă între presă (cu/fără SSN); Infosecurity Magazine menționează SSN.
16. **Amagasaki:** „beat" (INCIBE) vs „după băutură" (CBS/AFP).
17. **Ding (Google):** DOJ/presă vorbesc despre trade secret theft (2024) și ulterior economic espionage – statusul procesului nu e verificat.
18. **Ubiquiti:** DOJ nu numește compania (conform SecurityWeek); spelling „Nickolas/Nicholas".

## 10. Limitări

- **Reddit/practicieni:** inaccesibil (blocat pentru WebSearch și WebFetch). Zero afirmații din acest tip de sursă.
- **Mai multe URL-uri primare au returnat 403 sau pagini neredate**: OpenAI post-mortem, Coinbase blog, Bloomberg (Samsung), TechRadar, Android Authority, justice.gov (SDNY Ubiquiti, DOJ Ding), EUR-Lex (DORA), Verizon DBIR 2026 executive summary (PDF grafic). Unde nu am alternativă, faptul e marcat secundar sau `[verifică]`.
- **WebFetch rezumă prin model:** conținutul citit este un rezumat produs de un model mic; citatele exacte nu sunt garantate, de aceea textul de aici e parafrazat și cifrele cheie sunt cele care apar consistent în ≥2 surse sau în sursa primară.
- **Pagini lungi:** pagina Purview Audit a fost citită parțial (200 000 din 289 544 caractere); operațiile `SharingSet`, `AnonymousLinkCreated` etc. rămân de verificat.
- **Metadatele DLP/SIEM** de la scenariile DOC sunt în mare parte *inferență* (incidentele publice rareori descriu telemetria); sunt marcate ca atare.
- **Scenariile COMP** sunt ilustrative; **nu** se citează ca fapte în explicațiile întrebărilor.
- **Obligații de notificare:** GDPR art. 33 e verificat (sursă deschisă); DORA doar prin sursă secundară; criteriile „incident major" (RTS de clasificare) și autoritatea competentă pentru bănci în România nu au fost deschise.
- Nu am abordat R5 (15 scenarii cloud + 10 AI + politici vendor) – acela este un livrabil separat; secțiunea 4 acoperă doar cerința de 3 rapoarte AI din R2.
