const fruits = [];

function onDocumentReady() {
  fetchFromStorage();

  document.getElementById('saveToStorage').addEventListener('click', saveToStorage);

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


function saveToStorage() {
  const stringVersion = JSON.stringify(fruits);
  localStorage.setItem('fruits', stringVersion);
}

function fetchFromStorage() {
  const tmp = JSON.parse(localStorage.getItem('fruits'));
  if (tmp == null) {
    console.log("No fruits saved");
    return;
  }
  for (fruit of tmp) {
    fruits.push(fruit);
  }
  updateDisplay();
}

if (document.readyState != 'loading') onDocumentReady();
else document.addEventListener('DOMContentLoaded', onDocumentReady);
