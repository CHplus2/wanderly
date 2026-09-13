# Wanderly by BlueSolar

**Team:** Christopher Hansen, Philip Ting  
**Problem Statement:** Travel Planner  
**Video Presentation:** [Watch the Pitch](https://youtu.be/F9ydyvjGBmQ?si=zgaw1WT3Uc_NguK4)  
**Presentation Slides:** [View Presentation](https://gamma.app/docs/Four-friends-finally-agree-on-a-trip-bv3lp963ut38rsx)  
**UI Prototype:** [Open Wanderly](https://wanderly-teal.vercel.app)

---

## 1. Project Overview

### The Problem

Planning a trip becomes difficult when travellers must coordinate different interests, walking preferences, schedules and budgets. The problem becomes more complicated for groups because members may not always want to do the same activity at the same time.

Unexpected conditions such as rain can also make parts of an itinerary unsuitable, forcing travellers to reconsider activities, timing and costs.

Existing travel-planning products such as Wanderlog already provide useful itinerary, collaboration and trip-planning features. Wanderly therefore does not attempt to differentiate itself simply by offering another editable itinerary. Instead, the prototype focuses on connecting **contextual activity discovery, flexible group planning and user-controlled adaptation when conditions change**.

### Our Solution

Wanderly is a mobile-first travel planner for solo travellers and groups. It builds an editable itinerary around participant preferences, timing and estimated budgets.

**Discover** lets travellers proactively browse, save and manually swap alternative activities. **Adapt** uses the same pool of alternatives when a disruption affects the current plan.

When a weather risk is detected, Wanderly prepares coordinated suggestions rather than immediately changing the itinerary. Travellers decide **when to review the risk, which suggestions to accept, and which original activities to keep**. Any affected activity that remains unchanged continues to display a risk marker.

### Core Features

- Multi-city and multi-country trip planning
- Solo and group travel support
- Participant interests and walking preferences
- Parallel activities for group members who want different plans at the same time
- Shared-budget and personal-budget planning modes
- Editable itinerary with activity images, transport mode and travel-time context
- **Discover** recommendations for browsing, saving and manual single-activity swaps
- **Adapt** for disruption-aware coordinated itinerary suggestions
- Early-forecast messaging with **Review now / Remind me later**
- Editable adaptive-plan review before changes are applied
- Partial approval of proposed changes
- Persistent risk markers for affected activities that remain unchanged

### Prototype Boundary

The current submission is a **UI prototype**, not the completed production system.

Prototype data is stored locally in the browser, while weather events, catalogue entries, prices and imagery may be simulated or illustrative. Live group synchronisation, booking services, production weather integration and live flight monitoring are not implemented during this prototyping phase.

---

## 2. Ideation & Process

### 2.1 Ideas We Considered

| Idea Explored | Decision | Why It Was Kept, Changed or Dropped |
| --- | --- | --- |
| **Contextual activity recommendations** | **Kept → Discover** | Inspired by related-content recommendations such as YouTube's suggested videos. Travellers can explore alternatives, save them or manually swap an activity. |
| **Adaptive itinerary** | **Kept → Adapt** | Instead of only warning travellers about a disruption, Wanderly can identify affected activities and prepare alternative arrangements. |
| **User-controlled adaptation** | **Kept** | Travellers choose when to review a disruption and which proposed changes to apply. Unchanged affected activities remain visibly at risk. |
| **Flexible group planning** | **Kept** | Group members are not forced to remain together for every activity. Parallel activities can exist within the same trip schedule. |
| **Shared vs personal budgets** | **Kept** | Supports groups that want one combined budget as well as members who want their individual spending kept separate. |
| **Multi-destination planning** | **Kept** | A trip may span multiple cities or countries, so the itinerary should not assume a single destination. |
| **Permanent Plan B recommendation list** | **Dropped → merged into Adapt** | It duplicated Discover. Discover handles voluntary exploration, while Adapt appears contextually when a disruption affects the itinerary. |
| **TikTok / social-media travel links** | **Dropped** | Considered for traveller-generated inspiration, but it added content and integration complexity without strengthening the core planning flow enough for this prototype. |
| **Multilingual interface** | **Deferred** | Useful for international travel, but not essential to demonstrating the core concept during the initial build. |
| **Live flight monitoring and automatic rebooking** | **Deferred / stretch goal** | Relevant to disruption handling, but provider coverage, cost and booking integrations would make the initial three-week scope substantially larger. |

### 2.2 Ideation Boards

The following visuals document both the **breadth of ideas explored** and **how the selected concept evolved**.

#### A. Ideation Mind Map

![Wanderly Ideation Mind Map](images/board.png)

**What it shows:** The major directions explored around group planning, budgets, recommendations, disruption handling, travel context and ideas that were later dropped or deferred.

#### B. Idea Evolution Timeline

![Wanderly Idea Evolution](images/timeline.png)

**What it shows:** The concept evolved from a broad group-aware travel planner into a focused system combining contextual discovery with user-controlled adaptation.

**Group-aware planner → contextual recommendations → parallel group planning and budget modes → disruption adaptation → separation of Discover and Adapt → review timing, partial approval and unresolved-risk handling.**

#### C. Core User Flow

![Wanderly Core User Flow](images/flow.png)

**What it shows:** The normal planning flow, voluntary Discover flow, weather-risk detection, review-now/review-later decision, editable adaptive suggestions, partial approval and persistent risk handling.

### 2.3 Mentor Consultation

| Mentor | What We Discussed / Asked | Advice Received | How We Applied It |
| --- | --- | --- | --- |
| **Janelle Tan** | We described an early version of the Wanderly prototype and asked how to manage the limited presentation time because we were unsure which novelty features to emphasise. | She advised us to focus the presentation on one or two of the strongest novelty features rather than trying to explain everything. | We focused the pitch on Wanderly's adaptive itinerary workflow and traveller control over proposed changes. |

---

## 3. Design & Prototype

**UI Prototype:** [Open Wanderly](https://wanderly-teal.vercel.app)

The prototype demonstrates one consistent end-to-end travel scenario:

**Configure preferences and budget → View itinerary → Discover alternatives → Encounter weather risk → Review proposed adjustments → Apply selected changes**

### 3.1 Group Preferences & Budget Setup

![Group Preferences and Budget Setup](images/0.png)

**Interaction shown:** Travellers configure preferences and constraints that influence itinerary planning while choosing how group spending should be represented.

### 3.2 Itinerary & Budget

![Itinerary and Budget](images/1.png)

**Interaction shown:** The itinerary remains editable and can represent different activities occurring in parallel for different group members.

### 3.3 Discover & Saved Alternatives

![Discover and Saved](images/5.png)

**Interaction shown:** Discover is proactive and user-initiated. Travellers can browse relevant alternatives, save them for later or manually swap an individual activity.

### 3.4 Weather Risk & Review Timing

![Weather Risk and Review Timing](images/2.png)

**Interaction shown:** Wanderly distinguishes between detecting a possible disruption and changing the itinerary. Early forecasts are presented as uncertain, allowing travellers to review alternatives immediately or wait until closer to the trip.

### 3.5 Editable Adaptive Review

![Editable Adaptive Review](images/3.png)

**Interaction shown:** Wanderly prepares a coordinated alternative plan, but the traveller remains in control. Suggestions can be reviewed and edited before any itinerary change is applied.

### 3.6 Partial Approval & Remaining Risk

![Partial Approval Result](images/4.png)

**Interaction shown:** Applying only some suggestions does not falsely mark every weather issue as resolved. Any affected activity that the traveller keeps remains visibly at risk and can be reconsidered later.

---

## 4. What Makes It Different

Wanderly's main twist is not simply that it recommends places or reacts to rain. It connects **proactive discovery** and **disruption-aware adaptation** through the same alternatives system while preserving traveller control.

### Discover vs Adapt

| | **Discover** | **Adapt** |
| --- | --- | --- |
| **Purpose** | "What else might I want to do?" | "My current plan may no longer work. What should change?" |
| **Triggered by** | Traveller | Context / disruption |
| **Scope** | One activity at a time | Multiple affected activities |
| **Alternatives** | General contextual recommendations | Alternatives filtered for the disruption and schedule |
| **User control** | Save or manually swap | Review, edit and approve selected changes |
| **If rejected** | Nothing changes | Original activity remains and its risk stays visible |

### Key Differentiators

**1. Recommendations when you want them; alternatives when you need them.**  
Discover supports voluntary exploration, while Adapt reuses relevant alternatives when circumstances threaten the existing itinerary.

**2. Control over both what changes and when to act.**  
A distant forecast does not immediately reorganise the trip. Travellers can review options early or wait until the forecast is closer to the activity date.

**3. Partial approval instead of all-or-nothing replanning.**  
Travellers can accept some proposed adjustments while rejecting or editing others.

**4. Unresolved risks remain visible.**  
If an affected activity is deliberately kept, Wanderly continues to mark it rather than treating the disruption as resolved.

**5. Group flexibility is built into the itinerary.**  
Members may participate in parallel activities while the trip still maintains overall timing and estimated budget context.

### Expected Impact

Wanderly aims to reduce repeated manual coordination when a trip changes. The build phase will validate whether users can understand a disruption, review alternatives, apply a subset of changes and recognise remaining risks without confusion.

**Wanderly recommends. The traveller decides.**

---

## 5. Technical Architecture & Feasibility

### 5.1 Current Prototype Stack

| Component | Current Prototype | Purpose |
| --- | --- | --- |
| **Frontend** | React 19 + TypeScript | Component-based mobile-first interface |
| **Styling** | Tailwind CSS 4 | Consistent responsive UI development |
| **Build tool** | Vite | Development and production builds |
| **Prototype state** | React Context + localStorage | Demonstrates the complete UI flow without requiring a production backend |

The current prototype does **not** require a production backend, cloud database, live weather service or AI API to demonstrate the submitted UI flow.

### 5.2 Proposed Build-Phase Stack

| Component | Proposed Technology | Purpose |
| --- | --- | --- |
| **Frontend & hosting** | React on Vercel | Continue the existing prototype and deploy it publicly |
| **Server-side logic** | Vercel Functions | Handle server-side application and integration logic |
| **Database** | Supabase PostgreSQL | Persist trips, itineraries, participants, preferences and activity data |
| **Authentication** | Supabase Auth | User authentication and trip membership |
| **Group updates** | Supabase Realtime | Synchronise relevant shared-trip changes between members |
| **Weather** | Open-Meteo Forecast API | Provide forecast data for weather-aware itinerary adaptation |
| **Recommendation logic** | Deterministic filtering and ranking | Match alternatives using location, time, weather suitability, participants, schedule and estimated cost |

The proposed MVP intentionally uses deterministic filtering and ranking rather than requiring an AI or LLM service for the core adaptive workflow.

### 5.3 Proposed MVP Architecture

![Proposed Wanderly MVP Architecture](images/system_architecture.png)

**Proposed flow:** The React client accesses application services and persistent trip data. Supabase stores authorised trip and catalogue information and manages authentication. Weather forecast data is retrieved from Open-Meteo and compared against weather-sensitive itinerary activities. Wanderly then prepares proposed adjustments for review. Only changes approved by the traveller are applied to the itinerary.

### 5.4 Three-Week Build Plan

The three-week build phase will prioritise proving the **core adaptive-itinerary workflow** rather than integrating every possible travel service.

#### Week 1 — Persistence & Group Foundation

- Add authentication
- Move trip and itinerary data from browser-only storage to Supabase
- Implement trip membership and participant preferences
- Persist shared/personal budget configuration
- Preserve manual itinerary editing

#### Week 2 — Weather & Adaptive Flow

- Curate a small activity catalogue for the demonstration destination
- Integrate Open-Meteo forecast data
- Detect weather conflicts with relevant itinerary activities
- Connect affected activities with suitable alternatives
- Reuse the adaptive-review interface
- Validate schedule, participant and estimated-budget effects before applying selected changes

#### Week 3 — Testing, Deployment & Demo

- Test solo and group scenarios
- Test **Review now / Remind me later**
- Test partial approval and unresolved-risk handling
- Test weather/API failure states
- Test mobile usability and accessibility
- Deploy the working build publicly
- Verify links and record the final demonstration

### 5.5 Scope Limits & Stretch Goals

**Core build:** itinerary persistence, group preferences, budget context, Discover, weather-based Adapt, editable review and partial approval.

**Deferred / stretch goals:**

- Live flight monitoring
- Automatic rebooking
- Broad transport-provider integration
- Multilingual localisation
- Social-media content integration
- Background push notifications
- Global activity coverage

The narrower scope is intentional so the team can demonstrate a reliable product within the three-week building phase.
