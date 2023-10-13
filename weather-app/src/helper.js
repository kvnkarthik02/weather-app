
export const getAvgWindSpeedPerDay = (list) => {
  const avgWindSpeeds = {}
  // Loop through the list of weather data and add the wind speeds to the appropriate day's array
  for (let i = 0; i < list.length; i++) {
    const date = new Date(list[i].dt_txt)
    const day = date.toDateString()
    // console.log(date,day)
    if (!avgWindSpeeds[day]) {
      avgWindSpeeds[day] = []
    }
    avgWindSpeeds[day].push(list[i].wind.speed)
    // console.log(avgWindSpeeds)
  }
  // Calculate the average wind speed for each day and add it to the avgWindSpeeds object
  for (const day in avgWindSpeeds) {
    const totalWindSpeed = avgWindSpeeds[day].reduce((acc, curr) => acc + curr, 0)
    const numWindSpeeds = avgWindSpeeds[day].length
    const avgWindSpeed = numWindSpeeds > 0 ? totalWindSpeed / numWindSpeeds : 0
    avgWindSpeeds[day] = avgWindSpeed
  }
  return avgWindSpeeds
}

export const getDates = (list) => {
    const dates = []
    for (let i = 0; i < list.length; i++) {
        const date = new Date(list[i].dt_txt)
        const day = date.toDateString()
        if(!dates.includes(day)){
            dates.push(day)
        }
      }
      return dates
}


export const getAvgTempPerDay = (list) => {
  const avgTemps = {}
  // Loop through the list of weather data and add the temperatures to the appropriate day's array
  for (let i = 0; i < list.length; i++) {
    const date = new Date(list[i].dt_txt)
    const day = date.toDateString()
    if (!avgTemps[day]) {
      avgTemps[day] = []
    }
    avgTemps[day].push(list[i].main.temp)
  }
  // Calculate the average temperature for each day and add it to the avgTemps object
  for (const day in avgTemps) {
    const totalTemp = avgTemps[day].reduce((acc, curr) => acc + curr, 0)
    const numTemps = avgTemps[day].length
    const avgTemp = numTemps > 0 ? totalTemp / numTemps : 0
    avgTemps[day] = avgTemp
  }
  return avgTemps
}


export const getAvgRainPerDay = (list) => {
  const avgRain = {}
  // Loop through the list of weather data and add the rain amounts to the appropriate day's array
  for (let i = 0; i < list.length; i++) {
    const date = new Date(list[i].dt_txt)
    const day = date.toDateString()
    if (!avgRain[day]) {
      avgRain[day] = []
    }
    if (list[i].rain && list[i].rain['3h']) {
      avgRain[day].push(list[i].rain['3h'])
    }
  }
  // Calculate the average rainfall for each day and add it to the avgRain object
  for (const day in avgRain) {
    const totalRain = avgRain[day].reduce((acc, curr) => acc + curr, 0)
    const numRain = avgRain[day].length
    const avgRainfall = numRain > 0 ? totalRain / numRain : 0
    avgRain[day] = avgRainfall
  }
  return avgRain
}