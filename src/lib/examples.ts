import { buildDemoTrip } from "../data"
import { generateTrip } from "./generate"

export function buildMalaysiaExample() {
  const source = buildDemoTrip()
  const trip = generateTrip({
    name: "Malaysia City Escape", days: 3, startDate: "2026-10-09",
    displayCurrency: "MYR", budgetMode: "shared", groupBudget: 2500,
    destinations: [{city:"Kuala Lumpur",country:"Malaysia"},{city:"George Town",country:"Malaysia"}],
    travellers: source.travellers.map((t,i) => ({name:["Aina","Daniel","Mei","Arjun"][i],budget:625,prefs:{...t.prefs,food:[]}})),
  })
  const places = [
    ["KLCC Park", "Nature", "outdoor", 0],
    ["Central Market", "Shopping", "indoor", 80],
    ["Bukit Bintang walk", "Sightseeing", "outdoor", 0],
    ["Perdana Botanical Garden", "Nature", "outdoor", 0],
    ["Islamic Arts Museum Malaysia", "Culture", "indoor", 100],
    ["Merdeka Square", "History", "outdoor", 0],
    ["George Town heritage walk", "Culture", "outdoor", 0],
  ] as const
  trip.activities = trip.activities.map((a,i) => {
    const p = places[i % places.length]
    return {...a,name:p[0],activityType:p[1],environment:p[2],activityCost:{amount:p[3],currency:"MYR" as const},
      description:"An example stop for your group. Confirm opening hours, admission and travel time before visiting.",
      reason:"Compare this stop with your group's interests and walking preferences.",inspirationLinks:[],alternatives:[],
      transportType:"Taxi" as const,transportCost:{amount:30,currency:"MYR" as const}}
  })
  trip.legs = [{id:"my-transfer",from:"Kuala Lumpur",to:"George Town",dayIndex:2,type:"Flight",departure:"09:00",arrival:"10:15",durationMin:75,cost:{amount:800,currency:"MYR"},participants:trip.travellers.map(t=>t.id)}]
  trip.weather = trip.weather.map((w,i) => ({...w,tempC:[31,30,29][i],condition:"Cloudy" as const}))
  trip.groupNote = "Explore familiar Malaysian places together, compare estimated spending in ringgit, and review outdoor alternatives if rain affects the plan. Transport and venue prices are illustrative."
  return trip
}
