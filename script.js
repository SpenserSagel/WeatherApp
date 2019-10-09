/* 
    TODO:
      -take in user input and format URL
      -write multiple fetch calls to different weather api
      -combine data into one set
      -display data onto page

      --format other URLS
      --find a 4th API
      --get temps from other URLS
      --combine temps
      --display temps

*/
accuWeatherKey= "?apikey=MAe2sJnI8J4aPC2lrdXJ0srAizjCp6jW";
locationURL= "https://dataservice.accuweather.com/locations/v1/cities/";
accuWeatherURL= "https://dataservice.accuweather.com/forecasts/v1/daily/5day/"
darkSkyURL= "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/3376c98c20aa4edf120a638b7c49a715/";
//openWeatherURL= "https://api.openweathermap.org/data/2.5/forecast?lat=39.739&lon=-104.985&appid=08d77f5d1b0e1290aa91c405aa22063e";
weatherBitURL= "https://api.weatherbit.io/v2.0/forecast/daily?units=i&days=5&key=fc0210422d3243c8a160888937c8034e"

function formatAccuURL(city,state,country){
    return locationURL+country+'/'+state+'/search'+accuWeatherKey+'&q='+city;
}

function formatAll(data){
    latitude = data[0].GeoPosition.Latitude;
    longitude = data[0].GeoPosition.Longitude;
    ID = data[0].Key;
    formattedURLs = [darkSkyURL,weatherBitURL,accuWeatherURL];
    formattedURLs[0] += latitude+','+longitude;
    formattedURLs[1] += "&lat="+latitude+"&lon="+longitude;
    formattedURLs[2] += ID + accuWeatherKey;
    console.log(formattedURLs);
    return Promise.all([fetch(formattedURLs[0]),fetch(formattedURLs[1]),fetch(formattedURLs[2])])
    .then(response => Promise.all(response.map(value => value.json())));
}

function formatWithID(data){
    url = accuWeatherURL;
    ID = data[0].Key;
    console.log(ID);
    url+=(ID + accuWeatherKey);
    console.log(url);
    return fetch(url);
}
function getDarkSkyTemps(i,temps,data){
    temps[0].date[i]=data[2].DailyForecasts[i].Date;
    temps[0].min[i]=data[0].daily.data[i].temperatureLow;
    temps[0].max[i]=data[0].daily.data[i].temperatureHigh;
    return temps;
}

function getWeatherBitTemps(i,temps,data){
    temps[1].date[i]=data[2].DailyForecasts[i].Date;
    temps[1].min[i]=data[1].data[i].low_temp;
    temps[1].max[i]=data[1].data[i].high_temp;
    return temps;
}

function getAccuWeatherTemps(i,temps,data){
    temps[2].date[i]=data[2].DailyForecasts[i].Date;
    temps[2].min[i]=data[2].DailyForecasts[i].Temperature.Minimum.Value;
    temps[2].max[i]=data[2].DailyForecasts[i].Temperature.Maximum.Value;
    return temps;
}

function combineTemps(temps){
    var combinedTemps = {min:[0,0,0,0,0],max:[0,0,0,0,0],date:[]};
    for(i=0;i<temps.length;i++){
        for(j=0;j<temps[i].min.length;j++){
            combinedTemps.date[j]=temps[i].date[j];
            combinedTemps.min[j]+=temps[i].min[j];
            combinedTemps.max[j]+=temps[i].max[j];
        }
    }
    for(i=0;i<combinedTemps.min.length;i++){
        combinedTemps.min[i]=combinedTemps.min[i]/temps.length;
        combinedTemps.max[i]=combinedTemps.max[i]/temps.length;
    }
    console.log(combinedTemps);
    return combinedTemps;
}

function extractWeather(data){
    var temps = [{min:[],max:[],date:[]},{min:[],max:[],date:[]},{min:[],max:[],date:[]}];
    for(i=0;i<5;i++){
        getDarkSkyTemps(i,temps,data);
        getWeatherBitTemps(i,temps,data);
        getAccuWeatherTemps(i,temps,data);
    }
    console.log(temps);
    return combineTemps(temps);
}

function weatherToHTML(temps){
    return `
    <ul>
        <li>${temps.date[0]} High:${temps.max[0].toFixed(2)} Low:${temps.min[0].toFixed(2)}</li>
        <li>${temps.date[1]} High:${temps.max[1].toFixed(2)} Low:${temps.min[1].toFixed(2)}</li>
        <li>${temps.date[2]} High:${temps.max[2].toFixed(2)} Low:${temps.min[2].toFixed(2)}</li>
        <li>${temps.date[3]} High:${temps.max[3].toFixed(2)} Low:${temps.min[3].toFixed(2)}</li>
        <li>${temps.date[4]} High:${temps.max[4].toFixed(2)} Low:${temps.min[4].toFixed(2)}</li>
    </ul>`
}

function renderWeather(data){
    $(".weatherDisplay").html(weatherToHTML(extractWeather(data)));
}

function get(url){
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new error(response.statusText());
    })
    .then(responseJson => formatAll(responseJson))/*
    .then(response => {
        if(response.ok){
            return response;
        }
        throw new error(response.statusText());
    })*/
    .then(response => renderWeather(response))
    .catch(error => console.log("no worky"));
}

function testGet(url1,url2){
    Promise.all([fetch(url1),fetch(url2)])
    .then(response => Promise.all(response.map(value => value.json())))
    .then(values => console.log(values));
}

function onSubmit(){
    $(".input").on('click', '.submit', event => {
        event.preventDefault();
        get(formatAccuURL($("#city").val(),$("#state").val(),$("#country").val()));
    });
}

function test(){
    testGet(weatherBitURL,darkSkyURL);
}

$(onSubmit);