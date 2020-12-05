//Code adapted from "JSON and AJAX" example in lecture 10
window.addEventListener("load", function(event) {
  let button = document.getElementById("button");
  let table = document.getElementById("table");
  let row1 = document.getElementById("row1");
  let row2 = document.getElementById("row2");
  let row3 = document.getElementById("row3");
  let extraContent = document.getElementById("extra-content");
  // Create a self-invoking fxn that sets an event handler on button that calls makeRequest when clicked
  (function() {
    let httpRequest;
    button.onclick = function() { 
      makeRequest('https://farleysm8909.github.io/CS601_HW5_Farley/degrees.json');
    };
    // makeRequest() creates a new XMLHttpRequest object
    function makeRequest(url) {
      httpRequest = new XMLHttpRequest();
      // if request object not successfully created, alert
      if (!httpRequest) {
        alert("Error! Cannot create XMLHttpRequest object");
        return false;
      }
      // handle server response; call displayDegrees when request state changes
      httpRequest.onreadystatechange = getDegrees; // ready state changes after httpRequest.send() is called and response is sent back
      // make the request with open() and send()
      httpRequest.open('GET', url);
      httpRequest.send();
    }
    // check state of request, if done, we have a full response from server
    function getDegrees() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // check if response is 200 (worked)
        if (httpRequest.status === 200) {
          //if we wanted to access JSON content directly without parsing => document.write(httpRequest.responseText);
          //Parse JSON to turn into JS object
          let myDegrees = JSON.parse(httpRequest.responseText); //JS object with 1 key value pair, "my_degrees": [{}, {}] in the future could add .my_degrees to make this variable equal to the array instead of the object
          //create counter variable and call function to recursively display data in table
          let count = 0;
          printDegrees(myDegrees, count);
        } else {
          // AJAX call unsuccessful
          alert("Error! There was a problem with the request.");
        }
      }
    }
    /* Code adapted from https://www.tutorialrepublic.com/javascript-tutorial/javascript-json-parsing.php
    * iterates through array of degree objects and examines their key-value pairs, 
    * then recursively calls this function if the value is an object to get to the key-value pairs nested inside that object 
    * Chose this approach as opposed to jQuery, was curious how it could be done without it */
    function printDegrees(myDegrees, count) {
      for (let degree in myDegrees) { 
        if (myDegrees[degree] instanceof Object) { //if the value is an object, recursively call function to access object's properties
          if (count === 3) { //if we have cycled past the outer objects, we are now looking at the value of the first "degree" object, which is itself an object
            let keys = Object.keys(myDegrees[degree]); //array of the object's keys: ["school", "program/major", "type", "year conferred"]
            for (let i = 0; i < keys.length; i++) {
              row1.innerHTML += `<th>${keys[i]}</th>`; //print each of these keys out and add to the first row of the table (headings)
            }
          }
          count++; //Keep track of which object we're on
          printDegrees(myDegrees[degree], count, count2); //recursively call to examine more objects' key-value pairs
        } else {
          if (count < 4) { //has to cycle past table data for second row before proceeding to else
            row2.innerHTML += `<td>${myDegrees[degree]}</td>`;
          } else {
            row3.innerHTML += `<td>${myDegrees[degree]}</td>`;
          }
          //alert("count1: " + count + "\ncount2: " + count2 + "\nrow2.innerHTML = " + row2.innerHTML + "\nrow3.innerHTML = " + row3.innerHTML);
        }
      }
      table.style.visibility = "visible"; //make table visible after it is populated
      extraContent.innerHTML = `   
        <img src="IMG_0395.JPG" alt="Sam Farley with her parents at graduation" width="500">
        <p>Sam Farley celebrating her virtual graduation during the onset of the pandemic in May, 2020.</p>
      `;
      extraContent.style.visibility = "visible";
    }
  })();
});