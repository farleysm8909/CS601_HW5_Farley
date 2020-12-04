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
          //Parse JSON to turn into JS object
          let myDegrees = JSON.parse(httpRequest.responseText); //JS object with 1 key value pair, "my_degrees": [{}, {}]
          let table = document.getElementById("table");
          let row1 = document.getElementById("row1");
          let row2 = document.getElementById("row2");
          let row3 = document.getElementById("row3");
          let count = 0;
          let count2 = 0;
          /* Code adapted from https://www.tutorialrepublic.com/javascript-tutorial/javascript-json-parsing.php
          * iterates through array of degree objects and examines their key-value pairs, 
          * then recursively calls this function if the value is an object to get to the key-value pairs nested inside that object */
          function printDegrees(myDegrees) {
            for (let degree in myDegrees) { 
              if (myDegrees[degree] instanceof Object) { //if the value is an object, recursively call function to access object's properties
                count++; //Keep track of which object we're on
                if (count === 3) { //if we have cycled past the objects with keys "my_degrees" and the first "degree", we are now looking at the value of the first "degree" object, which is itself an object
                  let keys = Object.keys(myDegrees[degree]); //array of the object's keys: ["school", "program/major", "type", "year conferred"]
                  for (let i = 0; i < keys.length; i++) {
                    row1.innerHTML += `<th>${keys[i]}</th>`; //print each of these keys out and add to the first row of the table (headings)
                  }
                }
                printDegrees(myDegrees[degree]); //recursively call to examine more objects' key-value pairs
              } else {
                count2++;
                if (count2 < 5) { //has to cycle past 4 table data for second row before proceeding to else
                  row2.innerHTML += `<td>${myDegrees[degree]}</td>`;
                } else {
                  row3.innerHTML += `<td>${myDegrees[degree]}</td>`;
                }
                //document.write(myDegrees[degree] + "\n"); // value is not an object, can print
              }
            }
            table.style.visibility = "visible"; //make table visible after it is populated
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