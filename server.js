const express = require('express');
const path = require('path');
const NodeGeocoder = require('node-geocoder');
const cors = require('cors');

const app = express();
app.use(cors());
// let publicPath= path.resolve(__dirname,"/public")
// app.use(express.static(publicPath));


const geocodeURL = "http://api.openweathermap.org/geo/1.0/direct"
const weatherURL = "https://api.openweathermap.org/data/2.5/forecast"
const currWeatherURL = "https://api.openweathermap.org/data/2.5/weather"
const apiKey = "90c462a2eb78cf05539d31d26003491a"

app.get('/weather/:city', getWeather);
var lon = null
var lat = null
async function getWeather(req, res){
    fetch(geocodeURL+'?q='+req.params.city+'&limit=1&appid='+apiKey)
    .then(response => response.json())
    .then(data => {
      console.log("hello at server")
        let rainBool = false
        fetch(weatherURL+'?lat='+data[0].lat+'&lon='+data[0].lon+'&units=metric&appid=90c462a2eb78cf05539d31d26003491a')
        .then(response => response.json())
        .then(data => {
          console.log(lat, lon)
          console.log(data)
          let avgWindSpeedPerDay = (Object.values(getAvgWindSpeedPerDay(data.list)))
          let avgTempPerDay = (Object.values(getAvgTempPerDay(data.list)))
          let  calcAvgTemp= array => array.reduce((a, b) => a + b) / array.length;
          let avgTemp = calcAvgTemp(avgTempPerDay)
          let avgRainfallPerDay = (Object.values(getAvgRainPerDay(data.list)))

          for(let i=0; i<avgRainfallPerDay.length; i++){
              if(avgRainfallPerDay[i] != 0){
                  rainBool = true
              }
          }
          let date = getDates(data.list)
          weatherTable = [
              {date: date[0], avgTempPerDay: avgTempPerDay[0], avgWindSpeedPerDay: avgWindSpeedPerDay[0], avgRainfallPerDay: avgRainfallPerDay[0]},
              {date: date[1], avgTempPerDay: avgTempPerDay[1], avgWindSpeedPerDay: avgWindSpeedPerDay[1], avgRainfallPerDay: avgRainfallPerDay[1]},
              {date: date[2], avgTempPerDay: avgTempPerDay[2], avgWindSpeedPerDay: avgWindSpeedPerDay[2], avgRainfallPerDay: avgRainfallPerDay[2]},
              {date: date[3], avgTempPerDay: avgTempPerDay[3], avgWindSpeedPerDay: avgWindSpeedPerDay[3], avgRainfallPerDay: avgRainfallPerDay[3]},
              {date: date[4], avgTempPerDay: avgTempPerDay[4], avgWindSpeedPerDay: avgWindSpeedPerDay[4], avgRainfallPerDay: avgRainfallPerDay[4]},
          ]
          finalRes = {
              rain: rainBool,
              avgTemp: avgTemp,
              weatherTable: weatherTable
          }
          res.json(finalRes)
      })
    })
}

app.get('/currweather/:city', getCurrWeather);
var lon = null
var lat = null
async function getCurrWeather(req, res){
    fetch(geocodeURL+'?q='+req.params.city+'&limit=1&appid='+apiKey)
    .then(response => response.json())
    .then(data => {
      fetch(currWeatherURL+'?lat='+data[0].lat+'&lon='+data[0].lon+'&units=metric&appid='+apiKey)
        .then(response => response.json())
        .then(data => {
          let finalRes = {
            temp: data.main.temp,
            description: data.weather[0].main
          }
          res.json(finalRes)
        })
    })
}


function getAvgWindSpeedPerDay(list){
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
      const avgWindSpeedPerDay = numWindSpeeds > 0 ? totalWindSpeed / numWindSpeeds : 0
      avgWindSpeeds[day] = avgWindSpeedPerDay
    }
    return avgWindSpeeds
}

function getAvgTempPerDay(list){
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
      const avgTempPerDay = numTemps > 0 ? totalTemp / numTemps : 0
      avgTemps[day] = avgTempPerDay
    }
    return avgTemps
}

  
function getDates(list){
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
  
function getAvgRainPerDay(list){
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
      const avgRainfallPerDay = numRain > 0 ? totalRain / numRain : 0
      avgRain[day] = avgRainfallPerDay
    }
    return avgRain
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});