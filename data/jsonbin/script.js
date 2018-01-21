const fruits = [];

function onDocumentReady() {
  fetchFromServer();

  document.getElementById('saveToServer').addEventListener('click', saveToServer);

  document.getElementById('fruitForm').addEventListener('submit', e=> {
    e.preventDefault(); // Prevent form from submitting
    
    // Grab values from form
    let form = e.target;
    
    let fruitName = form.elements['fruit'].value;
    let colour = form.elements['colour'].value;
    let smoothie = form.elements['smoothie'].checked;
  
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
  fetch('https://api.jsonbin.io/b/' + bin, {
    method: 'PUT', // HTTP verb is 'PUT'
    body: JSON.stringify(fruits), 
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log('Success:', response);
  });
}

function createBin() {
  fetch('https://api.jsonbin.io/b', {
    method: 'POST', // HTTP verb is 'POST'
    body: JSON.stringify(fruits), 
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log('Success:', response);

    // Save the server-generated id so we can update it next time
    localStorage.setItem('bin', response.id);
  });
}

function fetchFromServer() {
  const bin = localStorage.getItem('bin');
  if (bin == null) {
    console.log("No bin id available so far");
    return;
  }

  // The URL we construct here is according to the JSONbin docs for
  // getting the latest version of a bucket
  fetch('https://api.jsonbin.io/b/' + bin + "/latest")
  .then(res => res.json())
  .then(res => {
    console.log("Retrieved from " +  bin + ": ");
    console.log(res);
    for (fruit of res)
      fruits.push(fruit);
    updateDisplay();
  });
}

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
