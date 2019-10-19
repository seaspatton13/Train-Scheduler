// config var for the firebase and api key
var config = {
    apiKey: "AIzaSyCCqFA1ZUjlkUS3EtwrAnqn9dNgFoLf9Pw",
    authDomain: "train-scheduler-ae1f6.firebaseapp.com",
    databaseURL: "https://train-scheduler-ae1f6.firebaseio.com",
    projectId: "train-scheduler-ae1f6",
    storageBucket: "train-scheduler-ae1f6.appspot.com",
    messagingSenderId: "68577947608",
    appId: "1:68577947608:web:4cc65926e8bf9b9ff50cad",
    measurementId: "G-Y97PDJNMZQ"
};

$(document).ready(function () {
    // config var for the firebase and api key


    firebase.initializeApp(config);

    // var to reference the database
    // self.ref.child("trainName").child(name.uid).setValue(["trainName", name])


    var database = firebase.database();
    // var ref: DatabaseReference!

    // ref = Database.database().reference()


    // on click event variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#addTrain").on('click', function () {
        event.preventDefault();
        name = $('#trainName').val().trim();
        destination = $('#destination').val().trim();
        firstTrain = $('#firstTrain').val().trim();
        frequency = $('#frequency').val().trim();

        // pushing to database

        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dataAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // reset function to clear the user form
        $('form')[0].reset();


        database.ref().on('child_added', function (childSnapshot) {

            var nextArr;
            var minAway;

            var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
            var timeDiff = moment().diff(moment(firstTrainNew), "minutes");
            var remainder = timeDiff % childSnapshot.val().frequency;
            var minAway = childSnapshot.val().frequency - remainder;
            var nextTrain = moment().add(minAway, "minutes");
            nextTrain = moment(nextTrain).format("hh:mm");

            $('#add-row').append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + childSnapshot + nextTrain +
                "</td><td>" + minAway + '</td></tr>');
        }, function (errorObjects) {
            console.log("Errors handled:" + errorObjects.code);
        });

        database.ref().orderByChild('dateAdded').limitToLast(1).on("child_added", function (Snapshot) {
            //  change the HTML to reflect firebase data



        });
    });


});