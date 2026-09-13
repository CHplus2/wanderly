Design and prototype a complete, polished AI-powered collaborative travel planning application called “Travel Planner”.

This is a prototype/hackathon product, but it should feel like a realistic, production-quality travel planning application rather than an AI-generated mockup.

CORE PRODUCT CONCEPT

Travel Planner helps groups of friends plan trips together while accounting for each traveller’s individual preferences, budgets, constraints, and interests.

The core idea is:

“AI-assisted collaborative travel planning that considers every traveller’s preferences and trip constraints while keeping humans in control.”

The AI should help generate, explain, adapt, and rebalance plans. It must NOT silently override user decisions.

The application should support:
- Solo trips
- Small groups
- Large groups
- Multiple groups/subgroups within one trip
- Different travellers doing different activities at the same time
- Multiple cities in one country
- Multiple countries in one trip
- Multiple transportation legs
- 1–14 day trips
- Shared and individual budgets
- Multiple currencies
- Adaptive itinerary changes
- AI recommendations and alternatives
- Explicit traveller preferences
- Personal/group travel history for recommendations
- Optional external social-media inspiration links

IMPORTANT DESIGN PRINCIPLE

Do not make the application look like generic “AI slop”.

Avoid:
- Giant unnecessary headings
- Excessive rounded cards
- Excessive empty space
- Random gradients
- Glassmorphism everywhere
- Too many badges
- Fake statistics
- Decorative UI without purpose
- Too many nested cards
- Excessive animations
- Huge text inputs
- Buttons that look interactive but do nothing
- Randomly different component styles
- Raw database/translation keys visible to users

Prioritize:
- Clear information hierarchy
- Readability
- Strong alignment
- Compact but comfortable layouts
- Consistent spacing
- Consistent components
- Useful visual feedback
- Responsive design
- Realistic interaction states
- Easy navigation
- Professional travel-product UX

DESIGN SYSTEM

Use a dark navy/charcoal foundation.

Use:
- Dark navy/charcoal for the main background
- Slightly lighter surfaces for cards and panels
- Near-white primary text
- Muted gray secondary text
- One primary blue accent for primary actions and active navigation
- Green only for positive/safe/under-budget states
- Amber for warnings
- Red for errors/over-budget states

Do not use blue and green as competing primary brand colors.

Spacing:
- 4px
- 8px
- 12px
- 16px
- 24px
- 32px

Typography:
- H1: approximately 32px
- H2: approximately 24px
- H3: approximately 18px
- Body: 14–16px
- Caption: 12–13px

Border radius:
- Generally 8–12px
- Avoid excessive pill-shaped UI

Buttons:
- Primary
- Secondary
- Ghost
- Destructive/Danger

Buttons must have obvious hover/selected/disabled states.

Never allow text to render vertically one character per line.

Never use:
word-break: break-all

Normal UI text should wrap naturally.

Use:
- white-space: normal
- word-break: normal
- overflow-wrap: break-word

Buttons should remain horizontally readable.

APPLICATION STRUCTURE

The application should have this general flow:

1. Welcome / Start
2. Trip Setup
3. Traveller Preferences
4. AI Generation
5. Trip Overview
6. Group
7. Itinerary
8. Budget
9. Accommodation
10. Transport
11. Recommendations / Alternatives
12. Trip Summary

Primary navigation after trip generation:

Overview
Group
Itinerary
Budget
Stay

Transport and recommendations can be accessed from the relevant itinerary/trip sections.

SCREEN 1 — WELCOME

Create a clean landing screen.

Title:
“Plan better. Travel together.”

Subtitle:
“Build a trip around everyone’s preferences, budget, and priorities — with AI helping along the way.”

Primary button:
“Start planning”

Secondary button:
“Try demo”

The demo should load a realistic example trip.

Example:
Japan Adventure
Tokyo → Kyoto → Osaka
5 days
4 travellers

Do not overload this page.

SCREEN 2 — TRIP SETUP

Create a proper multi-step trip setup.

The user should be able to specify:

Trip name
Destination(s)
Number of days
Start date
End date
Number of travellers
Traveller names
Budget mode
Preferred display currency

Trip duration must support 1–14 days.

Do not hard-code 5 days.

If the user selects 10 days, every part of the application must use 10 days.

DESTINATIONS

Do NOT restrict the application to one destination.

Support:

One city:
Tokyo

Multiple cities:
Tokyo → Kyoto → Osaka

Multiple countries:
Berlin, Germany → Amsterdam, Netherlands → Paris, France

Another example:
Beijing → Xi’an → Shanghai

The data structure should conceptually be:

Trip
→ Destinations
→ Transport Legs
→ Daily Itineraries

Each destination should support:
- City
- Country
- Arrival date/time
- Departure date/time
- Accommodation
- Local currency

TRANSPORT

Support:
- Flight
- High-speed rail
- Train
- Subway / Metro
- Bus
- Taxi / Ride-hailing
- Walking

Transport should be treated as part of the itinerary and budget.

Show:
- Origin
- Destination
- Departure
- Arrival
- Duration
- Estimated cost
- Local currency
- Converted display currency

The system should consider travel time, transfer time, walking time, and reasonable buffers.

Avoid impossible schedules.

Flights should be supported as a transportation type, but the application does not need to implement flight booking.

MOCK DATA

For the prototype, realistic mock transport, accommodation, weather, activity, popularity, and currency data is acceptable.

Do not require complex external APIs.

BUDGET MODE

During trip setup, users must explicitly select their budgeting model.

Provide:

1. Shared Group Budget

Example:
Group budget: RM5,000

This represents the total planning envelope for the group.

It does NOT mean every traveller receives RM1,250 of personal spending.

2. Individual Budgets

Example:
Alice: RM1,000
Bob: RM2,000
Charlie: RM1,500
David: RM800

Each traveller's budget is independent.

IMPORTANT RULE:

Unused budget from one traveller must NOT automatically transfer to another traveller.

For example:

Alice has RM300 remaining.
Bob is RM200 over budget.

Do NOT automatically give Bob Alice’s unused RM300.

Instead, the AI may:
- Recommend cheaper alternatives
- Recommend removing optional activities
- Ask the group to change budgets
- Recommend explicitly reallocating budget if users choose to do so

But never silently transfer money.

Also support a conceptual hybrid mode if appropriate:
- Shared group expenses
- Individual personal spending limits

BUDGET CATEGORIES

Distinguish:

Shared expenses:
- Hotel
- Group transport
- Group activities
- Shared meals
- Rental car

Personal expenses:
- Shopping
- Souvenirs
- Snacks
- Optional activities
- Individual meals

The application is NOT intended to become Splitwise.

Its purpose is:
“Planning affordability and budget awareness.”

Shared expenses can default to equal splitting, but users must be able to edit the split.

Personal expenses belong only to the selected traveller.

BUDGET UI

Show:

Trip Total
Shared Expenses
Personal Expenses
Remaining Budget
Estimated spending per traveller

Example:

Alice
Estimated: RM320
Remaining: RM680

Bob
Estimated: RM510
Remaining: RM1,490

Charlie
Estimated: RM460
Remaining: RM1,040

Every expense should show:
- Total cost
- Currency
- Converted cost
- Participants
- Per-person allocation

Example:

Shibuya Shopping
Participants: Alice + Bob
Total: RM160
Alice: RM80
Bob: RM80
Charlie: RM0

Hotel
Participants: Everyone
Total: RM900
Alice: RM300
Bob: RM300
Charlie: RM300

Users must be able to manually record spending.

Example:

Group budget:
RM5,000

Hotel:
-RM1,200

Train:
-RM600

Remaining:
RM3,200

After a manual budget change, show:

“Budget changed”

Then offer:

“Ask AI to rebalance”

Do NOT automatically regenerate the itinerary.

The user must confirm.

CURRENCY SYSTEM

Currency must apply to ALL financial information in the application.

Not just hotels.

Support:
- MYR
- JPY
- USD
- EUR
- CNY
- GBP

Every destination has a local currency.

Examples:
Japan → JPY
Germany → EUR
Netherlands → EUR
China → CNY
United Kingdom → GBP
United States → USD

The user chooses a preferred display currency.

Show both when useful:

¥5,000
≈ RM155

€80
≈ RM380

Do NOT overwrite the original transaction currency.

All of these must use the currency system:
- Hotels
- Flights
- Trains
- High-speed rail
- Buses
- Metro
- Taxi
- Activities
- Restaurants
- Shopping
- Shared expenses
- Personal expenses
- Daily totals
- Trip total
- Traveller remaining budgets
- AI recommendations

For the prototype, reasonable/mock exchange rates are acceptable.

SCREEN 3 — TRAVELLER SETUP

Allow the user to create multiple travellers.

Example:

Alice
Bob
Charlie
David

Each traveller should have their own profile/preferences.

Do NOT infer preferences from:
- Age
- Gender
- Occupation
- Sensitive personal characteristics

Travellers explicitly provide their preferences.

Preferences should include:

Budget preference
Interests
Travel pace
Walking tolerance
Activity intensity
Food preferences
Must-do activities
Avoid activities
Preferred activity times
Rest preference
Accessibility/mobility needs

Example:

Alice:
Budget: Medium
Interests: Shopping, culture
Walking: Low
Food: Japanese food
Must-do: Shibuya
Avoid: Long hikes

Bob:
Budget: High
Interests: Food, nightlife
Walking: Medium
Must-do: Tsukiji
Avoid: Museums

Charlie:
Budget: Low
Interests: Nature, culture
Walking: High
Must-do: Meiji Shrine

Make this easy to edit later.

GROUP PREFERENCES

The application should also identify shared group preferences.

For example:
- Culture
- Food
- Shopping
- Nightlife
- Nature
- Relaxation

The AI should consider both individual preferences and group-level preferences.

SCREEN 4 — AI GENERATION

Create an attractive generation/loading state.

Example:

“Building your trip…”

Show useful progress concepts:

Understanding traveller preferences
Checking budgets
Balancing activities
Planning transportation
Checking travel time
Finding alternatives

Do not make fake claims that actual APIs are being called.

After generation, transition to the generated trip.

AI should produce structured itinerary data rather than only prose.

CONCEPTUAL ACTIVITY DATA:

Date
Start time
End time
Name
Location
City
Country
Description
Participants
Activity cost
Transport cost
Transport type
Travel duration
Walking duration
Recommendation reason

SCREEN 5 — OVERVIEW

Create a polished dashboard.

Show:

Trip name
Destinations
Dates
Number of days
Number of travellers
Budget status
Total estimated spending
Weather summary
Upcoming activity
Transportation summary

Example:

Japan Adventure

Tokyo → Kyoto → Osaka

5 days · 4 travellers

Budget:
RM3,240 / RM5,000

Status:
RM1,760 remaining

Show a visual trip route.

Example:

Tokyo
↓
Kyoto
↓
Osaka

The overview should be information-dense but not cluttered.

SCREEN 6 — GROUP

Make Group a major first-class section.

Show:

Travellers
Individual budgets
Preferences
Must-do
Avoid
Walking tolerance
Activity intensity
Food preferences
Group preferences

Each traveller should be visually distinct.

Allow:
- Edit traveller
- Change budget
- Change preferences
- Add traveller
- Remove traveller

Show an AI explanation section:

“Why this plan fits your group”

Example:

“Your itinerary prioritizes Japanese culture and food while keeping walking moderate for Alice. Shopping activities are concentrated in the afternoon, while Charlie has more nature-focused options.”

Do not call this “AI negotiation”.

Use language such as:
“AI considers your group’s preferences and constraints.”

SCREEN 7 — ITINERARY

This is the most important screen.

The itinerary must support MULTIPLE SIMULTANEOUS ITINERARIES.

This is a critical requirement.

Travellers do NOT always need to follow the same schedule.

Example:

09:00–12:00
Everyone
Tsukiji Outer Market

14:00–17:00
Alice + Bob
Shibuya Shopping

14:00–16:00
Charlie
Tokyo National Museum

16:00–18:00
David
Free time

18:30–20:00
Everyone
Dinner

These activities occur in parallel.

The UI must visually communicate simultaneous activities.

Do NOT force everything into one sequential list.

Use:
- Timeline lanes
- Traveller/group columns
- Parallel activity cards
- Clear participant labels
- Time blocks

For example:

14:00
────────────────────────
Alice + Bob
Shibuya Shopping

Charlie
Tokyo National Museum

David
Free Time
────────────────────────
18:30
Everyone
Dinner

Support:

Everyone
Selected travellers
One traveller

Every activity should have a participant selector.

Changing participants must visibly update:
- Activity participation
- Cost allocation
- Individual budget
- Recommendations
- Relevant transportation
- Schedule

ACTIVITY CARD

Each activity should display:

Time
Activity name
Location
City
Participants
Estimated cost
Duration
Walking level
Transport
Why recommended

Example:

14:00–17:00
Shibuya Shopping

Alice + Bob

¥8,000
≈ RM250

Walking: Low
Transport: Metro

“Matches Alice and Bob’s shopping preference and stays within their current budgets.”

ACTIVITY ACTIONS

Every activity should support:

Edit
Move
Delete
Add alternative
Add participants
Remove participants
Mark as Must-do
Mark as Avoid
Add spending
Inspiration

Users must be able to manually edit:
- Name
- Location
- Time
- Duration
- Participants
- Cost
- Transport
- Notes

AI must preserve manually accepted/locked activities.

SCREEN 8 — ALTERNATIVES / RECOMMENDATIONS

Every itinerary activity should have an “Alternatives” action.

Alternatives should still respect the user's constraints.

Example:

Original:
Shibuya Shopping
Estimated cost: ¥8,000

Alternatives:

Shibuya Sky
¥2,500
Fits budget
Popular
Matches Alice + Bob

Meiji Shrine
Free
Popular
Matches culture preference

Yoyogi Park
Free
Low cost
Lower walking

Harajuku Walk
Free
Budget friendly

Users can select:

“Apply alternative”

But applying it must require user confirmation.

The system should update:
- Itinerary
- Budget
- Participants
- Transport
- Schedule
- Currency
- Recommendations

Never silently replace the original.

RECOMMENDATION TYPES

Provide:

Recommended for you
Popular with travellers
Budget-friendly alternatives

Recommendations should be filtered by constraints first.

Then rank by:

Preference match
Budget fit
Popularity
Explicit travel-history match
Location convenience
Schedule compatibility

Do not claim these scores are scientifically validated.

Prefer explanations.

Example:

“Recommended because it matches your group’s interest in Japanese culture, costs less than the original activity, and requires less walking.”

TRAVEL HISTORY / MACHINE LEARNING

The application should be designed so machine learning/personalization can improve recommendations over time.

Remember explicit user behavior such as:

Previously visited places
Saved activities
Liked activities
Rejected activities
Previously selected activity types
Previous trip preferences
Previously accepted recommendations

Do NOT infer sensitive characteristics.

If a traveller has no history:
Use explicit preferences + budget + popularity.

If they have history:
Use explicit history + preferences + budget + popularity.

Group history can also be used.

For the prototype, this machine-learning layer can be represented with mock data and heuristic recommendation logic.

Do not pretend that a real ML model has been trained if it has not.

Use concepts such as:

Preference Match
History Match
Budget Fit
Popularity
Schedule Fit

These are product signals, not scientific scores.

SCREEN 9 — ADAPTIVE ITINERARY

The product's strongest AI feature should be adaptive planning.

The itinerary should not be static.

Support triggers such as:

Bad weather
Activity closure
Transport delay
Budget reduction
Traveller preference change
Traveller joins/leaves an activity
Activity becomes unavailable
Time constraint changes

Example:

“Rain expected in Tokyo at 14:00.”

AI proposes:

Move outdoor activity
Replace with indoor museum
Move shopping earlier

Show:

AI suggestion

Reason:
“Your original outdoor activity may be affected by rain. This alternative preserves your culture preference and stays within the current budget.”

Buttons:

Apply
Keep original
Edit

Never silently change the itinerary.

REPLANNING

Provide an “Ask AI to rebalance” action.

AI must understand:

Current itinerary
Current budgets
Individual budgets
Shared expenses
Participants
Preferences
Must-do activities
Avoid activities
Travel times
Transport
Currency
Destination
Weather
Locked/accepted activities

The AI should make the minimum necessary changes.

It should preserve:
- Must-do activities
- User-approved activities
- Locked activities
- Budget constraints
- Traveller preferences

If a user changes Alice's budget from RM100 to RM80:

Do NOT automatically increase Bob's budget.

Instead:
“Would you like AI to find alternatives within Alice's new budget?”

SCREEN 10 — ACCOMMODATION / STAY

Provide accommodation information.

Show:

Hotel name
Location
Check-in
Check-out
Room information
Total cost
Currency
Converted cost
Cost per person
Participants

Accommodation should affect the trip budget.

The application does not need to implement real booking.

SCREEN 11 — TRANSPORT

Show transport between destinations and within destinations.

Examples:

Tokyo → Kyoto
High-speed rail
¥14,000
2h 15m

Kyoto → Osaka
Train
¥600
30m

Also show local transport:

Metro
Bus
Taxi
Walking

Transport costs must contribute to the overall budget.

SCREEN 12 — WEATHER

Show daily weather.

Example:

Day 2
Tokyo
24°C
Rain likely

The weather feature should connect to adaptive planning.

Example:

“Rain may affect your 14:00 outdoor activity.”

Offer:
Apply AI adjustment
Keep original

Mock weather is acceptable.

SCREEN 13 — SOCIAL MEDIA / INSPIRATION LINKS

Do NOT build social media scraping or social media ingestion.

Instead, allow each itinerary activity to optionally contain external inspiration links.

For example:

Shibuya Sky

Inspiration:
TikTok
YouTube
Instagram
Official website

The user can manually paste a URL.

Example:

https://www.tiktok.com/...
https://www.youtube.com/...
https://www.instagram.com/...

Show a clean “Inspiration” action on each activity.

When clicked, open the external link.

Do not automatically scrape or ingest social media content.

The link should belong specifically to that itinerary activity.

For example:

Activity:
Shibuya Sky

Inspiration:
“Watch video”

This should be optional and should not clutter the itinerary.

MULTI-CITY / MULTI-COUNTRY TRIP MODEL

The UI must clearly support trips such as:

Japan:
Tokyo → Kyoto → Osaka

Europe:
Berlin → Amsterdam → Paris

China:
Beijing → Xi’an → Shanghai

Each destination should have:
City
Country
Arrival
Departure
Accommodation
Local currency

The itinerary should visually separate destinations.

Example:

DAY 1 — TOKYO

activities...

DAY 2 — TOKYO

activities...

TRAVEL TO KYOTO

High-speed rail
09:30 → 11:45

DAY 3 — KYOTO

activities...

The system should account for travel time between cities.

MULTI-GROUP SUPPORT

A trip can contain multiple groups/subgroups.

Example:

Main Group:
4 travellers

Subgroup A:
Alice + Bob

Subgroup B:
Charlie + David

Subgroups may have different activities.

Allow users to create and manage groups/subgroups.

Activities can belong to:
- Entire trip
- Group
- Subgroup
- Individual traveller

The UI should make this relationship clear.

PARALLEL ITINERARIES

This is mandatory.

At any given time, different travellers/groups may be doing different activities.

The UI must allow:

Everyone → Activity A

Alice + Bob → Activity B

Charlie + David → Activity C

Charlie → Activity D

These activities may occur at overlapping times.

Do not force activities into a single linear timeline.

BUDGET + PARALLEL ACTIVITIES

If Alice and Bob attend an activity costing RM160:

Alice RM80
Bob RM80
Charlie RM0
David RM0

If Charlie independently attends a RM100 activity:

Charlie RM100

The budget system must understand these participants.

CHANGING PARTICIPANTS

If an activity changes from:

Alice + Bob

to:

Alice + Bob + Charlie

the cost allocation must update.

If the user removes Alice:

Bob + Charlie

the allocation updates accordingly.

The UI should visibly show this change.

MANUAL CONTROL

The human user remains in control.

Every major AI action should allow:

Accept
Reject
Edit

Users can:
- Accept AI recommendation
- Reject AI recommendation
- Replace activity
- Move activity
- Edit activity
- Lock activity
- Add activity manually
- Remove activity
- Change participants
- Change budget
- Change preferences

Do not create fake buttons.

Every button should perform a meaningful interaction in the prototype.

AI SHOULD EXPLAIN ITSELF

Where useful, show concise reasoning.

Example:

“Why this activity?”

“Matches Alice and Bob’s shopping preference, fits their remaining budget, and is close to the previous activity.”

Keep explanations short.

Do not create huge AI chat bubbles everywhere.

AI should feel like an assistant integrated into the planner, not the entire interface.

AI CHAT / ASSISTANT

Include an optional AI assistant entry point.

Example:

“Ask AI”

Users can ask:

“Find cheaper activities for today.”

“Make today less tiring.”

“Give Charlie more cultural activities.”

“Find something for Alice and Bob while Charlie visits the museum.”

“Reduce today's spending by RM200.”

“Find alternatives with less walking.”

“Move outdoor activities because of rain.”

“Plan the next city.”

The assistant should understand the current trip context.

It should suggest changes rather than silently applying them.

OVERVIEW OF CORE DATA RELATIONSHIPS

Design the application as if it uses the following conceptual model:

Trip
→ Travellers
→ Groups/Subgroups
→ Destinations
→ Transport Legs
→ Daily Itineraries
→ Activities
→ Expenses
→ Budgets
→ Preferences
→ Recommendations
→ Inspiration Links
→ Weather

Each activity has:

id
date
startTime
endTime
name
location
city
country
description
participants
estimatedActivityCost
estimatedTransportCost
currency
displayCurrency
transportType
travelDuration
walkingDuration
activityType
preferenceMatch
popularityScore
historyMatch
budgetFit
scheduleFit
recommendationReason
inspirationLinks
locked/accepted status

NAVIGATION

Use a simple navigation structure.

Primary:
Overview
Group
Itinerary
Budget
Stay

Secondary contextual areas:
Transport
Weather
Recommendations
AI Assistant

Do not create 15 different navigation items.

RESPONSIVE DESIGN

The application must work on:

Desktop
Tablet
Mobile

For mobile:
- Avoid horizontal overflow
- Use collapsible sections where appropriate
- Keep important information visible
- Make buttons touch-friendly
- Convert parallel itinerary lanes into an understandable stacked/timeline representation
- Keep participant information visible
- Maintain readable typography

For desktop:
Use the available space efficiently.

Do not create huge empty areas.

IMPORTANT UI QUALITY RULES

No raw internal keys should ever appear in the UI.

Never show:
drink_water
ai_satisfaction_rate
group_fit_score
traveler_preferences
transport_cost
activity_duration
estimated_total
must_do
walking_tolerance
budget_mode
high_speed_rail
shared_group_budget

Instead display:

Drink water
AI Preference Match
Group Fit
Traveller Preferences
Transport Cost
Duration
Estimated Total
Must-do
Walking tolerance
Budget Mode
High-speed rail
Shared Group Budget

No snake_case.
No database field names.
No technical enum values.

Do not use fake metrics unless they are clearly meaningful product signals.

Do not show unexplained AI percentages.

Use human-readable labels everywhere.

INTERACTION STATES

Every interactive component should have:

Default
Hover
Pressed
Selected
Disabled
Loading
Success
Error

Examples:

When Alice is selected:
“✓ Alice”

When an activity is selected:
Show a clear selected state.

When a participant is added:
Update participant list and cost.

When budget changes:
Update remaining budget.

When currency changes:
Update financial displays.

When itinerary duration changes:
Update the entire itinerary.

When an alternative is applied:
Update the relevant activity after confirmation.

When AI proposes a change:
Show a preview before applying.

IMPORTANT: DO NOT CREATE DECORATIVE INTERACTIONS THAT DO NOTHING.

DEMO DATA

Create a polished demo trip:

Japan Adventure

Travellers:
Alice
Bob
Charlie
David

Destinations:
Tokyo
Kyoto
Osaka

Duration:
5 days

Currency:
MYR

Budget:
RM5,000 shared group budget

Include different traveller preferences.

Create at least one example of simultaneous activities:

09:00–12:00
Everyone
Tsukiji Outer Market

14:00–17:00
Alice + Bob
Shibuya Shopping

14:00–16:00
Charlie
Tokyo National Museum

16:00–18:00
David
Free time

18:30–20:00
Everyone
Dinner

Include:
- Transport between Tokyo and Kyoto
- Transport between Kyoto and Osaka
- Hotel cost
- Activity costs
- Personal expenses
- Shared expenses
- Remaining budget
- Weather warning
- Alternative activities
- Inspiration links
- AI recommendation
- AI adaptive itinerary example

FINAL PRODUCT FEEL

The final result should feel like a serious modern travel-planning product.

Think:

Simple enough to use quickly.
Powerful enough for a complicated group trip.
AI-assisted but human-controlled.
Visually polished but not decorative.
Information-rich but not cluttered.

The most important product differentiator is not simply “AI generates an itinerary”.

The differentiator is:

A group-aware, preference-aware, budget-aware, multi-destination, adaptive travel planner where different travellers can follow different activities while the system maintains a coherent overall trip.

Prioritize these features above unnecessary visual effects or secondary features.

Before finalizing the design, audit the entire application for:

1. Readability
2. Consistent spacing
3. Consistent typography
4. Consistent buttons
5. Responsive layouts
6. No raw technical keys
7. No broken/empty interactions
8. Correct participant selection
9. Correct shared vs individual budget behavior
10. Correct currency propagation
11. Correct 1–14 day support
12. Correct multi-city/multi-country support
13. Correct parallel itinerary support
14. Correct transport integration
15. Correct AI confirmation flow
16. Correct alternative activity flow
17. Correct adaptive itinerary flow
18. Correct manual editing
19. Correct recommendation explanations
20. No excessive cards, gradients, whitespace, or decorative AI-generated UI

Do not sacrifice functionality and usability for visual decoration.

Build a coherent design system and apply it consistently across every screen.