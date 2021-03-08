const fruits = [];
const baseUrl = 'https://api.jsonbin.io/v3/';

// Generate a key by signing in to JSONBin and going to 'API Keys' (https://jsonbin.io/api-keys)
const jsonBinKey = '';

const headers = {
  'X-Master-Key': jsonBinKey,
  'X-Bin-Private': true,
  'Content-Type': 'application/json'
 };

function onDocumentReady() {

  if (jsonBinKey == '') {
    log('Read the README.md', true);
    throw new Error('Read the README.md');
  }
  fetchFromServer();
 
  document.getElementById('saveToServer').addEventListener('click', saveToServer);

  document.getElementById('fruitForm').addEventListener('submit', e=> {
    e.preventDefault(); // Prevent form from submitting
    
    // Grab values from form
    const form = e.target;
    const fruitName = form.elements['fruit'].value;
    const colour = form.elements['colour'].value;
    const smoothie = form.elements['smoothie'].checked;
  
    let fruit = {
      name: fruitName, colour: colour, smoothie: smoothie
    }
    fruits.push(fruit);
    updateDisplay();
  });
}

function updateDisplay() {
  let html = '';
  for (fruit of fruits) {
    html += '<span class="fruit">';
    html += fruit.name;
    html +=  " (" + fruit.colour + ")";
    if (fruit.smoothie)
      html += " Nice in smoothies!";
    html += '</span>'
  }
  document.getElementById('fruits').innerHTML = html;
}

// Creates or updates server
function saveToServer() {
  const bin = localStorage.getItem('bin');
  if (bin == null) {
    // We don't have the id already, so create it
    createBin();
  } else {
    // Update existing bin on server
    updateBin(bin);
  }
}

function updateBin(bin) {
  // Note we access the bin by the URL
  fetch(baseUrl + 'b/' + bin, {
    method: 'PUT', // HTTP verb is 'PUT'
    body: JSON.stringify(fruits), 
    headers: headers
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log('Success:', response);
  });
}

function createBin() {
  fetch(baseUrl + 'b/', {
    method: 'POST', // HTTP verb is 'POST'
    body: JSON.stringify(fruits), 
    headers: headers
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log('Success:', response);

    // Save the server-generated id so we can update it next time
    const binId = response.metadata.id;
    log(`Created new bin ${binId}`);
    localStorage.setItem('bin', binId);
  });
}

function log(msg, isError = false) {
  const el = document.getElementById('log');
  el.innerText = msg;
  if (isError) {
    console.error(msg);
    el.classList.add('error');
  } else {
    console.log(msg);
    el.classList.remove('error');
  }
}

function fetchFromServer() {
  log('Fetching from server');
  const bin = localStorage.getItem('bin');
  if (!bin) {
    log("No bin id available yet");
    return;
  }

  // The URL we construct here is according to the JSONbin docs for
  // getting the latest version of a bucket
  fetch(baseUrl + 'b/' + bin + "/latest", { headers: headers})
  .then(res => res.json())
  .then(res => {
    console.log("Retrieved from " +  bin + ": ");
    console.log(res);
    for (fruit of res.record)
      fruits.push(fruit);
    updateDisplay();
    log('');
  }).catch(e => {
    log(e, true);
  });
}

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
