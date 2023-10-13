<template>
  <div class="home">
    <h1>Weather App</h1>
    <div class="enterCity">
      <input v-model="weatherData.city" type="text" placeholder="Enter City">
      <div class="button">
        <button @mousedown.left="geocode">Get Weather</button>
      </div>
    </div>

    <div class="weathertable" >
      <table id="tableID" border="3" style="align-items: center;">
        <tr>
          <th>Date</th>
          <th>Average temperature (&degC)</th>
          <th>Average wind speed (meters/seconds)</th>
          <th>Average rainfall (mm) for 3 hours</th>
        </tr>
        <tr v-for="weather in weatherData.weatherTable">
          <td>{{weather.date}}</td>
          <td>{{weather.average_temperature}}</td>
          <td>{{weather.average_wind}} </td>
          <td>{{weather.average_rain}}</td>
        </tr>
      </table>
    </div>

  </div>
</template>


<script>
  import { reactive } from 'vue'
  import axios from 'axios'
  import { getAvgWindSpeedPerDay , getAvgRainPerDay, getAvgTempPerDay , getDates} from './helper.js';

  export default{
    setup(){
      let weatherData = reactive({
        city:'',
        weather: null, 
        avgTemp: null,
        avgWindSpeed: null,
        avgRainfall: null,
        dates: null,
        weatherTable: null,
      })
      
      const geocodeURL = "http://api.openweathermap.org/geo/1.0/direct"
      const weatherURL = "https://api.openweathermap.org/data/2.5/forecast"
      const apiKey = "90c462a2eb78cf05539d31d26003491a"

      const geocode = () =>{
        axios(`${geocodeURL}?q=${weatherData.city}&limit=1&appid=${apiKey}`).then(response=>{
          let latitude = response.data[0].lat
          let longitude = response.data[0].lon
          getWeather(latitude, longitude)
        })
      }

      const getWeather = (latitude, longitude) =>{
        axios(`${weatherURL}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`).then(response=>{
          weatherData.avgWindSpeed = (Object.values(getAvgWindSpeedPerDay(response.data.list))) //get array of daily avg wind speed in order of timestamp
          // console.log(weatherData.avgWindSpeed)
          weatherData.avgTemp = (Object.values(getAvgTempPerDay(response.data.list))) //get array of daily avg temp in order of timestamp
          // console.log(weatherData.avgTemp)
          weatherData.avgRainfall = (Object.values(getAvgRainPerDay(response.data.list))) //get array of daily avg rainfall in order of timestamp
          // console.log(weatherData.avgRainfall)
          weatherData.dates = getDates(response.data.list)
          weatherData.weatherTable = [
            {date: weatherData.dates[0], average_temperature: weatherData.avgTemp[0], average_wind: weatherData.avgWindSpeed[0], average_rain: weatherData.avgRainfall[0]},
            {date: weatherData.dates[1], average_temperature: weatherData.avgTemp[1], average_wind: weatherData.avgWindSpeed[1], average_rain: weatherData.avgRainfall[1]},
            {date: weatherData.dates[2], average_temperature: weatherData.avgTemp[2], average_wind: weatherData.avgWindSpeed[2], average_rain: weatherData.avgRainfall[2]},
            {date: weatherData.dates[3], average_temperature: weatherData.avgTemp[3], average_wind: weatherData.avgWindSpeed[3], average_rain: weatherData.avgRainfall[3]},
            {date: weatherData.dates[4], average_temperature: weatherData.avgTemp[4], average_wind: weatherData.avgWindSpeed[4], average_rain: weatherData.avgRainfall[4]},
          ]
        })
      }

      return{
        weatherData, 
        getWeather, 
        geocode
      }
    }
  }
</script>

<style lang="css">
  .enterCity input{
    font-size: 30px;
  }
  .enterCity button{
    margin-top: 20px;
  }
  .weatherData{
    margin-top:20px;
  }
  .weatherData h1{
    font-size: 80px;
  }

  .weathertable{
    margin-top: 20px;
  }
</style>