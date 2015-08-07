Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');
Session.set('postsSort', {submitted: -1});

Template.newsfeed.rendered = function(){
  $(document).ready(function() {
    $(".dropdown").dropdown({
      hover:false,
      belowOrigin: true
    });

    $('select').material_select({
      belowOrigin: true
    });
  });
  putPosts();
  if(!this._rendered) {
    this._rendered = true;
    deleteOld()
  }

};

Template.newsfeed.created = function(){
  deleteOld();
}


function deleteOld(){
  allPosts = Posts.find().fetch();
  _.each(allPosts, function(post){
    var today = new Date();
    if((today.getTime()-post.submitted.getTime())/(1000 * 60 * 60 * 24)<3){
      removePost(post._id);    
    }
  });
}



Template.newsfeed.helpers({
  posts: function() {
    return Posts.find({}, {sort: Session.get('postsSort')});
  }
});

Template.postInfo.helpers({
  ismyrow: function(){
    return Meteor.userId() == this.owner;
  },
  commentCount: function(){
    return Comments.find({fromPost:this._id}).count()
  },
  commentPlural: function(){
    if(Comments.find({fromPost:this._id}).count()==1){
      return "comment";
    } else {
      return "comments";
    }
  },
  submitted:function(){

    return submittime(this.submitted);
  }

});

Template.postInfo.events({
  'click #say': function(event){
    currentPost = this._id;
    var msg = new SpeechSynthesisUtterance(Posts.findOne({_id:this._id}).post);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },

  'click #delete': function(){removePost(this._id);},

  'click #comment': function(){
      Meteor.defer(function() {Router.go('comment');});
  }


});


function playAudio(){
  audio.play();
}
var clicked = false;

Template.newsfeed.events({
  'click #submitButton': function(event) {
    event.preventDefault();
    var search = searchInput.value; // get post vote value
    console.log(search);
    var location = userLocation();

    // check if the value is empty
    if (search == "") {
      alert("You can’t search a blank space!");
    } else {
      if (recognizing) {
        recognition.stop();
      }
      console.log("my location = "+JSON.stringify(location))
      Meteor.call('searchInsert', search, {
        "type": "Point",
        "coordinates": [
          Session.get("lng"),
          Session.get("lat")
          ]
      });
      Router.go('newsfeed');
    }
  },
  'click #notmicbutton': function(event){
    clicked = !clicked;
    console.log("clicked in newsfeed")


    _.each(postArray, function(post){
      console.log(post.post);
    });
    if (clicked) {
      console.log("yes")
      startDictation(event);
    } else {
      console.log("no")
      recognition.stop();
      recognizing=false;
      /*
      var user_utterance = final_span.innerHTML;
      user_utterance = user_utterance.substring(0,user_utterance.indexOf(' --'));
      handle_user_input(user_utterance);
      var response = "You just said "+user_utterance;
      say(response);
      handle_user_input(user_utterance.toLowerCase());
      */
    }

  },

    'click': function(){
      var postId = this._id;
      Session.set('post', postId);
    },

    'click #flag': function(){
      if(Meteor.user()) {
        var selectedPost = Posts.findOne({_id:this._id});
        //console.log($.inArray(Meteor.userId(), selectedPost.hasFlagged));
        if($.inArray(Meteor.userId(), selectedPost.hasFlagged) == -1){
          var r = confirm('This cannot be undone. Are you sure you want to flag the post?');
          if(r){
            var postId = Session.get('post');
            Posts.update(postId, {$inc: {numberFlags: 1}});
            Posts.update(postId, {$addToSet: {hasFlagged: Meteor.userId()}});
          }
        Meteor.call("checkFlags",selectedPost);
        } else{
          alert("You've already flagged this post.")
        }
      }else{
        alert("You must log in to vote. Log in and try again.");
      }
    },
    'click #increment': function () {
      console.log("incrementing");
      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        console.log("about to meteor call");
        Meteor.call('increase', selectedAnime);
      } else {
        alert("You must log in to vote. Log in and try again.");
      }

    },

    'click #decrement': function(){

      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        Meteor.call('decrease', selectedAnime);
      } else {
        alert("You must log in to vote. Log in and try again.");
      }

  },

  'click #messageButton': function(){
    if(Meteor.user()){
      Meteor.defer(function() {Router.go('message');});
    } else {
      alert("You must be logged in to send a message. Login and try again.");
    }
  },

   'click #readAll': function(){
      allPosts = Posts.find().fetch();
      console.log(allPosts);

      //console.log(allPosts);

      var posts = _.pluck(allPosts, 'post');
      var reversePosts = posts.reverse()

      _.each(reversePosts, function(post){
        var msg = new SpeechSynthesisUtterance(post);
        msg.onend = function(){
          playAudio();
        }
        window.speechSynthesis.speak(msg);
      })
    },

    'click #timeUp' : function(){
        Session.set('postsSort', {submitted: -1});
    },
    'click #timeDown':function(){
        Session.set('postsSort', {submitted: 1});
    },
    'click #voteUp':function(){
        Session.set('postsSort', {score: -1});
    },
    'click #voteDown':function(){
        Session.set('postsSort', {score: 1});
    }
});

function say(text){
  if (pauseTimeout){
    console.log("clearing pause Timeout");
    window.clearTimeout(pauseTimeout);
    pauseTimeout = null;
  }
  recognition.onend = function(){console.log("recognition is stopped"); sayitnow(text);};
  console.log("stopping recognition");
  recognition.stop();
}
var pauseTimeout = null;

  function sayitnow(text){
  console.log("\n\nSPEAKING: "+text+"\n\n");
  var msg = new SpeechSynthesisUtterance(text+".  Ready");
  msg.onend = function(event){
    console.log("speech over"+ "said '"+msg.text+"'\n\n RECOGNIZING\n\n");
    final_transcript = '';
    recognition.start();
    //pauseTimeout = window.setTimeout(function(){handle_user_input("next")},5000);
  };
  window.speechSynthesis.speak(msg);
}

var i = 0;

function handle_user_input(u){
  var responded = false;
  console.log("    hui: "+u+" i="+i);
  u = u.toLowerCase();
  if ((u.indexOf("next")>-1) || (u.indexOf("start")>-1)) {
    if (i < numbers.length){
      console.log("   hui: saying "+i+"th number");
      say(numbers[i++]);
    } else {
      say("there are no more numbers")
    };

    responded = true;
  } else if (u.indexOf("reset")> -1) {
    i=0;
    say("OK!  Resetting!");
    responded = true;
  } else if (u.indexOf("repeat")>-1){
    say(numbers[i-1]);
    responded = true;
  }

}

var final_transcript = '';
var recognizing = false;

function putPosts(){
  allPosts = Posts.find().fetch();

  //console.log(allPosts);
}



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
      console.log("   onResult: i="+i+" words="+words);
    var words = event.results[i][0].transcript;
    console.log("    onResult: ready to handle input: '"+words+"'");
    //if (words) handle_user_input(words);
    //handle_user_input(words);
        if (event.results[i].isFinal) {
          console.log("    onResult: final result is |"+event.results[i][0].transcript.trim()+"|");
          final_transcript +=
      capitalize(event.results[i][0].transcript.trim()) +" -- " + Math.round(100*event.results[i][0].confidence)+"%\n";
      console.log('    onResult: final events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        } else {
          interim_transcript += Math.round(100*event.results[i][0].confidence) + "%: "+ event.results[i][0].transcript+"<br>";
      console.log('    onResult: interim events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
        }
      }
      //final_transcript = capitalize(final_transcript);
    console.log("ready to handle input: '"+final_transcript+"'");
    handle_user_input(final_transcript);

      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);


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

final_span = '';
interim_span='';

function startDictation(event) {
  if (recognizing) {
    //recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-US';

  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  recognition.start();
}
var votesForLevels = [-5,5,10,20,40,50,100,200,400,800,1600,3200,6400];

function removePost(selectedId){
  _.each(Comments.find({fromPost:selectedId}).fetch(), function(comment){
    _.each(ComMessages.find().fetch(), function(commes){
      ComMessages.remove(commes._id);
    })
    Comments.remove(comment._id);
  });
  _.each(Messages.find({postId:selectedId}).fetch(), function(message){
    Messages.remove(message._id)
  });
  Posts.remove(selectedId);
}


function submittime(submitted){
  var tTime=new Date(submitted);
      var cTime=new Date();
      var sinceMin=Math.round((cTime-tTime)/60000);
      if(sinceMin==0)
      {
          var sinceSec=Math.round((cTime-tTime)/1000);
          if(sinceSec<10)
            var since='less than 10 seconds ago';
          else if(sinceSec<20)
            var since='less than 20 seconds ago';
          else
            var since='half a minute ago';
      }
      else if(sinceMin==1)
      {
          var sinceSec=Math.round((cTime-tTime)/1000);
          if(sinceSec==30)
            var since='half a minute ago';
          else if(sinceSec<60)
            var since='less than a minute ago';
          else
            var since='1 minute ago';
      }
      else if(sinceMin<45)
          var since=sinceMin+' minutes ago';
      else if(sinceMin>44&&sinceMin<60)
          var since='about 1 hour ago';
      else if(sinceMin<1440){
          var sinceHr=Math.round(sinceMin/60);
      if(sinceHr==1)
        var since='about 1 hour ago';
      else
        var since='about '+sinceHr+' hours ago';
      }
      else if(sinceMin>1439&&sinceMin<2880)
          var since='1 day ago';
      else
      {
          var sinceDay=Math.round(sinceMin/1440);
          var since=sinceDay+' days ago';
      }
      return since;
}

// function search(){
//   var s = document.querySelector('input[type="search"]'),
//     p = document.querySelector('p'),
//     find = function(){
//         var words = p.innerText.split(' '),
//             i = words.length,
//             word = '';
//
//         while(--i) {
//             word = words[i];
//             if(word.toLowerCase() == s.value.toLowerCase()){
//                 words[i] = '<span class="highlight">' + word + "</span>";
//             }
//             else{
//             }
//         }
//         p.innerHTML = words.join(' ');
//     }
//
// s.addEventListener('keydown', find , false);
// s.addEventListener('keyup', find , false);
// }
