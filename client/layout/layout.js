Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');
alreadyRead = false;


Template.layout.rendered = function(){
  $(".button-collapse").sideNav({
    closeOnClick:true
  });
  $(".dropdown-button").dropdown({ 
    hover: true,
    belowOrigin: true
  });
  $(".dropdown-button1").dropdown({ 
    hover: false,
    belowOrigin: true
  });

}

var running = false;

Template.layout.events({
	// 'click #micbutton': function(event) {
	// 	startMic(event);
	// }
  'click #micbutton': function(event){
    console.log("starting dictation");
    if (!running) {
      running = true;
      i = 0;
      numbers= Posts.find({}, {limit: 3, sort: Session.get('postsSort')}).fetch();
      sayitnow("what would you like me to do? I can read posts or navigate to a new page for you");
      //sayitnow(numbers[i++].post);

    } else {
      recognition.stop();
      recognizing=false;
      running = false;
      /*
      var user_utterance = final_span.innerHTML;
      user_utterance = user_utterance.substring(0,user_utterance.indexOf(' --'));
      handle_user_input(user_utterance);
      var response = "You just said "+user_utterance;
      say(response);
      handle_user_input(user_utterance.toLowerCase());
      */
    }

  }

})

function say(text, stop){
  // if (pauseTimeout){
  //   console.log("clearing pause Timeout");
  //   window.clearTimeout(pauseTimeout);
  //   pauseTimeout = null;
  // }
  recognition.onend = function(){console.log("recognition is stopped"); sayitnow(text, stop);};
  console.log("stopping recognition");
  recognition.stop();
}

//var pauseTimeout = null;

function sayitnow(text, stop){
  console.log("starting to talk");

  var msg = new SpeechSynthesisUtterance(text+". "+ (stop ? "goodbye":"ready"));
  msg.onend = function(event){
    console.log("speech over"+ "said '"+msg.text+"' .... starting recognition!"); 
    final_transcript = '';
    if(!stop){
      recognition.start();
    }
    
    //pauseTimeout = window.setTimeout(function(){handle_user_input("next")},5000);
  };
  window.speechSynthesis.speak(msg);
}

var i = 0;

function handle_user_input(u){
  var responded = false;
  console.log("hui: "+u+" i="+i);
  u = u.toLowerCase();
  if ((u.indexOf("next")>-1) || (u.indexOf("start")>-1) || (u.indexOf("read")>-1)) {
    if (i < numbers.length){
      console.log("saying "+i+"th post");
      say(numbers[i++].post);
    } else {
      say("there are no more posts", "stop");
      return;
    };

    responded = true;
  } else if (u.indexOf("reset")> -1) {
    i=0;
    say("OK!  Resetting!");
    responded = true;
  } else if (u.indexOf("repeat")>-1){
    say(numbers[i-1].post);  
    responded = true;
  } else if (u.indexOf("stop")>-1){
    say("okay", "stop");
  } else if (u.indexOf('navigate')>-1){
    if(u.indexOf('submit')>-1 || u.indexOf('post')>-1){
      recognition.stop();
      Router.go('submit');
    } else if(u.indexOf('newsfeed')>-1 || u.indexOf('home')>-1 || u.indexOf('news feed')>-1){
      recognition.stop();
      Router.go('newsfeed');
    } else if(u.indexOf('messages')>-1 || u.indexOf('inbox')>-1 || u.indexOf('message')>-1){
      recognition.stop();
      Router.go('inbox');
    }
  } else if (u.indexOf('up vote')>-1 || u.indexOf('upvote')>-1){
    console.log("score : "+numbers[i-1].score);
  }
  // } else {
  //   say("eh?");
  // }
  
};

  // var final_transcript = '';
  // var recognizing = false;
  // var dictating = false;
  
var final_transcript = '';
var recognizing = false;
var numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
var position = 0;

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
      console.log("i="+i+" words="+words);
    var words = event.results[i][0].transcript;
    console.log("ready to handle input: '"+words+"'");
    // if (words) handle_user_input(words);
    // //handle_user_input(words);
    // if (words.includes("stop dictation")) {
    //   recognition.stop();
    // } else if (words.includes("read it back")){
    //   var msg = new SpeechSynthesisUtterance(words);
    //   window.speechSynthesis.speak(msg);
    // }
        if (event.results[i].isFinal) {
          console.log("final result is |"+event.results[i][0].transcript.trim()+"|");
          final_transcript += 
      capitalize(event.results[i][0].transcript.trim()) +" -- " + Math.round(100*event.results[i][0].confidence)+"%\n";
      console.log('final events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        } else {
          interim_transcript += Math.round(100*event.results[i][0].confidence) + "%: "+ event.results[i][0].transcript+"<br>";
      console.log('interim events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        }
      }
      //final_transcript = capitalize(final_transcript);
    console.log("ready to handle input: '"+final_transcript+"'");
    handle_user_input(final_transcript);
    
      //final_span.innerHTML = linebreak(final_transcript);
      //interim_span.innerHTML = linebreak(interim_transcript);
    
    
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
  console.log("starting dictation");
  recognition.start();
}

  // if ('webkitSpeechRecognition' in window) {
  //   var recognition = new webkitSpeechRecognition();
  //     recognition.continuous = true;
  //     recognition.interimResults = true;
 
  //     recognition.onstart = function() {
  //       recognizing = true;
  //     };
 
  //     recognition.onerror = function(event) {
  //       console.log(event.error);
  //     };
 
  //     recognition.onend = function() {
  //       recognizing = false;
  //     };
 
  //     recognition.onresult = function(event) {

  //     myevent = event;
  //       var interim_transcript = '';

  //       for (var i = event.resultIndex; i < event.results.length; ++i) {
  //       	console.log("recognizing" + event.results[i][0].transcript);
  //       	//$("#test").html(interim_transcript);
  //         if (event.results[i][0].transcript.indexOf("stop") > -1){
  //           recognition.stop();
  //           return;
  //         } if((event.results[i][0].transcript.indexOf("submit") > -1) || (event.results[i][0].transcript.indexOf("post") > -1)){
  //         	recognition.stop();
  //         	Router.go("submit");
  //         } if ((event.results[i][0].transcript.indexOf("inbox") > -1) || (event.results[i][0].transcript.indexOf("messages") > -1)) {
  //         	recognition.stop();
  //         	Router.go("inbox");
  //         } if ((event.results[i][0].transcript.indexOf("newsfeed") > -1) || (event.results[i][0].transcript.indexOf("home") > -1) || (event.results[i][0].transcript.indexOf("news feed") > -1)) {
  //         	recognition.stop();
  //         	Router.go("newsfeed");

  //         } if (Router.current().route.getName() == "submit"){
  //         		if((event.results[i][0].transcript.indexOf("dictate") > -1) || (event.results[i][0].transcript.indexOf("dictation") > -1)){
  //         			dictating=true;
          			
  //         		}
  //         }
  //         if((Router.current().route.getName() == "newsfeed")){
  //               if((event.results[i][0].transcript.indexOf("read") > -1)){
  //                   if(!alreadyRead){
  //                     readPosts();
  //                     alreadyRead = true;
  //                   }
  //                   if(
  //                     (event.results[i][0].transcript.indexOf("upvote") > -1) || 
  //                     (event.results[i][0].transcript.indexOf("a boat") > -1) || 
  //                     (event.results[i][0].transcript.indexOf("like") > -1) || 
  //                     (event.results[i][0].transcript.indexOf("upload") > -1) || 
  //                     (event.results[i][0].transcript.indexOf("up vote") > -1)){
  //                       console.log("done");
  //                       recognition.stop();
  //                   }
  //               }
  //         } 
  //         // if (Router.current().route.getName() == "newsfeed"){

  //         // }
  //         if(event.results[i].isFinal) {
  //           final_transcript += event.results[i][0].transcript.trim() +".\n";
  //           console.log("final :");
  //           if(dictating){
  //           	dictating=false;
  //           	 $("#post").val(final_transcript);
  //           	} else{
  //           		 $("#test").html("bark! thinks you said: " + final_transcript);
  //           	}
            
  //         } else {
  //           interim_transcript += event.results[i][0].transcript;
  //           console.log("not final");
  //           if (dictating){
  //            	$("#post").val(interim_transcript);
  //           } else{
  //           	$("#test").html("bark! thinks you said: " + interim_transcript);
  //           }
  //         }
  //       }
        
  //     };
  // }

function readPosts(){
    allPosts = Posts.find().fetch();
    console.log(allPosts);
    
    var posts = _.pluck(allPosts, 'post');
    var postsId = _.pluck(allPosts, '_id')
    var reversePosts = posts.reverse()
    var reversePostsId = postsId.reverse()
    var zipped = _.zip(reversePosts, reversePostsId)
    _.each(zipped, function(pair){
      // console.log(pair[0]);
      // console.log(pair[1]);
      Session.set("currentPost", pair[1])
      console.log(Session.get("currentPost"));
      var msg = new SpeechSynthesisUtterance(pair[0]);
      msg.onend = function(){
        playAudio();      
      }      
      window.speechSynthesis.speak(msg);
    })


}

// function readPosts(){
//     allPosts = Posts.find().fetch();
//     console.log(allPosts);
    
//     var posts = _.pluck(allPosts, 'post');
//     var postsId = _.pluck(allPosts, '_id')
//     var reversePosts = posts.reverse()
//     var reversePostsId = postsId.reverse()
//     var zipped = _.zip(reversePosts, reversePostsId)
//     _.each(zipped, function(pair){
//       // var myVar=setInterval(function () {timedOutput(pair)}, 1000);
//       timedOutput(pair);      

//     })
//   }

// function timedOutput(pair){
//   Session.set("currentPost", pair[1])
//   var msg = new SpeechSynthesisUtterance(pair[0]);
//   msg.onend = function(){
//     playAudio();      
//   }      
//   var myVar=setInterval(function() {readOut()},10000);
//   function readOut(){
//     window.speechSynthesis.speak(msg);
//   }
// }


// function playAudio(){
//   audio.play();
// }




// function startMic(event) {
//   if (recognizing) {
//     recognition.stop();
//     return;
//   }
//   final_transcript = '';
//   recognition.lang = 'en-US';
//   recognition.start();
// }


Template.layout.helpers({
  loggedIn: function(){
    return (Meteor.userId() != null && Meteor.userId() != undefined && Meteor.userId() !="");
  }
})
