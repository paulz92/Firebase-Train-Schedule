  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD4rrHtnkYkzPHuMAhsn5_2GdJXHw2vzQA",
    authDomain: "train-schedule-bd785.firebaseapp.com",
    databaseURL: "https://train-schedule-bd785.firebaseio.com",
    projectId: "train-schedule-bd785",
    storageBucket: "",
    messagingSenderId: "500203420252"
  };

  firebase.initializeApp(config);

  // database variable
  var database = firebase.database();

  // on click for add train submit button
  $("#submit-button").on("click", function(event) {
    // prevent default for submit button
    event.preventDefault();

    // grab user input
    var trainName = $("#train-name").val().trim();
    var trainDestination = $("#destination").val().trim();
    var firstTrainTime = moment(
      $("#first-train-time").val().trim(), "HH:mm").format("X");
    var trainFrequency = $("#frequency").val().trim();

    // store user input in object
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      firstTime: firstTrainTime,
      frequency: trainFrequency
    };

    // push user input object to database
    database.ref().push(newTrain);

    // logs info to console
    console.log("on click");
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);
    console.log("============================================");

    // empty input boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  });

  // database function for each new train added to firebase
  database.ref().on("child_added", function(childSnapshot) {
    // creating variables which get value from database snapshot
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTime;
    var trainFrequency = childSnapshot.val().frequency;

    // math for minutes away and next train time
    // converting database time to time 1 year ago so that 
    // the first train time is always before current time
    var firstTrainTimeConverted = moment(firstTrainTime, "X")
      .subtract(1, "years");
    // creating current time variable for logging purposes
    var currentTime = moment();
    // minute dif between current time and first train time
    var difference = moment()
      .diff(moment(firstTrainTimeConverted), "minutes");
    // calculating remainder of diff/frequency
    var remainder = difference % trainFrequency;
    // calculating minutes until next train
    var minUntilNext = trainFrequency - remainder;
    // next train time formatted in AM/PM format
    var nextTrain = moment().add(minUntilNext, "minutes")
      .format("h:mm A");

    // console log info
    console.log("from database");
    console.log(childSnapshot.val());
    console.log("name: " + trainName);
    console.log("destination: " + trainDestination);
    console.log("frequency: " + trainFrequency);
    console.log("first train time (unix): "
      + firstTrainTimeConverted);
    console.log("current time (unix): " + currentTime);
    console.log("difference (min): " + difference);
    console.log("remainder (min): " + remainder);
    console.log("minutes until next: " + minUntilNext);
    console.log("next train time: " + nextTrain);
    console.log("============================================");

    // appending each train's data to table
    $("#table-body").append("<tr><td>" + trainName 
      + "</td><td>" + trainDestination + "</td><td>" 
      + trainFrequency + " minutes</td><td>" + nextTrain 
      + "</td><td>"+ minUntilNext + "</td></tr>");
  });
