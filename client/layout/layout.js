// Meteor.users.deny({
//   update: function() {
//     return true;
//   }
// });

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
    console.log("starting dictation in layout");
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

function handle_user_input(u) {
  var responded = false;
  console.log("hui: "+u+" i="+i);
  u = u.toLowerCase();
  if ((u.indexOf("next")>-1) || (u.indexOf("start")>-1) || (u.indexOf("read post")>-1) || (u.indexOf("read posts")>-1)) {
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
  } else if (u.indexOf("stop")>-1 || u.indexOf('pause')>-1){
    say("okay", "stop");
  } else if (u.indexOf('navigate')>-1){
    if(u.indexOf('submit')>-1 || u.indexOf('post')>-1){
      recognition.stop();
      Router.go('submit');
    } else if(u.indexOf('newsfeed')>-1 || u.indexOf('home')>-1 || u.indexOf('news feed')>-1){
      recognition.stop();
      Router.go('newsfeed');
    } else if(u.indexOf('inbox')>-1){
      recognition.stop();
      Router.go('inbox');
    } else if ((i!=0)&&(u.indexOf('comment')>-1 || u.indexOf('comments'>-1))){
      Session.set('post', numbers[i-1]._id);
      Router.go('comment');
    } else if ((i!=0)&&(u.indexOf('message')>-1 || u.indexOf('messages'>-1))){
      Session.set('post', numbers[i-1]._id);
      Router.go('message');
    }
  } else if (u.indexOf('up vote')>-1 || u.indexOf('upvote')>-1 || u.indexOf('like')>-1){
    // console.log("score : "+numbers[i-1].score);
    Meteor.call('increase', numbers[i-1]);
    say("upvote recorded");
    checkVotes(numbers[i-1]);
  } else if (u.indexOf('down vote')>-1 || u.indexOf('downvote')>-1 || u.indexOf('dislike')>-1){
    // console.log("score : "+numbers[i-1].score);
    Meteor.call('decrease', numbers[i-1]);
    say("downvote recorded");
    checkVotes(numbers[i-1]);
  } else if (u.indexOf('read comments')>-1) {
    if(Comments.find({fromPost:numbers[i-1]._id}).count() == 0){
      say("There are no comments on this post");
    } else {
      coms= Comments.find({fromPost:numbers[i-1]._id}, {sort: {submitted: 1}}).fetch();
      console.log(coms);
      plucked = _.pluck(coms, 'comment');
      console.log(plucked);
      all="";
      s = 0
      _.each(plucked, function(comment){
        s++;
        all+= s+ ". " + comment + ". "
      });
      console.log(all);
      say(all);
    }
  } else if (u.indexOf('go back')>-1 || u.indexOf('return')>-1 || u.indexOf('last')>-1){
    console.log('old' + numbers[i].post)
    i--;
    say(numbers[--i].post);
    console.log('new' + numbers[i].post)
    i++
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
  //console.log("webkit is available!");
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

Template.layout.helpers({
  loggedIn: function(){
    return (Meteor.userId() != null && Meteor.userId() != undefined && Meteor.userId() !="");
  }
})
