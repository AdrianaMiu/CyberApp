# R5 – Cloud și AI: scenarii de scurgere de date, politici DLP ale vendorilor pentru AI, verificarea Purview Audit

Agent A2 · acces la surse: **2026-10-23** (toate sursele marcate „deschis" au fost efectiv încărcate cu WebFetch în această dată, dacă nu scrie altfel) · limba: română, termenii tehnici în engleză. Nu suprascrie `02-scenarios.md`; scenariile de aici sunt **noi** (fără suprapunere cu S01–S24 / C01–C15; cazurile din 02 apar doar ca ancore sau trimiteri).

## 0. Cum se citește fișierul

Aceeași legendă ca în `02-scenarios.md`:

- **DOC** = scenariu documentat: faptele provin dintr-o sursă deschisă efectiv, citată la final. Ce nu spune sursa e marcat `[verifică]` sau *inferență*.
- **COMP** = scenariu compozit: construit de agent pe un tipar real. **Numele, cifrele, orele și valorile de log sunt ilustrative, nu fapte.** Fiecare COMP indică o „ancoră" documentată.
- **inferență** = ce ar fi contat într-un SIEM/DLP, dedus de agent; nu e afirmat de sursa incidentului.
- `[verifică]` = afirmație fără sursă deschisă efectiv (din snippet de căutare sau din memorie).
- **Câmpul `sector`** (CONTEXTi §9, runda 3): `finance | tech-vendor | mssp-consulting | general`. Un incident la un furnizor (Okta, CircleCI) este `tech-vendor`, chiar dacă clienții lui sunt bănci.
- Reddit: blocat, **nicio afirmație din acest fișier nu se sprijină pe Reddit**.
- Sursele de tip „vendor care raportează propriul incident" (Cloudflare, CircleCI, Okta, LastPass, Hugging Face) sunt **autoraportare**: cifrele de impact sunt ale vendorului, neverificate independent.

## 1. Sumar și numere

- **25 de scenarii**: **17 DOC** + **8 COMP**.
  - Cloud: **15** = 10 DOC (CL01–CL10) + 5 COMP (CL11–CL15).
  - AI (scurgere de date): **10** = 7 DOC (AI01–AI07) + 3 COMP (AI08–AI10).
- Sector (25 de scenarii): finance 6 (toate COMP: CL11–CL14, AI08, AI10), tech-vendor 9, mssp-consulting 3 (CL07, CL15, AI09), general 7. *Notă:* niciun incident **documentat** nou nu este strict financiar; partea financiară se acoperă prin COMP ancorate în cazuri financiare din `02-scenarios.md` (S02, S04, S08, S15) și în documentația Purview. Este o lacună onestă, nu o omisiune: incidentele cloud/AI cu sursă deschisă integrală și detalii de detecție/containment provin în mare parte de la furnizori tehnologici.
- **Politici DLP pentru AI** (secț. 4): Microsoft Purview (documentație extinsă, deschisă), Netskope (parțial: pagina AI Guardrails deschisă; politica DLP concretă doar dintr-un articol al unui angajat Netskope), Zscaler (parțial: portalul `help.zscaler.com` nu s-a redat; folosit blogul oficial și repo-ul oficial GitHub), Cloudflare One (ales ca al treilea; documentație deschisă).
- **Verificare Purview Audit** (secț. 3): toate cele cinci operații **confirmate**; retenția implicită confirmată și **diferă** de ce scrie CONTEXTi §7.

## 2. Tabel-index (pentru A4 – autorul de întrebări)

| ID | Titlu scurt | Tip | Sector | Canal | Domeniu (secț. 4 CONTEXTi) | Layer |
|---|---|---|---|---|---|---|
| CL01 | Credențiale nerotite după Okta → Atlassian (Cloudflare, 2023) | DOC | tech-vendor | service tokens/accounts | Cloud, IR, SIEM | L2/L3, Eng |
| CL02 | Cookie SSO furat → secrete de clienți (CircleCI, 2022–23) | DOC | tech-vendor | CI/CD, sesiune | Cloud, IR | L3, Eng |
| CL03 | Fișiere HAR cu session tokens în suportul Okta (2023) | DOC | tech-vendor | SaaS support, sesiune | Cloud, IR, SIEM | L2/L3 |
| CL04 | Token-uri forjate pe Exchange Online (Storm-0558, 2023) | DOC | general | identitate/token | Cloud, SIEM | L3, Gov |
| CL05 | Backup-uri în cloud storage (LastPass, 2022) | DOC | tech-vendor | cloud backup | Cloud, IR | L3, Gov |
| CL06 | Vishing → connected app Salesforce (UNC6040, 2025) | DOC | general | SaaS/OAuth | Cloud, SIEM | L2/L3 |
| CL07 | Patru bucket-uri S3 publice la un consultant (Accenture, 2017) | DOC | mssp-consulting | S3 public | Cloud, IR | L2, Gov |
| CL08 | GitHub Action compromis → secrete în log-uri (tj-actions, 2025) | DOC | general | CI/CD | Cloud | Eng, L2 |
| CL09 | Exfiltrare din Azure Storage + ransomware cloud (Storm-0501, 2025) | DOC | general | Azure control plane | Cloud, SIEM | L3, Eng |
| CL10 | Credențiale GitHub → backup S3 (Uber, 2016) | DOC | general | GitHub + S3 | Cloud, IR | L3, Gov |
| CL11 | Plecare: OneDrive sync client, FileSyncDownloadedFull | COMP | finance | SharePoint/OneDrive | DLP, Cloud | L2 |
| CL12 | Link „Anyone" pe folder KYC (AnonymousLinkCreated/Used) | COMP | finance | SharePoint/OneDrive | Cloud, DLP, IR | L1/L2 |
| CL13 | S3 cu GetObject suspect, dar fără data events | COMP | finance | AWS S3/CloudTrail | Cloud, SIEM, IR | L2/L3 |
| CL14 | Cheie de service account GCP expusă, Data Access logs oprite | COMP | finance | GCP | Cloud, SIEM | L2/L3 |
| CL15 | MSSP: credențiale de admin delegat furate → tenant bancă | COMP | mssp-consulting | admin delegat/partener | Cloud, IR, Gov | L3, Gov |
| AI01 | Prompt injection în Slack AI (PromptArmor, 2024) | DOC | tech-vendor | AI asistent SaaS | AI, DLP | Eng |
| AI02 | Linkuri de share ChatGPT/Grok indexate de motoare de căutare (2025) | DOC | general | AI share link | AI, DLP | L2, Gov |
| AI03 | Secrete Hugging Face Spaces accesate (2024) | DOC | tech-vendor | platformă AI | AI, Cloud, IR | L2/L3 |
| AI04 | Server MCP Asana: expunere între organizații (2025) | DOC | tech-vendor | MCP/agenți | AI, Cloud, IR | L2, Gov |
| AI05 | ForcedLeak în Agentforce (2025) | DOC | tech-vendor | agent CRM | AI, DLP | Eng |
| AI06 | CamoLeak în GitHub Copilot Chat (2025) | DOC | tech-vendor | agent cod | AI | Eng |
| AI07 | Extensie de browser care colectează conversațiile AI (Urban VPN, 2025) | DOC | general | extensie browser | AI, DLP, Network | L2, Eng |
| AI08 | Analist financiar lipește IBAN-uri în ChatGPT personal | COMP | finance | AI paste | AI, DLP | L1/L2 |
| AI09 | Consultant folosește un AI notetaker în ședința clientului | COMP | mssp-consulting | AI SaaS | AI, DLP, Gov | L2, Gov |
| AI10 | Copilot intern cu acces CRM exfiltrează prin imagine randată | COMP | finance | agent/RAG | AI, DLP | Eng |

---

## 3. Verificare din documentația Microsoft Purview Audit (punctul 3)

**Metodă.** Pagina `audit-log-activities` are ~289 500 caractere; WebFetch o livrează în felii. Am citit feliile 0–100 000, 100 000–200 000 și 150 000–250 000 (ultimele ~39 500 caractere, 250 000+, nu au fost citite; nu conțin secțiunile de interes, care sunt în felia 0–250 000). Rândurile de tabel de mai jos au fost cerute *verbatim* și coincid între două citiri independente. Pagina Learn: `ms.date 2026-10-15`, `updated_at 2026-10-19`.

URL principal: https://learn.microsoft.com/en-us/purview/audit-log-activities · Complementar (explică logica): https://learn.microsoft.com/en-us/purview/audit-log-sharing (ms.date 2026-06-19).

| Operație | Verdict | Secțiune în pagină | Sens (parafrazat) |
|---|---|---|---|
| `FileDownloaded` | **CONFIRMAT** | File and page activities („Downloaded file") | Un utilizator descarcă un document de pe un site (SharePoint/OneDrive) *prin browser/UI*. Nu menționează sync. |
| `FileAccessed` | **CONFIRMAT** | File and page activities („Accessed file") | Un utilizator sau un cont de sistem accesează un fișier. După un acces, același eveniment **nu se mai loghează 5 minute** pentru același utilizator și fișier. Eveniment înrudit: `FileAccessedExtended` (friendly name „(none)") – înregistrat când aceeași persoană accesează continuu un fișier până la **3 ore**, ca să reducă zgomotul. |
| `FileSyncDownloadedFull` | **CONFIRMAT** | Synchronization activities („Downloaded files to computer") | Utilizatorul a descărcat un fișier pe computer dintr-o bibliotecă SharePoint / OneDrive **prin aplicația de sincronizare OneDrive.exe**. Este alt eveniment decât `FileDownloaded`. Rândul vecin `FileSyncDownloadedPartial` este declarat *deprecated* (vechiul client Groove.exe). |
| `SharingSet` | **CONFIRMAT, dar cu sens mai îngust decât în CONTEXTi** | Sharing and access request activities („Shared file, folder, or site") | Un utilizator (membru sau guest) a partajat un fișier/folder/site cu **un utilizator din directorul organizației** (membru sau guest *care are deja cont în director*). Câmpul `Detail` spune cu cine și dacă e Member sau Guest. De obicei e însoțit de un al doilea eveniment (ex. `AddedToGroup`). |
| `AnonymousLinkCreated` | **CONFIRMAT** | Sharing and access request activities („Created an anonymous link") | Cineva a creat un link anonim („Anyone"): oricine îl are poate accesa resursa **fără autentificare**. |

**Operații vecine confirmate în aceeași pagină/ pagina de sharing:** `AnonymousLinkUsed` (un utilizator anonim a accesat resursa; identitatea poate fi necunoscută, dar apar detalii precum IP-ul), `SharingInvitationCreated` (resursă partajată cu un utilizator *care nu e în director*; `audit-log-sharing` precizează că se loghează doar când resursa e un **site**), `SecureLinkCreated` + `AddedToSecureLink` (link „specific people"; ținta apare în `TargetUserOrGroupName`), `CompanyLinkCreated` (link doar pentru membri, nu pentru guests), `SharingInvitationAccepted`.

**Consecințe pentru întrebări (inferență din documentație, de validat la review):**

1. `SharingSet` **nu** este semnalul „link public" și nici „partajare externă fără cont": pentru un destinatar fără cont în director, log-ul conține `AnonymousLinkCreated`, `SecureLinkCreated`/`AddedToSecureLink` sau `SharingInvitationCreated` (doar site). Filtrul recomandat de pagina `audit-log-sharing` pentru „partajat cu externi" combină aceste operații cu `TargetUserOrGroupType = Guest`.
2. Un mass download făcut prin **clientul OneDrive sync** apare ca `FileSyncDownloadedFull`, nu ca `FileDownloaded`: o căutare doar după `FileDownloaded` poate rata exfiltrarea (scenariul CL11).
3. `FileAccessed` este rate-limited (5 min per user+fișier) și are `FileAccessedExtended`: numărul de evenimente `FileAccessed` **nu** este un număr de fișiere distincte accesate.

**Retenția implicită a audit log-ului – CONFIRMAT** (surse: https://learn.microsoft.com/en-us/purview/audit-solutions-overview, `ms.date 2026-05-18`; https://learn.microsoft.com/en-us/purview/audit-log-retention-policies, `ms.date 2026-06-19`; ambele deschise integral):

| Element | Audit (Standard) | Audit (Premium) |
|---|---|---|
| Activat implicit | da | da |
| Retenție implicită | **180 de zile** pentru înregistrările generate de la **17 oct. 2023**; **90 de zile** pentru cele generate înainte | **1 an** pentru înregistrările cu `Workload` = AzureActiveDirectory, Exchange, OneDrive, SharePoint, **doar pentru utilizatori cu licență E5** (Office 365/Microsoft 365 E5, Purview Suite/E5 Compliance sau add-on E5 eDiscovery and Audit); **180 de zile** pentru toate celelalte workload-uri, pentru utilizatorii non-E5 și pentru guests |
| Politici de retenție custom | nu | da, până la 10 ani; 7 și 30 de zile cer E5; 3/5/7 ani cer și add-on „10-Year Audit Log Retention"; 10 ani la fel; max. 50 politici |
| Înregistrări ale entităților non-utilizator (service principal etc.) | – | retenție fixă de **1 an**, neconfigurabilă (notă de subsol în pagina de overview) |
| Acces Management Activity API | bandă de bază 2 000 cereri/min | aproximativ dublu la E5/A5/G5 |

Alte note documentate: durata de viață a unei înregistrări se fixează la momentul intrării în pipeline; schimbările de licență/politică nu se aplică retroactiv elementelor deja comise.

**Comparație cu CONTEXTi §7** („retenție limitată (90 de zile default la M365 fără E5)"): **depășit** pentru înregistrări generate după 17 oct. 2023 (acum 180 zile). Recomand rescrierea în „180 de zile la Audit Standard; 1 an la Audit Premium doar pentru utilizatorii E5, pentru Entra/Exchange/OneDrive/SharePoint". Vezi „Dezacorduri" #1.

**Legătură cu IR (secundar):** MailItemsAccessed a fost multă vreme o capacitate Audit Premium; un articol independent (office365itpros.com, 23 mai 2024, deschis) spune că Microsoft a început să livreze evenimentele `MailItemsAccessed` și `Send` către tenanții Audit Standard în mai–iun. 2024 și că, pentru Standard, administratorii trebuie să ruleze `Set-Mailbox` pe căsuțele cu configurare de audit personalizată. Acesta e un fapt dependent de dată și de configurare → `[verifică]` în documentația curentă înainte de a scrie o întrebare cu „Audit Standard are/nu are MailItemsAccessed".

---

## 4. Politici DLP / data security ale vendorilor pentru AI

**Regulă de lectură:** numele de politici/șabloane sunt scrise *exact* ca în pagina citată. Descrierile sunt parafrazate. Ce nu am putut citi din documentație oficială este marcat.

### 4.1 Microsoft Purview

**(a) DSPM for AI – politicile „one-click"** (pagina *classic*, `ms.date 2026-05-01`, `updated_at 2026-06-25`; pagina avertizează că versiunea classic a fost înlocuită de „Data Security Posture Management" nou, deci **numele pot dispărea sau se pot schimba**): https://learn.microsoft.com/en-us/purview/dspm-for-ai-considerations (+ overview https://learn.microsoft.com/en-us/purview/dspm-for-ai)

*Discovery (audit/colectare):*

| Politică (nume exact) | Tip / soluție | Ce detectează / face |
|---|---|---|
| `DSPM for AI: Detect sensitive info added to AI sites` | DLP | Descoperă conținut sensibil lipit sau încărcat pe site-uri AI din Edge, Chrome, Firefox; toți utilizatorii, **doar audit**. |
| `DSPM for AI - Detect when users visit AI sites` | Insider Risk Management | Detectează vizitele cu browserul pe site-uri AI. |
| `DSPM for AI - Detect risky AI usage` | IRM | Calculează riscul utilizatorului din prompturi și răspunsuri riscante în Microsoft 365 Copilot, agenți și alte aplicații AI generative. |
| `DSPM for AI - Unethical behavior in AI apps` | Communication Compliance | Detectează conținut sensibil/neetic în prompturi și răspunsuri; toți utilizatorii. |
| `DSPM for AI - Capture interactions for Copilot experiences` | Collection policy | Capturează prompturi și răspunsuri din Copilot în Fabric și Security Copilot (pentru eDiscovery, retenție). |
| `DSPM for AI - Detect sensitive info shared with AI via network` | Collection policy | Detectează informații sensibile trimise către aplicații AI din browsere, aplicații, API-uri, add-in-uri, **prin integrare SASE/SSE** adăugată manual; fără captură de conținut implicit. Detecția depinde de implementarea partenerului de rețea. |
| `DSPM for AI - Capture interactions for enterprise AI apps` | Collection policy | Capturează prompturi/răspunsuri din ChatGPT Enterprise și din aplicații AI conectate prin Entra/Foundry. |
| `DSPM for AI - Detect sensitive info shared in AI prompts in Edge` | Collection policy | Detectează prompturi trimise către aplicații AI din Edge și informațiile sensibile din ele; doar audit, fără captură de conținut. |

*Protection (blocare):*

| Politică (nume exact) | Tip | Ce face |
|---|---|---|
| `DSPM for AI - Block sensitive info from AI sites` | DLP + Adaptive Protection | *Block with override* pentru utilizatori cu risc ridicat care lipesc/încarcă informații sensibile pe aplicații AI din Edge, Chrome, Firefox; creată în **test mode**. |
| `DSPM for AI - Block elevated risk users from submitting prompts to AI apps in Microsoft Edge` | DLP + Adaptive Protection | Blochează utilizatorii cu risc elevated/moderate/minor care introduc informații în aplicații AI din Edge; includ „unmanaged apps", deci utilizatorii sunt blocați în browsere neprotejate. |
| `DSPM for AI - Block sensitive info from AI apps in Edge` | DLP | Detectează inline un set de SIT-uri comune și blochează trimiterea promptului în Edge; aceeași consecință pentru browserele neprotejate. |
| `DSPM for AI - Protect sensitive data from Copilot processing` | DLP | Împiedică Microsoft 365 Copilot și agenții să proceseze elemente cu sensitivity labels alese. |

*Evenimente în Activity Explorer (nume exacte):* `AI interaction`, `AI website visit`, `DLP rule match`, `Sensitive info types`. Limite documentate: promptul/răspunsul apare doar dacă politica de colectare are „capture content"; pentru aplicații AI nemanaged din Edge se păstrează doar textul promptului; evenimentul `Sensitive info types detected` nu afișează nivelul de risc al utilizatorului.

**(b) Politică DLP „inline web traffic" în Edge for Business către AI neadministrat** (pagina `ms.date 2026-06-26`, `updated_at 2026-07-29`): https://learn.microsoft.com/en-us/purview/dlp-create-policy-block-to-ai-via-edge · prerequisite: https://learn.microsoft.com/en-us/purview/dlp-browser-dlp-learn (`updated_at 2026-10-06`).

- Locație: *Inline web traffic*; template: **Custom → Custom policy**; app scope: *Adaptive app scopes → All unmanaged AI apps* (include aplicațiile din categoria Generative AI); enforcement: **Edge for Business**.
- Condiție de exemplu (ipotetică în pagină): *Content contains → Sensitive info types*: ABA Routing Number, Australia Bank Account Number, Canada Bank Account Number, International Bank Account Number (IBAN), Israel Bank Account Number, Japan Bank Account Number, New Zealand bank account number, SWIFT Code, U.S Bank Account Number.
- Acțiuni (exact): *Restrict browser and network activities* → **Text sent to or shared with cloud or AI apps → Block** și **File uploaded to or shared with cloud or AI app → Block**; alertă către admini; mod **simulation** la început.
- Ce se întâmplă la `Block`: utilizatorii sunt blocați la nivel de dispozitiv să deschidă Firefox și alte browsere; Chrome rămâne permis doar cu extensia Microsoft Purview (cu extensie, accesul la un set dinamic de aplicații AI e blocat).
- Aplicații nemanaged suportate (lista din pagina `dlp-browser-dlp-learn`): Adobe Firefly, CapCut, ChatGPT (consumer), Cohere, DeepAI, DeepSeek, Google Gemini, Grok (xAI), Meta AI, Microsoft Copilot 365 Chat, Notion AI, Otter.ai, Perplexity AI, QwenAI, Qwen Chat, Runway, Textcortex, Textcortex Zenochat, You (You.com). Lista mai largă „supported AI sites" pentru DSPM (sute de domenii, ex. `chatgpt.com`, `claude.ai`, `gemini.google.com`, `grok.com`, `perplexity.ai`, `deepseek.com`, `cursor.com`) este la https://learn.microsoft.com/en-us/purview/ai-microsoft-purview-supported-sites (`ms.date 2025-12-15`).
- **Limite documentate (importante pentru „ce a mers prost"):** aplicații precum ChatGPT, Runway, Meta AI pot trimite conținut codat sau prin endpoint-uri generate dinamic, ceea ce poate afecta aplicarea; politicile pentru aplicații nemanaged pot prinde și varianta enterprise dacă URL-ul e comun (ChatGPT consumer vs Enterprise); evaluare inline până la 4 MB text și 3 MB fișier; nu se aplică guests B2B; mediu: Windows 10/11 gestionat de Intune; politica Endpoint DLP are prioritate peste cea inline dacă același user/acțiune sunt în ambele; nu suportă tenanți cu multi-admin approval în Intune.

**(c) Endpoint DLP pentru browser AI și DLP pentru Copilot** – deja descrise în `02-scenarios.md` §3 (Endpoint DLP: *paste to supported browsers*, *upload to restricted cloud service domain*; DLP pentru Copilot: restricții pe SIT în prompt, pe web search, pe fișiere/emailuri cu label; nu scanează fișierele încărcate direct în prompt). Din DSPM: pentru site-uri AI terțe, **dispozitivele trebuie onboardate** și, pe Windows cu Chrome, **extensia Purview** este necesară (https://learn.microsoft.com/en-us/purview/dspm-for-ai-considerations, secțiunea Prerequisites).

**(d) IRM – șablon „Risky AI usage"** (necesită extensia Edge/Chrome) – vezi `02-scenarios.md` §3.

### 4.2 Netskope

*Acoperire parțială; notă de încredere sus.*

- **AI Guardrails profile** (documentație oficială, deschisă, conținut mid-2026): https://docs.netskope.com/en/ai-security-guardrails-profile. Profilul se creează în *Policies → AI Guardrails → Profiles* și se atașează unei politici **Real-time Protection**; poate permite/bloca prompturi și/sau răspunsuri pe baza de categorii predefinite, cuvinte-cheie și similaritate semantică.
  - Categorii predefinite (nume exacte): **Prompt Injection and Jailbreaking** (doar prompturi; fără niveluri de încredere, doar on/off), **Malicious URLs**, **Newly Registered and Observed Domains**, **Hate Speech and Discrimination**, **Crimes**, **Weapons**, **Suicide and Self-Harm**, **Sex-Related Crimes and Content**, **Piracy and Copyright**, **Requests for Sensitive Data** (cereri de a obține/dezvălui date personale despre persoane reale fără consimțământ).
  - Niveluri de încredere Low/Medium/High pentru categorii (cu excepția Prompt Injection and Jailbreaking). **Custom Topics** (Beta, activare prin suport/vânzări), **Matched Keywords** (până la 256 cuvinte, 2 048 caractere), **Matched Prompts / Responses** (până la 10 itemi, 500 cuvinte fiecare, 4 096 caractere total).
  - Pagina **nu** menționează DLP și nu listează aplicațiile suportate dincolo de „generative AI apps" → AI Guardrails este un control de *conținut/intenție*, distinct de DLP-ul de *date sensibile* (inferență din ce NU spune pagina).
- **Politici DLP pentru Gen AI în Real-time Protection** (articol Netskope GTS, postat de un angajat Netskope pe community, 21 oct. 2024, Cloud v120): https://community.netskope.com/generative-ai-60/how-to-craft-effective-generative-ai-policies-a-walkthrough-7107. Structură: categoria *Generative AI* pentru vizibilitate (dashboard „AI Usage" în Advanced Analytics); blocarea aplicațiilor AI nesancționate; permiterea celor sancționate (ChatGPT/OpenAI, Microsoft Copilot) cu notificare *User Coach*; restricționarea accesului la ChatGPT doar cu conturi corporate; **DLP pe upload/download/post** (exemplu: cod sursă). **Numele profilelor/regulilor DLP nu sunt specificate** în textul citit → nu pot da un „nume exact de politică DLP" Netskope din documentație oficială. Pagina oficială „About DLP" (https://docs.netskope.com/en/about-dlp, deschisă) descrie DLP profiles/rules, data identifiers, fingerprint rules, ML-based classifiers (exemplu: credit cards în imagini), file profiles, containere (zip), Endpoint DLP – dar **nu** menționează AI generativ.
- **API Data Protection pentru Gen AI** (doar din rezultat de căutare, pagină `create-a-next-generation-api-data-protection-policy` neîncărcată): se pot monitoriza prompturi și răspunsuri cu DLP profiles → `[verifică]`.
- Un rezultat de căutare susținea că release 139.0.0 adaugă „AI Guardrails în Enterprise Browser"; pagina de release notes 139.0.0 (6 iul. 2026) **nu** conține asta (menționează doar „AI Command Center – GA") → neconfirmat, vezi „Dezacorduri".

### 4.3 Zscaler

*Acoperire parțială: portalul oficial de ajutor `help.zscaler.com` este redat prin JavaScript și WebFetch a întors pagini goale. Folosesc ce am putut deschide efectiv.*

- **Blog oficial Zscaler, 17 mai 2023** (deschis): https://www.zscaler.com/blogs/product-insights/make-generative-ai-tools-chatgpt-safe-and-secure-zscaler. Controale descrise: categorie URL **„AI and ML Applications"** (acțiuni block / caution / isolation pentru întreaga categorie); aplicație cloud predefinită **ChatGPT** pentru controale granulare; **inline DLP** cu inspecție SSL (vede query-urile trimise și conținutul descărcat; exemple: blocarea numerelor de card, dicționare de **cod sursă**); **browser isolation** (sesiune remote, fără descărcarea output-ului); **regulă DLP fără inspecție de conținut** care capturează orice HTTP POST > 0 bytes către ChatGPT și îl trimite la **Incident Receiver**. Atenție: e marketing de produs, vechi de 3 ani.
- **Zscaler AI Guard** (repo oficial GitHub `zscaler/zguard-ai-integrations`, deschis): https://github.com/zscaler/zguard-ai-integrations. Descris ca securitate de runtime pentru AI, „Detection as a Service". Detectoare pe **prompt**: *Toxicity*, *Injection*, *PII*, *Secrets*, *Gibberish*; pe **răspuns**: *PII*, *Secrets*, *Malicious URLs*, *Data Leakage*; menționate separat *Off-Topic* și *Competition*. Acțiuni per detector: **BLOCK**, **DETECT** (monitor/log, nu blochează), **ALLOW**. Politica se creează în AI Guard Console și se asociază unei aplicații prin API key. Notă: AI Guard protejează **aplicațiile AI proprii** ale companiei (Private AI Apps), nu este același lucru cu DLP inline pentru angajați care folosesc ChatGPT.
- **Doar din rezultate de căutare (neconfirmat în pagini deschise)** → `[verifică]`: setarea „Gen AI Prompt Configuration" în *Advanced Policy Settings* și opțiunea „Capture Prompts" într-o regulă *AI & ML* din Cloud App Control; limitarea DLP/capture pentru Microsoft Copilot la „Copilot Chat"; praguri recomandate 0,5 (PII) și 0,7 (IP) la AI Guard; detectoare suplimentare din solution brief (Code, PII DeepScan, Topic, Invisible Text, Finance Advice, Prompt Tags). Solution brief-ul PDF a fost descărcat, dar conținutul nu s-a putut extrage.

### 4.4 Al treilea la alegere: Cloudflare One (DLP + AI prompt protection)

Ales pentru că documentația este complet deschisă și redată. Sursă: https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/dlp-profiles/predefined-profiles/ (pagina „last updated Aug 12, 2026", fără etichetă beta/GA).

- **AI prompt profiles** (nume exacte; verifică *Content* și *Intent*): **AI Prompt: AI Security** (prompturi care încearcă să ocolească politici de securitate AI sau cer cod malițios), **AI Prompt: Customer** (nume de clienți, proiecte, context confidențial), **AI Prompt: Financial Information** (cifre financiare/date business confidențiale), **AI Prompt: PII** (date personale sau cereri pentru ele), **AI Prompt: Technical** (cod sursă, algoritmi proprietari, credențiale precum API keys/parole).
- **Alte profile predefinite relevante:** *Financial Information* (carduri Amex/Diners/Mastercard/UnionPay/Visa, ABA, IBAN), *Credentials and Secrets* (chei AWS/Azure/Google Cloud, SSH), *Source Code* (cod în C, Python, Go, Rust, JavaScript, prin NLP), *Social Security, Insurance, Tax, and Identifier Numbers*, *Personally Identifiable Information (PII) Record* (cere minim trei intrări apropiate), *Health Information*, **Unsanitized HAR** (fișiere HAR nesanitizate, care conțin adesea cookies de sesiune și credențiale – legătură directă cu scenariul CL03 Okta).
- Din rezultat de căutare (pagini `ai-gateway/features/dlp` și changelog neîncărcate) → `[verifică]`: *custom topics* pentru ChatGPT, Gemini, Perplexity și Claude (adăugate 2026-06-11); AI Gateway DLP cu profile Financial Information / PII / Government Identifiers / Healthcare / Custom, acțiuni flag/block, fără decodare base64; profilele AI prompt nu acoperă traficul MCP server portal.

### 4.5 Sinteză comparativă (pentru întrebări „alegi controlul potrivit")

| Control | Ce vede | Unde se aplică | Punct slab documentat |
|---|---|---|---|
| Purview DLP în Edge for Business (AI neadministrat) | text/fișier trimis către aplicații AI, SIT-uri | Edge pe Windows gestionat Intune; Chrome doar cu extensie | conținut codat/endpoint dinamic; nu guests B2B; 4/3 MB |
| Purview Endpoint DLP / DSPM one-click | paste/upload, vizite AI, risc utilizator | dispozitive onboardate | dependență de extensie (Chrome) și onboarding |
| Netskope AI Guardrails | intenție/conținut (injection, URL-uri, categorii) în prompt/răspuns | Real-time Protection | nu e DLP de date; unele funcții Beta |
| Zscaler AI Guard | prompt/răspuns către aplicații AI proprii | gateway/API | alt scop decât DLP pentru angajați |
| Cloudflare AI prompt profiles | conținut + intenție în prompturi | Gateway HTTP policies | nu acoperă MCP portals `[verifică]` |

---

## 5. Scenarii CLOUD (CL01–CL15)

> Format per scenariu: situație → detecție → log-uri/metadate → containment → ce a mers prost → impact și notificare → clasificare → sursă. La DOC, faptele sunt din sursă; *inferență* e marcată.

### CL01 – Credențiale nerotite după breșa Okta → acces la Atlassian (Cloudflare, nov. 2023) · DOC · tech-vendor
- **Situație:** actor probabil statal a folosit credențiale scurse în breșa Okta din oct. 2023 pentru a intra în mediul Atlassian self-hosted al Cloudflare: un service token Moveworks și un service account Smartsheet cu drepturi de admin în Jira, plus un cont Bitbucket și un cont AWS. Cloudflare a considerat greșit că acele credențiale nu mai sunt folosite și nu le-a rotit.
- **Cronologie (UTC):** recunoaștere 14 nov.; acces la Jira/Confluence 15 nov.; cont nou, asemănător unui angajat, 16 nov.; 22 nov.: instalare Sliver prin pluginul ScriptRunner for Jira și descărcarea a 76 de repo-uri; 23 nov.: descoperire și containment.
- **Detecție:** alertă automată care s-a declanșat la 16:00 pe 23 nov. când contul Smartsheet a fost adăugat într-un grup de administratori; SOC a început investigația la 16:12.
- **Log-uri/metadate care au contat:** schimbarea de apartenență la grup (admin group), activitate pe service accounts, accesări Confluence (202 din 194 100 pagini), Jira (36 din 2 059 357 tichete), Bitbucket (120 din 11 904 repo-uri văzute, 76 descărcate); IP-uri și un fișier `jvm-agent` publicate ca IoC.
- **Containment:** cont Smartsheet dezactivat 16:35; contul creat de atacator dezactivat 17:23; incident declarat 17:43; reguli firewall pentru IP-urile atacatorului 21:31; eliminare Sliver 24 nov. 11:59. Remediere „Code Red": peste 5 000 de credențiale de producție rotite, triaj forensic pe 4 893 de sisteme, reimage al tuturor mașinilor din rețeaua globală și al produselor Atlassian.
- **Ce a mers prost:** patru credențiale nerotite după breșa unui furnizor; cont de serviciu cu privilegii de admin în Jira; o listă ACL nu era aplicată pe un server de consolă din São Paulo.
- **Impact/notificare:** Cloudflare declară că nu au fost afectate date sau sisteme ale clienților (autoraportare). Postarea a apărut după încheierea investigației independente CrowdStrike; au publicat IoC pentru alte organizații afectate de Okta. Nicio notificare către autorități menționată `[verifică]`.
- **Clasificare:** Cloud (service accounts, rotation), IR, SIEM · L2/L3, Eng.
- **Sursă:** Cloudflare Blog – https://blog.cloudflare.com/thanksgiving-2023-security-incident/ (acces 2026-10-23, deschis, primară/autoraportare).

### CL02 – Cookie SSO furat → secretele clienților (CircleCI, dec. 2022 – ian. 2023) · DOC · tech-vendor
- **Situație:** malware instalat pe laptopul unui inginer (16 dec.) a furat un cookie de sesiune SSO valid, „2FA-backed", și atacatorul a impersonat angajatul; angajatul putea genera token-uri de acces în producție. Antivirusul nu a detectat malware-ul. Pe 22 dec. s-au exfiltrat variabile de mediu, token-uri și chei ale clienților dintr-un subset de baze de date (criptate la repaus, dar cheile de criptare au fost extrase din memoria unui proces în rulare).
- **Detecție:** **un client** a raportat activitate OAuth suspectă pe GitHub pe 29 dec.; compania a confirmat calea de intrare pe 4 ian.
- **Log-uri/metadate:** GitHub audit logs (`repo.download_zip` – recomandat clienților), listă de IP-uri ale atacatorului, fișiere malițioase pe endpoint.
- **Containment (revocare/rotire):** rotirea tuturor token-urilor OAuth GitHub ale clienților (de la 31 dec., terminat 7 ian.); revocarea Project API tokens (5 ian.) și Personal API tokens (6 ian.); rotire Bitbucket (6 ian.); notificarea clienților cu token-uri AWS potențial afectate (7–12 ian.); acces de producție restrâns, step-up authentication.
- **Îndrumare pentru clienți:** presupuneți că secretele stocate în fereastră au fost accesate și rotiți-le; investigați activitatea din 16 dec. 2022 până la rotire.
- **Ce a mers prost:** endpoint compromis nedetectat, încredere prea mare într-o sesiune, privilegii largi de generare de token-uri.
- **Impact/notificare:** la publicare, sub 5 clienți raportaseră acces neautorizat la sisteme terțe; compania nu putea determina dacă cheile furate fuseseră folosite. E-mailuri de dezvăluire și postare pe 5 ian. 2023.
- **Clasificare:** Cloud/CI-CD (secrete), IR · L3, Eng.
- **Sursă:** CircleCI – https://circleci.com/blog/jan-4-2023-incident-report/ (acces 2026-10-23, deschis, autoraportare).

### CL03 – Fișiere HAR cu session tokens în sistemul de suport (Okta, sept.–oct. 2023) · DOC · tech-vendor
- **Situație:** un service account cu drept de vizualizare/actualizare a cazurilor de suport avea username și parolă salvate în profilul Google personal al unui angajat, în Chrome, pe un laptop gestionat de Okta (Okta consideră *probabil*, nu confirmat, compromiterea contului/dispozitivului personal). Atacatorul a descărcat fișiere ale a 134 de clienți (sub 1 %), inclusiv HAR cu session tokens; tokenurile au fost folosite pentru a deturna sesiunile a 5 clienți.
- **Detecție:** **clienții**, nu monitorizarea Okta: 1Password (29 sept.), BeyondTrust (2 oct.), al treilea client (12 oct.). IP-ul dat de BeyondTrust (13 oct.) a dus la contul de serviciu (16 oct.).
- **Log-uri/metadate:** log-urile sistemului de suport. **Lecție de investigație:** deschiderea unui fișier dintr-un caz și descărcarea din fila *Files* generează tipuri diferite de eveniment; ancheta se uitase doar la accesul pe caz, deci descărcările au trecut neobservate 14 zile. În plus, jurnalele lipseau pentru ultimele ore de acces până la 18 oct. (re-rulare de interogare).
- **Containment:** dezactivare cont de serviciu și terminarea sesiunilor (17 oct.); **revocarea session tokens din fișierele HAR** (17 și 19 oct.); notificare clienți.
- **Remediere Okta:** blocarea profilurilor Google personale în Chrome pe laptopurile gestionate, reguli noi de detecție, legarea token-urilor de sesiune de locația de rețea pentru administratori.
- **Impact/notificare:** 134 de clienți cu fișiere accesate, 5 cu sesiuni deturnate (Cloudflare a fost ultima țintă); clienții cu contact de securitate înregistrat au fost alertați pe 19 oct.; advisory public 20 oct.; cauza rădăcină 3 nov.
- **Legătură DLP:** profilul Cloudflare **Unsanitized HAR** (secț. 4.4) detectează exact acest tip de fișier.
- **Clasificare:** Cloud/SaaS (sesiuni), IR, SIEM · L2/L3.
- **Sursă:** Okta – https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/ (acces 2026-10-23, deschis, autoraportare).

### CL04 – Token-uri forjate pe Exchange Online (Storm-0558, mai–iul. 2023) · DOC · general (guvern)
- **Situație:** din 15 mai 2023, un actor a accesat emailuri ale unor organizații (≈25, inclusiv agenții guvernamentale) cu token-uri de autentificare *forjate*, semnate cu o cheie de consumator MSA achiziționată, posibil din cauza unei erori de validare.
- **Detecție:** un client a raportat accesări anormale în Exchange Online pe 16 iun.; Microsoft a presupus inițial furt de token-uri Azure AD valide; indiciul tehnic a fost folosirea unei chei *incorecte* la semnare.
- **Containment (token și cheie):** blocarea token-urilor semnate cu cheia achiziționată în OWA (27 iun.); înlocuirea cheilor de semnare MSA și revocarea tuturor cheilor valide anterior (29 iun.); închiderea ultimei infrastructuri de replay (4 iul.). Postarea afirmă că nu era necesară nicio acțiune a clienților pentru Exchange Online/Outlook.com.
- **Log-uri/metadate:** postarea Microsoft listează IoC (thumbprint-ul cheii, IP-uri, User-Agent-uri OWA); **nu** menționează `MailItemsAccessed` și nu discută licențele de audit.
- **Legătură cu audit (secundar):** un articol independent (office365itpros.com, 23 mai 2024, deschis) spune că Microsoft a promis, pe 19 iul. (anul nu e dat în pagină), să expună evenimentele de audit respective clienților Audit Standard și să extindă retenția de la 90 la 180 de zile; livrarea a venit mai târziu. Legătura directă cu Storm-0558 nu e stabilită de pagina deschisă → `[verifică]`.
- **Ce a mers prost (din sursă):** eroare de validare care a permis unei chei MSA să semneze token-uri Azure AD; pentru clienții cu licențe fără funcții de audit avansate, vizibilitatea a depins de licență (*inferență*; vezi secț. 3).
- **Clasificare:** Cloud/identitate, SIEM · L3, Gov.
- **Surse:** Microsoft Security Blog (14 iul. 2023) – https://www.microsoft.com/en-us/security/blog/2023/07/14/analysis-of-storm-0558-techniques-for-unauthorized-email-access/ ; office365itpros – https://office365itpros.com/2024/05/23/new-audit-events-may24/ (ambele deschise 2026-10-23); pagina MSRC originală a redirecționat și nu s-a încărcat.

### CL05 – Backup-uri de vault în cloud storage (LastPass, 2022) · DOC · tech-vendor
- **Situație:** după un prim incident (mediu de dezvoltare, 14 din 200 de repo-uri, secrete și certificate în scripturi interne; fără date de client), atacatorul a folosit informațiile pentru a ținti un inginer DevOps senior, exploatând software terț vulnerabil, a obținut secrete DevOps și acces la **backup-urile din cloud**: configurări, secrete de integrare, metadate de clienți, backup-uri ale tuturor vault-urilor și al bazei de date MFA/federation.
- **Cronologie:** ultima activitate văzută 26 oct. 2022; prima dezvăluire 22 dec. 2022; raport final 1 mar. 2023.
- **Detecție:** sursele citite nu spun cum a fost detectat accesul `[verifică]`.
- **Containment:** rotirea secretelor și certificatelor afectate, analiză a stocării cloud cu politici noi, privilegii restrânse, Mandiant implicat.
- **Ce a mers prost:** primul incident a fost declarat închis înainte de a se afla că datele lui au fost folosite în al doilea; comunicare „prea rară și incompletă" (recunoscut de companie).
- **Impact/notificare:** vault-urile erau criptate cu o cheie derivată din parola principală, dar URL-urile și unele metadate erau necriptate; sub 3 % dintre clienții Business au fost contactați pentru pași specifici (postarea din 22 dec.); autorități și poliție notificate.
- **Neconfirmat în paginile citite:** „calculatorul de acasă al inginerului", keylogger, chei S3 – apar în presa generală, dar nu în paginile LastPass pe care le-am deschis → `[verifică]`.
- **Clasificare:** Cloud (backup, secrete), IR, Gov · L3.
- **Surse:** LastPass 22 dec. 2022 – https://blog.lastpass.com/posts/notice-of-recent-security-incident ; LastPass 1 mar. 2023 – https://blog.lastpass.com/posts/2023/03/security-incident-update-recommended-actions (ambele deschise 2026-10-23, autoraportare).

### CL06 – Vishing → connected app Salesforce (UNC6040, 2025) · DOC · general
- **Situație:** operatori care se dau drept suport IT conving angajați să autorizeze o *connected app* malițioasă (un Data Loader modificat, uneori redenumit „My Ticket Portal"); apoi exportă tabele întregi din Salesforce; folosesc credențiale colectate pentru a trece la Okta și Microsoft 365. Nu există o vulnerabilitate Salesforce exploatată.
- **Detecție:** raportul nu descrie un detector unic; unele încercări au fost întrerupte prin detecție și revocarea accesului.
- **Log-uri/metadate (cele pe care le indică raportul):** autorizări de connected apps (aplicații necunoscute/redenumite), login și activitate API din IP-uri neașteptate (Mullvad, apoi Tor), exporturi în masă, Event Monitoring.
- **Containment/hardening:** restrângerea permisiunii „API Enabled" și a „Manage Connected Apps", allowlist pentru aplicații, restricții IP de login, Transaction Security Policies (Shield) pentru descărcări mari, MFA și training anti-vishing.
- **Impact/notificare:** extorcarea a venit **după luni** de la furt, de la un cluster separat (UNC6240), cu cerere de bitcoin în 72 h și pretins ShinyHunters. Google a raportat (5 aug. 2025) că o instanță Salesforce proprie a fost accesată în iunie, cu date în mare parte publice; notificările s-au încheiat pe 8 aug.
- **Clasificare:** Cloud/SaaS (OAuth, connected apps), SIEM · L2/L3.
- **Sursă:** Google Threat Intelligence Group (5 iun. 2025, actualizat 5 aug.) – https://cloud.google.com/blog/topics/threat-intelligence/voice-phishing-data-extortion (acces 2026-10-23, deschis, primară).

### CL07 – Patru bucket-uri S3 publice la un consultant (Accenture, 2017) · DOC · mssp-consulting
- **Situație:** cercetătorul UpGuard Chris Vickery a găsit pe 17 sept. 2017 patru bucket-uri AWS S3 accesibile public (fără autentificare). Conținut: chei de acces și credențiale interne pentru un API de identitate, un master key în clar pentru AWS KMS al Accenture, chei VPN pentru rețeaua de producție, dump-uri de baze de date (aprox. 137 GB într-un bucket) cu aproape 40 000 de parole în clar într-un backup, credențiale Google și Azure, chei și certificate potențial capabile să decripteze trafic între Accenture și clienți.
- **Detecție:** **externă** (UpGuard). UpGuard a notificat compania pe 18 sept.; bucket-urile au fost securizate a doua zi; articol publicat 10 oct. 2017.
- **Log-uri/metadate care ar fi contat (inferență):** configurația ACL/bucket policy a bucket-urilor, S3 server access logs și CloudTrail data events pe fereastra de expunere – dar sursa nu spune cât timp au fost expuse bucket-urile.
- **Containment (inferență din natura conținutului):** pe lângă închiderea accesului public, ar fi trebuit rotite *toate* secretele găsite (KMS, VPN, parole, chei API), nu doar blocat accesul – sursa nu confirmă ce rotații s-au făcut `[verifică]`.
- **Ce a mers prost (din sursă):** secrete de infrastructură și date legate de clienți stocate în bucket-uri publice; lipsa unei detecții interne.
- **Impact:** UpGuard avertizează că cheile permiteau impersonarea Accenture, accesul discret la mediul IT și decriptarea traficului clienților; sursa nu documentează utilizare frauduloasă. Accenture Cloud Platform era folosită, conform Accenture, de 94 din Fortune Global 100. Obligațiile de notificare nu sunt descrise `[verifică]`.
- **Relevanță `mssp-consulting`:** când ești furnizor/consultant, scurgerea unui secret propriu devine risc pentru *toți* clienții (alt lanț de notificare, art. 33(2) GDPR – procesator → operator, verificat în `02-scenarios.md`).
- **Clasificare:** Cloud (S3, secrets), IR, Gov · L2.
- **Sursă:** UpGuard – https://www.upguard.com/breaches/cloud-leak-accenture (acces 2026-10-23, deschis, primară a cercetătorului).

### CL08 – GitHub Action compromis → secrete în log-uri de workflow (tj-actions/changed-files, mar. 2025) · DOC · general
- **Situație:** acțiunea terță `tj-actions/changed-files` (CVE-2025-30066) a fost compromisă, posibil prin compromiterea separată a `reviewdog/action-setup@v1` (CVE-2025-30154). Compromiterea permitea divulgarea de secrete.
- **Fereastre de audit (UTC, CISA):** `tj-actions/changed-files`: 12 mar. 2025 00:00 – 15 mar. 12:00; reviewdog: 11 mar. 18:42–20:31. Alertă CISA 18 mar., ambele CVE adăugate în KEV pe 26 mar.
- **Ce era expus:** access keys, GitHub Personal Access Tokens, token-uri npm, chei RSA private; secretele pot fi codate dublu în base64; accent pe repo-uri publice ale căror workflow-uri au rulat commit-ul malițios.
- **Containment (CISA):** identificați repo-urile care au folosit versiunile afectate în ferestrele date; verificați log-urile de workflow din repo-uri publice; **rotiți imediat toate secretele identificate**; actualizați (tj-actions: v46.0.1; reviewdog: commit 3f401fe sau ulterior).
- **Detecție:** pagina CISA nu spune cum a fost descoperită compromiterea `[verifică]`.
- **Metadate (inferență):** log-urile de rulare GitHub Actions (conțin secretele), lista de workflow-uri care referă acțiunea, activitate a token-urilor/cheilor după fereastra de expunere (CloudTrail pentru chei AWS, audit GitHub pentru PAT).
- **Impact:** CISA nu cuantifică numărul de organizații sau repo-uri.
- **Clasificare:** Cloud (CI/CD, supply chain, secrets) · Eng, L2.
- **Sursă:** CISA – https://www.cisa.gov/news-events/alerts/2025/03/18/supply-chain-compromise-third-party-github-action-cve-2025-30066 (acces 2026-10-23, deschis).

### CL09 – Exfiltrare din Azure Storage și ransomware în cloud (Storm-0501, publicat 27 aug. 2025) · DOC · general
- **Situație:** după domain admin on-premises, atacatorul a abuzat contul de sincronizare Entra Connect, a găsit un cont de Global Administrator sincronizat, fără MFA, i-a resetat parola on-prem (propagată prin Password-Hash Synchronization) și și-a înregistrat propria metodă MFA; a ocolit un Conditional Access care cerea dispozitive hybrid-joined mutându-se lateral pe un server hybrid-joined; a adăugat un domeniu federat malițios pentru token-uri SAML forjate.
- **Operații Azure documentate (utile ca nume exacte în log-uri):** `Microsoft.Authorization/elevateAccess/action`, `Microsoft.Authorization/roleAssignments/write` (auto-atribuire Owner), `Microsoft.Storage/storageAccounts/write` (activarea accesului public), `Microsoft.Storage/storageAccounts/listkeys/action` (obținerea cheilor), apoi **AzCopy** către infrastructura atacatorului; ștergerea lock-urilor (`Microsoft.Authorization/locks/delete`) și a politicilor de immutability, ștergerea snapshot-urilor/backup-urilor; fallback prin criptarea datelor cu o cheie Key Vault apoi ștergerea cheii (soft-delete 90 de zile a permis recuperarea).
- **Detecții menționate (Defender XDR/Defender for Cloud):** „Possibly compromised Microsoft Entra Connect Sync account elevated its access to Azure resources", „Assignment of Owner Azure role", „Mass Azure data store resources deletion and encryption", „Unusual amount of data extracted from a storage account"; interogări pe `IdentityLogonEvents`, `CloudAppEvents`, `CloudAuditEvents`; tabelul `CloudStorageAggregatedEvents`.
- **Containment/hardening recomandat:** restricții IP pentru contul de sincronizare, MFA obligatoriu cu metodă preînregistrată, Global Admin doar cloud-native și separat de AD, revizuirea domeniilor federate, purge protection și soft delete, immutability și lock-uri, endpoint-uri private și acces anonim dezactivat.
- **Impact/notificare:** postarea nu dă date calendaristice ale campaniei și nu cuantifică victimele; extorcarea a fost făcută prin Microsoft Teams dintr-un cont compromis anterior.
- **Clasificare:** Cloud (control plane, Azure), SIEM (KQL) · L3, Eng.
- **Sursă:** Microsoft Threat Intelligence – https://www.microsoft.com/en-us/security/blog/2025/08/27/storm-0501s-evolving-techniques-lead-to-cloud-based-ransomware/ (acces 2026-10-23, deschis, primară).

### CL10 – Credențiale GitHub → backup S3 și plata tăcerii (Uber, 2016) · DOC · general
- **Situație:** atacatorii au obținut credențiale dintr-un site GitHub privat, au ajuns la un repo cu o cheie de acces, iar cheia a dat acces la un bucket S3 cu backup-uri. Date: înregistrări ale a 57 mil. de utilizatori și șoferi, inclusiv ≈600 000 de numere de permis de conducere.
- **Detecție:** nu prin telemetrie; un atacator a contactat compania (extorcare).
- **Containment/„răspuns":** în nov. 2016 compania a plătit 100 000 USD prin programul bug bounty pentru ștergerea datelor și tăcere. Aceasta este exact ce **nu** trebuie făcut: breșa nu a fost raportată către FTC (care investiga deja practicile) și utilizatorii nu au fost informați ~un an.
- **Impact/notificare:** dezvăluire publică nov. 2017; acord cu cele 50 de state + DC, 148 mil. USD (sept. 2018); acord FTC cu program de confidențialitate pe 20 de ani (oct. 2018); în iul. 2022, non-prosecution agreement cu DOJ, prin care Uber a admis ascunderea breșei față de FTC; fostul CSO a fost inculpat în 2020.
- **Metadate (inferență):** acces la repo privat din locații noi, cheie folosită din IP-uri neobișnuite, `GetObject`/`ListBucket` în masă (CloudTrail data events, dacă erau activate).
- **Clasificare:** Cloud (secrets, S3), IR, Gov · L3, Gov.
- **Sursă:** SecurityWeek – https://www.securityweek.com/uber-settles-federal-investigators-over-2016-data-breach-coverup (acces 2026-10-23, deschis, secundară).

### CL11 – Plecare: mass download prin OneDrive sync client · COMP · finance
- **Ancoră documentată:** rândurile `FileSyncDownloadedFull` vs `FileDownloaded` din Purview Audit (secț. 3), șablonul IRM „Data theft by departing users" și cazul Block (S02 din `02-scenarios.md`).
- **Situație (ilustrativă):** un relationship manager care a depus demisia sincronizează pe laptopul corporativ biblioteca SharePoint „Private Banking" cu OneDrive.exe; într-un weekend se loghează mii de `FileSyncDownloadedFull`. Un analist care caută doar `FileDownloaded` vede câteva zeci de descărcări și închide alerta ca „volum normal".
- **Detecție corectă:** corelarea HR connector (data demisiei) ↔ volum anormal de evenimente de sync; includerea ambelor operații în regula SIEM; *inferență*: compararea cu baseline-ul pe 30 de zile.
- **Log-uri/metadate:** `FileSyncDownloadedFull` și `FileDownloaded` (UserId, ObjectId, ClientIP, dispozitiv), sensitivity labels ale fișierelor, status dispozitiv (managed/unmanaged), Endpoint DLP `copy to USB`/`upload to cloud` pentru ce iese *după* sync.
- **Containment:** coordonare cu HR/Legal înainte de acțiuni vizibile; revocarea sesiunilor/token-urilor și restrângerea accesului la site; blocarea sincronizării pe dispozitive nepermise `[verifică numele setării SharePoint/OneDrive]`; colectare forensică a laptopului cu chain of custody; **exportul și păstrarea log-urilor de audit** înainte să expire retenția (180 de zile la Standard; vezi secț. 3).
- **Ce poate merge prost:** filtru doar pe `FileDownloaded`; ignorarea faptului că alertele Endpoint DLP nu alimentează indicatorul „DLP alert" al IRM (limită din `02`, §3); confruntare înainte de colectarea dovezilor.
- **Notificare:** dacă fișierele conțin date de clienți și ajung în afara firmei → evaluare GDPR art. 33; DORA doar la atingerea pragului de incident major `[verifică criteriile]`.
- **Clasificare:** DLP, Cloud · L2.

### CL12 – Link „Anyone" pe un folder cu documente KYC · COMP · finance
- **Ancoră documentată:** `AnonymousLinkCreated` / `AnonymousLinkUsed` din Purview Audit și pagina `audit-log-sharing`; DSPM for AI „data risk assessments" (numără linkurile „anyone with the link", acțiune „Remove sharing link").
- **Situație (ilustrativă):** un colaborator creează un link anonim pentru un folder cu scanări de buletine ca să-l trimită unui furnizor; după 3 zile apar evenimente `AnonymousLinkUsed` din IP-uri din afara furnizorului.
- **Detecție:** regulă SIEM pe `AnonymousLinkCreated` în site-uri etichetate „Confidential"; evaluarea de oversharing din DSPM (raportează numărul de linkuri „anyone"); alertă pe `AnonymousLinkUsed` cu IP necunoscut. **Atenție:** `SharingSet` *nu* apare pentru linkuri anonime (secț. 3).
- **Log-uri/metadate:** `AnonymousLinkCreated` (cine, obiect), `AnonymousLinkUsed` (IP; identitatea poate fi necunoscută), `FileAccessed` pe același obiect, sensitivity label, `TargetUserOrGroupType`.
- **Containment:** ștergerea linkului (acțiunea „Remove sharing link" documentată în DSPM, folosită cu grijă pentru că poate bloca accesul legitim); schimbarea tipului de link implicit la „specific people"; dezactivarea linkurilor „Anyone" la nivel de tenant/site `[verifică numele exact al setării]`; export de log-uri.
- **Ce poate merge prost:** analistul caută `SharingSet`, nu găsește nimic și concluzionează „nu s-a partajat extern"; ignorarea `AnonymousLinkUsed`; lipsa unui label automat pe documentele de identitate.
- **Impact/notificare:** date de identitate → risc ridicat pentru persoane (art. 34 GDPR dacă accesul neautorizat e confirmat); dovada accesului vine din `AnonymousLinkUsed`, deci retenția log-urilor contează.
- **Clasificare:** Cloud (SaaS DLP), IR · L1/L2.

### CL13 – S3: GetObject suspect, dar fără data events · COMP · finance
- **Ancoră documentată:** documentația AWS CloudTrail (citat: „By default, trails and event data stores do not log data events. Additional charges apply for data events."; exemple S3: `GetObject`, `PutObject`, `DeleteObject`, tip `AWS::S3::Object`) + cazurile S04 (Capital One) din `02` și CL07 (Accenture).
- **Situație (ilustrativă):** un cercetător extern raportează că un bucket cu extrase de cont era accesibil prin credențiale scurse; echipa vede în CloudTrail `PutBucketPolicy` și creare de chei (management events), dar **nu** vede ce obiecte au fost citite, pentru că data events nu erau activate pe acel trail.
- **Decizia de judecată:** fără evidență la nivel de obiect, scopul expunerii trebuie tratat prin *worst case* (toate obiectele din bucket în fereastra în care credențialele erau valide), nu prin „nu avem dovezi".
- **Containment:** blocarea accesului public, dezactivarea/rotirea cheii IAM, revizuirea politicilor bucket, activarea data events (cost) pentru viitor, păstrarea tuturor log-urilor disponibile. S3 server access logs ca sursă alternativă → `[verifică, neîncărcat]`.
- **Ce poate merge prost:** raportare către management „nu există dovezi de exfiltrare" confundată cu „dovezi că nu a fost exfiltrare"; notificare întârziată pentru că nu se poate număra persoane afectate.
- **Notificare:** GDPR art. 33 – notificarea în etape e permisă (verificat în `02`), deci se notifică în 72 h cu estimarea disponibilă și se completează.
- **Clasificare:** Cloud (AWS logging), SIEM, IR · L2/L3.

### CL14 – GCP: cheie de service account expusă, Data Access logs oprite · COMP · finance
- **Ancoră documentată:** documentația Google Cloud Audit Logs (pagină „Last updated 2026-10-22"): Admin Activity logs sunt mereu scrise; **Data Access logs sunt dezactivate implicit, cu excepția BigQuery**, și pot genera costuri; Admin Activity merg în bucket-ul `_Required`, Data Access în `_Default`. Ancore de caz: S15 (Toyota, cheie în repo public) din `02` și CL08.
- **Situație (ilustrativă):** o cheie JSON de service account ajunge într-un repo public; GitHub secret scanning alertează; echipa vede în Admin Activity crearea cheii și schimbări IAM, dar nu poate stabili ce obiecte din Cloud Storage au fost citite, fiindcă Data Access logs pentru Cloud Storage nu erau activate.
- **Containment:** dezactivarea și ștergerea cheii, rotirea secretelor accesibile contului, restricționarea rolurilor (least privilege), activarea Data Access logs pentru serviciile cu date sensibile, folosirea identității federate fără chei de lungă durată `[verifică ca recomandare oficială]`.
- **Retenție:** documentația citită nu dă zilele de retenție ale bucket-urilor `_Required`/`_Default` (trimite la „Quotas and limits") → `[verifică]`.
- **Clasificare:** Cloud (GCP logging, IAM), SIEM · L2/L3.

### CL15 – MSSP: credențiale de admin delegat furate → tenantul băncii · COMP · mssp-consulting
- **Ancoră documentată:** Microsoft Threat Intelligence, 25 oct. 2021: actorul a vizat conturi privilegiate ale furnizorilor de servicii și MSP-urilor care dețin *delegated administrative privileges* (DAP) pentru a ajunge în tenanții clienților („compromise one, compromise many"); privilegiile erau adesea neauditate și neeliminate; un exemplu a înlănțuit patru furnizori.
- **Situație (ilustrativă):** un SOC L1 dintr-un MSSP primește o alertă de la un client bancar: sign-in-uri non-interactive din contul de partener în tenant, în afara programului. Contul MSSP are rol de admin delegat în tenantul băncii.
- **Log-uri/metadate:** Azure AD/Entra sign-in logs – filtrul „Cross-tenant access type: Service provider" pe fila non-interactive (indicat de Microsoft); audit logs Entra; audit Microsoft 365; activitate în Partner Center.
- **Containment:** eliminarea relațiilor DAP/delegări neutilizate, revocarea sesiunilor și resetarea credențialelor contului MSSP, MFA și Conditional Access pentru conturile de partener, revizuirea conturilor B2B și a administratorilor care acționează în numele altora; pentru bancă – audit al furnizorilor cu acces și registrul ICT (DORA) `[verifică cerințele]`.
- **Ce poate merge prost:** MSSP-ul nu informează la timp clientul; lipsa unei liste de „cine are admin în tenant"; log-uri cu retenție insuficientă (Microsoft insistă să se verifice retenția *înainte* de incident).
- **Notificare:** MSSP = procesator → operator „fără întârziere nejustificată" (art. 33(2) GDPR, verificat în `02`); operatorul (banca) are 72 h de la luarea la cunoștință.
- **Clasificare:** Cloud/identitate, IR, Gov · L3, Gov.

---

## 6. Scenarii AI de scurgere de date (AI01–AI10)

### AI01 – Prompt injection în Slack AI (PromptArmor, aug. 2024) · DOC · tech-vendor
- **Mecanism:** atacatorul creează un canal public în care e singurul membru și postează o instrucțiune ascunsă. Când o victimă cere lui Slack AI un secret stocat într-un canal privat (ex. o cheie API), asistentul aduce ambele mesaje în același context și redă un link markdown „click here to reauthenticate" cu secretul în parametrii URL-ului; un click trimite secretul la serverul atacatorului. Citările arătau doar mesajul privat, deci mesajul atacatorului nu era vizibil.
- **Cronologie:** raportat către Slack pe 14 aug. 2024 (ziua extinderii Slack AI la fișiere și Google Drive); Slack a răspuns pe 19 aug. că dovezile sunt insuficiente și comportamentul e intenționat (mesajele din canale publice sunt căutabile de orice membru); publicat 20 aug. 2024.
- **Detecție:** cercetare externă (PoC); nu e un incident în producție documentat.
- **Containment (cel descris):** proprietarii/adminii pot restricționa ingestia de fișiere în Slack AI; sursa nu descrie un patch `[verifică dacă Slack a corectat ulterior]`.
- **Metadate/log-uri (inferență, nu din sursă):** canale publice cu un singur membru nou create, răspunsuri AI cu linkuri externe și parametri lungi, audit logs ale Slack `[verifică disponibilitatea]`.
- **Lecție:** extinderea surselor pe care un asistent le citește extinde ce poate injecta un atacator (OWASP LLM01) chiar fără acces la datele private.
- **Clasificare:** AI (prompt injection, exfiltrare prin link), DLP · Eng.
- **Sursă:** PromptArmor – https://promptarmor.substack.com/p/data-exfiltration-from-slack-ai-via (acces 2026-10-23, deschis, primară a cercetătorului).

### AI02 – Linkuri de share ale chatbot-urilor indexate de motoare de căutare (ChatGPT, Grok, 2025) · DOC · general
- **ChatGPT:** o opțiune „Make this chat discoverable", activată în două clicuri după crearea linkului de share, permitea indexarea conversațiilor de către Google/Bing/DuckDuckGo. OpenAI a descris-o drept „experiment de scurtă durată", a dezactivat-o la finalul lui iulie / începutul lui august 2025 și a colaborat cu furnizorii de căutare pentru eliminarea linkurilor deja indexate. Ștergerea linkului nu elimină automat copiile din cache. CISO-ul OpenAI a spus că funcția crea prea multe ocazii de partajare accidentală.
- **Grok:** Forbes (21 aug. 2025) a raportat peste 370 000 de conversații Grok indexate de Google; butonul de share crea un URL unic, fără avertisment; conținut: întrebări medicale/psihologice, nume, cel puțin o parolă, imagini/foi de calcul încărcate. xAI nu a răspuns la solicitarea Forbes.
- **Detecție:** utilizatori și jurnaliști, prin căutări `site:`; nu prin controale ale furnizorilor.
- **Lecția pentru DLP enterprise (inferență):** un link de share este un URL public; DLP-ul pe „upload către AI" nu acoperă faptul că răspunsul/promptul poate deveni public ulterior. Controalele care contează: politică de utilizare, conturi enterprise cu setări de share restrânse, monitorizarea domeniilor `*/share` în proxy/CASB.
- **Impact/notificare:** nu există notificări de breșă documentate (nu a fost o intruziune; a fost o funcție de produs).
- **Clasificare:** AI (shadow AI, share links), DLP · L2, Gov.
- **Surse:** Bitdefender Hot for Security (4 aug. 2025) – https://www.bitdefender.com/en-us/blog/hotforsecurity/openai-pulls-make-chat-discoverable-feature-from-chatgpt-to-safeguard-privacy ; Forbes Australia (21 aug. 2025) – https://www.forbes.com.au/news/innovation/xai-published-hundreds-of-thousands-of-grok-chatbot-conversations/ (ambele deschise 2026-10-23, secundare). Cifra „peste 4 500 de linkuri ChatGPT indexate (Fast Company)" apare doar într-un rezultat de căutare → `[verifică]`.

### AI03 – Secrete Hugging Face Spaces accesate neautorizat (mai 2024) · DOC · tech-vendor
- **Situație:** Hugging Face a detectat acces neautorizat la platforma Spaces, în special la *Spaces secrets*; un subset de secrete ar fi putut fi accesat. Postarea e din 31 mai 2024 și spune că activitatea a fost detectată „mai devreme în săptămâna aceea".
- **Detecție:** echipa Hugging Face; metoda nu e descrisă.
- **Containment (revocare/rotire):** revocarea mai multor token-uri HF stocate în secretele afectate; utilizatorii au fost sfătuiți să **reînnoiască cheile/token-urile** și să treacă la *fine-grained tokens* (acum implicite); analiză cu firme forensice externe.
- **Schimbări ulterioare:** eliminarea org tokens (trasabilitate), introducerea unui KMS pentru secretele Spaces, identificare proactivă și invalidare a token-urilor scurse, deprecierea token-urilor „classic".
- **Impact/notificare:** numărul de secrete afectate nu e dat; utilizatorii cu token-uri revocate au primit email; incident raportat către autorități de aplicare a legii și de protecție a datelor.
- **Relevanță:** secretele de platformă AI (tokeni către modele, API-uri) sunt ținte la fel ca cheile de cloud; aceleași reguli de rotire.
- **Clasificare:** AI/ML platform, Cloud (secrets), IR · L2/L3.
- **Sursă:** Hugging Face – https://huggingface.co/blog/space-secrets-disclosure (acces 2026-10-23, deschis, autoraportare).

### AI04 – Server MCP Asana: date expuse între organizații (iun. 2025) · DOC · tech-vendor
- **Situație:** un defect de logică în serverul MCP al Asana (lansat în beta pe 1 mai 2025) a permis ca informații ale unei organizații să fie vizibile altor utilizatori MCP, **în limita permisiunilor utilizatorului respectiv** (nu workspace-uri întregi). Date posibile: detalii de task-uri, metadate de proiect, echipe, comentarii, fișiere încărcate.
- **Cronologie:** descoperit 4 iun. 2025; serverul scos din funcțiune (10–12 zile; BleepingComputer: revenit la funcționare normală pe 17 iun., 17:00 UTC); ≈1 000 de clienți afectați (declarație a unui purtător de cuvânt către BleepingComputer).
- **Detecție:** sursa nu spune cum a fost detectat `[verifică]`.
- **Containment:** MCP oprit, defect corectat (sursa nu confirmă explicit corecția), notificări trimise fiecărei organizații afectate; clienții au fost îndrumați să-și revizuiască log-urile de acces MCP și rezumatele generate de AI; recomandare de a seta integrarea LLM pe acces restricționat și de a opri reconectările automate.
- **Dovezi de exploatare:** sursele citite nu indică exploatare reală de către atacatori (afirmație din rezultat de căutare, `[verifică]` pe sursa primară).
- **Ce a mers prost:** izolare între tenanți insuficientă într-un produs nou (agenți/MCP) lansat rapid; fereastra de expunere ≈ 34 de zile (1 mai–4 iun.) sau „peste o lună", după sursă.
- **Clasificare:** AI (MCP, agenți), Cloud (tenant isolation), IR · L2, Gov.
- **Surse:** BleepingComputer (18 iun. 2025) – https://www.bleepingcomputer.com/news/security/asana-warns-mcp-ai-feature-exposed-customer-data-to-other-orgs/ (deschis 2026-10-23, secundară); detalii suplimentare din rezultatul de căutare (The Register, UpGuard) **neîncărcate** `[verifică]`.

### AI05 – ForcedLeak: prompt injection prin formular Web-to-Lead în Agentforce (2025) · DOC · tech-vendor
- **Mecanism (Noma Labs):** un atacator trimite un formular Web-to-Lead cu instrucțiuni ascunse în câmpul Description (până la 42 000 de caractere); mai târziu, un angajat cere agentului Agentforce o sarcină banală despre lead; agentul execută instrucțiunile din datele stocate; Content Security Policy permitea imagini dintr-un domeniu *expirat*, pe care cercetătorii l-au cumpărat; agentul a produs un tag de imagine cu date CRM în parametri → exfiltrare la randare. CVSS 9,4.
- **Cronologie:** descoperit și raportat 28 iul. 2025; Salesforce a confirmat 31 iul.; **Trusted URLs** impuse pentru Agentforce și Einstein AI 8 sept.; dezvăluire publică 25 sept. 2025.
- **Date la risc:** contacte clienți, pipeline de vânzări, comunicări interne, date de integrări, istoric de interacțiuni.
- **Containment (recomandări Noma/Salesforce):** impunerea Trusted URLs, audit al datelor de lead pentru submisii suspecte, validarea câmpurilor controlate de utilizator, inventar al agenților și al uneltelor lor, controale de runtime pentru tool calls și sanitizare a output-ului.
- **Notă de încredere:** sursa este cercetătorul (vendor de securitate); nu există dovezi de exploatare reală în pagină.
- **Clasificare:** AI (OWASP LLM01 și LLM06), DLP · Eng.
- **Sursă:** Noma Security – https://noma.security/blog/forcedleak-agent-risks-exposed-in-salesforce-agentforce/ (acces 2026-10-23, deschis, primară a cercetătorului).

### AI06 – CamoLeak: GitHub Copilot Chat exfiltrează cod privat (2025) · DOC · tech-vendor
- **Mecanism:** instrucțiuni ascunse în comentarii markdown invizibile într-un pull request/issue; când un maintainer cere Copilot Chat să rezume, asistentul (cu permisiunile utilizatorului) caută secrete în repo și le codifică ca secvențe de imagini 1×1 prin URL-uri Camo pre-generate (câte unul per caracter), ocolind CSP; atacatorul reconstruiește datele din ordinea cererilor. Conținut exfiltrabil în PoC: chei AWS, token-uri de securitate, cod privat și descrierea unui zero-day dintr-un issue privat.
- **Cronologie:** cercetător Omer Mayraz (Legit Security) via HackerOne; articolul The Register e din 9 oct. 2025; GitHub a dezactivat randarea imaginilor în Copilot Chat pe 14 august (anul implicit 2025 din context; `[verifică]`); CVSS 9,6 conform dezvăluirii. Identificatorul CVE din rezultatele de căutare **nu** l-am confirmat → nu îl folosiți.
- **Dovezi de exploatare:** doar PoC; fără victime confirmate în sursa citită.
- **Control relevant:** GitHub a tratat canalul de exfiltrare (randare de imagini), nu promptul.
- **Clasificare:** AI (prompt injection în agent de cod; OWASP LLM01/LLM02), Cloud (secrete în repo) · Eng.
- **Sursă:** The Register – https://theregister.com/2025/10/09/github_copilot_chat_vulnerability/ (acces 2026-10-23, deschis, secundară).

### AI07 – Extensie de browser care colectează conversațiile cu chatboți (Urban VPN Proxy, 2025) · DOC · general
- **Ce a găsit Koi Security (raportat 16 dec. 2025):** extensia Urban VPN Proxy (Chrome; același cod în alte șapte extensii ale aceluiași publisher, pe Chrome și Edge) captura prompturi, răspunsuri, timestamp-uri și identificatori de sesiune de la platforme precum ChatGPT, Claude și Gemini, chiar când VPN-ul era oprit; colectarea a fost introdusă în versiunea **5.5.0 din 9 iul. 2025**, activată implicit, fără opțiune de dezactivare (doar dezinstalare); trimis la servere de analytics ale publisher-ului, cu partajare către terți „pentru marketing analytics".
- **Scală:** peste 6 mil. de utilizatori pentru Urban VPN Proxy, peste 8 mil. pentru toate extensiile; publisher-ul nu răspunsese la momentul articolului. Insigna „Featured" Google era prezentă.
- **Dovadă de calitate:** analiză a unui vendor de securitate; nu am găsit verificare independentă `[verifică]`.
- **Detecție (enterprise, inferență):** inventar de extensii și blocare/allowlist prin politici de browser; trafic spre domenii noi de analytics din browsere cu prompt-uri AI; **un control Purview/DLP pe site-ul AI nu vede exfiltrarea făcută de extensie**, fiindcă ea interceptează la nivel de browser și trimite pe alt canal.
- **Containment (inferență):** dezinstalare centralizată, reset al secretelor lipite în prompturi, evaluare GDPR dacă s-au transmis date personale către terț.
- **Clasificare:** AI (shadow AI), DLP (extensii, canale ocolite), Network forensics · L2, Eng.
- **Sursă:** Infosecurity Magazine – https://infosecurity-magazine.com/news/urban-vpn-proxy-harvesting-ai-chats (acces 2026-10-23, deschis, secundară). Detalii despre domeniile de destinație și numele broker-ului sunt din rezultate de căutare (CSO, Dark Reading) neîncărcate → `[verifică]`; pagina primară Koi nu s-a putut încărca (URL redirecționat).

### AI08 – Analist financiar lipește IBAN-uri într-un ChatGPT personal · COMP · finance
- **Ancoră documentată:** exemplul de politică Purview „Edge for Business către AI neadministrat" (SIT: IBAN, SWIFT Code, ABA Routing Number; acțiunea *Text sent to or shared with cloud or AI apps → Block*; mod simulation), politicile `DSPM for AI - Block sensitive info from AI sites` și `DSPM for AI - Block elevated risk users…` (secț. 4.1), și incidentul Samsung (S10 din `02`).
- **Situație (ilustrativă):** în *simulation mode*, 14 evenimente de la același utilizator arată text cu nume + IBAN trimis către o aplicație AI consumer; un browser Chrome fără extensie Purview oferă acoperire parțială; unele aplicații AI trimit conținut codat (limită documentată).
- **Decizii:** trecerea din simulation în block în etape; block-with-override doar pentru utilizatori cu risc ridicat (Adaptive Protection); notificare utilizator + coaching; excepții documentate cu expirare.
- **Containment:** nu există „recall" către un serviciu AI terț; se evaluează baza legală și transferul în afara UE, se cere ștergerea conversației/contului (dacă e posibil), se documentează breșa.
- **Raportare la management:** diferența dintre *încercare blocată* și *scurgere confirmată*; folosirea termenilor „condițional: dacă promptul a fost trimis".
- **Clasificare:** AI, DLP · L1/L2, Gov.

### AI09 – Consultant folosește un AI notetaker în ședința clientului · COMP · mssp-consulting
- **Ancoră documentată:** Purview listează *Otter.ai* și *Notion AI* printre aplicațiile AI nemanaged suportate (secț. 4.1b); Netskope descrie (articol GTS) blocarea aplicațiilor AI nesancționate și permiterea celor sancționate cu *User Coach*; cazul Samsung (S10).
- **Situație (ilustrativă):** un consultant conectează un notetaker AI la apelul video cu un client bancar; transcrierea include informații acoperite de NDA și date de clienți ai băncii; contractul interzice procesarea la terți nedeclarați.
- **Metadate care ar fi contat (inferență):** trafic către domeniul serviciului AI (proxy/CASB), instalare de extensii/aplicații, eveniment `AI website visit` din DSPM, participant „bot" în log-ul platformei de meeting.
- **Containment:** oprirea înregistrării, ștergerea transcrierii la furnizor, notificarea clientului conform contractului (aici obligația contractuală poate fi mai strictă decât GDPR), revizuirea listei de sub-procesatori.
- **Decizie de judecată:** blocare totală vs permitere cu DLP inline și coaching; alternativă enterprise aprobată.
- **Clasificare:** AI, DLP, Gov (third-party) · L2, Gov.

### AI10 – Copilot intern cu acces la CRM exfiltrează date prin imagine randată · COMP · finance
- **Ancoră documentată:** ForcedLeak (AI05), CamoLeak (AI06), Slack AI (AI01) și EchoLeak (S13 din `02`): content extern ajunge în același context cu date interne, iar output-ul randat (link/imagine) devine canal de exfiltrare.
- **Situație (ilustrativă):** o bancă a conectat un asistent intern la CRM și la un site SharePoint; un formular public de contact permite text liber, iar un atacator lasă acolo instrucțiuni ascunse; un agent de relații cu clienții cere asistentului „rezumă ultimele mesaje de la prospecți".
- **Ce poate vedea defensiv:** log-uri de randare/ieșire către domenii neaprobate (proxy), prompturi cu lungime și structură anormale în câmpurile de formular, accesări de documente de către asistent în afara contextului cererii (Purview: `AI interaction` + fișiere referite).
- **Controale documentate pentru produsele Microsoft:** DLP pentru Copilot (restricții pe SIT în prompt, pe fișiere cu label, exclude emailurile externe din grounding – preview, pe baza metadatelor expeditorului; nu scanează fișierele încărcate direct în prompt – `02` §3); `DSPM for AI - Protect sensitive data from Copilot processing`.
- **Containment:** dezactivarea temporară a sursei contaminate, listă de URL-uri de încredere pentru output, privilegii minime ale agentului (OWASP LLM06), curățarea datelor de lead suspecte.
- **Notificare:** dacă se confirmă transmiterea de date personale ale clienților către un destinatar extern → art. 33 GDPR; dovada transferului depinde de log-urile de ieșire.
- **Clasificare:** AI (OWASP LLM01/LLM02/LLM06), DLP · Eng, L2.

---

## 7. Mapare pe domeniile taxonomiei (acoperire R5)

| Domeniu (pondere) | Scenarii R5 |
|---|---|
| Cloud security (8 %) | CL01–CL15, AI03, AI04 |
| AI în SOC și riscuri AI (4 %) | AI01–AI10 |
| DLP (20 %) | CL11, CL12, AI02, AI05, AI07, AI08, AI09, AI10 |
| SIEM (12 %) | CL01, CL04, CL06, CL09, CL13, CL14 |
| Incident Response (18 %) | CL01–CL05, CL07, CL10, CL15, AI03, AI04 |
| Network forensics (10 %) | AI07 (parțial) |

**Lacune:** niciun scenariu nou documentat nu e strict financiar; GCP are doar un COMP (CL14); nu există scenariu documentat despre un *asistent AI folosit de SOC* (direcția 2 din CONTEXTi §7) – tema nu a făcut parte din cerința R5 de „scurgere de date".

---

## 8. Dezacorduri

1. **Retenția audit log în CONTEXTi §7 (90 de zile fără E5) vs documentația Microsoft:** Audit Standard are **180 de zile** pentru înregistrările generate de la 17 oct. 2023 (90 înainte). Mai mult, retenția de 1 an a Audit Premium se aplică doar utilizatorilor cu licență E5/Purview Suite/add-on și doar pentru workload-urile AzureActiveDirectory, Exchange, OneDrive, SharePoint; restul sunt 180 de zile. CONTEXTi trebuie corectat.
2. **`SharingSet` în CONTEXTi §7 ca indicator de scurgere:** documentația îl definește ca partajare cu un utilizator *din director* (membru sau guest cu cont). Partajarea cu un extern fără cont produce `AnonymousLinkCreated`, `SecureLinkCreated`+`AddedToSecureLink` sau `SharingInvitationCreated`. Subtilitate între două pagini Microsoft: `audit-log-activities` descrie `SharingInvitationCreated` ca „resursă partajată cu un utilizator din afara directorului", iar `audit-log-sharing` adaugă că se loghează **doar când resursa e un site**.
3. **ChatGPT „discoverable":** data dezactivării diferă între surse (31 iul. vs 1 aug. 2025); numărul de conversații indexate: ≈4 500 de linkuri (Fast Company, din snippet) vs „până la 70 000" (circulat pe X, neverificat) vs „mii" (Bitdefender, fără cifră). Nu am folosit niciun număr pentru ChatGPT în scenariu.
4. **Asana MCP:** fereastra de expunere – „peste o lună" (BleepingComputer, de la 1 mai) vs ≈34 de zile (rezumat de căutare); durata opririi – 5–17 iun. (rezumat de căutare) vs „revenit pe 17 iun. 17:00 UTC" (BleepingComputer). Sursa citită nu spune dacă bug-ul a fost corectat explicit.
5. **Urban VPN:** „peste 6 mil." (Infosecurity, pentru extensia principală) vs „≈8 mil." (toate extensiile, Koi/Infosecurity). „Vândute pentru publicitate" este caracterizarea Koi, nu un fapt verificat independent.
6. **CamoLeak:** CVSS 9,6 din dezvăluire; identificatorul CVE apare în rezultate de căutare, dar nu s-a putut confirma → omis. Anul mitigării (14 august) nu e scris în articol, doar implicit.
7. **Storm-0558 vs audit:** pagina Microsoft deschisă spune că nu e nevoie de acțiune a clienților și nu menționează `MailItemsAccessed`/licențe; legătura dintre incident și extinderea auditului Standard apare doar într-un rezumat de căutare (Practical365) și nu a fost confirmată de pagina office365itpros încărcată.
8. **LastPass:** paginile deschise vorbesc despre „software terț vulnerabil" și „alt angajat"; detalii precum „calculatorul de acasă" sau „chei S3" nu apar în ele.
9. **Netskope release 139.0.0:** un rezultat de căutare spune că aduce AI Guardrails în Enterprise Browser; pagina de release notes (6 iul. 2026) nu menționează asta. Tratat ca neconfirmat.
10. **Purview DSPM for AI „classic" vs nou:** pagina classic spune că a fost înlocuită de „Data Security Posture Management" nou; numele politicilor `DSPM for AI - …` pot fi diferite în portalul curent. Datele de pagină diferă (`ms.date` 2025-12-15 / 2026-05-01 vs `updated_at` 2026-06-25).
11. **Okta:** cauza inițială e formulată ca „cea mai probabilă" (cont/dispozitiv personal compromis), nu ca fapt confirmat; 134 de clienți cu fișiere accesate și 5 cu sesiuni deturnate sunt cifrele Okta (autoraportare).
12. **Cloudflare:** „fără impact asupra datelor clienților" este afirmația Cloudflare; analiza independentă CrowdStrike e citată, dar raportul ei nu a fost deschis.
13. **Zscaler:** textul blogului (2023) vs capabilitățile AI Guard (repo GitHub): sunt produse și momente diferite; nu amestecați în aceeași întrebare „ce face DLP-ul Zscaler pentru ChatGPT". Pragurile 0,5/0,7 provin doar dintr-un rezumat de căutare.

## 9. Limitări

- **Reddit/practicieni:** inaccesibil; zero afirmații din surse de tip forum.
- **Netskope și Zscaler:** `docs.netskope.com` a returnat doar titlu/meniu pentru pagina `ai-security-guardrails`; pagina `ai-security-guardrails-profile` s-a încărcat. `help.zscaler.com` este redat prin JavaScript: **toate paginile de help oficiale au întors conținut gol**; PDF-urile (deployment guide, solution brief) au venit binare, fără text extras. Din acest motiv, la Zscaler nu pot da „nume exact de politică DLP" din documentația oficială a help portalului; am folosit blogul oficial (2023) și repo-ul oficial GitHub pentru AI Guard. La Netskope nu am putut deschide o pagină oficială care să dea nume de profile DLP pentru AI generativ.
- **WebFetch rezumă prin model:** textul citit e rezumat de un model mic; rândurile de tabel Purview pentru cele cinci operații au fost cerute verbatim și coincid între citiri independente, dar citatele exacte nu sunt garantate. Ultimele ~39 500 de caractere ale paginii `audit-log-activities` nu au fost citite (nu conțin secțiunile de interes).
- **Pagini neîncărcate sau parțial încărcate:** AWS CloudTrail (prima pagină a dat conținut gol; a doua, `logging-data-events-with-cloudtrail`, s-a încărcat parțial – primele 100 000 din 110 269 caractere), blogul Koi (URL redirecționat), pagina primară Fast Company, The Register/UpGuard pentru Asana, pagina MSRC pentru Storm-0558, blogul Microsoft „expands cloud logging", Netskope `create-a-next-generation-api-data-protection-policy`, Cloudflare AI Gateway DLP și changelog. Informațiile din aceste surse apar doar ca `[verifică]`.
- **Autoraportare:** o mare parte din scenariile DOC sunt povestite de victimă (Cloudflare, CircleCI, Okta, LastPass, Hugging Face). Ce *nu* spun (ex. nicio notificare către regulator) nu e tratat ca fapt.
- **Metadatele DLP/SIEM** din scenariile DOC sunt în mare parte *inferență*; incidentele publice rareori descriu telemetria. Excepții bune cu detalii de log: CL01 (alerta pe grup), CL03 (tipuri de eveniment), CL09 (nume de operații Azure), CL02 (`repo.download_zip`).
- **Scenariile COMP** sunt ilustrative; **nu** se citează ca fapte în explicațiile întrebărilor.
- **Obligații de notificare:** doar GDPR art. 33 e verificat deschis (în `02-scenarios.md`); DORA și criteriile de „incident major" rămân `[verifică]` pe EUR-Lex; nu am deschis nicio decizie de autoritate pentru scenariile noi.
- **Cerința „3 rapoarte publice de scurgere prin AI"** din CONTEXTi §7 este acoperită în `02-scenarios.md` §4 (cinci cazuri); aici AI01–AI07 adaugă șapte cazuri documentate, dintre care **doar trei au sursă primară a cercetătorului sau a vendorului** (AI01, AI03, AI05); AI02, AI04, AI06 și AI07 au doar surse secundare (presă).
- **Date:** ziua curentă a sesiunii este 2026-10-23; „acces" înseamnă data deschiderii în această sesiune, nu data publicării sursei.
