

Meteor.startup(function() {
    start = currentLocation();
});

Template.submit.events({
  'submit .postsSubmitForm': function(event) {
    event.preventDefault();
    var post = event.target.post.value; // get post vote value
    var location = currentLocation();
    // check if the value is empty
    if (post == "") {
      alert("You can’t insert empty post. Try to write something funny instead.");
    } else {

      Meteor.call('postInsert', post, location);
      Router.go('newsfeed');
    }
  },
  'click #whereAmI': function(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function(position) {
    console.log(start);
    start = new Point(position.coords.latitude,position.coords.longitude);
    console.log(start);
    Session.set("currentLocation",start);
    });
  },

  'click #start_button': function(event){
    startDictation(event);
  }


});

Template.submit.helpers({

  getLat: function(){
    var location = Session.get('currentLocation');
    return location.x;
  },

  getLng: function(){
    var location = Session.get('currentLocation');
    return location.y;
  }
});

function currentLocation() {
    // watchPosition watches to see if position changes
    // the function then sets the new location
    // and calls searchLocations to determine the new location
    navigator.geolocation.watchPosition(function(position){
      var current = new Point(position.coords.latitude,position.coords.longitude);
      Session.set("currentLocation",current); 
    });
    return Session.get("currentLocation");

}

function Point(x,y) {
  this.x = x;
  this.y = y;
}




/*
  This code comes from this blog post by Amit Agarwal
      http://ctrlq.org/code/19680-html5-web-speech-api
*/

  var final_transcript = '';
  var recognizing = false;
  
  if ('webkitSpeechRecognition' in window) {
    console.log("webkit is available!");
    var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
 
      recognition.onstart = function() {
        recognizing = true;
      };
 
      recognition.onerror = function(event) {
        console.log(event.error);
      };
 
      recognition.onend = function() {
        recognizing = false;
      };
 
      recognition.onresult = function(event) {
      myevent = event;
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
        console.log("i="+i);
          if (event.results[i][0].transcript.indexOf("stop") > -1){
            console.log("woord");
            recognition.stop()
            return;
          }
          if(event.results[i].isFinal) {
            final_transcript += capitalize(event.results[i][0].transcript.trim()) +".\n";
        console.log('final events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
          } else {
            interim_transcript += event.results[i][0].transcript;
        console.log('interim events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
          }
        }
        //final_transcript = capitalize(final_transcript);
       document.getElementById("post").value = linebreak(final_transcript);
        document.getElementById("post").value = linebreak(interim_transcript);
        
      };
  }
 
  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
  }
 
  function capitalize(s) {
    return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
  }
 
  function startDictation(event) {
    if (recognizing) {
      recognition.stop();
      return;
    }
    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
  }
  


