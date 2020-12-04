//Code adapted from "JSON and AJAX" example in lecture 10
window.addEventListener("load", function(event) {
  let button = document.getElementById("button");
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
      httpRequest.onreadystatechange = displayDegrees;
      // make the request with open() and send()
      httpRequest.open('GET', url);
      httpRequest.send();
    }
    // check state of request, if done, we have a full response from server
    function displayDegrees() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // check if response is 200 (worked)
        if (httpRequest.status === 200) {
          //document.write(httpRequest.responseText);
          let myDegrees = JSON.parse(httpRequest.responseText); //JS object with 1 key value pair, "my_degrees": [{}, {}]
          let table = document.getElementById("table");
          let row1 = document.getElementById("row1");
          let row2 = document.getElementById("row2");
          let row3 = document.getElementById("row3");
          let count = 0;
          let count2 = 0;
          // Code adapted from https://www.tutorialrepublic.com/javascript-tutorial/javascript-json-parsing.php
          function printDegrees(myDegrees) {
            for (let degree in myDegrees) { //iterates through array of degree objects at the start
              if (myDegrees[degree] instanceof Object) { //if the value is an object, recursively call function to print object's properties
                count++;
                if (count === 3) {
                  let keys = Object.keys(myDegrees[degree]); //array of object keys
                  for (let i = 0; i < keys.length; i++) {
                    row1.innerHTML += `<th>${keys[i]}</th>`;
                  }
                }
                printDegrees(myDegrees[degree]);
              } else {
                table.style.visibility = "visible";
                count2++;
                if (count2++ < 8) { 
                  row2.innerHTML += `<td>${myDegrees[degree]}</td>`;
                } else {
                  row3.innerHTML += `<td>${myDegrees[degree]}</td>`;
                }
                //document.write(myDegrees[degree] + "\n"); // value is not an object, can print
              }
            }
          }
          printDegrees(myDegrees);
        } else {
          // AJAX call unsuccessful
          alert("Error! There was a problem with the request.");
        }
      }
    }
  })();
});