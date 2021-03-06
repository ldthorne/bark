
Meteor.startup(function() {
    start = userLocation();
});

Template.submit.events({
  'submit .postsSubmitForm': function(event) {
    event.preventDefault();
    var post = event.target.post.value; // get post vote value
    //console.log(post);
    var location = userLocation();

    // check if the value is empty
    if (post == "") {
      alert("You can’t insert empty post. Bark something instead!");
    } else {
      if (recognizing) {
        recognition.stop();
      }
      //console.log("my location = "+JSON.stringify(location))
      Meteor.call('postInsert', post, {
        "type": "Point",
        "coordinates": [
          Session.get("lng"),
          Session.get("lat")
          ]
      });
      Router.go('newsfeed');
    }
  },
  'click #whereAmI': function(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function(position) {
    Session.set("userLocation",position);
    });
  },

  'click #start_button': function(event){
    startDictation(event);
  }


});

Template.submit.helpers({

  getLat: function(){
    var location = Session.get('userLocation');
    return location.coords.latitude;
  },

  getLng: function(){
    var location = Session.get('userLocation');
    return location.coords.longitude;
  },
  // charatersLeft: function(){
  //   return left();
  // }
});

// function left(){
//   var total = document.getElementById('postInput').getAttribute('maxlength');
//   console.log(total);
//   Session.set('typing', document.getElementById("postInput").value);
//   console.log(Session.get('typing'));
//   Session.set('remaining', (total - Session.get('typing').length));
//   console.log(Session.get('remaining'));
//   return Session.get('remaining');
// }

function userLocation() {
    // watchPosition watches to see if position changes
    // the function then sets the new location
    // and calls searchLocations to determine the new location
    navigator.geolocation.watchPosition(function(position){
      // console.dir(position);
      var myPosition = {longitude: position.coords.longitude, latitude:position.coords.latitude};
      // console.dir(myPosition);
      Session.set("myLocation", myPosition); 
      Session.set("lat",position.coords.latitude);
      Session.set("lng",position.coords.longitude);
    });
    return Session.get("myLocation");

}


  var final_transcript = '';
  var recognizing = false;
  
  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
 
      recognition.onstart = function() {
        recognizing = true;
        console.log("listening!");
      };
 
      recognition.onerror = function(event) {
        console.log(event.error);
      };
 
      recognition.onend = function() {
        recognizing = false;
        console.log("dictation has stopped");
      };
 
      recognition.onresult = function(event) {
      myevent = event;
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i][0].transcript.indexOf("stop") > -1){
            recognition.stop()
            return;
          }
          if(event.results[i].isFinal) {
            final_transcript += capitalize(event.results[i][0].transcript.trim()) +".\n";
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = final_transcript;
       
       document.getElementById("post").value = final_transcript;
       //document.getElementById("post").value = linebreak(interim_transcript);
       
      
        
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
    interim_transcript='';
    recognition.lang = 'en-US';
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    recognition.start();

  }
