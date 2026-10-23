# CyberQuiz

Aplicație web statică de quiz cu explicații, care pregătește analiști pentru roluri de Data Leakage Monitoring / SOC / Incident Response.

## Language

### Conținut

**Question**:
Unitatea de conținut a băncii, cu ID stabil, un singur tip, explicație și cel puțin o referință.
_Avoid_: Item, card, quiz

**Domain**:
Una dintre cele 10 arii tematice ale băncii (ex. DLP, SIEM); fiecare are un fișier de date și o pondere.
_Avoid_: Category, topic, subject

**Layer**:
Nivelul de carieră pe care îl exersează o întrebare: L1, L2, L3, Engineering sau Governance / Risk.
_Avoid_: Level, role, tier

**Difficulty**:
Complexitatea cognitivă a unei întrebări: `basic`, `intermediate` sau `advanced`.
_Avoid_: Level, grade

**Scenario**:
Un caz real descris în 5–10 rânduri, cu artefacte și o listă ordonată de întrebări înlănțuite, încheiat cu un debrief.
_Avoid_: Case, story, exercise

### Moduri de lucru

**Practice mode**:
Mod în care alegi domeniile, layerul și numărul de întrebări, cu feedback imediat după fiecare răspuns.
_Avoid_: Study mode, training

**Exam mode**:
Simulare cronometrată de 30–60 de întrebări mixte, cu feedback doar la final.
_Avoid_: Interview mode, test mode

**Scenario mode**:
Mod în care parcurgi un Scenario și întrebările lui, în ordine.
_Avoid_: Case mode

**Review mode**:
Mod care reia doar întrebările Missed sau Flagged, după programul de repetare spațiată.
_Avoid_: Mistakes mode, revision

### Progres

**Missed**:
O întrebare la care ultimul răspuns a fost greșit.
_Avoid_: Wrong, failed

**Flagged**:
O întrebare marcată de utilizator cu „nu sunt sigur”, indiferent dacă răspunsul a fost corect.
_Avoid_: Bookmarked, starred

**Disputed**:
O întrebare contestată, scoasă din rotație până la review.
_Avoid_: Reported, broken

**Reviewed**:
O întrebare verificată tehnic de agentul reviewer; doar acestea sunt servite de aplicație.
_Avoid_: Approved, validated
