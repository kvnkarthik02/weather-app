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
          <td>{{weather.avgTemp}}</td>
          <td>{{weather.avgWindSpeed}} </td>
          <td>{{weather.avgRainfall}}</td>
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
        date: null,
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
          weatherData.date = getDates(response.data.list)
          weatherData.weatherTable = [
            {date: weatherData.date[0], avgTemp: weatherData.avgTemp[0], avgWindSpeed: weatherData.avgWindSpeed[0], avgRainfall: weatherData.avgRainfall[0]},
            {date: weatherData.date[1], avgTemp: weatherData.avgTemp[1], avgWindSpeed: weatherData.avgWindSpeed[1], avgRainfall: weatherData.avgRainfall[1]},
            {date: weatherData.date[2], avgTemp: weatherData.avgTemp[2], avgWindSpeed: weatherData.avgWindSpeed[2], avgRainfall: weatherData.avgRainfall[2]},
            {date: weatherData.date[3], avgTemp: weatherData.avgTemp[3], avgWindSpeed: weatherData.avgWindSpeed[3], avgRainfall: weatherData.avgRainfall[3]},
            {date: weatherData.date[4], avgTemp: weatherData.avgTemp[4], avgWindSpeed: weatherData.avgWindSpeed[4], avgRainfall: weatherData.avgRainfall[4]},
          ]

          for(let i=0;i<response.data.list.length;i++){
            console.log(response.data.list[i].weather)
          }
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