const assert = require("node:assert/strict")

const fs = require("node:fs")

const path = require("node:path")

const vm = require("node:vm")

const ts = require("typescript")

// Run the pure TypeScript ranking logic with the project's existing compiler.

const cache = new Map()

function load(file) {
  file = path.resolve(file)

  if (cache.has(file)) return cache.get(file).exports

  const module = { exports: {} }

  cache.set(file, module)

  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText

  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {
    filename: file,
  })(
    (name) => load(path.resolve(path.dirname(file), name + ".ts")),
    module,
    module.exports,
  )

  return module.exports
}

const { rankOptions, optionInventory } = load(
  path.join(__dirname, "../src/lib/discovery.ts"),
)

const { buildDemoTrip } = load(path.join(__dirname, "../src/data.ts"))

const { computeTotals } = load(path.join(__dirname, "../src/lib/compute.ts"))

const { toDisplay } = load(path.join(__dirname, "../src/lib/currency.ts"))

const trip = buildDemoTrip()

const activity = trip.activities.find((a) => a.name === "Shibuya Shopping")

const initial = JSON.stringify(trip)

const ranked = rankOptions(trip, activity, "explore")

assert.ok(
  ranked.length >= 5,
  "Activities have discovery choices even with sparse original alternatives",
)

assert.equal(
  JSON.stringify(trip),
  initial,
  "Browsing must not mutate the itinerary or budget",
)

assert.ok(
  ranked[0].matches.length > 0,
  "A matching interest ranks ahead of an unrelated option",
)

const indoor = rankOptions(trip, activity, "backup", true)

assert.ok(
  indoor.length > 0 && indoor.every((r) => r.option.environment === "indoor"),
  "Indoor filtering must exclude unknown and outdoor settings",
)

const saved = ranked[ranked.length - 1].option

trip.savedOptions = { [activity.id]: [saved] }

assert.ok(
  rankOptions(trip, activity, "backup").some(
    (r) => r.option.id === saved.id && r.saved,
  ),
  "Saved alternatives remain available without overriding suitability",
)

assert.equal(
  optionInventory(trip, activity).filter((o) => o.id === saved.id).length,
  1,
  "Saved entries must not duplicate inventory",
)

trip.activities.push({ ...activity, id: "already-scheduled", name: saved.name })

assert.ok(
  !optionInventory(trip, activity).some((o) => o.name === saved.name),
  "Do not recommend a place already on the itinerary",
)

trip.activities.pop()

const item = ranked[0]

const expected =
  toDisplay(item.option.cost, trip.displayCurrency) -
  toDisplay(activity.activityCost, trip.displayCurrency)

assert.equal(
  item.delta,
  expected,
  "The comparison converts both amounts to the display currency",
)

const projected = structuredClone(trip)

projected.activities.find((a) => a.id === activity.id).activityCost =
  item.option.cost

assert.ok(
  Math.abs(
    computeTotals(projected).total - computeTotals(trip).total - item.delta,
  ) < 0.001,
  "The preview delta matches the resulting trip total",
)

const solo = structuredClone(trip)

solo.travellers = [solo.travellers[0]]

solo.activities.find((a) => a.id === activity.id).participants = [
  solo.travellers[0].id,
]

assert.equal(
  rankOptions(
    solo,
    solo.activities.find((a) => a.id === activity.id),
    "explore",
  )[0].people.length,
  1,
  "Solo recommendations only evaluate the participant",
)

console.log("10 discovery checks passed")

const adaptive = load(path.join(__dirname, "../src/lib/adaptive.ts"))

const rain = buildDemoTrip()

rain.weatherDisruption = adaptive.demoForecast(rain, "multiple")

assert.equal(adaptive.weatherRisks(rain).length, 3)

const untouched = JSON.stringify(rain)

const proposals = adaptive.suggestAdaptivePlan(rain)

assert.equal(
  JSON.stringify(rain),
  untouched,
  "Preparing suggestions never changes the itinerary",
)

assert.equal(
  proposals.filter((s) => s.included).length,
  2,
  "Locked activities start excluded",
)

assert.deepEqual(adaptive.validateAdaptivePlan(rain, proposals), [])

const kept = rain.activities.find(
  (a) => a.id === proposals.find((s) => !s.included).activityId,
)

const result = adaptive.applyAdaptivePlan(
  rain,
  proposals,
  adaptive.forecastKey(rain),
)

assert.deepEqual(result.errors, [])

assert.equal(result.count, 2)

assert.equal(
  adaptive.weatherRisks(result.trip).length,
  1,
  "Partial application retains unresolved risk",
)

assert.deepEqual(
  result.trip.activities.find((a) => a.id === kept.id),
  kept,
  "Rejected activity stays exactly unchanged",
)

assert.equal(
  JSON.stringify(rain),
  untouched,
  "Applying returns a new trip without mutating the source",
)

assert.equal(
  result.trip.activities.filter((a) => a.adjustedForForecast).length,
  2,
)

assert.ok(
  adaptive
    .applyAdaptivePlan(
      rain,
      proposals.map((s) => ({ ...s, included: true })),
      adaptive.forecastKey(rain),
    )
    .errors.some((e) => e.includes("locked")),
)

assert.equal(adaptive.applyAdaptivePlan(rain, proposals, "stale").count, 0)

const clear = structuredClone(rain)

clear.weatherDisruption.cleared = true

assert.equal(adaptive.weatherRisks(clear).length, 0)

assert.equal(
  adaptive.applyAdaptivePlan(clear, proposals, adaptive.forecastKey(clear))
    .count,
  0,
)

delete clear.weatherDisruption

assert.equal(adaptive.applyAdaptivePlan(clear, proposals, "none").count, 0)

for (const [days, key] of [
  [0, "near"],
  [2, "near"],
  [3, "moderate"],
  [5, "moderate"],
  [6, "early"],
  [10, "early"],
  [11, "very-early"],
  [14, "very-early"],
])
  assert.equal(adaptive.confidence(days).key, key)

const early = structuredClone(rain)

early.weatherDisruption.horizonDays = 12

early.weatherReminder = {
  signature: adaptive.noticeKey(early),
  untilHorizonDays: 2,
  until: 2000,
}

assert.equal(adaptive.reminderActive(early, 1000), true)

early.weatherDisruption.horizonDays = 11

assert.equal(
  adaptive.reminderActive(early, 1000),
  true,
  "Identical forecast band stays snoozed",
)

early.weatherDisruption.horizonDays = 1

assert.equal(
  adaptive.reminderActive(early, 1000),
  false,
  "A near-term forecast resurfaces",
)

early.weatherDisruption.horizonDays = 12

early.weatherDisruption.severity = "heavy-rain"

assert.equal(
  adaptive.reminderActive(early, 1000),
  false,
  "Increased severity resurfaces",
)

early.weatherDisruption.severity = "rain"

assert.equal(
  adaptive.reminderActive(early, 3000),
  false,
  "Expired reminders resurface",
)

const target = rain.activities.find(
  (a) => a.id === proposals.find((s) => s.included).activityId,
)

assert.equal(
  adaptive.isWeatherRisk(rain, { ...target, environment: "indoor" }),
  false,
)

assert.equal(
  adaptive.isWeatherRisk(rain, {
    ...target,
    startTime: "18:00",
    endTime: "19:00",
  }),
  false,
)

assert.equal(
  adaptive.isWeatherRisk(rain, { ...target, city: "Elsewhere" }),
  false,
)

const move = [
  {
    activityId: target.id,
    included: true,
    method: "reschedule",
    dayIndex: target.dayIndex,
    startTime: "21:00",
    endTime: "22:00",
  },
]

assert.deepEqual(adaptive.validateAdaptivePlan(rain, move), [])

assert.equal(
  adaptive.weatherRisks(
    adaptive.applyAdaptivePlan(rain, move, adaptive.forecastKey(rain)).trip,
  ).length,
  2,
)

assert.ok(
  adaptive
    .validateAdaptivePlan(rain, [
      { ...move[0], startTime: "14:00", endTime: "15:00" },
    ])
    .some((e) => e.includes("rain window")),
)

assert.ok(
  adaptive
    .validateAdaptivePlan(rain, [{ ...move[0], dayIndex: 4 }])
    .some((e) => e.includes("must stay")),
)

assert.ok(
  adaptive
    .validateAdaptivePlan(rain, [{ ...move[0], startTime: "25:00" }])
    .some((e) => e.includes("start and end")),
)

console.log(
  "Adaptive checks passed: partial approval, locks, stale/cleared forecasts, risk boundaries, reminders and rescheduling",
)

const {buildMalaysiaExample} = load(path.join(__dirname,"../src/lib/examples.ts"));
const malaysia = buildMalaysiaExample();
assert.ok(malaysia.activities.length >= 7);
assert.ok(malaysia.activities.every(a => a.country === "Malaysia" && a.activityCost.currency === "MYR"));
assert.ok(Number.isFinite(computeTotals(malaysia).total));
assert.ok(malaysia.activities.filter(a => a.dayIndex === 2).every(a => a.startTime >= "14:00"));
malaysia.weatherDisruption = adaptive.demoForecast(malaysia,"multiple");
assert.ok(adaptive.weatherRisks(malaysia).length >= 2);
assert.deepEqual(adaptive.validateAdaptivePlan(malaysia,adaptive.suggestAdaptivePlan(malaysia)),[]);
console.log("Malaysia example checks passed: locations, currency, arrival time and adaptation");
