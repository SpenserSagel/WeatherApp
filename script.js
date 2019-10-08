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
darkSkyURL= "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/3376c98c20aa4edf120a638b7c49a715/39.739,-104.985";
//openWeatherURL= "https://api.openweathermap.org/data/2.5/forecast?lat=39.739&lon=-104.985&appid=08d77f5d1b0e1290aa91c405aa22063e";
weatherBitURL= "https://api.weatherbit.io/v2.0/forecast/daily?units=i&days=5&lat=39.739&lon=-104.98&key=fc0210422d3243c8a160888937c8034e"

function formatURL(city,state,country){
    return locationURL+country+'/'+state+'/search'+accuWeatherKey+'&q='+city;
}

function formatWithCoords(data){
    latitude = data[0].GeoPosition.Latitude;
    longitude = data[0].GeoPosition.Longitude;
    console.log(latitude);
}

function formatWithID(data){
    url = accuWeatherURL;
    ID = data[0].Key;
    console.log(ID);
    url+=(ID + accuWeatherKey);
    console.log(url);
    return fetch(url);
}

function extractWeather(data){
    var temps = {min:[],max:[],date:[]};
    for(i=0;i<5;i++){
        temps.date[i]=data.DailyForecasts[i].Date;
        temps.min[i]=data.DailyForecasts[i].Temperature.Minimum.Value;
        temps.max[i]=data.DailyForecasts[i].Temperature.Maximum.Value;
    }
    console.log(temps);
    return temps;
}

function weatherToHTML(temps){
    return `
    <ul>
        <li>${temps.date[0]} High:${temps.max[0]} Low:${temps.min[0]}</li>
        <li>${temps.date[1]} High:${temps.max[1]} Low:${temps.min[1]}</li>
        <li>${temps.date[2]} High:${temps.max[2]} Low:${temps.min[2]}</li>
        <li>${temps.date[3]} High:${temps.max[3]} Low:${temps.min[3]}</li>
        <li>${temps.date[4]} High:${temps.max[4]} Low:${temps.min[4]}</li>
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
    .then(responseJson => formatWithID(responseJson))
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new error(response.statusText());
    })
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
        get(formatURL($("#city").val(),$("#state").val(),$("#country").val()));
    });
}

function test(){
    testGet(weatherBitURL,darkSkyURL);
}

$(test());