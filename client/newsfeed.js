Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');
Session.set('postsSort', {submitted: -1});

Template.newsfeed.rendered = function(){
  $(document).ready(function() {
    $('select').material_select();
  });
  putPosts();

};


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
  'click #micbutton': function(event){
    clicked = !clicked;
    console.log("clicked")

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
      //checkVotes(Posts.findOne({_id: postId})); 
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
        checkFlags(selectedPost)
        } else{
          alert("You've already flagged this post.")  
        }
      }else{
        alert("You must log in to vote. Log in and try again.");
      }
    },
    'click #increment': function () {
      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.upVoted) !== -1){
            //console.log("up vote & vote removed");
            var postId = Session.get('post');
            Posts.update(postId, {$inc: {score: -1}});
            Posts.update(postId, {$pull: {voted: Meteor.userId()}});
            Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
          } else {
            //console.log("up voted; down vote removed");
            var postId = Session.get('post');
            Posts.update(postId, {$inc: {score: 2}});
            Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
            Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
          }
        } else {
          //console.log("up voted & voted");
          var postId = Session.get('post');
          Posts.update(postId, {$inc: {score: 1}});
          Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
          Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
        }
        checkVotes(selectedAnime);
      } else {
        alert("You must log in to vote. Log in and try again.");
      }

      //Meteor.call('upVote', )
      
    },

    'click #decrement': function(){

      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.downVoted) !== -1){
            //console.log("down vote & vote removed");
            var postId = Session.get('post');
            Posts.update(postId, {$inc: {score: 1}});
            Posts.update(postId, {$pull: {voted: Meteor.userId()}});
            Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
          } else {
            //console.log("down voted; up vote removed");
            var postId = Session.get('post');
            Posts.update(postId, {$inc: {score: -2}});
            Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
            Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
          }
        } else {
          //console.log("down voted & voted");
          var postId =Session.get('post');
          Posts.update(postId, {$inc: {score: -1}});
          Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
          Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
        } 
        checkVotes(selectedAnime);
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

    'change #selectSort' : function(){
      var val = $("#selectSort option:selected").text();
      //console.log(val);
      if(val == "Newest"){
        Session.set('postsSort', {submitted: -1});
      } else if (val == "Oldest"){
        Session.set('postsSort', {submitted: 1});
      } else if (val == "Highest Score"){
        Session.set('postsSort', {score: -1});
      } else if (val == "Lowest Score"){
        Session.set('postsSort', {score: 1});
      }
    },
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

function checkVotes(selected){
    var p = Posts.findOne({_id:selected._id});
    //numbers may seem off.. were not sure how to fix

    //console.log(selected.score);
   if(selected.score >=5 && selected.score <10){
    Posts.update({_id: p._id}, {$set: {radius:4}});
    //console.log("radius should be 4");
     //console.log(selected.radius);
  } else if(selected.score >=10 && selected.score <20){
    Posts.update({_id: p._id}, {$set: {radius:6}});
     //console.log("radius should be 6");
     //console.log(selected.radius);
  }else if(selected.score >=20 && selected.score <40){
    Posts.update({_id: p._id}, {$set: {radius:8}});
  }else if(selected.score >=40 && selected.score <50){
    Posts.update({_id: p._id}, {$set: {radius:10}});
  }else if(selected.score >=50 && selected.score <100){
    Posts.update({_id: p._id}, {$set: {radius:15}});
  }else if(selected.score >=100 && selected.score <200){
    Posts.update({_id: p._id}, {$set: {radius:20}});
  }else if(selected.score >=200 && selected.score <400){
    Posts.update({_id: p._id}, {$set: {radius:30}});
  }else if(selected.score >=400 && selected.score <800){
    Posts.update({_id: p._id}, {$set: {radius:35}});
  }else if(selected.score >=800 && selected.score <1600){
    Posts.update({_id: p._id}, {$set: {radius:50}});
  }else if(selected.score >=1600 && selected.score <3200){
    Posts.update({_id: p._id}, {$set: {radius:100}});
  }else if(selected.score >=1600){
    Posts.update({_id: p._id}, {$set: {radius:1000000}});
  }
  if(selected.score <= -4){
    removePost(selected._id);
    //console.log("should delete");
  }
}

function checkFlags(selected){
  if(selected.numberFlags >= 4){
    removePost(selected._id);
    //should delete if more than 4 flags
  }
}


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

function search(){
  var s = document.querySelector('input[type="search"]'),
    p = document.querySelector('p'),
    find = function(){
        var words = p.innerText.split(' '),
            i = words.length,
            word = '';

        while(--i) {
            word = words[i];
            if(word.toLowerCase() == s.value.toLowerCase()){
                words[i] = '<span class="highlight">' + word + "</span>";
            }
            else{
            }   
        }
        p.innerHTML = words.join(' ');
    }

s.addEventListener('keydown', find , false);
s.addEventListener('keyup', find , false);
}

