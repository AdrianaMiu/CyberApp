# R1 — Job descriptions: cererea de piață pentru DLP / SOC / IR / DFIR / Detection Engineering (2026)

> Agent: A1 (research piață) · Data accesării tuturor surselor: **2026-10-23** · Limba: română (termeni tehnici în engleză)

## 0. Rezumat (citește întâi)

- **JD-uri deschise efectiv și numărate: 69** (țintă ≥ 40: îndeplinită). Fiecare a fost deschisă efectiv (pagină de carieră / API-ul ATS al angajatorului sau copie de agregator) la 2026-10-23 și nu afișa notă de închidere. Multe alte pagini au fost deschise (sau încercate) dar **nu** au fost numărate (închise, blocate, irelevante) — lista și motivele sunt în §2.2.
- **Sectoare** (coloana `sector` cerută de coordonator): finance = 14, tech-vendor = 27, mssp-consulting = 19, other = 9. Din 69: **21 în România**, 17 în alte țări UE, 9 în UK, 22 în afara UE/UK (SUA, Canada, Israel, India, Australia, Mexic, Brazilia).
- **JD-ul care corespunde descrierii din CONTEXTi (DLP/DLM în ISTO) a fost găsit deschis**: *Data Leakage Monitoring Analyst (f/m/x)*, Deutsche Bank, Bucharest Technology Centre, echipa ISTO – DLM, publicat 2026-09-29 (id `db01`). Rezumatul lui e în §3.5.
- **Top 10 skill-uri tehnice/de proces** (pe 69 JD-uri): Incident response (process / lifecycle) 54/69 (78%); Alert triage / investigation 54/69 (78%); SIEM (generic) 45/69 (65%); Any certification named/preferred 37/69 (54%); Cloud (AWS / Azure / GCP / M365) 36/69 (52%); Alert tuning / false-positive reduction 31/69 (45%); Threat hunting 31/69 (45%); Playbooks / runbooks / SOPs 31/69 (45%); Detection content / rules / use cases (Sigma, YARA, detection-as-code) 30/69 (43%); Scripting / coding (Python, PowerShell, Bash) 28/69 (41%). Cu generice incluse, top-ul mai conține reporting (70 %) și teamwork (67 %).
- Must-have (> 50 %), vezi §3.1: doar 7 depășesc 50 % (`must-have`), din care 2 sunt generice (reporting, teamwork) iar certificările sunt aproape mereu *preferate*, nu cerute.
- **Slăbiciuni de eșantion (citește înainte de a folosi cifrele)**: (a) **DLP este subreprezentat** (6 JD-uri din 69 menționează DLP; doar 5 sunt roluri DLP/insider-risk) — în Oct 2026 am găsit deschise doar 1 DLM analyst în România (Deutsche Bank) + 1 specialist DLP (Levi9, Iași) + 1 în Cehia (PwC); rolurile DLP din Polonia sunt la agenții (Antal, Mindbox, ITDS) și au dat 403 la deschidere → nenumărate; (b) **nu am găsit niciun JD „Digital Forensics analyst” pur, deschis, în RO/UE** (cele găsite la BNY, JPMorgan, Barclays au fost închise sau inaccesibile); forensics apare doar ca parte din roluri IR; (c) **sectorul `finance` are doar 14 JD-uri**: 6 în România (Deutsche Bank ×4, ING, SCOR), 3 în UE (Stripe Dublin, Bitpanda Viena ×2, fintech/crypto) și 5 în afara UE (Mastercard ×4, Santander Brazilia); nu am găsit deschise roluri SOC/DLP/IR la alte bănci din UE (BCR, BRD, BT, UniCredit, ABN AMRO, ING NL etc.); procentele pe `finance` au interval de încredere larg; (d) Adobe și Fortinet nu aveau, la 2026-10-23, niciun rol SOC/IR/DLP deschis în UE (Adobe: 2 roluri relevante, India/SUA; Fortinet: 4, Canada/SUA/Israel); (e) LinkedIn, Indeed, Glassdoor, eJobs, BestJobs **nu au putut fi deschise** (login / 403 / JS) și **nu sunt numărate**.
- Ce a diferit între sectoare (detalii §3.3): `finance` cere mai des reglementare/compliance, Sentinel/Splunk, comunicare cu stakeholderi; `tech-vendor` cere mai des scripting (Python), threat intel, AI, și aproape deloc SIEM-ul „de produs” (folosesc propriile platforme); `mssp-consulting` cere SIEM + certificări (SC-200, GIAC) + limbi străine; `other` (corporate SOC din RO) cere runbook-uri, escalare, RCA, NIST/ISO.

## 1. Metodă (pe scurt)

1. **Descoperire**: WebSearch (rezultate folosite doar ca indicii de URL, nu ca dovadă) + API-urile publice ale sistemelor ATS ale angajatorilor (Workday `cxs`, Greenhouse `boards-api`, Oracle HCM REST pentru Fortinet) + pagina de listare a Orange Cyberdefense + agregatorul românesc hipo.ro (singurul agregator RO care s-a putut deschide cu `curl`).
2. **Deschidere efectivă**: fiecare JD numărat a fost descărcat integral (text complet) sau, pentru 4 JD-uri (`nt01`, `nt02`, `bv01`, `isr01`), citit prin WebFetch care returnează un rezumat parafrazat de tool — marcate în tabel; textul integral rămâne **[verifică]**.
3. **Filtru de relevanță**: păstrate doar rolurile din familiile cerute (DLP/DLM, SOC L1/L2/L3, IR/DFIR, threat hunting/intel, detection engineering). Excluse după citirea conținutului: GRC/third-party risk, IAM audit, vulnerability management, admin/asistență, product management, vânzări (§2.2).
4. **Extragere skill-uri**: ~58 de skill-uri definite cu expresii regulate aplicate pe textul secțiunii „responsabilități + cerințe” (am tăiat heuristic descrierea companiei și beneficiile). Am verificat manual prin eșantionare contextele a ~30 de skill-uri; au rămas posibile fals-pozitive pentru `cloud`, `shift`, `exp`, `report`, `team` (marcate). Cifrele sunt **estimări**, nu numărători manuale complete. JD-urile non-engleze (suedeză, italiană, franceză, maghiară) au fost taggate doar pe termenii tehnici în engleză → pot fi subnumărate.
5. **Parafrazare**: nu am copiat text din JD-uri; unde citez o cerință, e parafrazată.

## 2. Lista JD-urilor

### 2.1 JD-uri deschise efectiv și numărate

`Familie` = clasificarea mea după conținut. `Data` = data din sursă (Workday `startDate`, Greenhouse `first_published`/`updated_at`, Orange Cyberdefense `datePosted`); `n/a` = sursa nu o arată (hipo.ro afișează data accesării ca „Updated at”, nu e dată de publicare). Toate accesate la **2026-10-23**.

| # | id | Titlu | Angajator | Țară | Familie | Sector | Sursă | Data (sursă) | URL |
|---|----|-------|-----------|------|---------|--------|-------|--------------|-----|
| 1 | `db01` | Data Leakage Monitoring Analyst (f/m/x) | Deutsche Bank (Bucharest Technology Centre) | RO | DLP / DLM / insider risk | finance | career page (Workday) | 2026-09-29 | https://db.wd3.myworkdayjobs.com/DBWebsite/job/Bucharest-6A-Dimitrie-Pompeiu-Blvd/Data-Leakage-Monitoring-Analyst--f-m-x-_R0441667 |
| 2 | `db03` | Information Security Analyst (Threat Operations, cloud SIEM/SOAR) | Deutsche Bank (Bucharest Technology Centre) | RO | SOC (L1/L2/L3, monitoring) | finance | career page (Workday) | 2026-09-16 | https://db.wd3.myworkdayjobs.com/DBWebsite/job/Bucharest-6A-Dimitrie-Pompeiu-Blvd/Information-Security-Analyst--f-m-x-_R0429674-1 |
| 3 | `db04` | Security Incident Response Manager  (f/m/x) | Deutsche Bank (Bucharest Technology Centre) | RO | Incident response / DFIR | finance | career page (Workday) | 2026-09-16 | https://db.wd3.myworkdayjobs.com/DBWebsite/job/Bucharest-6A-Dimitrie-Pompeiu-Blvd/Security-Incident-Response-Manager---f-m-x-_R0445881-1 |
| 4 | `db05` | Director for Detection, Response & Data Engineering (f/m/x) | Deutsche Bank (Bucharest Technology Centre) | RO | Detection engineering / SIEM engineering | finance | career page (Workday) | 2026-09-16 | https://db.wd3.myworkdayjobs.com/DBWebsite/job/Bucharest-6A-Dimitrie-Pompeiu-Blvd/Director-for-Detection--Response---Data-Engineering--f-m-x-_R0450090-1 |
| 5 | `hp271828` | Security Operations Engineer / Information Security | ING Bank Romania | RO | SOC (L1/L2/L3, monitoring) | finance | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/271828/ING-Bank-Romania/Security-Operations-Engineer-%7C-Information-Security-@-ING-Bank |
| 6 | `hp272555` | Operations Security Engineer | SCOR (reinsurance), Bucharest | RO | SOC (L1/L2/L3, monitoring) | finance | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/272555/SCOR/Operation-Security-Engineer |
| 7 | `st01` | Incident Response Manager | Stripe | IE | Incident response / DFIR | finance | career page (Greenhouse API) | 2026-09-29 | https://stripe.com/jobs/search?gh_jid=8167558 |
| 8 | `bp01` | Senior SOC Analyst, Security Operations | Bitpanda | AT | SOC (L1/L2/L3, monitoring) | finance | career page (Greenhouse API) | 2026-10-21 | https://job-boards.eu.greenhouse.io/bitpanda/jobs/5012693101 |
| 9 | `bp02` | Senior Cyber Security Engineer, Elastic (Security Operations) | Bitpanda | AT | Detection engineering / SIEM engineering | finance | career page (Greenhouse API) | 2025-10-28 | https://job-boards.eu.greenhouse.io/bitpanda/jobs/4699355101 |
| 10 | `mc01` | SOC Monitoring and Response Analyst II | Mastercard | AU | SOC (L1/L2/L3, monitoring) | finance | career page (Workday) | 2026-10-20 | https://mastercard.wd1.myworkdayjobs.com/CorporateCareers/job/St-Leonards-Australia/SOC-Monitoring-and-Response-Analyst-II_R-292668 |
| 11 | `mc02` | Incident Response Engineer | Mastercard | MX | Incident response / DFIR | finance | career page (Workday) | 2026-10-22 | https://mastercard.wd1.myworkdayjobs.com/CorporateCareers/job/Mexico-City-Mexico/Incident-Response-Engineer_R-293270-1 |
| 12 | `mc03` | Lead Security Monitoring and Response Analyst (Insider Threat Program Lead) | Mastercard | US | SOC (L1/L2/L3, monitoring) | finance | career page (Workday) | 2026-10-14 | https://mastercard.wd1.myworkdayjobs.com/CorporateCareers/job/OFallon-Missouri/Lead-Corporate-Security-Operations-Analyst--Insider-Threat-Program-Lead-_R-292513-1 |
| 13 | `mc04` | Senior Security Monitoring and Response Analyst (Incident Responder) | Mastercard | IN | Incident response / DFIR | finance | career page (Workday) | 2026-09-22 | https://mastercard.wd1.myworkdayjobs.com/CorporateCareers/job/Pune-India/Senior-Security-Monitoring-and-Response-Analyst--Incident-Responder-_R-290538-1 |
| 14 | `sa01` | Cyber Security Spec II (CSIRT) | Santander | BR | Incident response / DFIR | finance | career page (Workday) | 2026-10-07 | https://santander.wd3.myworkdayjobs.com/SantanderCareers/job/SAO-PAULO/Cyber-Security-Spec-II_Req1611308 |
| 15 | `bd01` | Associate Security Analyst | Bitdefender | RO | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Greenhouse API) | 2026-08-21 | https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/4954189101 |
| 16 | `bd02` | Senior Security Analyst | Bitdefender | RO | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Greenhouse API) | 2026-10-06 | https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/4982982101 |
| 17 | `bd03` | Incident Response Manager | Bitdefender | RO | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-07-30 | https://job-boards.eu.greenhouse.io/scbitdefendersrl/jobs/4939566101 |
| 18 | `cs04` | Incident Response Analyst II (listed as Security Engineer), Bucharest | CrowdStrike | RO | Incident response / DFIR | tech-vendor | career page (Workday) | 2026-08-08 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/Romania---Bucharest/Incident-Response-Analyst-II--Hybrid--Bucharest-_R29614 |
| 19 | `cs01` | Incident Response Sr. Consultant (Remote) | CrowdStrike | GB | Incident response / DFIR | tech-vendor | career page (Workday) | 2026-10-21 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/United-Kingdom---Remote/Incident-Response-Sr-Consultant--Remote-_R30527 |
| 20 | `cs05` | Analyst I, Falcon Complete (Remote, GBR) | CrowdStrike | GB | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Workday) | 2026-10-21 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/United-Kingdom---Remote/Analyst-I--Falcon-Complete--Remote--GBR-_R30488 |
| 21 | `cs06` | Sr. Analyst, Falcon Complete (Remote, GBR) | CrowdStrike | GB | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Workday) | 2026-10-21 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/United-Kingdom---Remote/Sr-Analyst--Falcon-Complete--Remote--GBR-_R30342 |
| 22 | `cs02` | Threat Analyst, Machine Learning Operations & Detection Efficacy (Remote) | CrowdStrike | US | Detection engineering / SIEM engineering | tech-vendor | career page (Workday) | 2026-10-22 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/USA---Remote-WA/Threat-Analyst--Machine-Learning-Operations---Detection-Efficacy--Remote-_R29964 |
| 23 | `cs03` | Sr. Threat Hunting Intelligence Analyst II (Remote) | CrowdStrike | US | Threat hunting / threat intel | tech-vendor | career page (Workday) | 2026-10-14 | https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers/job/USA---Remote/Sr-Threat-Hunting-Intelligence-Analyst-II--Remote-_R30427 |
| 24 | `ft01` | SOC Analyst | Fortinet | CA | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Oracle HCM API) | 2026-07-08 | https://edel.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2001/job/23426 |
| 25 | `ft02` | Security Operations Expert | Fortinet | US | Incident response / DFIR | tech-vendor | career page (Oracle HCM API) | 2026-08-31 | https://edel.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2001/job/23960 |
| 26 | `ft03` | Senior Threat Hunting Specialist | Fortinet | CA | Threat hunting / threat intel | tech-vendor | career page (Oracle HCM API) | 2026-08-17 | https://edel.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2001/job/21217 |
| 27 | `ft04` | Incident Response Analyst | Fortinet (ex-Lacework) | IL | Incident response / DFIR | tech-vendor | career page (Oracle HCM API) | 2026-09-20 | https://edel.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_2001/job/24384 |
| 28 | `wz01` | Incident Responder | Wiz | GB | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-06-30 | https://www.wiz.io/careers/job/4690856006/:title?gh_jid=4690856006 |
| 29 | `wz02` | Threat Detection Researcher (Cloud) | Wiz | IL | Detection engineering / SIEM engineering | tech-vendor | career page (Greenhouse API) | 2025-06-08 | https://www.wiz.io/careers/job/4566780006/:title?gh_jid=4566780006 |
| 30 | `zs01` | Insider Risk Security Engineer | Zscaler | US | DLP / DLM / insider risk | tech-vendor | career page (Greenhouse API) | 2026-09-21 | https://job-boards.greenhouse.io/zscaler/jobs/5208421007 |
| 31 | `zs02` | Detection Analyst | Zscaler | US | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Greenhouse API) | 2026-09-17 | https://job-boards.greenhouse.io/zscaler/jobs/5219486007 |
| 32 | `zs03` | Staff Detection Engineer | Zscaler | IN | Detection engineering / SIEM engineering | tech-vendor | career page (Greenhouse API) | 2026-09-01 | https://job-boards.greenhouse.io/zscaler/jobs/5200408007 |
| 33 | `cr01` | Senior Threat Detection Engineer | Cribl | US | Detection engineering / SIEM engineering | tech-vendor | career page (Greenhouse API) | 2026-10-07 | https://cribl.io/job-detail/?gh_jid=6217897004 |
| 34 | `gl01` | Senior Security Engineer, Security Incident Response Team (SIRT) - EMEA | GitLab | PL/GB/IL (remote) | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-07-10 | https://job-boards.greenhouse.io/gitlab/jobs/8628447002 |
| 35 | `tw01` | Security Engineer, Incident Response | Twilio | GB | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-07-10 | https://job-boards.greenhouse.io/twilio/jobs/8055481 |
| 36 | `ti01` | Senior Security Operations Engineer | Tines | IE | Detection engineering / SIEM engineering | tech-vendor | career page (Greenhouse API) | 2026-10-13 | https://job-boards.greenhouse.io/tines/jobs/6223362004 |
| 37 | `rf01` | Threat Intelligence Response Analyst | Recorded Future | GB | Threat hunting / threat intel | tech-vendor | career page (Greenhouse API) | 2026-10-02 | https://job-boards.greenhouse.io/recordedfuture/jobs/8859088002 |
| 38 | `el01` | Senior Incident Response Analyst - InfoSec | Elastic | US | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-10-19 | https://jobs.elastic.co/jobs?gh_jid=8274371&gh_jid=8274371 |
| 39 | `dd01` | Senior Security Engineer, Security Incident Response Team | Datadog | US | Incident response / DFIR | tech-vendor | career page (Greenhouse API) | 2026-10-15 | https://careers.datadoghq.com/detail/8286919/?gh_jid=8286919 |
| 40 | `ad02` | Sr Manager, Integrated Security Operations | Adobe | IN | SOC (L1/L2/L3, monitoring) | tech-vendor | career page (Workday) | 2026-09-21 | https://adobe.wd5.myworkdayjobs.com/external_experienced/job/Noida/Sr-Manager--Integrated-Security-Operations_R171954 |
| 41 | `ad03` | Threat Intelligence / Reverse Engineering Investigator | Adobe | US | Threat hunting / threat intel | tech-vendor | career page (Workday) | 2026-10-20 | https://adobe.wd5.myworkdayjobs.com/external_experienced/job/San-Jose/Threat-Intelligence---Reverse-Engineering-Investigator_R171849 |
| 42 | `ac01` | SOC Developer / Engineer | Accenture | FI | Detection engineering / SIEM engineering | mssp-consulting | career page (Workday) | 2026-10-05 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/Helsinki/SOC-Developer---Engineer_R00361503 |
| 43 | `ac02` | SOC analytiker / Security Managed Services Analyst (Sweden) | Accenture | SE | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page (Workday) | 2026-10-08 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/Stockholm/Security-Managed-Services-Analyst-Cybersecurity-Sweden_R00361853 |
| 44 | `ac03` | Threat Hunting & Detection Analyst | Accenture | GB | Threat hunting / threat intel | mssp-consulting | career page (Workday) | 2026-10-22 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/London/Security-Managed-Services-Senior-Analyst_R00305755 |
| 45 | `ac04` | Cyber Defense Expert (Threat Detection & Response) | Accenture | IT | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page (Workday) | 2026-06-22 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/Roma-Via-Sciangai-53/Threat-Detection---Response-Expert_R00284999 |
| 46 | `ac05` | MxDR SOC Engineer | Accenture | ES | Detection engineering / SIEM engineering | mssp-consulting | career page (Workday) | 2026-09-23 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/Malaga-ID6---South-Building/MxDR-SOC-Engineer_R00359223 |
| 47 | `ac06` | SIEM Security Consultant (Dutch speaker) | Accenture | NL | Detection engineering / SIEM engineering | mssp-consulting | career page (Workday) | 2026-09-24 | https://accenture.wd103.myworkdayjobs.com/AccentureCareers/job/Amsterdam/SIEM-Security-Engineer_R00282184 |
| 48 | `oc01` | Cyber Security Analyst | Orange Cyberdefense | BE | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page | 2026-09-21 | https://jobs.orangecyberdefense.com/jobs/8430499-cyber-security-analyst |
| 49 | `oc02` | Senior Incident Responder | Orange Cyberdefense | BE | Incident response / DFIR | mssp-consulting | career page | 2026-04-01 | https://jobs.orangecyberdefense.com/jobs/7503439-senior-incident-responder |
| 50 | `oc03` | Junior SOC Analyst with French & Spanish | Orange Cyberdefense | ES | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page | 2026-03-26 | https://jobs.orangecyberdefense.com/jobs/7465785-junior-soc-analyst-with-french-spanish-m-f-based-in-spain |
| 51 | `pw01` | Data Security Engineer (Purview, DSPM, DLP) | PwC Czech Republic | CZ | DLP / DLM / insider risk | mssp-consulting | career page (Workday) | 2026-10-21 | https://pwc.wd3.myworkdayjobs.com/Global_Experienced_Careers/job/Prague/Data-Security-Engineer--Purview--DSPM--DLP-_769268WD |
| 52 | `pw02` | SOC Analyst | PwC Czech Republic | CZ | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page (Workday) | 2026-09-23 | https://pwc.wd3.myworkdayjobs.com/Global_Experienced_Careers/job/Prague/SOC-Analyst_721704WD-2 |
| 53 | `pw03` | Threat Detection and Response Specialist | PwC Czech Republic | CZ | Detection engineering / SIEM engineering | mssp-consulting | career page (Workday) | 2026-09-23 | https://pwc.wd3.myworkdayjobs.com/Global_Experienced_Careers/job/Prague/Threat-Detection-and-Response-Specialist_723663WD-2 |
| 54 | `pw04` | Manager / CSIRT / Cybersécurité / F/H | PwC France | FR | Incident response / DFIR | mssp-consulting | career page (Workday) | 2026-10-07 | https://pwc.wd3.myworkdayjobs.com/Global_Experienced_Careers/job/Neuilly-sur-Seine/Consultant-expriment---Manager-CSIRT---CDI---H-F---_162072WD |
| 55 | `nt01` | SOC Analyst Level 1 (UK Sovereign SOC) | NTT DATA UK | GB | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page (summarised by WebFetch) | n/a | https://nttdata.jobs/vacancies/7272 |
| 56 | `nt02` | SOC Level 2 Security Analyst (UK Sovereign SOC) | NTT DATA UK | GB | SOC (L1/L2/L3, monitoring) | mssp-consulting | career page (summarised by WebFetch) | n/a | https://nttdata.jobs/vacancies/7587 |
| 57 | `bv01` | SOC Security Analyst L2 | BlueVoyant | RO | SOC (L1/L2/L3, monitoring) | mssp-consulting | aggregator copy (Working Nomads, summarised by WebFetch) | n/a | https://www.workingnomads.com/jobs/soc-security-analyst-l2-bluevoyant-1943587 |
| 58 | `ex01` | Senior Detection & Response Engineer | Expel | (remote) | Detection engineering / SIEM engineering | mssp-consulting | career page (Greenhouse API) | 2026-09-26 | https://expel.com/about/career-listing/8836996002?gh_jid=8836996002 |
| 59 | `hp269209` | SOC Analyst (L2) | Levi9 (IT services), Iasi | RO | SOC (L1/L2/L3, monitoring) | mssp-consulting | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/269209/Hipo-Job-Finder/SOC-Analyst-(L2)---Levi9 |
| 60 | `hp267997` | Data Loss Prevention Specialist (Microsoft Purview) | Levi9 (IT services, finance client) | RO | DLP / DLM / insider risk | mssp-consulting | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/267997/Hipo-Job-Finder/Data-Loss-Prevention-Specialist-(Microsoft-Purview)---Levi9 |
| 61 | `hp269623` | Security Expert (Cyber Security Analyst, CSOC) | VOIS (Vodafone shared services) | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/269623/VOIS-Romania/Security-Expert |
| 62 | `hp270009` | Cybersecurity Incident Responder II, Enterprise Security | Booking Holdings Romania | RO | Incident response / DFIR | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/270009/Booking-Holdings/Booking-Holdings-Romania---Cybersecurity-Incident-Responder-II,-Enterprise-Security |
| 63 | `hp271941` | Intelligence and Security Response Analyst I | Booking Holdings Romania | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/271941/Booking-Holdings/Booking-Holdings-Romania---Intelligence-and-Security-Response-Analyst-I |
| 64 | `hp271942` | Junior Intelligence and Security Response Analyst | Booking Holdings Romania | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/271942/Booking-Holdings/Booking-Holdings-Romania---Junior-Intelligence-and-Security-Response-Analyst |
| 65 | `hp272220` | Senior Cybersecurity Incident Responder, Enterprise Security | Booking Holdings Romania | RO | Incident response / DFIR | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/272220/Booking-Holdings/Booking-Holdings-Romania---Senior-Cybersecurity-Incident-Responder,-Enterprise-Security |
| 66 | `hp272617` | Senior Security Operations Specialist (SOC) | Continental (Tires) | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/272617/Continental/Senior-Security-Operations-Specialist-(SOC)---Tires |
| 67 | `hp271627` | Cybersecurity Monitoring Lead | Siemens Energy | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/271627/Siemens-Energy/Cybersecurity-Monitoring-Lead |
| 68 | `hp271628` | IT/OT L2 Cybersecurity Monitoring Specialist | Siemens Energy | RO | SOC (L1/L2/L3, monitoring) | other | aggregator copy (hipo.ro) | n/a | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/271628/Siemens-Energy/IT/OT-L2-Cybersecurity-Monitoring-Specialist |
| 69 | `isr01` | Data Security Specialist | InterSources (via Vaia Talents) | US (remote) | DLP / DLM / insider risk | other | aggregator copy (summarised by WebFetch) | n/a | https://talents.vaia.com/companies/intersources/position-summary-122462522/ |

**Pe familie de rol:** SOC (L1/L2/L3, monitoring) = 28; Incident response / DFIR = 19; Detection engineering / SIEM engineering = 12; DLP / DLM / insider risk = 5; Threat hunting / threat intel = 5.
**Pe regiune:** non-EU = 22; RO = 21; EU = 17; UK = 9.

Note pe JD-uri: `bd01` — Bitdefender are două postări identice „Associate Security Analyst” (ID-uri 4954189101 și 4954182101); numărată **o singură dată**. `hp272617` — Continental are două postări identice (272617 și 273227); numărată o singură dată. `cs04` — pagina CrowdStrike are titlul public „Security Engineer (Hybrid, Bucharest)” dar URL-ul indică *Incident Response Analyst II*; am citit conținutul (IR). `wz02` și `bp02` apar pe board-ul curent dar `updated_at` din Greenhouse e din 2025 — le-am păstrat (listate = deschise), data nu e dată de publicare.

### 2.2 Pagini deschise dar **nenumărate** (nu intră în nicio cifră)

| Pagină | URL | De ce nu e numărată |
|--------|-----|---------------------|
| Vodafone — Data Loss Prevention Junior Analyst (Bucharest) | https://opportunities.vodafone.com/job/Bucharest-Data-Loss-Prevention-Junior-Analyst/1126592101 | pagina spune „position has been filled”; rezumatul din WebSearch (cerințe 1–3 ani, English B2) **nu** a fost confirmat de pagină → [verifică] |
| Eames Consulting — Data Leakage Protection Analyst 1 | https://www.eamesconsulting.com/job/data-leakage-protection-analyst-1 | HTTP 404 |
| Société Générale careers (IT Security Hub, DLP Symantec) | https://careers.societegenerale.com/en/sg_careers_offers_entity/78703 | HTTP 404 |
| SG EBS — Business Analyst with SQL for Security HUB | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/132449/Societe-Generale-European-Business-Services-(SG-EBS)/Business-Analyst-with-SQL | închis; actualizat 2019 (arhivă; conținut DLP SQL/Python/Symantec citit, doar context) |
| Inetum — Data Loss Prevention Analyst, French skills | https://www.hipo.ro/locuri-de-munca/locuri_de_munca/34920/Inetum-Romania/Data-Loss-Prevention-Analyst-French-skills | închis; actualizat 2016 (arhivă; descrie model L1 ~100 anomalii/zi → escalare L2; doar context) |
| Jit Team — DLP Analyst Expert (client financiar nordic, Gdańsk/Łódź) | https://justjoin.it/job-offer/jit-team-dlp-analyst-expert-gdansk-security | „Offer expired”; citit pentru context (investigare incidente DLP în mediu bancar, rapoarte BI pe date DLP, playbook-uri) — **nenumărat** |
| Antal — Senior Cybersecurity Analyst – Data Security (DLP); SME DLP Proofpoint; DLP Engineer; Mindbox DLP Analyst; ITDS DLP Engineer (Polonia) | https://antal.pl/en/job-offer/senior-cybersecurity-analyst-data-security-dlp-230-4-2026-pk-95308 | HTTP 403 la deschidere (curl și WebFetch); existența lor vine doar din snippet WebSearch → [verifică] |
| Stryker — Senior Analyst, Cybersecurity: DLP / Data Protection (Varșovia) | https://careers.stryker.com/senior-analyst-cybersecurity-data-loss-prevention-dlp-data-protection/job/4AAF401D12374E856361C815755614C6 | HTTP 404 |
| Orange Cyberdefense — SOC Analyst 5011275 | https://jobs.orangecyberdefense.com/jobs/5011275-soc-analyst | HTTP 410. Lista OCD (≈34 poziții) nu are, după titluri, niciun rol în România [verifică locațiile fiecăruia] |
| Halian — L3 Analyst and Detection Engineer (Bruxelles) | https://www.halian.com/jobs/l3-analyst-and-detection-engineer-239726 | HTTP 404 |
| Swedbank — Detection Engineer | https://jobs.swedbank.com/jobs/23762-detection-engineer | HTTP 410 (termen 12.09.2025) |
| EY — Junior SOC Analyst (Bucharest) | https://careers.ey.com/ey/job/Bucharest-Junior-SOC-Analyst-011171/1238236701 | „The Job is no longer available” |
| Lucrezi.ro — SOC Analyst L2; Security Operations Centre Analyst; SOC Consultant (București) | https://www.lucrezi.ro/munca/soc-analyst-l2-ronvb4d677a28a011d42 | „oferta nu mai este activă”; pagini de listare fără JD |
| Worldline — 7 pagini SOC Analyst Bucharest (junior/senior) | https://jobs.worldline.com/job/Senior-SOC-Analyst/304383-en_US/ | „job not available at this time”; Worldline e SuccessFactors |
| BNY Dublin — Cyber Incident Response & DFIR VP; JPMorganChase London — Digital Forensics Senior Associate | https://builtindublin.ie/job/cyber-incident-response-digital-forensics-dfir-vice-president/8992413 | copii Built In „job was removed” (iul 2026) |
| Barclays — DFIR Lead Cyber Operations Analyst (Knutsford) | https://search.jobs.barclays/job/knutsford/dfir-lead-cyber-operations-analyst/13015/96668374464 | HTTP 404 pe URL-ul din search; existența vine din snippet → [verifică] |
| ING Bank — Security Analyst Bucharest (careers.ing.com) | https://careers.ing.com/ro/post-vacant/bucarest/security-analyst-ing-bank/3353/28653421440 | HTTP 404; în schimb a fost numărat JD-ul ING `Security Operations Engineer` din hipo.ro |
| Deloitte NL — Senior Detection Engineer (Amsterdam) | https://werkenbijdeloitte.nl/en/vacancy/senior-detection-engineer-ref4079q/ | redirecționează la homepage (probabil închis); copia Magnet.me e din 24.06.2026 → [verifică] |
| Palo Alto Networks — MDR Analyst (Unit 42), Varșovia | https://jobs.paloaltonetworks.com/en/job/warsaw/mdr-analyst-unit-42/47263/97741095328 | pagina returnează doar hub-ul de cariere, nu JD-ul |
| BCR — Security Manager; NTT DATA RO — Cybersecurity Analyst (Sibiu/București) și «with German» | https://career.io/job/security-manager-bucharest-bcr-9a1bb612b9d64fc86ed30be2de2f0626 | career.io/NTT global: conținut gol (JS) sau DNS indisponibil în WebFetch → [verifică]; rolurile NTT RO există conform snippet-urilor de search, dar nu am putut citi textul |
| Raiffeisen Bank — Analist Securitate IT&C (Securitatea Informației), valid până 2026-12-07 | https://www.undelucram.ro/en/jobs/analist-securitate-itc-securitatea-informatiei/100769 | DESCHIS dar **exclus**: rol de risk/GRC (evaluare riscuri, rapoarte, monitorizare conformitate; investigare incidente doar ca ultim punct) |
| Deutsche Bank — Information Security Analyst (Third Party Security) `db02`; Information Security Specialist (IAM audit, Frankfurt) `db06` | https://db.wd3.myworkdayjobs.com/DBWebsite/job/Bucharest-6A-Dimitrie-Pompeiu-Blvd/Information-Security-Analyst--f-m-x-_R0409553 | DESCHISE dar **excluse**: GRC / third-party risk / audit IAM — același titlu „Information Security Analyst” ca db01/db03, scop diferit |
| Bitpanda — Specialist, Information Security `bp03`; SCOR — Security Reporting & Automation Analyst; SCOR Lead Operations Security Engineer; ING Hubs — Senior IT Security Engineer; Levi9 — Data Security SME (criptografie); AUMOVIO — Vulnerability Manager (SOC); VOIS … ; Grant Thornton — Security Engineer; Solaris — Cyber Security Engineer; Visa London — Cybersecurity Operations & Enablement Associate (rol administrativ) și Cybersecurity Analyst (CSPM cloud); Adobe — Policy and Incident Specialist, Payments & Commercial Abuse Analyst; Bitdefender — Cybersecurity Advisory Consultant; Accenture — Symantec DLP Load Balancing Network Engineer (Dallas) | (vezi URL-urile în fișierele sursă din scratchpad) | DESCHISE dar **excluse** ca irelevante pentru familiile cerute (GRC, criptografie, vuln mgmt, admin, product/abuse, infrastructură de rețea). Acestea nu intră în cifre |
| LinkedIn Jobs, Indeed, Glassdoor, eJobs, BestJobs | https://www.ejobs.ro/ | eJobs 403 la `curl`; BestJobs redirect fără conținut; LinkedIn/Indeed/Glassdoor cer login sau nu au fost deschise → **nenumărate** (cerința de pornire din brief nu a putut fi respectată; agregatorul hipo.ro și ATS-urile angajatorilor au fost folosite în loc) |

## 3. Frecvențe de skill-uri

Notație: `n/N (%)`. Total N = 69. `finance` N=14, `tech-vendor` N=27, `mssp-consulting` N=19, `other` N=9, `RO` N=21, `RO+UE` N=38. **must-have** = apare în > 50 % din cele 69 JD-uri. Coloana **Sector-specific** marchează skill-uri cu diferență ≥ 20 pp și ≥ 1,8× între `finance` și restul (atenție: finance are N mic).

### 3.1 Tabel general (sortat după frecvență totală)

| Grup | Skill | Total | % | must-have | finance | tech-vendor | mssp-consulting | other | RO | RO+UE | Sector-specific | Observație |
|------|-------|-------|---|-----------|---------|-------------|-----------------|-------|----|-------|-----------------|------------|
| Detection/IR | Incident response (process / lifecycle) | 54/69 | 78% | **must-have** | 13/14 (93%) | 21/27 (78%) | 11/19 (58%) | 9/9 (100%) | 19/21 (90%) | 30/38 (79%) |  | cuvântul-cheie apare și în JD-uri de SOC |
| Detection/IR | Alert triage / investigation | 54/69 | 78% | **must-have** | 11/14 (79%) | 23/27 (85%) | 11/19 (58%) | 9/9 (100%) | 19/21 (90%) | 26/38 (68%) |  |  |
| Detection/IR | Reporting / documentation | 48/69 | 70% | **must-have** (generic) | 10/14 (71%) | 18/27 (67%) | 11/19 (58%) | 9/9 (100%) | 18/21 (86%) | 25/38 (66%) |  | generic; aproape orice rol SOC/IR |
| General | Teamwork / collaboration | 46/69 | 67% | **must-have** (generic) | 10/14 (71%) | 21/27 (78%) | 8/19 (42%) | 7/9 (78%) | 16/21 (76%) | 26/38 (68%) |  | generic |
| Tools | SIEM (generic) | 45/69 | 65% | **must-have** | 11/14 (79%) | 13/27 (48%) | 15/19 (79%) | 6/9 (67%) | 16/21 (76%) | 28/38 (74%) |  | SIEM-ul concret diferă (vezi Splunk/Sentinel) |
| Certs | Any certification named/preferred | 37/69 | 54% | **must-have** | 7/14 (50%) | 12/27 (44%) | 13/19 (68%) | 5/9 (56%) | 11/21 (52%) | 18/38 (47%) |  | mai ales *preferat*, nu obligatoriu |
| Tools | Cloud (AWS / Azure / GCP / M365) | 36/69 | 52% | **must-have** | 9/14 (64%) | 11/27 (41%) | 11/19 (58%) | 5/9 (56%) | 12/21 (57%) | 22/38 (58%) |  | include și mențiuni scurte; posibil umflat de [verifică] |
| General | Analytical / problem-solving | 34/69 | 49% |  | 7/14 (50%) | 12/27 (44%) | 10/19 (53%) | 5/9 (56%) | 11/21 (52%) | 19/38 (50%) |  |  |
| Detection/IR | Stakeholder / customer communication | 33/69 | 48% |  | 9/14 (64%) | 10/27 (37%) | 7/19 (37%) | 7/9 (78%) | 16/21 (76%) | 22/38 (58%) |  |  |
| General | Communication skills | 33/69 | 48% |  | 5/14 (36%) | 15/27 (56%) | 6/19 (32%) | 7/9 (78%) | 13/21 (62%) | 18/38 (47%) |  |  |
| General | Years of experience stated | 32/69 | 46% |  | 6/14 (43%) | 13/27 (48%) | 7/19 (37%) | 6/9 (67%) | 12/21 (57%) | 18/38 (47%) |  |  |
| Detection/IR | Alert tuning / false-positive reduction | 31/69 | 45% |  | 4/14 (29%) | 13/27 (48%) | 8/19 (42%) | 6/9 (67%) | 12/21 (57%) | 16/38 (42%) |  |  |
| Detection/IR | Threat hunting | 31/69 | 45% |  | 5/14 (36%) | 10/27 (37%) | 11/19 (58%) | 5/9 (56%) | 9/21 (43%) | 19/38 (50%) |  |  |
| Detection/IR | Playbooks / runbooks / SOPs | 31/69 | 45% |  | 4/14 (29%) | 10/27 (37%) | 8/19 (42%) | 9/9 (100%) | 12/21 (57%) | 18/38 (47%) |  |  |
| Detection/IR | Detection content / rules / use cases (Sigma, YARA, detection-as-code) | 30/69 | 43% |  | 6/14 (43%) | 10/27 (37%) | 8/19 (42%) | 6/9 (67%) | 11/21 (52%) | 16/38 (42%) |  |  |
| Tools | Scripting / coding (Python, PowerShell, Bash) | 28/69 | 41% |  | 5/14 (36%) | 15/27 (56%) | 6/19 (32%) | 2/9 (22%) | 5/21 (24%) | 11/38 (29%) |  |  |
| Detection/IR | Escalation | 28/69 | 41% |  | 5/14 (36%) | 8/27 (30%) | 6/19 (32%) | 9/9 (100%) | 15/21 (71%) | 17/38 (45%) |  |  |
| Detection/IR | Digital forensics (disk/memory/artifacts) | 28/69 | 41% |  | 7/14 (50%) | 10/27 (37%) | 6/19 (32%) | 5/9 (56%) | 9/21 (43%) | 16/38 (42%) |  |  |
| Detection/IR | Threat intelligence (CTI / IOC) | 27/69 | 39% |  | 3/14 (21%) | 14/27 (52%) | 7/19 (37%) | 3/9 (33%) | 9/21 (43%) | 14/38 (37%) | non-finance |  |
| Tools | Windows / Linux OS internals | 26/69 | 38% |  | 6/14 (43%) | 9/27 (33%) | 6/19 (32%) | 5/9 (56%) | 11/21 (52%) | 15/38 (39%) |  |  |
| Detection/IR | 24/7 shifts / on-call | 26/69 | 38% |  | 5/14 (36%) | 10/27 (37%) | 6/19 (32%) | 5/9 (56%) | 9/21 (43%) | 16/38 (42%) |  |  |
| Tools | Microsoft Sentinel / KQL | 25/69 | 36% |  | 9/14 (64%) | 3/27 (11%) | 11/19 (58%) | 2/9 (22%) | 6/21 (29%) | 14/38 (37%) | finance |  |
| Tools | EDR / XDR / endpoint security | 25/69 | 36% |  | 3/14 (21%) | 8/27 (30%) | 9/19 (47%) | 5/9 (56%) | 9/21 (43%) | 16/38 (42%) |  |  |
| Detection/IR | Mentoring / team lead | 25/69 | 36% |  | 4/14 (29%) | 10/27 (37%) | 6/19 (32%) | 5/9 (56%) | 7/21 (33%) | 14/38 (37%) |  |  |
| Tools | SOAR / security automation | 24/69 | 35% |  | 4/14 (29%) | 9/27 (33%) | 8/19 (42%) | 3/9 (33%) | 6/21 (29%) | 16/38 (42%) |  |  |
| Detection/IR | MITRE ATT&CK | 24/69 | 35% |  | 4/14 (29%) | 11/27 (41%) | 6/19 (32%) | 3/9 (33%) | 9/21 (43%) | 14/38 (37%) |  |  |
| Governance | AI / LLM mention (as tool or risk) | 22/69 | 32% |  | 4/14 (29%) | 12/27 (44%) | 3/19 (16%) | 3/9 (33%) | 7/21 (33%) | 12/38 (32%) |  |  |
| General | Degree (BSc/MSc/equivalent) | 22/69 | 32% |  | 4/14 (29%) | 6/27 (22%) | 7/19 (37%) | 5/9 (56%) | 7/21 (33%) | 12/38 (32%) |  |  |
| Certs | GIAC / SANS (GCIH, GCFA, GCIA...) | 21/69 | 30% |  | 4/14 (29%) | 6/27 (22%) | 6/19 (32%) | 5/9 (56%) | 9/21 (43%) | 12/38 (32%) |  |  |
| Tools | Splunk / SPL | 20/69 | 29% |  | 7/14 (50%) | 2/27 (7%) | 9/19 (47%) | 2/9 (22%) | 8/21 (38%) | 13/38 (34%) | finance |  |
| Detection/IR | Malware analysis / reverse engineering | 20/69 | 29% |  | 3/14 (21%) | 10/27 (37%) | 3/19 (16%) | 4/9 (44%) | 6/21 (29%) | 8/38 (21%) |  |  |
| Detection/IR | Post-incident review / lessons learned | 19/69 | 28% |  | 2/14 (14%) | 8/27 (30%) | 6/19 (32%) | 3/9 (33%) | 5/21 (24%) | 12/38 (32%) |  |  |
| Governance | Compliance / audit / risk | 19/69 | 28% |  | 8/14 (57%) | 5/27 (19%) | 2/19 (11%) | 4/9 (44%) | 8/21 (38%) | 11/38 (29%) | finance |  |
| General | English proficiency stated | 19/69 | 28% |  | 5/14 (36%) | 3/27 (11%) | 8/19 (42%) | 3/9 (33%) | 9/21 (43%) | 17/38 (45%) |  |  |
| Tools | Query languages (KQL/SPL/SQL/ES/QL) | 17/69 | 25% |  | 4/14 (29%) | 7/27 (26%) | 4/19 (21%) | 2/9 (22%) | 3/21 (14%) | 7/38 (18%) |  |  |
| Tools | Firewall / IDS-IPS / WAF | 16/69 | 23% |  | 4/14 (29%) | 7/27 (26%) | 2/19 (11%) | 3/9 (33%) | 9/21 (43%) | 10/38 (26%) |  |  |
| Governance | Financial/sector regulation (DORA, NIS2, PCI, SOX, regulators) | 16/69 | 23% |  | 8/14 (57%) | 4/27 (15%) | 1/19 (5%) | 3/9 (33%) | 6/21 (29%) | 8/38 (21%) | finance |  |
| Detection/IR | Root cause analysis | 14/69 | 20% |  | 3/14 (21%) | 4/27 (15%) | 1/19 (5%) | 6/9 (67%) | 5/21 (24%) | 7/38 (18%) |  |  |
| Tools | Vulnerability management | 13/69 | 19% |  | 2/14 (14%) | 9/27 (33%) | 2/19 (11%) | 0/9 (0%) | 3/21 (14%) | 6/38 (16%) |  |  |
| Tools | Identity (AD / Entra / IAM / PAM) | 13/69 | 19% |  | 4/14 (29%) | 2/27 (7%) | 4/19 (21%) | 3/9 (33%) | 5/21 (24%) | 9/38 (24%) |  |  |
| Tools | Network analysis (PCAP/Wireshark/NDR/Zeek/NetFlow) | 12/69 | 17% |  | 2/14 (14%) | 4/27 (15%) | 3/19 (16%) | 3/9 (33%) | 7/21 (33%) | 9/38 (24%) |  |  |
| General | Other language required/valued (German/French/Dutch/Italian/Spanish...) | 12/69 | 17% |  | 4/14 (29%) | 1/27 (4%) | 5/19 (26%) | 2/9 (22%) | 7/21 (33%) | 12/38 (32%) |  |  |
| Certs | CompTIA (Security+, CySA+) | 11/69 | 16% |  | 3/14 (21%) | 2/27 (7%) | 5/19 (26%) | 1/9 (11%) | 3/21 (14%) | 5/38 (13%) |  |  |
| Certs | Microsoft SC-200 / SC-xxx | 11/69 | 16% |  | 1/14 (7%) | 0/27 (0%) | 8/19 (42%) | 2/9 (22%) | 5/21 (24%) | 7/38 (18%) |  |  |
| Tools | Ticketing / case management | 9/69 | 13% |  | 2/14 (14%) | 2/27 (7%) | 4/19 (21%) | 1/9 (11%) | 3/21 (14%) | 6/38 (16%) |  |  |
| Detection/IR | Metrics / KPI / MTTD-MTTR / SLA | 9/69 | 13% |  | 2/14 (14%) | 3/27 (11%) | 2/19 (11%) | 2/9 (22%) | 4/21 (19%) | 5/38 (13%) |  |  |
| Governance | ISO 27001/27035 | 9/69 | 13% |  | 4/14 (29%) | 1/27 (4%) | 0/19 (0%) | 4/9 (44%) | 4/21 (19%) | 6/38 (16%) |  |  |
| Certs | Offensive certs (CEH, OSCP, GPEN) | 9/69 | 13% |  | 1/14 (7%) | 3/27 (11%) | 2/19 (11%) | 3/9 (33%) | 4/21 (19%) | 5/38 (13%) |  |  |
| Tools | Email security / phishing analysis | 8/69 | 12% |  | 1/14 (7%) | 4/27 (15%) | 1/19 (5%) | 2/9 (22%) | 5/21 (24%) | 5/38 (13%) |  |  |
| Governance | GDPR / data protection / privacy | 8/69 | 12% |  | 4/14 (29%) | 1/27 (4%) | 2/19 (11%) | 1/9 (11%) | 3/21 (14%) | 5/38 (13%) | finance |  |
| Certs | CISSP / CISM / CISA | 8/69 | 12% |  | 4/14 (29%) | 1/27 (4%) | 1/19 (5%) | 2/9 (22%) | 4/21 (19%) | 4/38 (11%) | finance |  |
| Governance | Financial-sector context explicitly requested (financial services, fintech, fraud, regulated environment) | 7/69 | 10% |  | 2/14 (14%) | 2/27 (7%) | 1/19 (5%) | 2/9 (22%) | 2/21 (10%) | 2/38 (5%) |  |  |
| Tools | DLP (tools or concepts) | 6/69 | 9% |  | 3/14 (21%) | 0/27 (0%) | 2/19 (11%) | 1/9 (11%) | 2/21 (10%) | 3/38 (8%) |  |  |
| Tools | DLP vendor/product named (Purview/Symantec/Forcepoint/Netskope/Zscaler) | 6/69 | 9% |  | 3/14 (21%) | 0/27 (0%) | 2/19 (11%) | 1/9 (11%) | 3/21 (14%) | 4/38 (11%) |  |  |
| Governance | NIST (800-61 / CSF) | 6/69 | 9% |  | 0/14 (0%) | 2/27 (7%) | 0/19 (0%) | 4/9 (44%) | 3/21 (14%) | 3/38 (8%) |  |  |
| Detection/IR | Insider threat / insider risk | 5/69 | 7% |  | 1/14 (7%) | 1/27 (4%) | 2/19 (11%) | 1/9 (11%) | 1/21 (5%) | 2/38 (5%) |  |  |
| Governance | Data classification / labelling | 5/69 | 7% |  | 0/14 (0%) | 2/27 (7%) | 2/19 (11%) | 1/9 (11%) | 1/21 (5%) | 2/38 (5%) |  |  |
| General | Clearance / background check / vetting | 3/69 | 4% |  | 0/14 (0%) | 0/27 (0%) | 3/19 (16%) | 0/9 (0%) | 1/21 (5%) | 1/38 (3%) |  |  |
| Tools | CASB / SSE / proxy | 1/69 | 1% |  | 0/14 (0%) | 0/27 (0%) | 0/19 (0%) | 1/9 (11%) | 0/21 (0%) | 0/38 (0%) |  |  |

**Top 10 skill-uri tehnice/de proces (fără cele generice):** Incident response (process / lifecycle) (54/69, 78%); Alert triage / investigation (54/69, 78%); SIEM (generic) (45/69, 65%); Any certification named/preferred (37/69, 54%); Cloud (AWS / Azure / GCP / M365) (36/69, 52%); Alert tuning / false-positive reduction (31/69, 45%); Threat hunting (31/69, 45%); Playbooks / runbooks / SOPs (31/69, 45%); Detection content / rules / use cases (Sigma, YARA, detection-as-code) (30/69, 43%); Scripting / coding (Python, PowerShell, Bash) (28/69, 41%).

**Must-have (> 50 %)**: Incident response (process / lifecycle) (78%), Alert triage / investigation (78%), Reporting / documentation (70%), Teamwork / collaboration (67%), SIEM (generic) (65%), Any certification named/preferred (54%), Cloud (AWS / Azure / GCP / M365) (52%). Atenție: certificările sunt de regulă „preferate / nice to have”; `cloud` e la limită (52 %) și poate fi ușor umflat.

### 3.2 Frecvențe separate pe sector (top 15 pe sector)

**finance** (N=14)

| Skill | n/N | % |
|-------|-----|---|
| Incident response (process / lifecycle) | 13/14 | 93% |
| Alert triage / investigation | 11/14 | 79% |
| SIEM (generic) | 11/14 | 79% |
| Reporting / documentation | 10/14 | 71% |
| Teamwork / collaboration | 10/14 | 71% |
| Cloud (AWS / Azure / GCP / M365) | 9/14 | 64% |
| Microsoft Sentinel / KQL | 9/14 | 64% |
| Stakeholder / customer communication | 9/14 | 64% |
| Compliance / audit / risk | 8/14 | 57% |
| Financial/sector regulation (DORA, NIS2, PCI, SOX, regulators) | 8/14 | 57% |
| Analytical / problem-solving | 7/14 | 50% |
| Any certification named/preferred | 7/14 | 50% |
| Digital forensics (disk/memory/artifacts) | 7/14 | 50% |
| Splunk / SPL | 7/14 | 50% |
| Detection content / rules / use cases (Sigma, YARA, detection-as-code) | 6/14 | 43% |

**tech-vendor** (N=27)

| Skill | n/N | % |
|-------|-----|---|
| Alert triage / investigation | 23/27 | 85% |
| Incident response (process / lifecycle) | 21/27 | 78% |
| Teamwork / collaboration | 21/27 | 78% |
| Reporting / documentation | 18/27 | 67% |
| Communication skills | 15/27 | 56% |
| Scripting / coding (Python, PowerShell, Bash) | 15/27 | 56% |
| Threat intelligence (CTI / IOC) | 14/27 | 52% |
| Alert tuning / false-positive reduction | 13/27 | 48% |
| SIEM (generic) | 13/27 | 48% |
| Years of experience stated | 13/27 | 48% |
| AI / LLM mention (as tool or risk) | 12/27 | 44% |
| Analytical / problem-solving | 12/27 | 44% |
| Any certification named/preferred | 12/27 | 44% |
| Cloud (AWS / Azure / GCP / M365) | 11/27 | 41% |
| MITRE ATT&CK | 11/27 | 41% |

**mssp-consulting** (N=19)

| Skill | n/N | % |
|-------|-----|---|
| SIEM (generic) | 15/19 | 79% |
| Any certification named/preferred | 13/19 | 68% |
| Alert triage / investigation | 11/19 | 58% |
| Cloud (AWS / Azure / GCP / M365) | 11/19 | 58% |
| Incident response (process / lifecycle) | 11/19 | 58% |
| Microsoft Sentinel / KQL | 11/19 | 58% |
| Reporting / documentation | 11/19 | 58% |
| Threat hunting | 11/19 | 58% |
| Analytical / problem-solving | 10/19 | 53% |
| EDR / XDR / endpoint security | 9/19 | 47% |
| Splunk / SPL | 9/19 | 47% |
| Alert tuning / false-positive reduction | 8/19 | 42% |
| Detection content / rules / use cases (Sigma, YARA, detection-as-code) | 8/19 | 42% |
| English proficiency stated | 8/19 | 42% |
| Microsoft SC-200 / SC-xxx | 8/19 | 42% |

**other** (N=9)

| Skill | n/N | % |
|-------|-----|---|
| Alert triage / investigation | 9/9 | 100% |
| Escalation | 9/9 | 100% |
| Incident response (process / lifecycle) | 9/9 | 100% |
| Playbooks / runbooks / SOPs | 9/9 | 100% |
| Reporting / documentation | 9/9 | 100% |
| Communication skills | 7/9 | 78% |
| Stakeholder / customer communication | 7/9 | 78% |
| Teamwork / collaboration | 7/9 | 78% |
| Alert tuning / false-positive reduction | 6/9 | 67% |
| Detection content / rules / use cases (Sigma, YARA, detection-as-code) | 6/9 | 67% |
| Root cause analysis | 6/9 | 67% |
| SIEM (generic) | 6/9 | 67% |
| Years of experience stated | 6/9 | 67% |
| 24/7 shifts / on-call | 5/9 | 56% |
| Analytical / problem-solving | 5/9 | 56% |

### 3.3 Ce diferă între sectoare (interpretare; N mic — direcționale, nu statistice)

- **finance (N=14)** — mai frecvent decât în restul: reglementare/sector (DORA, PCI, NYDFS, regulatori: 57 % vs 15 %), compliance/audit/risc (57 % vs ~20 %), **Microsoft Sentinel/KQL** (64 % vs 29 %), **Splunk** (50 % vs 24 %), GDPR/protecția datelor (29 % vs 7 %), CISSP/CISM (29 % vs 7 %), ISO 27001 (29 % vs 9 %), comunicare cu stakeholderi (64 % vs 44 %), incident response ca proces (93 %). Mai rar: threat intel (21 % vs 44 %), tuning/runbook-uri (29 % vs 49 %), EDR (21 % vs 40 %). Observație: **evaluarea impactului financiar/reputațional/de client/de piață/regulator** apare explicit doar la Deutsche Bank (`db01` DLM, `db04` IR manager) — este elementul cel mai clar *specific bancar*. DORA apare doar la Bitpanda (fintech/crypto, Austria); NIS2 doar la Siemens Energy (OT).
- **tech-vendor (N=27)** — mai frecvent: **scripting/coding** (Python, PowerShell: 56 % vs 31 %), vulnerability management (33 % vs 10 %), **threat intelligence** (52 % vs 31 %), **AI/LLM în context de securitate** (44 % vs 24 %), malware analysis (37 % vs 24 %). Mult mai rar: SIEM generic (48 % vs 76 %), Sentinel (11 % vs 52 %), Splunk (7 % vs 43 %), certificări Microsoft (0 % vs 26 %), engleza ca cerință explicită (11 %): vendorii își folosesc propriile platforme/pipeline-uri (detection-as-code, Git/CI) și cer inginerie, nu operare de SIEM terț. Detection engineering (rule content / detection-as-code / tuning) e concentrat aici (Cribl, Zscaler, Wiz, Expel).
- **mssp-consulting (N=19)** — mai frecvent: **SC-200/certificări Microsoft** (42 % vs 6 %), Sentinel (58 % vs 28 %), Splunk (47 % vs 22 %), SIEM (79 % vs 60 %), orice certificare (68 % vs 48 %), threat hunting (58 % vs 40 %), limbi străine (26 %: olandeză, franceză, spaniolă, italiană, suedeză). Mai rar: reglementare (5 %), compliance (11 %), IR formal (58 % vs 86 %).
- **other (N=9: 8 corporate SOC din România — Booking ×4, Continental, Siemens Energy ×2, VOIS — + `isr01` SUA)** — foarte frecvent: **escaladare, runbook-uri/SOP, RCA, raportare, NIST/ISO** (100 % / 100 % / 67 % / 100 % / 44 %): JD-urile lor sunt cele mai „procedurale”. N=9, interpretare cu rezervă.
- **Pe familii de rol** (N mici; vezi §3.4): DLP/DLM → forensic/metadata + reguli de detecție (4–5/5), certificări (5/5), zero shift-uri; threat hunting/intel → CTI 5/5; detection engineering → scripting 67 %, Sentinel 58 %; SOC → triage 86 %, certificări 61 %.

### 3.4 Frecvențe pe familie de rol (skill-uri selectate)

| Skill | SOC (L1/L2/L3, monitoring) (N=28) | Incident response / DFIR (N=19) | Detection engineering / SIEM engineering (N=12) | DLP / DLM / insider risk (N=5) | Threat hunting / threat intel (N=5) |
|---|---|---|---|---|---|
| SIEM (generic) | 21/28 (75%) | 10/19 (53%) | 9/12 (75%) | 3/5 (60%) | 2/5 (40%) |
| Splunk / SPL | 10/28 (36%) | 4/19 (21%) | 3/12 (25%) | 1/5 (20%) | 2/5 (40%) |
| Microsoft Sentinel / KQL | 11/28 (39%) | 3/19 (16%) | 7/12 (58%) | 3/5 (60%) | 1/5 (20%) |
| EDR / XDR / endpoint security | 12/28 (43%) | 7/19 (37%) | 3/12 (25%) | 1/5 (20%) | 2/5 (40%) |
| SOAR / security automation | 10/28 (36%) | 7/19 (37%) | 5/12 (42%) | 1/5 (20%) | 1/5 (20%) |
| DLP (tools or concepts) | 2/28 (7%) | 0/19 (0%) | 0/12 (0%) | 4/5 (80%) | 0/5 (0%) |
| Scripting / coding (Python, PowerShell, Bash) | 10/28 (36%) | 6/19 (32%) | 8/12 (67%) | 2/5 (40%) | 2/5 (40%) |
| Detection content / rules / use cases (Sigma, YARA, detection-as-code) | 10/28 (36%) | 8/19 (42%) | 7/12 (58%) | 4/5 (80%) | 1/5 (20%) |
| Threat intelligence (CTI / IOC) | 12/28 (43%) | 7/19 (37%) | 3/12 (25%) | 0/5 (0%) | 5/5 (100%) |
| Digital forensics (disk/memory/artifacts) | 11/28 (39%) | 11/19 (58%) | 2/12 (17%) | 4/5 (80%) | 0/5 (0%) |
| Any certification named/preferred | 17/28 (61%) | 9/19 (47%) | 4/12 (33%) | 5/5 (100%) | 2/5 (40%) |
| 24/7 shifts / on-call | 11/28 (39%) | 10/19 (53%) | 4/12 (33%) | 0/5 (0%) | 1/5 (20%) |
| Incident response (process / lifecycle) | 22/28 (79%) | 19/19 (100%) | 6/12 (50%) | 3/5 (60%) | 4/5 (80%) |
| Alert triage / investigation | 24/28 (86%) | 15/19 (79%) | 6/12 (50%) | 4/5 (80%) | 5/5 (100%) |

### 3.5 Analiză țintită: rolurile DLP / DLM / insider risk (N = 5, prea mic pentru procente)

**Referință — `db01` Deutsche Bank, Data Leakage Monitoring Analyst, Bucharest (ISTO – DLM), publicat 2026-09-29, hibrid cu 40 % remote.** Parafrazat:

- *Misiune*: analistul acționează prompt asupra evenimentelor și incidentelor de data leakage, decide cursul de acțiune pentru containment și mitigare rapidă și se asigură că toți pașii procesului DLM al băncii (evaluarea impactului, managementul consecințelor) sunt aplicați la timp și documentați; participă și la îmbunătățirea proceselor, uneltelor și raportării și la proiectele mai largi ISTO.
- *Responsabilități*: monitorizarea și analiza activităților cu date pentru a detecta transferuri neautorizate; folosirea metadatelor logate de soluțiile DLP pentru incident management și investigații forensice; containment și răspuns la timp; documentarea incidentelor și **handover** către alți colegi din ISTO; raportare către stakeholderi și escaladare; sprijin la evaluarea impactului **financiar, reputațional, de client, de piață sau de regulator**; contribuție la îmbunătățirea procesului DLM și la **tuning-ul regulilor de detecție**.
- *Cerințe*: engleză fluentă; comunicare foarte bună; decizii rapide și independență; cunoștințe despre standarde și bune practici de protecția datelor; înțelegere a SIEM și a uneltelor de detecție, „ideal Splunk, McAfee, Symantec, Microsoft Sentinel și Purview”; **≥ 18 luni** într-o poziție similară sau fundal de incident management / SOC; familiaritate cu MITRE ATT&CK; mediu internațional.
- *Plus*: licență în cybersecurity/IT; CISSP, CISM, GCIH sau echivalent; limbi străine (în special germana). Include și cerința generică de „utilizare responsabilă a uneltelor AI” (apare și în alte JD-uri DB, deci este boilerplate de angajator, nu cerință SOC) [verifică dacă merită un domeniu].

**Celelalte 4 JD-uri DLP/insider (deschise):**

| id | Rol | Ce cere în plus față de `db01` (parafrazat) |
|----|-----|---------------------------------------------|
| `pw01` PwC Praga | Data Security Engineer (Purview, DSPM, DLP) | proiectare/implementare/operare controale pe M365, endpoint, cloud, SaaS și „medii AI”; discovery și clasificare de date sensibile; DSPM (Cyera, Varonis, BigID); IRM; traducerea cerințelor de business/compliance în politici DLP; Sentinel/Defender/Entra ca plus; certificări Microsoft SC-100/200/300/401; consultanță (comunicare cu stakeholderi) |
| `hp267997` Levi9 (client: ABN AMRO Clearing), Iași | DLP Specialist (Microsoft Purview) | **5+ ani Purview** (DLP, Information Protection, IRM); preia un setup DLP existent și îl rulează BAU; **policy tuning și reducere false positives**; alert triage, escalare și remediere; auto-labeling, sensitivity labels, MPIP; suport audit și activități de reglementare; training/awareness |
| `zs01` Zscaler (SUA, remote) | Insider Risk Security Engineer | investigații pe endpoint și activitate de utilizator cu EDR/XDR, UEBA și SIEM; timeline-uri factuale; playbook-uri de investigație insider; lucru cu HR și Legal; certificări forensics (GCFA/GCFE) apreciate |
| `isr01` InterSources (SUA/remote) [rezumat WebFetch] | Data Security Specialist | Purview DLP + Information Protection + Insider Risk + eDiscovery; **DLP pentru GenAI** (Copilot, blocare servicii AI prin CASB/SSE, inspecție prompt/răspuns); GDPR/NYDFS/SOC 2/ISO 27001; PowerShell/Python/KQL; certificări SC-400, CISSP, CIPP, CCSP |

**Concluzii (cu rezerva N mic):** (1) Microsoft Purview e numit în 5 din cele 69 de JD-uri (`db01`, `pw01`, `hp267997`, `isr01`, `mc03`); Symantec/McAfee în 2 (`db01`, `isr01`) — deci „Purview ca default” din CONTEXTi §9 e susținut slab dar fără contra-dovezi; DB nu se limitează la Purview (listează 5 platforme). (2) *Tuning* și *false positives* sunt cerute explicit în 2 din 3 roluri DLP operaționale (`db01`, `hp267997`). (3) Rolurile DLP „operaționale” (DB, Levi9) cer 18 luni – 5 ani; rolurile de inginerie/consultanță (PwC) cer mai ales conceptele de clasificare/DSPM. (4) *Insider risk* și *DLP pentru AI* apar în JD-urile din 2026 (`zs01`, `isr01`, `pw01`) — legătura cu domeniul „AI” din §4 este reală, dar în 3 JD-uri.

## 4. Mapare skill → domeniu din CONTEXTi §4

`Ponderea v1` = ponderea din CONTEXTi §4. `Layer` = L1 triage, L2 investigation/DLM, L3 IR lead/forensics, Eng = engineering, Gov = governance/risk. Coloana „Acoperire / observație” compară cu frecvența din §3.1.

| Skill (JD) | Frecv. | Domeniu(i) CONTEXTi §4 | Layer | Observație |
|------------|--------|------------------------|-------|------------|
| Incident response (proces/ciclu), escaladare, RCA, post-incident review | 78 % / 41 % / 20 % / 28 % | Incident Response (18 %) | L1–L3 | IR e cel mai cerut skill; subtopicuri RCA și lessons learned apar în ~1/4 din JD-uri → întrebări de tip „ordonare pași” |
| Alert triage / investigation | 78 % | Incident Response; DLP (triaj DLM); SIEM | L1–L2 | cerut aproape peste tot; baza întrebărilor L1 |
| SIEM (generic), Splunk/SPL, Sentinel/KQL, alte query-uri, QRadar/Elastic/Google SecOps | 65 % / 29 % / 36 % / 25 % | SIEM (12 %) | L1–Eng | Sentinel > Splunk > Elastic > QRadar în eșantion; distribuția pe sector diferă mult (finance/MSSP: Sentinel+Splunk; vendorii: alt tooling) → exemplele de query în ambele limbaje |
| Detection content / rules / use cases (Sigma, YARA, detection-as-code); tuning / false positives | 43 % / 45 % | SIEM (Sigma, use-case management, alert fatigue); DLP (false positives & tuning) | Eng / L2 | Sigma apare explicit doar în 3 JD-uri, YARA în 1 — conceptul „detection logic/use case” e mult mai frecvent decât numele formatului |
| MITRE ATT&CK, kill chain, TTP | 35 % | SIEM (MITRE mapping); Fundamente | L1–Eng | cerut mai ales la MSSP/vendori; DB `db01` îl cere explicit |
| SOAR / automatizare, playbook-uri/runbook-uri, ticketing | 35 % / 45 % / 13 % | SOAR (8 %); IR | L1–Eng | playbook/runbook mai frecvent decât „SOAR” ca produs; tool-uri SOAR nominalizate rar (Tines, XSOAR în 2 JD-uri) |
| Metrici / KPI / MTTD-MTTR / SLA | 13 % | SOAR | L2–Gov | rar; ponderea mică din plan este justificată |
| DLP, vendor DLP (Purview/Symantec/McAfee/Forcepoint/Netskope), insider risk, clasificare/labeling | 9 % / 9 % / 7 % / 7 % (80 % în rolurile DLP) | DLP/DLM (20 %) | L1–L2–Eng | **cel mai subreprezentat față de pondere în eșantionul general** — vezi §3.5 și §6 |
| CASB / SSE / proxy | 1 % | DLP; Cloud security | — | aproape absent din JD-uri; apare ca tool DLP în `isr01` |
| EDR/XDR | 36 % | IR; SIEM | L1–L3 | endpoint telemetry e asumat; EDR specific (CrowdStrike/Defender/SentinelOne) apare ca „plus” |
| Digital forensics (disk/memory/artefacte), chain of custody | 41 % | Windows forensics (10 %); Linux forensics (7 %); Network forensics (10 %) | L3 | menționat generic; **unelte forensice numite (EnCase, X-Ways, Volatility, KAPE, Velociraptor) apar în 1 JD** → întrebările pe artefacte (Prefetch, ShimCache, USBSTOR) sunt „L3/advanced”, nu cerere de piață pentru L1–L2 |
| Windows / Linux / macOS fundamentals; Active Directory/Entra/IAM | 38 % / 19 % | Fundamente (3 %); Windows/Linux forensics; Cloud (identitate) | L1–L2 | OS-fundamentals cerute mai des decât artefactele |
| Network analysis (PCAP/Wireshark/Zeek/NDR/NetFlow); firewall/IDS/IPS/WAF | 17 % / 23 % | Network forensics (10 %); Fundamente | L2–L3 | Wireshark apare în 2 JD-uri (Bitdefender); rar |
| Cloud (AWS/Azure/GCP/M365) | 52 % | Cloud security (8 %) | L1–Eng | peste jumătate din JD-uri menționează cloud — ponderea de 8 % poate fi mică [verifică; posibil umflat]; log-uri cloud numite (CloudTrail, Unified Audit Log) în 1 JD |
| Threat hunting; threat intelligence (CTI/IOC) | 45 % / 39 % | SIEM; Incident Response; Fundamente (threat intel) | L2–L3 | frecvente (tech-vendor 52 % CTI); aplicația le acoperă doar la „Fundamente 3 %” |
| Malware analysis / sandbox | 29 % | Windows forensics; IR | L2–L3 | subtopic lipsă din §4 (nu e menționat explicit) [observație] |
| Scripting (Python/PowerShell/Bash) | 41 % | SIEM; SOAR (layer Engineering) | Eng | cerut mai ales la tech-vendor (56 %) vs RO (24 %) |
| Email/phishing analysis | 12 % | SIEM / IR; Fundamente | L1 | rar în eșantion; mai frecvent în JD-uri MSSP L1/L2 |
| AI / LLM (în context de securitate: ca tool în SOC sau ca risc) | 32 % | AI în SOC și riscuri AI (4 %) | Eng / Gov | 32 % din JD-uri menționează AI în context relevant; ponderea 4 % din plan pare mică vs. cerere, dar mențiunile sunt de obicei „plus”/boilerplate [verifică] |
| GDPR/protecția datelor; ISO 27001; NIST; reglementare sector (DORA/NIS2/PCI/NYDFS) ; compliance/audit | 12 % / 13 % / 9 % / 23 % / 28 % | DLP (GDPR/DORA/NIS2); IR (notificare 72 h, NIST 800-61, ISO 27035); Gov layer | Gov | **notificarea de 72 h GDPR, NIST 800-61, DORA și NIS2 aproape nu apar în JD-uri** (0 / 0 / 2 / 2 JD-uri) — sunt cunoștințe așteptate la interviu, nu cerințe scrise [verifică în R4] |
| Raportare/documentare; comunicare cu stakeholderi; escaladare | 70 % / 48 % / 41 % | IR; DLP (raportare către stakeholderi; handover ISTO) | L2–Gov | foarte frecvente → tip „open question” / scenarii de comunicare |
| Insider threat / insider risk | 7 % (4 din cele 5 JD-uri DLP/insider + `mc03`) | DLP | L2 | puțin în total, dar central în rolurile DLP/insider |
| Shifturi 24/7, on-call | 38 % | — (context profesional) | L1 | util pentru modul „scenarii” (handover, escaladare nocturnă); nu e domeniu |
| Certificări: GIAC (GCIH 14 JD-uri), CompTIA, SC-200, CISSP/CISM, CEH/OSCP | 54 % (oricare) | → R4 (interviu și certificări) | — | GCIH e cea mai numită certificare (14/69); aproape mereu „preferat” |
| Experiență (ani), diplomă, engleză, limbi străine, clearance | 46 % / 32 % / 28 % / 17 % / 4 % | — (meta) | — | nu se transformă în întrebări; informează „cum apare la interviu” |

## 5. 30 de întrebări de interviu (doar idei, pornind de la cerințele din JD-uri; nu sunt în schema JSON)

Fiecare idee are între paranteze sursa cerinței (id JD din §2.1). Ordinea: DLP/DLM, SIEM/detecție, IR/SOC, forensics/rețea, cloud/AI, reglementare/raportare, comportamentale.

**DLP / Data Leakage Monitoring**
1. Un utilizator din Finance a trimis un XLSX cu IBAN-uri către un domeniu @gmail.com. Ce metadate din alerta DLP verifici înainte să iei orice decizie de containment? (`db01`: metadate DLP pentru incident management)
2. Cum distingi un false positive de un incident real într-o alertă DLP și ce modifici în regulă după ce o închizi ca FP? (`db01`, `hp267997`: tuning, reducere false positives)
3. Ce intră într-o evaluare de impact pentru un incident de data leakage — cum separi impactul financiar, reputațional, de client, de piață și de regulator? (`db01`)
4. Cum documentezi un incident DLM și ce trebuie să conțină un handover către echipa de threat operations la sfârșitul turei? (`db01`: documentare și handover)
5. Care sunt canalele clasice de exfiltrare monitorizate de DLP (email, web upload, USB, print, cloud sync) și pe care dintre ele se poate depăși DLP-ul endpoint-only? (`pw01`, `hp267997`)
6. Ce înseamnă clasificarea datelor și sensitivity labels și cum influențează o politică DLP? Ce e diferența dintre pattern matching și EDM/fingerprinting? (`pw01`, `hp267997`)
7. Un angajat care pleacă din firmă a descărcat 5.000 de fișiere din SharePoint în 2 zile; cum investighezi, cu ce surse de date și cu ce limite legale/HR? (`zs01`: insider risk, colaborare cu HR și Legal)

**SIEM / detecție**
8. Cum ai ajusta o regulă care generează 200 de alerte/zi, din care 195 sunt FP, fără să pierzi detecția reală? (`hp269209`: tune alerts; `bp02`: reducere zgomot)
9. Scrie sau explică un query (KQL sau SPL) care găsește un utilizator cu mai multe autentificări eșuate urmate de una reușită într-un interval scurt. (`bv01`, `nt02`: KQL/SPL, SIEM hands-on)
10. Ce diferență există între o regulă bazată pe semnătură/IOC și una bazată pe comportament (TTP)? Dă un exemplu mapat pe MITRE ATT&CK. (`db01`, `ac03`, `cr01`)
11. Cum testezi și versionezi reguli de detecție (detection-as-code, Sigma, CI)? Ce e un use case de detecție și cum îi măsori acoperirea? (`cr01`, `ex01`, `bp02`)
12. Ce surse de log ai onboarda primele pentru un SOC nou (identitate, endpoint, email, firewall/proxy, cloud) și de ce în ordinea aceasta? (`bv01`, `db03`)
13. Cum decizi ce se automatizează într-un playbook SOAR și ce rămâne cu „human in the loop”? Dă un exemplu de enrichment automatizat. (`nt02`, `tw01`, `ti01`)

**SOC / Incident Response**
14. Parcurge ciclul de viață al unui incident (preparare → detecție/analiză → containment/eradicare/recuperare → lecții învățate). Unde se oprește rolul unui analist L1/L2 și unde preia IR lead? (`nt01`, `nt02`, `db04`)
15. Ai o alertă EDR de execuție de PowerShell codat pe un laptop de Finance la 23:40. Care sunt primii 5 pași în ordine? (`bd01`, `hp272617`)
16. Cum decizi între izolarea unui endpoint și monitorizarea suplimentară, când sistemul e critic pentru business? (`bv01`, `mc04`)
17. Când escaladezi la L3 / incident commander și ce informații minime trebuie să conțină escaladarea? (`bd03`, `oc03`, `hp269209`)
18. Cum faci un root cause analysis după un incident de phishing reușit și ce schimbări propui în detecție/proces? (`hp272617`, `hp272220`)
19. Cum prioritizezi 40 de alerte din coadă când ai 15 minute înainte de handover? (`bv01`, `hp271941`)
20. Ce este tipping off și de ce nu suni utilizatorul imediat într-o investigație insider? Cum colaborezi cu HR și Legal? (`zs01`: colaborare cu HR/Legal în investigații insider)

**Forensics / rețea**
21. Ordinea de volatilitate a probelor și cum păstrezi chain of custody pentru un laptop și pentru log-uri cloud. (`oc02`, `bd03`, `cs01`)
22. Ce artefacte Windows arată că un stick USB a fost conectat și ce fișiere au fost copiate? (`oc02`, `hp272220`; GCFA/GCFE sunt certificări preferate)
23. Într-un PCAP vezi interogări DNS cu subdomenii lungi, aleatoare, către un singur domeniu. Ce ipoteze formulezi și ce verifici? (`bd01`, `bd02`: analiză de pachete)
24. Ce diferențe există între logurile de proxy și cele de firewall în investigarea exfiltrării, și ce nu vede niciunul dintre ele? (`bv01`: network metadata)

**Cloud / AI**
25. Cum faci containment pe un cont cloud compromis când nu ai acces la mașină (revocare token, rotire chei, restricționare sharing)? (`db03`, `wz01`, `ti01`)
26. Un angajat lipește cod și date de clienți într-un asistent AI public. Ce detectezi, cum răspunzi și când blochezi complet serviciul vs. permiți cu DLP inline? (`isr01`, `pw01`)
27. Cum ai folosi un asistent AI pentru sumarizarea alertelor și cum validezi rezultatul înainte să acționezi? (clauză de „utilizare responsabilă AI” din JD-urile DB: `db01`, `db05`)

**Reglementare, raportare, comportamental**
28. Ce obligații de notificare apar când un incident implică date personale (GDPR) și cine din organizație decide? Cum raportezi către management un incident de leakage? (`db01`; reglementarea rar scrisă în JD → [verifică la interviu])
29. Povestește un incident în care ai greșit o evaluare de severitate. Ce ai schimbat în proces după? (`db01`: decizii rapide și independență; `mc04`: lead incident bridges sub presiune)
30. Cum îți actualizezi cunoștințele (CTI, MITRE, blog-uri DFIR) și ce certificare ai urmări următoarea (GCIH, SC-200, CySA+, CISSP) și de ce? (certificări preferate în `db01`, `bv01`, `hp269209`)

## 6. Dezacorduri (contradicții între surse și între sursă și plan)

1. **Titlu ≠ conținut.** La Deutsche Bank Bucharest titlul „Information Security Analyst (f/m/x)” acoperă trei roluri diferite: `db03` (threat operations, SIEM/SOAR cloud — numărat), `db02` (third-party risk — exclus) și, la Frankfurt, `db06` (audit IAM — exclus). Similar, `cs04` e „Security Engineer” în titlu dar „Incident Response Analyst II” în URL. Frecvențele nu pot fi estimate din titluri; am citit conținutul.
2. **Snippet de căutare vs. pagină.** Rezumatele WebSearch au descris ca deschise sau cu cerințe concrete pagini care, la deschidere, erau închise sau goale: Vodafone DLP Junior Analyst (snippet cu cerințe 1–3 ani/English B2 → pagina: „filled”, fără cerințe), Orange Cyberdefense SOC Analyst (410), Swedbank, Halian, Worldline ×7, ING Bucharest, Barclays (404/410/„not available”). Am numărat **numai** ce s-a deschis efectiv. Același tip de rezumat (WebFetch) este folosit și pentru `nt01`, `nt02`, `bv01`, `isr01` — formulările sunt ale tool-ului, nu ale JD-ului [verifică].
3. **Platforma „default” din CONTEXTi §9 (Sentinel + Purview) vs. date.** Sentinel/KQL apare în 25/69 (36 %), Splunk în 20/69 (29 %), Elastic ≥ 4 JD-uri, QRadar ≥ 4, Google SecOps în `db03` (nu Sentinel!). Rolul DLM al DB listează 5 platforme (Splunk, McAfee, Symantec, Sentinel, Purview). Purview e numit în doar 5 JD-uri. Datele susțin „vendor-neutru în întrebare, exemple Sentinel/Splunk în explicație”; „Purview ca DLP default” e susținut slab (N=5).
4. **Ponderea DLP 20 % (CONTEXTi §4) vs. 9 % în eșantion.** Contradicție de **eșantionare**, nu de piață: am căutat roluri din 6 familii iar DLP a fost găsit mai greu (rolurile DLP din Polonia, la agenții, au dat 403; Vodafone/Jit Team/Eames/SG închise). Conform §3.5, rolurile DLP deschise sunt puține în RO/UE în Oct 2026. Nu pot confirma că piața cere DLP „20 %” — pentru candidatul-țintă (DB DLM) ponderea e justificată de JD-ul de referință, nu de frecvența globală.
5. **Reglementare în plan vs. JD-uri.** CONTEXTi pune GDPR/DORA/NIS2 și „72 h” în DLP/IR; în JD-uri: „72 h” apare în 0, DORA în 2 (Bitpanda; + `db02` exclus), NIS2 în 2 (Siemens Energy, OT), GDPR/protecția datelor în 8/69. Singurul element „bancar” repetat și clar este **evaluarea impactului financiar/reputațional/de client/de piață/de regulator** (DB). Reglementarea este deci mai degrabă un subiect de interviu așteptat decât un skill scris în anunț [verifică în R4/R3].
6. **Experiența cerută pentru „același nivel”.** DLM analyst DB: ≥ 18 luni; Mastercard SOC Analyst II: ≥ 2 ani; NTT L2: 2–4 ani; BlueVoyant L2: 3+ ani preferat; Levi9 SOC L2: 3–5 ani; Levi9 DLP Specialist: 5+ ani; Bitdefender „Associate”: fără ani. Nu există o definiție unică L1/L2/L3 între angajatori (în NTT L1 = „strong interest in cyber”, în Bitdefender „Associate” = MDR L1) — layer-ele din CONTEXTi §4 sunt o normalizare, nu o terminologie de piață.
7. **Certificări „must-have” vs. „preferate”.** 54 % din JD-uri numesc o certificare, dar cvasi-totalitatea o dau ca preferată („Always a plus” la DB; „nu sunt necesare certificări” la NTT L1; „highly preferred” la Fortinet; practic niciunul nu le condiționează angajarea). Pragul > 50 % nu înseamnă obligatoriu.
8. **Scripting: „toți cer Python” vs. România.** Python/PowerShell apare în 41 % din JD-uri total, dar 56 % la tech-vendor și 24 % în RO (RO+UE 29 %). JD-urile SOC din RO (Booking, Continental, DB, ING) cer mai mult proces, escaladare și runbook-uri decât cod.
9. **Date de publicare nesigure.** Greenhouse `updated_at` ≠ data publicării (`wz02` apare cu 2025-06-08, `bp02` cu 2025-10-28 și sunt încă pe board-ul public); hipo.ro afișează „Updated at = data accesării” pentru toate paginile; Workday `startDate` e folosit unde există. Nu pot afirma că un JD a fost publicat recent doar din dată.
10. **Adobe / Fortinet „au JD-uri de security” vs. ce era deschis.** Utilizatorul a văzut JD-uri la acești angajatori; la 2026-10-23 am găsit la Adobe 2 roluri relevante (SecOps manager Noida, TI/RE investigator San Jose) și la Fortinet 4 (SOC Analyst și Threat Hunting Specialist în Burnaby CA, Security Operations Expert în Sunnyvale, IR Analyst în Tel Aviv) — **niciunul în UE**; la CrowdStrike și Bitdefender există roluri în București (IR analyst, MDR analysts, IR manager). Rolurile de vânzări/presales de la Fortinet în UE (Systems Engineer SecOps etc.) nu sunt SOC și au fost excluse.
11. **Piața RO: absență vs. existență.** CERT-uri și SOC-uri interne există la BCR, Orange România și Worldline (confirmate de snippet-uri și registre de CSIRT, nu de JD-uri deschise); nu am găsit poziții SOC/IR deschise la BCR, BRD, Banca Transilvania, Orange România sau Worldline (pagini închise / negăsite) — **absența din eșantion nu înseamnă absența pe piață** (eJobs/BestJobs/LinkedIn nu au putut fi deschise).
12. **DFIR pur.** CONTEXTi cere „Digital forensics analyst”; în eșantion nu există niciun JD deschis dedicat în RO/UE. Singurele apropiate sunt IR cu componentă forensics (`cs01`, `oc02`, `bd03`, `hp272220`) și JD-ul PwC Budapesta „Forensic Tanácsadó” (exclus: forensics financiar/anti-fraudă, nu digital). Un rol numit „forensic” poate însemna lucruri total diferite (investigații de fraudă vs. analiză de artefacte).
13. **Boilerplate AI.** 32 % din JD-uri menționează AI în context relevant, dar o parte e o clauză generică a angajatorului („leverage AI tools…” la DB, pe toate rolurile); `isr01`/`pw01`/`zs01` sunt singurele cu AI ca subiect de securitate real (DLP pentru GenAI, AI security). Valoarea 32 % supraestimează cererea.
14. **Dubluri în sursă.** Bitdefender (2 postări identice), Continental (2 identice) arată că numărul de postări ≠ numărul de poziții; am numărat o dată JD-urile cu text identic, dar nu am putut verifica dacă mai există dubluri între aggregatori (hipo.ro) și paginile primare.

## 7. Limitări și reproductibilitate

- **Neimplementat din brief:** LinkedIn Jobs, Indeed, Glassdoor, eJobs, BestJobs nu au putut fi deschise (403/login/JS) și nu sunt numărate; Big4 prezent doar prin PwC (Praga, Franța), nu și Deloitte/KPMG/EY (EY și Deloitte închise/redirect).
- **Eșantion nealeatoriu:** s-a început de la ATS-uri accesibile și de la rezultatele unui motor de căutare US-only (WebSearch); angajatorii acoperiți nu sunt reprezentativi pentru piața RO. Eșantionul e tras spre SOC/IR (63 din 69) față de DLP (5).
- **Cifrele de frecvență sunt estimări regex** (vezi §1): verificate prin eșantionare, nu manual pe toate cele 69 × ~58 combinații. JD-urile în suedeză, italiană, franceză sunt subnumărate (tag doar pe termeni tehnici în engleză).
- **Textele JD nu sunt copiate** în acest fișier; copiile locale de lucru sunt în directorul de scratchpad al sesiunii (nu fac parte din proiect) [verifică dacă se dorește arhivarea lor].
- **Unelte folosite:** WebSearch/WebFetch pentru descoperire și 4 JD-uri; `curl`/Python (API-uri publice Workday, Greenhouse, Oracle HCM, pagina OCD, hipo.ro) pentru restul. Datele accesării: toate 2026-10-23.
