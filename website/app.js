// Personal API Key for OpenWeatherMap API
const apiKey = 'dc2fedc4a84809bf9db03dea296d0593';
//  Base Url
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

/**
* @description Fetching data from OpenWeatherMap
* @param {string} zip - zip code of the country
* @param {string} feelings - user's feelings
*/
const weatherData = async (zip, feelings) => {
  // Checking if the zip code i valid
  if ( !isNaN(Number(zip)) && zip.length == 5 ){
    // Creating Url
    const url = baseUrl + "zip=" + zip + "&appid=" + apiKey;
    /*
    * Fetching data if the user entered a wrong Zipcode
    * OpenWeatherMap would send 404 message to our console
    * and an Object with a messege
    */
    const response = await fetch(url);
    try{
      // Transform into JSON
      const newData = await response.json();
      // new Entry variable to custmize the data we want
      let newEntry;
      // Checking there no error
      if (newData.cod == 200){
        newEntry = {
          temperature: newData.main.temp,
          feelings: feelings,
          date: newDate,
          cod: newData.cod
        }
      } else {
        // if there is an error hold the messege that OpenWeatherMap sent
        newEntry = {
            message : newData.message,
            cod: newData.cod
        }
      }
      return newEntry;
    } catch(error) {
      // Actually we already handled if an error happend but we have to write a catch handler
      console.log("error",error);
    }
  } else {
    return {message:"Invalid Zip Code"}

  }
};

/**
* @description  Function to POST data
* @param {string} url - the path to our server
* @param {string} data - the data we want to post
*/
const postData = async ( url = '', data = {})=>{
    const response = await fetch(url, {
    method: 'POST', //  POST
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}

/**
* @description  Function to update our UI
*/
const updateUI = async () =>{
    // get the data from our Local Server
    const request = await fetch('/all');
    try {
    // Transform into JSON
      const weatherTodayData = await request.json();
      // Checking if an error occured
      if (weatherTodayData.cod == 200){
        // Write updated data to DOM elements
        document.querySelector(".entry").classList.remove("error");
        document.querySelector(".title").textContent ="";
        document.getElementById('temp').innerHTML = "Temperature: "+Math.round(weatherTodayData.temperature-273) + '°C';
        document.getElementById('content').innerHTML = weatherTodayData.feelings;
        document.getElementById("date").innerHTML = "Today's Date "+weatherTodayData.date;
      } else{
        document.getElementById('temp').innerHTML = "";
        document.getElementById('content').innerHTML = "";
        document.getElementById("date").innerHTML = "";
        document.querySelector(".title").textContent ="";
        document.getElementById('content').innerHTML = weatherTodayData.message;
        document.querySelector(".entry").classList.add("error");
      }
    }
    catch(error) {
      console.log("error", error);
    }
}

// Add a click event to add generate button
document.querySelector('button').addEventListener('click',performAction);

/**
* @description  Function to handle the click event
* @params{object} e - EventObject
*/
function performAction(e){
  // Getting the user's inputs
  const zip = document.querySelector('#zip').value;
  const feelings = document.querySelector('#feelings').value;
  // calling wetherData function to get the data from OpenWeatherMap
  weatherData(zip, feelings)
  .then( function(data) {
    // Postng the data to our local server
    postData("/add",data);
  })
  .then( function() {
    // Dynamically Updating our UI corressponding to the user's input
    updateUI();
  });
}

// Add a keypress event to on enter key to click on generate button
document.querySelector("#app").addEventListener('keypress', (event)=>{
   // event.keyCode or event.which  property will have the code of the pressed key
   let keyCode = event.keyCode ? event.keyCode : event.which;
   // 13 points the enter key
   if(keyCode === 13) {
     // click generate has been clicked update UI
     performAction();
   }
 });
