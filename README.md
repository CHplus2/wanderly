# Wanderly by BlueSolar

**Team:** Christopher Hansen, Philip Ting\
**Problem Statement:** Travel Planner\
**Video Presentation:** \[PASTE UNLISTED YOUTUBE LINK HERE\]\
**Presentation Slides:** https://gamma.app/docs/Four-friends-finally-agree-on-a-trip-bv3lp963ut38rsx
**UI Prototype:** https://wanderly-teal.vercel.app

------------------------------------------------------------------------

## 1. Project Overview

### The Problem

Planning a trip becomes difficult when travellers must coordinate
different interests, walking preferences, schedules and budgets. The
problem becomes more complicated for groups because members may not
always want to do the same activity at the same time. Unexpected
conditions such as rain can also make part of an itinerary unsuitable
and force travellers to reorganise their plans manually.

Existing travel-planning products such as Wanderlog already provide
useful itinerary, collaboration and trip-planning features. Wanderly
therefore does not attempt to differentiate itself simply by offering
another editable itinerary. Instead, the prototype focuses on connecting
**contextual activity discovery, flexible group planning and
user-controlled adaptation when conditions change**.

### Our Solution

Wanderly is a mobile-first travel planner for solo travellers and
groups. It builds an editable itinerary around participant preferences,
timing and estimated budgets. **Discover** lets travellers proactively
browse, save and manually swap alternative activities, while **Adapt**
uses the same pool of alternatives when a disruption affects the current
plan.

When a weather risk is detected, Wanderly prepares coordinated
suggestions rather than immediately changing the itinerary. Travellers
decide **when to review the risk, which suggestions to accept, and which
original activities to keep**. Any affected activity that remains
unchanged continues to display a risk marker.

### Core Features

-   Multi-city and multi-country trip planning
-   Solo and group travel support
-   Participant interests and walking preferences
-   Parallel activities for group members who want different plans at
    the same time
-   Shared-budget and personal-budget planning modes
-   Editable itinerary with activity images, transport mode and
    travel-time context
-   **Discover** recommendations for browsing, saving and manual
    single-activity swaps
-   **Adapt** for disruption-aware coordinated itinerary suggestions
-   Early-forecast messaging and **review now / remind me later**
    controls
-   Editable adaptive-plan review before anything is applied
-   Partial approval: travellers can apply only selected suggestions
-   Persistent risk markers for affected activities that remain
    unchanged

### Prototype Boundary

The current submission is a **UI prototype**, not the completed
production system. Prototype data is stored locally in the browser, and
weather events, catalogue entries, prices and imagery may be simulated
or illustrative. Live group synchronisation, booking services,
production weather integration and live flight monitoring are not
implemented in this prototyping phase.

------------------------------------------------------------------------

## 2. Ideation & Process

### 2.1 Ideas We Considered

  -----------------------------------------------------------------------
  Idea explored           Decision                Why it was kept,
                                                  changed or dropped
  ----------------------- ----------------------- -----------------------
  **Contextual activity   **Kept → Discover**     Inspired by
  recommendations**                               related-content
                                                  recommendations such as
                                                  YouTube's suggested
                                                  videos. Travellers can
                                                  explore alternatives,
                                                  save them or manually
                                                  swap an activity.

  **Adaptive itinerary**  **Kept → Adapt**        Instead of only warning
                                                  travellers about a
                                                  disruption, Wanderly
                                                  can identify affected
                                                  activities and prepare
                                                  alternative
                                                  arrangements.

  **User-controlled       **Kept**                Travellers choose when
  adaptation**                                    to review a disruption
                                                  and which proposed
                                                  changes to apply.
                                                  Unchanged affected
                                                  activities remain
                                                  visibly at risk.

  **Flexible group        **Kept**                Group members are not
  planning**                                      forced to remain
                                                  together for every
                                                  activity; parallel
                                                  activities can exist
                                                  within the same trip
                                                  schedule.

  **Shared vs personal    **Kept**                Supports groups that
  budgets**                                       want one combined
                                                  budget as well as
                                                  members who want their
                                                  individual spending
                                                  kept separate.

  **Multi-destination     **Kept**                A trip may span
  planning**                                      multiple cities or
                                                  countries, so the
                                                  itinerary should not
                                                  assume a single
                                                  destination.

  **Permanent Plan B      **Dropped → merged into It duplicated Discover.
  recommendation list**   Adapt**                 Discover now handles
                                                  voluntary exploration,
                                                  while Adapt appears
                                                  contextually when a
                                                  disruption affects the
                                                  itinerary.

  **TikTok / social-media **Dropped**             Considered for
  travel links**                                  traveller-generated
                                                  inspiration, but it
                                                  added content and
                                                  integration complexity
                                                  without strengthening
                                                  the core planning flow
                                                  enough for this
                                                  prototype.

  **Multilingual          **Deferred**            Useful for
  interface**                                     international travel,
                                                  but not essential to
                                                  demonstrating the core
                                                  concept during the
                                                  initial build.

  **Live flight           **Deferred / stretch    Relevant to disruption
  monitoring and          goal**                  handling, but provider
  automatic rebooking**                           coverage, cost and
                                                  booking integrations
                                                  would make the initial
                                                  three-week scope
                                                  substantially larger.
  -----------------------------------------------------------------------

### 2.2 Ideation Boards

The following visuals document both the **breadth of ideas explored**
and **how the selected concept evolved**.

#### A. Ideation Mind Map

![Wanderly Ideation Mind Map](images/board.png)

**What it shows:** The major directions explored around group planning,
budgets, recommendations, disruption handling, travel context and ideas
that were later dropped or deferred.

#### B. Idea Evolution Timeline

![Wanderly Idea Evolution](images/timeline.png)

**What it shows:** The concept evolved from a broad group-aware travel
planner into a focused system combining contextual discovery with
user-controlled adaptation.

**Group-aware planner → contextual recommendations → parallel group
planning and budget modes → disruption adaptation → separation of
Discover and Adapt → review timing, partial approval and unresolved-risk
handling.**

#### C. Core User Flow

![Wanderly Core User Flow](images/flow.png)

**What it shows:** The normal planning flow, voluntary Discover flow,
weather-risk detection, review-now/review-later decision, editable
adaptive suggestions, partial approval and persistent risk handling.

### 2.3 Mentor Consultation


  -----------------------------------------------------------------------
  Date              Mentor            Feedback Received What We Changed
  ----------------- ----------------- ----------------- -----------------
  \[DATE\]          Teh Ming En   Brainstom Ideas with Friends/AI    

  \[DATE\]        Janelle Tan   Speech Structure is important     
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. Design & Prototype

**UI Prototype:** https://wanderly-teal.vercel.app/

The prototype demonstrates one consistent end-to-end travel scenario:
configure preferences and budget, view an itinerary, explore
alternatives, encounter a simulated weather risk, review proposed
adjustments, modify the proposal and apply only selected changes.

### 3.1 Group Preferences & Budget Setup

![Group Preferences and Budget Setup](images/0.png)

**Interaction shown:** Travellers configure constraints that influence
itinerary planning while choosing how group spending should be
represented.

### 3.2 Itinerary & Budget

![Itinerary and Budget](images/1.png)

**Interaction shown:** The itinerary remains editable and can represent
different activities occurring in parallel for different group members.

### 3.3 Discover & Saved Alternatives

![Discover and Saved](images/5.png)

**Interaction shown:** Discover is proactive and user-initiated.
Travellers can browse relevant alternatives, save them for later or
manually swap an individual activity.

### 3.4 Weather Risk & Review Timing

![Weather Risk and Review Timing](images/2.png)

**Interaction shown:** Wanderly distinguishes detecting a possible
disruption from changing the itinerary. Early forecasts are presented as
uncertain so travellers can wait until closer to the trip before
deciding.

### 3.5 Editable Adaptive Review

![Editable Adaptive Review](images/3.png)

**Interaction shown:** Wanderly prepares a coordinated alternative plan,
but the traveller remains in control. Suggestions can be reviewed and
edited before any itinerary change is applied.

### 3.6 Partial Approval & Remaining Risk

![Partial Approval Result](images/4-approval.png)

**Interaction shown:** Applying only some suggestions does not falsely
mark every weather issue as resolved. Any affected activity that the
traveller keeps remains visible as a risk and can be reconsidered later.

------------------------------------------------------------------------

## 4. What Makes It Different

Wanderly's main twist is not simply that it recommends places or reacts
to rain. It connects **proactive discovery** and **disruption-aware
adaptation** through the same alternatives system while preserving
traveller control.

  -----------------------------------------------------------------------
                          **Discover**            **Adapt**
  ----------------------- ----------------------- -----------------------
  **Purpose**             "What else might I want "My current plan may no
                          to do?"                 longer work. What
                                                  should change?"

  **Triggered by**        Traveller               Context / disruption

  **Scope**               One activity at a time  Multiple affected
                                                  activities

  **Alternatives**        General contextual      Alternatives filtered
                          recommendations         for the disruption and
                                                  schedule

  **User control**        Save or manually swap   Review, edit and
                                                  approve selected
                                                  changes

  **If rejected**         Nothing changes         Original activity
                                                  remains and its risk
                                                  stays visible
  -----------------------------------------------------------------------

### Key Differentiators

**1. Recommendations when you want them; alternatives when you need
them.** Discover supports voluntary exploration, while Adapt reuses
relevant alternatives when circumstances threaten the existing
itinerary.

**2. Control over both what changes and when to act.** A distant
forecast does not immediately reorganise the trip. Travellers can review
options early or wait until the forecast is closer to the activity date.

**3. Partial approval instead of all-or-nothing replanning.** Travellers
can accept some proposed adjustments while rejecting or editing others.

**4. Unresolved risks remain visible.** If an affected activity is
deliberately kept, Wanderly continues to mark it rather than pretending
the disruption has been solved.

**5. Group flexibility is built into the itinerary.** Members may
participate in parallel activities while the trip still maintains
overall timing and estimated budget context.

### Expected Impact

Wanderly aims to reduce repeated manual coordination when a trip
changes. The build phase should validate whether users can understand a
disruption, review alternatives, apply a subset of changes and recognise
remaining risk without confusion.

------------------------------------------------------------------------

## 5. Technical Architecture & Feasibility

### 5.1 Current Prototype Stack

  -----------------------------------------------------------------------
  Component               Current prototype       Why
  ----------------------- ----------------------- -----------------------
  **Frontend**            React 19 + TypeScript   Component-based
                                                  interface and typed
                                                  application logic

  **Styling**             Tailwind CSS 4          Fast, consistent
                                                  responsive UI
                                                  development

  **Build tool**          Vite                    Lightweight React
                                                  development and
                                                  production builds

  **Prototype state**     React Context +         Sufficient for
                          localStorage            demonstrating the UI
                                                  flow without requiring
                                                  a backend during
                                                  prototyping
  -----------------------------------------------------------------------

The current prototype does **not** require a production backend, cloud
database, live weather service or AI API to demonstrate the submitted UI
flow.

### 5.2 Proposed Build-Phase Stack

  -----------------------------------------------------------------------
  Component               Proposed technology     Purpose / constraint
  ----------------------- ----------------------- -----------------------
  **Frontend & hosting**  React + TypeScript on   Continue the existing
                          Vercel                  prototype and deploy it
                                                  publicly

  **Server-side logic**   Vercel server-side      Handle external-service
                          functions               requests and validation
                                                  without exposing
                                                  privileged credentials
                                                  in the browser

  **Database**            Supabase PostgreSQL     Persistent trip,
                                                  itinerary, participant,
                                                  preference and
                                                  catalogue data without
                                                  relying on a developer
                                                  laptop being online

  **Authentication**      Supabase Auth           User identity and trip
                                                  membership

  **Group updates**       Supabase Realtime       Synchronise relevant
                                                  shared-trip changes
                                                  between members

  **Weather**             Open-Meteo or another   Replace simulated
                          verified forecast       weather with real
                          provider                forecast data during
                                                  the build phase if
                                                  feasible

  **Recommendation        Deterministic           Match alternatives
  logic**                 filtering/ranking       using location, time,
                                                  weather suitability,
                                                  participants, schedule
                                                  and estimated cost
  -----------------------------------------------------------------------

### 5.3 Proposed MVP Architecture

![Proposed Wanderly MVP Architecture](images/system-architecture.png)

**Proposed flow:** The React client accesses authenticated server-side
functionality. Authorised trip and catalogue data are stored in
Supabase. Weather information can be retrieved through the server-side
layer and compared against weather-sensitive itinerary activities.
Wanderly generates a preview of proposed adjustments; only changes
approved by the traveller are saved.

### 5.4 Build Plan & Scope

The three-week build phase will prioritise proving the **core
adaptive-itinerary workflow**, rather than integrating every possible
travel service.

**Week 1 --- Persistence & Group Foundation** - Add authentication -
Move trip and itinerary data from browser-only storage to Supabase -
Implement trip membership and participant preferences - Persist
shared/personal budget configuration - Preserve manual itinerary editing

**Week 2 --- Weather & Adaptive Flow** - Curate a small activity
catalogue for the demonstration destination - Connect a real weather
forecast service if feasible - Detect weather overlap with relevant
activities - Reuse the adaptive-review interface - Validate schedule,
participant and estimated-budget effects before applying selected
changes

**Week 3 --- Testing, Deployment & Demo** - Test solo and group
scenarios - Test review-now / remind-later behaviour - Test partial
approval and unresolved-risk handling - Test weather/API failure
states - Test mobile usability and accessibility - Deploy the working
build publicly - Verify links and record the final demonstration

### 5.5 Scope Limits & Stretch Goals

**Core build:** itinerary persistence, group preferences, budget
context, Discover, weather-based Adapt, editable review and partial
approval.

**Deferred / stretch:** live flight monitoring, automatic rebooking,
broad transport-provider integration, multilingual localisation,
social-media content integration, background push notifications and
global activity coverage.

The narrower scope is intentional so the team can demonstrate a reliable
product within the three-week building phase.

-   [ ] Verify every technical reference
-   [ ] Remove instructional placeholder text before final submission
