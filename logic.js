// Prevent any non-numeric characters to be entered
function isNumber(event){
  var keycode=event.keyCode;
  if(keycode>48 && keycode>57){
    return false;
  }
  return true;
}

$( document ).ready(function() {
  
// ("#first-train-time").mask("00:00");
// ("#frequency").mask("00");


$("tbody").on('click', ".removeX", function(){
  var tempAttr = $(this).attr('datakey');
  database.ref().child(tempAttr).remove();
});

// Your web app's Firebase configuration
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCl84-5yulhT0pNxCYGmd8_6iZKmIECcN0",
    authDomain: "test-project-b064c.firebaseapp.com",
    databaseURL: "https://test-project-b064c.firebaseio.com",
    projectId: "test-project-b064c",
    storageBucket: "test-project-b064c.appspot.com",
    messagingSenderId: "74461025996",
    appId: "1:74461025996:web:d50ac27d770cb8e5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  setInterval(function(){

    database.ref().on("value", function (snapshot) {
      $("tbody").empty()
      console.log(snapshot.val())
      var list = snapshot.val();   
      if(list){  
        for(var index in list){
          var row = list[index];
          var rowresults = FetchNextArrival(row);

          var tableRow = "<tr>"
          tableRow += "<td scope='col'>" + row.name + "</td>"
          tableRow += "<td scope='col'>" + row.destination + "</td>"
          tableRow += "<td scope='col'>" + row.freq + "</td>"
          tableRow += "<td scope='col'>" + rowresults.arrival.format("HH:mm") + "</td>"
          tableRow += "<td scope='col'>" + rowresults.minutesaway + "</td>"
          tableRow += "<td scope='col'>" + "<input type='button' datakey=" + index + " value='X' class='removeX'>" + "</td>"
 tableRow += "</tr>"

          $("tbody").append(tableRow);
        }
      }
    });

   }, 60000);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

console.log(database.ref().child("-LkKamNrZBuXJ2Mu6xT9").key)
console.log(database.ref().child("-LkKv39Y6YEzTZ9Is_ub").key)

//
database.ref().on("child_added", function (snapshot) {
  var id = snapshot.val()
  console.log(id);

  var results = FetchNextArrival(id);
  //Get the data from the data base
  var name = id.name;
  var destination = id.destination;
  var trainTime = id.time;
  var timeFreq = id.freq;

var tableRow = "<tr>"
 tableRow += "<td scope='col'>" + name + "</td>"
 tableRow += "<td scope='col'>" + destination + "</td>"
 tableRow += "<td scope='col'>" + timeFreq + "</td>"
 tableRow += "<td scope='col'>" + results.arrival.format("HH:mm") + "</td>"
 tableRow += "<td scope='col'>" + results.minutesaway + "</td>"
 tableRow += "<td scope='col'>" + "<input type='button' datakey=" + snapshot.key + " value='X' class='removeX'>" + "</td>"
 tableRow += "</tr>"

  $("tbody").append(tableRow);

});


database.ref().on("child_removed", function (snapshot) {
  
  database.ref().on("value", function (snapshot) {
    $("tbody").empty()
    console.log(snapshot.val())
    var list = snapshot.val();   
    if(list){  
      for(var index in list){
        var row = list[index];
        var rowresults = FetchNextArrival(row);

        var tableRow = "<tr>"
        tableRow += "<td scope='col'>" + row.name + "</td>"
        tableRow += "<td scope='col'>" + row.destination + "</td>"
        tableRow += "<td scope='col'>" + row.freq + "</td>"
        tableRow += "<td scope='col'>" + rowresults.arrival.format("HH:mm") + "</td>"
        tableRow += "<td scope='col'>" + rowresults.minutesaway + "</td>"
        tableRow += "<td scope='col'>" + "<input type='button' datakey=" + index + " value='X' class='removeX'>" + "</td>"
        tableRow += "</tr>"

        $("tbody").append(tableRow);
      }
    }
  });

});

// On click function 
$("#submit").on('click', function(){
  event.preventDefault();
 
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var trainTime = $("#first-train-time").val().trim();
  var timeFreq = $("#frequency").val().trim();

  console.log(trainName, destination,trainTime,timeFreq);

  $("fieldset input").val("");

  database.ref().push({
    name: trainName,
    destination: destination,
    time: trainTime,
    freq: timeFreq
  });
});

function FetchNextArrival(row){
  var interval = parseInt(row.freq);
  var currenttime = moment()
  // var currenttimeformatted = currenttime.format();
  var firsttime = moment(row.time, "HHmm");
  console.log(firsttime.format("HH:mm"));


  var difftime = currenttime.diff(firsttime, "minutes")
  if(difftime < 0){
    return {arrival: firsttime, minutesaway: Math.abs(difftime)};
  }    
  else{
    var numberofintervals = Math.ceil(difftime / row.freq);
    var arrivaltime = firsttime.add(numberofintervals * row.freq, "minutes");    
    var minutesaway = arrivaltime.diff(currenttime, "minutes")
    return {arrival: arrivaltime, minutesaway: minutesaway};
  }

}




});



