// javascript

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://wearethechamps-af520-default-rtdb.firebaseio.com/"
}

const helloDiv = document.getElementById("hello")
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "endoresement")
const inputFieldEl = document.getElementById("textArea")
const inputFromEl = document.getElementById("inputFrom")
const inputToEl = document.getElementById("inputTo")
const publishButtonEl = document.getElementById("publishButton")
const shoppingListEl = document.getElementById("shopping-list")
const likeButton = document.getElementById('like-button')
const likeCount = document.getElementById('like-count')

publishButtonEl.addEventListener("click", function () {
  let inputValue = "To:" + "<b>" + inputToEl.value + "</b>" + "\n" + "\n" + inputFieldEl.value + "\n" + "\n\nFrom:" + "<b>" + inputFromEl.value + "</b>";

  if (inputFieldEl.value === "" || inputFromEl.value === "" || inputToEl.value === "") {
    alert("INVALID! YOU MUST COMPLETE THE FORM!");
    return; // exit the function without pushing to the database
  }
  push(shoppingListInDB, inputValue)
  clearInputFieldEl()
  clearInputFromEl()
  clearInputToEl()
  shoppingListEl.appendChild(helloDiv);
})

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())
    clearShoppingListEl()
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]
      appendItemToShoppingListEl(currentItem)
    }
  } else {
    shoppingListEl.innerHTML = ""
  }
})

function clearShoppingListEl() {
  shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
  inputFieldEl.value = ""
}

function clearInputFromEl() {
  inputFromEl.value = ""
}

function clearInputToEl() {
  inputToEl.value = ""
}


function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  let newDiv = document.createElement("div");
  let newLikeButton = document.createElement("button");
  let newLikeCount = document.createElement("span");

  // split the itemValue string into the "To:" and "From:" parts
  let [toText, fromText] = itemValue.split("\n\nFrom:");

  // wrap the "To:" and "From:" parts in <strong> tags to make them bold
  toText = "<strong>To:</strong> " + toText.substr(3);
  fromText = "<strong>From:</strong> " + fromText.trim();




  // create a new HTML element to display the itemValue
  let newItemValue = document.createElement("div");
  newItemValue.innerHTML = toText + "<br>" + fromText;

  newEl.appendChild(newItemValue);

  // set up the like button and count
  newLikeCount.id = itemID;
  newLikeCount.textContent = parseInt(localStorage.getItem(itemID)) || 0;
  newLikeButton.addEventListener("click", function () {
    let currentCount = parseInt(newLikeCount.textContent) || 0;

    newLikeCount.textContent = currentCount;
    localStorage.setItem(itemID, currentCount);
    newEl.removeEventListener("click", function () { });


  });

  // Disable the button after it has been clicked
  newLikeButton.addEventListener("click", function () {
    newLikeButton.disabled = true;
  });
  let liked = localStorage.getItem(itemID + '_liked');
  if (liked) {
    newLikeButton.disabled = true;
  }

  newLikeButton.addEventListener('click', function () {
    let currentCount = parseInt(newLikeCount.textContent) || 0;
    currentCount++;
    newLikeCount.textContent = currentCount;
    localStorage.setItem(itemID, currentCount);
    localStorage.setItem(itemID + '_liked', true);
    newLikeButton.disabled = true;
  });

  newDiv.appendChild(newLikeButton);
  newDiv.appendChild(newLikeCount);
  newEl.appendChild(newDiv);

  //newEl.addEventListener("dblclick", function () {
    //let exactLocationOfItemInDB = ref(database, `endoresement/${itemID}`)
   // remove(exactLocationOfItemInDB)
 // });

  shoppingListEl.append(newEl);
}



// Load the like count from local storage or set to 0 if it doesn't exist
let count = parseInt(localStorage.getItem('likeCount')) || 0;
likeCount.textContent = count;

function resizeList() {
  const textarea = document.getElementById('textArea');
  const list = document.getElementById('list');
  const textHeight = textarea.scrollHeight;
  list.style.height = `${textHeight}px`;
}

// get the mainDiv element
const mainDiv = document.getElementById('mainDiv');

// listen to the event when a new ul li list is added
const ulList = document.querySelector('ul');
ulList.addEventListener('DOMNodeInserted', function (event) {
  // get all the ul li elements
  const ulLiList = ulList.querySelectorAll('li');
  // calculate the height of the mainDiv
  let height = 844;
  ulLiList.forEach(function (li) {
    height += li.offsetHeight + parseInt(window.getComputedStyle(li).marginTop);
  });
  // set the new height for the mainDiv
  mainDiv.style.height = height + 'px';
});


