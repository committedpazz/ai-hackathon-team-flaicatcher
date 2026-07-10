# Specificaties E-learningplatform voor Test Consultants

**Versie:** 0.1 (concept — input voor brainstorm/validatie)
**Datum:** 10 juli 2026
**Status:** Concept, dient als basis voor ontwikkeling met agentic AI

---

## 1. Inleiding

### 1.1 Doel van dit document

Dit document vertaalt onze brainstorm over het nieuwe e-learningplatform naar concrete functionele en niet-functionele specificaties. Het dient als brondocument om de applicatie te laten bouwen met agentic AI: hoe explicieter en concreter de specificaties, hoe beter een AI-coding agent hiermee aan de slag kan.

### 1.2 Context

De doelgroep bestaat voornamelijk uit **Test Consultants**. Kenmerkend voor deze doelgroep is de dubbele rol die zij kunnen vervullen:

- Als **learner** volgen zij trainingen om hun vakkennis te ontwikkelen (bijv. testautomatisering, testmanagement, ISTQB-voorbereiding).
- Als **trainer** stellen ervaren Test Consultants zelf trainingen samen om kennis te delen met collega's.

Deze hybride rol is een randvoorwaarde die consequent door het hele platform moet worden doorgevoerd — het is geen uitzondering, maar het uitgangspunt.

### 1.3 Aanpak

Ter voorbereiding is een marktverkenning gedaan naar bestaande e-learning- en LMS-platformen (o.a. Docebo, Easygenerator, TalentLMS, 360Learning, Absorb LMS, CYPHER Learning, Tovuti LMS en EducateMe). De belangrijkste inzichten staan in hoofdstuk 2 en zijn verwerkt in de functionele specificaties in hoofdstuk 4 en 5.

### 1.4 Scope

Het platform bestaat uit twee samenhangende omgevingen:

- **Admin-omgeving** — voor platformbeheerders en trainers/content creators
- **Learner-omgeving** — voor Test Consultants die trainingen volgen

Buiten scope van dit document: technische architectuurkeuzes (hosting, technologie-stack), gedetailleerd UX/UI-ontwerp en een concreet implementatieplan. Zie hoofdstuk 9 voor openstaande vragen die dit raken.

---

## 2. Marktverkenning: inspiratie uit bestaande platformen

| Platform                         | Sterke punten                                                                                                                                         | Relevantie voor ons platform                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Easygenerator**                | AI-functie (EasyAI) zet PPT/PDF/Word binnen minuten om naar interactieve e-learning inclusief quizvragen; publiceert naar SCORM/xAPI; 75+ talen       | Directe blauwdruk voor content-import & AI-conversie (§4.2)                          |
| **Docebo**                       | AI-suite voor contentaanbevelingen, zoeken en coaching; aangekondigde agentic AI-functionaliteit voor het automatiseren van workflows; skills-mapping | Inspiratie voor de aanbevelingsengine (§5.2) en een eventuele AI-coach voor learners |
| **TalentLMS**                    | Volwassen, volledig instelbaar gamification-systeem (punten, badges, levels, leaderboards) met eigen rapportages                                      | Blauwdruk voor het gamification-systeem (§5.5)                                       |
| **360Learning**                  | "Collaborative learning": vakexperts maken zelf content, met peer review en feedback van collega's                                                    | Inspiratie voor de hybride trainer/learner-rol (§3, §5.9)                            |
| **Tovuti LMS / EducateMe**       | Cursusgenerator die van een document (of prompt) automatisch lessen, quizvragen, afbeeldingen, narratie én een kant-en-klare SCORM-package maakt      | Referentie voor de geautomatiseerde moduleopbouw (§4.2)                              |
| **Absorb LMS / CYPHER Learning** | Competentiegerichte leerpaden die pas ontgrendelen na aangetoonde vaardigheid; ingebouwde AI-agent beantwoordt vragen tijdens het leren               | Inspiratie voor adaptieve leerpaden (§5.1) en een in-context AI-tutor                |
| **Axonify**                      | Adaptieve microlearning: korte, frequente herhaalsessies afgestemd op functie en kennisniveau                                                         | Inspiratie voor kennisonderhoud/herhaling ná afronding van een training              |

**Belangrijkste conclusies:**

1. AI-conversie van bestaand materiaal (PPT/PDF/Word) naar e-learning is inmiddels bewezen technologie, geen experiment — meerdere platformen bieden dit als kernfunctie.
2. Bij AI-conversie geven gebruikers doorgaans aan hoe dicht de AI bij het origineel moet blijven, en blijft een menselijke reviewstap essentieel vóór publicatie.
3. Gamification werkt het best wanneer badges/punten zijn gekoppeld aan aantoonbare vaardigheid, niet aan losse deelname.
4. Aanbevelingsengines werken vergelijkbaar met streamingdiensten: ze combineren historie, functie/rol en gedrag van vergelijkbare gebruikers.
5. 2026 is het jaar waarin "agentic AI" in leerplatformen mainstream wordt: van losse chatbots naar AI-agents die proactief begeleiden, vragen beantwoorden en zelfs content-taken van de admin overnemen.
6. Contentstandaarden zoals SCORM en xAPI/cmi5 bepalen mede hoe toekomstvast en interoperabel het platform is (zie §7.7).

---

## 3. Doelgroepen & rollen

| Rol                           | Omschrijving                                                      | Kernrechten                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Platformbeheerder (Admin)** | Verantwoordelijk voor het systeem als geheel                      | Gebruikersbeheer, systeeminstellingen, alle rapportages, rollen toekennen                                     |
| **Trainer / Content Creator** | Een Test Consultant (of L&D-medewerker) die trainingen samenstelt | Content importeren/laten converteren, trainingen bouwen en publiceren, resultaten van eigen trainingen inzien |
| **Learner**                   | Een Test Consultant die trainingen volgt                          | Leerpaden volgen, toetsen maken, voortgang en resultaten inzien                                               |

**Ontwerpprincipe:** rollen zijn niet exclusief. Eén gebruiker heeft typisch zowel de rol Learner als Trainer. Het systeem moet dit ondersteunen via role-based access control met meerdere rollen per gebruiker, en een naadloze overgang bieden tussen "leren" en "content maken" (zie §5.9) zonder dat dit aanvoelt als het wisselen van applicatie.

_Open vraag: is er behoefte aan een tussenrol zoals "L&D-coördinator" die trainers begeleidt maar geen volledige systeembeheerder is? Zie hoofdstuk 9._

---

## 4. Admin-omgeving — Functionele specificaties

### 4.1 Gebruikersmanagement

- Gebruikers aanmaken, bewerken, deactiveren/archiveren (bewaren i.p.v. hard verwijderen, t.b.v. historie en verantwoording)
- Rollen en rechten toekennen (RBAC), inclusief combinaties van rollen per gebruiker
- Groepen/teams samenstellen (bijv. per klantproject, praktijkgroep, vestiging, senioriteitsniveau)
- Bulk-import van gebruikers via CSV/Excel
- Koppeling met bestaande identiteitsbronnen (SSO, bijv. Microsoft Entra ID of Google Workspace)
- Optionele zelfregistratie met goedkeuringsflow voor externe deelnemers
- Overzicht van (actieve) gebruikers en licenties t.b.v. beheer

### 4.2 Content-import & AI-conversie van trainingsmateriaal

Kernfunctionaliteit van het platform:

- Upload van bestaand trainingsmateriaal: PowerPoint (.ppt/.pptx), PDF en Word (.doc/.docx)
- AI-analyse van het document: herkenning van structuur (koppen, hoofdstukken, opsommingen, afbeeldingen, tabellen)
- Automatische omzetting naar e-learning modules:
  - Tekst wordt herschreven en opgedeeld in behapbare leerblokken, niet letterlijk gekopieerd van de slides
  - Automatisch gegenereerde quizvragen op basis van de inhoud (meerkeuze, waar/onwaar, open vraag), altijd ter review aan de trainer
  - Optioneel: gegenereerd narratiescript, bruikbaar voor voice-over
  - Optioneel: tekst-naar-spraak narratie en automatische vertaling
- Instelbare mate van AI-bewerking: "blijf dicht bij het origineel" versus "laat AI de inhoud verrijken/verbeteren met extra uitleg en voorbeelden"
- Mogelijkheid om doelgroep en kennisniveau op te geven (bijv. junior vs. senior Test Consultant), zodat gegenereerde content daarop wordt afgestemd
- Verplichte menselijke reviewstap: AI-gegenereerde modules starten als concept en moeten door een trainer worden goedgekeurd of bewerkt vóór publicatie ("human in the loop")
- OCR-ondersteuning voor gescande/afbeelding-only PDF's
- Herbruikbare mediabibliotheek voor afbeeldingen, video's en documenten

### 4.3 Trainingsbeheer & contentstructuur

- Aanmaken, bewerken, dupliceren, archiveren en versiebeheer van trainingen
- Hiërarchische opbouw: **Training → Hoofdstuk/module → Les → Content-element**
- Drag-and-drop structuurbouwer om volgorde en hiërarchie **handmatig** aan te passen — los van, of in aanvulling op, een AI-voorgestelde structuur uit §4.2
- Mogelijkheid om een AI-voorgestelde structuur volledig te overschrijven
- Preview-modus: bekijk de training zoals een learner die zou ervaren, vóór publicatie
- Publicatie-workflow: concept → interne review → gepubliceerd → gearchiveerd
- Metadata per training: niveau, verwachte duur, taal, tags/onderwerp, verplicht of optioneel, doelgroep
- Koppeling van trainingen aan leerpaden (zie §5.1)

### 4.4 Ondersteunde content-types

Een training kan bestaan uit een combinatie van:

- **Tekst** — rich-text editor met opmaak, links en opsommingen
- **Video** — uploaden of embedden, met ondertiteling
- **Afbeeldingen** — inclusief infographics en diagrammen
- **Quizvragen** — meerkeuze, meerdere-antwoorden, waar/onwaar, open vraag, matching, invulvragen
- **Overige interactieve elementen** — scenario-/casusoefeningen, branching-scenario's met consequenties (bijvoorbeeld praktijksituaties uit testprojecten), flashcards, korte polls
- **Downloadbare bijlagen** — templates, checklists, cheat sheets
- Import van extern gebouwde content via SCORM/xAPI/cmi5, zodat content uit andere auteurstools ook ingeladen kan worden

### 4.5 Toetsbeheer

- Centrale, herbruikbare vraagbank
- Instelbare slagingscriteria (bijv. minimaal 80% correct), maximaal aantal pogingen en tijdslimiet
- Willekeurige selectie/volgorde van vragen uit een vragenpool
- Automatische certificaatgeneratie bij een voldoende resultaat

### 4.6 Rapportages & analytics

- Voortgang en resultaten per gebruiker, team of training
- Completion rates en gemiddelde scores
- Dashboards voor management, filterbaar per praktijkgroep of klantteam
- Export naar Excel/PDF
- Signalering van achterblijvende deelnemers of trainingen met een lage voltooiingsgraad

### 4.7 Notificaties & communicatie

- Automatische herinneringen (nieuwe verplichte training, naderende deadline, verlopend certificaat)
- Aankondigingen van nieuwe of bijgewerkte content
- Meldingen aan trainers bij feedback of vragen van learners

---

## 5. Learner-omgeving — Functionele specificaties

### 5.1 Leerpaden

- Gestructureerde leerpaden die meerdere trainingen in een logische volgorde bundelen (bijv. "Onboarding Test Consultant", "ISTQB Foundation", "Testautomatisering Traject")
- Onderscheid tussen verplichte en optionele onderdelen binnen een leerpad
- Leerpaden gekoppeld aan rol en senioriteit (junior/medior/senior Test Consultant, Test Manager)
- Ruimte voor zelfgestuurd leren buiten het verplichte leerpad

### 5.2 Persoonlijke aanbevelingen

- Aanbevelingsengine die op het dashboard een "volgende training" suggereert op basis van:
  - voltooide trainingen en behaalde resultaten (historie)
  - opgegeven of afgeleide interesses/vakgebieden
  - functie, rol en senioriteit
  - wat vergelijkbare collega's (zelfde rol/team) hebben gevolgd
- Korte toelichting bij elke aanbeveling ("aanbevolen omdat je Testautomatisering Basis hebt afgerond"), zodat dit geen black box is
- Voor nieuwe gebruikers zonder historie: aanbevelingen op basis van rol/functie, om het "cold start"-probleem te ondervangen

### 5.3 Cursusnavigatie & structuur

- Duidelijk overzicht van hoofdstukken/modules binnen een training, met status per onderdeel (nog niet gestart / bezig / afgerond)
- Consistente navigatie, bijvoorbeeld via een zijbalk met hoofdstukken en breadcrumbs
- Mogelijkheid om tussen onderdelen te springen, tenzij een training bewust lineair is ingericht

### 5.4 Voortgang

- Voortgang wordt automatisch en continu opgeslagen, ook bij tussentijds afsluiten
- Hervatten precies waar men gebleven was
- Synchronisatie van voortgang tussen apparaten (desktop, tablet, mobiel)

### 5.5 Gamification

Gebaseerd op wat daadwerkelijk motiveert — gekoppeld aan echte vaardigheidsopbouw, niet enkel "leuk":

- Punten/XP voor het afronden van lessen, quizzes en trainingen
- Badges gekoppeld aan concrete testvaardigheden (bijv. "Testautomatisering Basis", "Security Testing Specialist") in plaats van losse deelnamebadges
- Levels die oplopen naarmate meer badges/punten zijn behaald
- Optionele leaderboards, bij voorkeur per team of met periodieke reset, om demotivatie door "altijd dezelfde nummer 1" te voorkomen
- Streaks voor regelmatige leeractiviteit
- Een zichtbare "skill-tree" of vaardighedenmatrix die aansluit bij testcompetenties, zodat learners hun vakkennis letterlijk zien groeien
- Door de admin instelbaar: gamification aan/uit per onderdeel van de organisatie, punten- en badge-regels aanpasbaar

### 5.6 Toetsing

- Dezelfde vraagtypen als beschreven in §4.4
- Directe feedback na inleveren, met toelichting per fout antwoord
- Herkansing volgens de door de trainer ingestelde regels
- Certificaat bij een voldoende resultaat, downloadbaar als PDF

### 5.7 Resultaten & historie

- Overzicht van alle gevolgde en lopende trainingen
- Behaalde scores, certificaten en badges
- Downloadbaar/deelbaar certificatenoverzicht (bijvoorbeeld als bewijs van vakkennis richting klanten)
- Persoonlijk vaardighedenprofiel dat de opgebouwde testcompetenties samenvat

### 5.8 Voortgang van een training

- Percentage voltooid, per training én per leerpad
- Geschatte resterende tijd
- Visuele voortgangsbalk, zowel per hoofdstuk als voor de training als geheel

### 5.9 Trainerfunctionaliteit binnen de learner-omgeving

Omdat Test Consultants zowel learner als trainer kunnen zijn:

- Eenvoudige rolwissel of gecombineerd dashboard: "Mijn trainingen" naast "Mijn gemaakte trainingen"
- Trainers zien statistieken over hun eigen trainingen (aantal deelnemers, gemiddelde score, feedback)
- Learners kunnen feedback/waardering geven op een training, zichtbaar voor de trainer
- Laagdrempelige toegang tot de content-creatietools (§4.2–4.4) vanuit de learner-omgeving, zodat een Test Consultant die kennis wil delen niet naar een aparte omgeving hoeft te schakelen

---

## 6. AI en agentic AI — overzicht

Omdat de applicatie zelf met agentic AI gebouwd gaat worden, is het onderscheid tussen "AI als bouwmethode" en "AI als functionaliteit in het product" belangrijk. Onderstaande tabel geeft een samenvattend overzicht van de AI-functionaliteit die _in_ het platform zelf voorkomt (uitgewerkt in de secties hierboven), zodat dit gericht als losse bouwstenen (agents/tools) kan worden ontwikkeld.

| AI/agentic functie                       | Omgeving                   | Toelichting                                                                                                              |
| ---------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Content-conversie                        | Admin/Trainer (§4.2)       | PPT/PDF/Word → gestructureerde e-learning module met quizvragen                                                          |
| Automatische quizgeneratie               | Admin/Trainer (§4.2, §4.5) | Vraagsuggesties op basis van lesinhoud, altijd door de trainer te reviewen                                               |
| Aanbevelingsengine                       | Learner (§5.2)             | Suggereert vervolgtraining op basis van historie, rol en interesses                                                      |
| AI-tutor/coach _(mogelijke latere fase)_ | Learner                    | Beantwoordt vragen over lesinhoud tijdens het leren, vergelijkbaar met functionaliteit die onderzochte platformen bieden |
| Skill-gebaseerde badge-logica            | Learner (§5.5)             | Herkent wanneer een vaardigheid aantoonbaar is behaald, niet enkel "afgevinkt"                                           |
| Risicosignalering                        | Admin (§4.6)               | Signaleert learners die dreigen achter te blijven, of trainingen met een lage voltooiingsgraad                           |

**Let op:** voor alle AI-functionaliteit die content genereert (conversie, quizvragen, aanbevelingen) geldt het uitgangspunt **"human in the loop"**: AI doet een voorstel, een mens (trainer of admin) keurt goed. Dit voorkomt dat onjuiste of ongepaste content ongezien bij learners terechtkomt.

---

## 7. Niet-functionele requirements

1. **Beveiliging & privacy** — AVG/GDPR-compliance, rolgebaseerde toegang, encryptie van data in rust en onderweg
2. **Toegankelijkheid** — aansluiting bij WCAG 2.1/2.2 AA-richtlijnen
3. **Performance & schaalbaarheid** — geschikt voor gelijktijdig gebruik door een groeiend aantal Test Consultants; snelle laadtijden, ook voor video
4. **Mobiel/responsive** — volledig bruikbaar op smartphone en tablet; overweeg offline beschikbaarheid van gedownloade content
5. **Integraties** — SSO (bijv. Microsoft Entra ID), koppeling met HR-/planningssystemen, agenda-uitnodigingen, eventueel Teams/Slack-notificaties
6. **Meertaligheid** — minimaal Nederlands en Engels, gezien internationale klantprojecten
7. **Content-standaarden** — ondersteuning voor SCORM 1.2/2004 voor basale voltooiings- en scoretracking; overweeg xAPI/cmi5 wanneer rijkere gedragsdata (bijv. hoelang iemand op een onderdeel besteedt) gewenst is — deze keuze is bepalend voor hoe toekomstvast en interoperabel het platform is
8. **Auditability** — logging van wie welke content heeft gepubliceerd of gewijzigd, relevant wanneer content als bewijs van opleiding richting klanten kan dienen

---

## 8. Prioritering (voorstel, ter validatie)

Een eerste aanzet voor MoSCoW-prioritering, puur als startpunt voor de scoping van een MVP:

| Prioriteit                 | Onderdelen                                                                                                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Must have**              | Gebruikersmanagement met rollen (admin/trainer/learner, hybride); handmatige trainingsopbouw met tekst, video, afbeeldingen en quizvragen; handmatige structuurbepaling; voortgang opslaan en hervatten; basistoetsing met directe feedback; resultaten- en historieoverzicht; voortgangsindicatie |
| **Should have**            | AI-conversie van PPT/PDF naar modules (met verplichte review); basisgamification (punten, badges, voortgangsbalk); rapportages/dashboards voor admins; leerpaden                                                                                                                                   |
| **Could have**             | AI-aanbevelingsengine; geavanceerde gamification (leaderboards, skill-tree, streaks); AI-tutor/coach tijdens het leren; automatische vertaling en narratie                                                                                                                                         |
| **Won't have (voorlopig)** | Marketplace/e-commerce voor extern verkopen van trainingen; AR/VR-simulaties                                                                                                                                                                                                                       |

---

## 9. Open vragen & vervolgstappen

- Hoeveel gebruikers worden in de eerste fase verwacht, en welk groeitempo wordt voorzien? Antwoord: klein beginnen (10 gebruikers, op den duur 450)
- Is er een voorkeur voor hosting (specifieke cloud-leverancier, on-premise, EU-datacenter)? Antwoord: Voorkeur voor hosten, moet via docker.
- Welke certificeringen/raamwerken moeten worden ondersteund (bijv. ISTQB), en zijn koppelingen met externe examenbureaus nodig? Antwoord: nvt
- Wordt het platform uitsluitend intern gebruikt, of ook (later) aangeboden aan klanten/externe partijen? Antwoord: Intern
- Welke bestaande systemen moeten worden geïntegreerd (HR-systeem, planningstool, SSO-provider)? Antwoord: Geen integraties voor nu, wel inlogmogelijkheid met gebruikersnaam en wachtwoord. Vergeet ook niet "Password vergeten"functie
- Wie is verantwoordelijk voor contentkwaliteit en redactionele richtlijnen bij trainingen die Test Consultants zelf maken? Antwoord: L&D coordinator
- Is er behoefte aan een tussenrol zoals "L&D-coördinator" (zie §3)? Antwoord: zie voorgaande antwoord
