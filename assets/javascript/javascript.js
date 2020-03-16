$(document).ready(function(){
  //My firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAJRJeMAlZjLzs0EQzc5QBextIK5L3pTrU",
    authDomain: "hw7-trainscheduler-d52fe.firebaseapp.com",
    databaseURL: "https://hw7-trainscheduler-d52fe.firebaseio.com",
    projectId: "hw7-trainscheduler-d52fe",
    storageBucket: "hw7-trainscheduler-d52fe.appspot.com",
    messagingSenderId: "818930557141",
    appId: "1:818930557141:web:e6882f0eb6873a17db425c",
    measurementId: "G-ZGJW2GZ4N9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //create firebase database
  var database=firebase.database();

  // button on click function
  $("#add-train").on("click", function (event) {
    event.preventDefault();

    // user input from form
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var trainFrequency = $("#train-frequency").val().trim();

    // pushing user form train to firebase
    database.ref().push({
      trainName: trainName,
      destination: trainDestination,
      firstTrain: firstTrain,
      frequency: trainFrequency
    });
  });

  // firebase w/ child snapshots and moment js functions
  database.ref().on("child_added", function (childSnapshot) {

    //new train functions
    var newFrequency = childSnapshot.val().frequency;
    var newTrainName = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;

    //converts train start time to proper format and reduces by 1 year so it doesn't throw an error in reference to current time
    var trainStart = moment(newFirstTrain, "hh:mm").subtract(1, "years");
    // moment js current time
    var currentTime = moment();
    // calculates different between train start time and now
    var timeDifferential = moment().diff(moment(trainStart), "minutes");
    // modulus to find the remainder of time based on the train's frequency
    var timeRemaining = timeDifferential % newFrequency;
    // subtracts the modulus time from the next train start
    var timeToNextTrain = newFrequency - timeRemaining;
    // Next Train
    var nextTrain = moment().add(timeToNextTrain, "minutes");
    //converts nextTrain to HH:mm format
    var trainArrival = moment(nextTrain).format("HH:mm");

    // train information display
    $("#all-display").append(
      ' <tr><td>' + newTrainName +
      ' </td><td>' + newDestination +
      ' </td><td>' + newFrequency +
      ' </td><td>' + trainArrival +
      ' </td><td>' + timeToNextTrain + ' </td></tr>');

    // wipes all user input fields
    $("#train-name, #train-destination, #first-train, #train-frequency").val("");
    return false;
    });
});