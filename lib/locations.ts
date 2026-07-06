import locationsData from './states-and-districts.json'

export const LOCATIONS: Record<string, string[]> = {}

// Populate LOCATIONS from json data
locationsData.states.forEach((item) => {
  LOCATIONS[item.state] = item.districts
})
