Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;

Template.comment.helpers({
	isComments: function() {
		return (Comments.find({fromPost: Session.get('post')}).count() > 0);
	},

	postTitle: function() {
		var pt =  Posts.findOne(Session.get('post'));
		return pt.post;
	}, 

	commentFunc: function(){
		return Comments.find({fromPost: Session.get('post')}, {sort: {submitted: 1}});
	}
});

Template.commentForm.events({


  'submit .commentsSubmitForm': function(event) {
    event.preventDefault();
    var comment = event.target.comment.value; // get comment value

    // check if the value is empty
    if (comment == "") {
      alert("You can’t insert an empty comment. Try to write something funny instead.");
    } else {
      if (recognizing) {
        recognition.stop();
      } else {
      var fromPost = Session.get('post');
      Meteor.call('commentInsert', comment, fromPost);
      Meteor.defer(function() {Router.go('comment');});
      $("#comment").val('');
    } 
  }
},

  'click #start_button': function(event){
    startDictation(event);
  }


});

Template.commentBloc.helpers({
   ismyrow: function(){return Meteor.userId() == this.commenter},
  
    submitted:function(){
    console.log(this.submitted);
    return submittime(this.submitted);
  }

});


Template.commentBloc.events({
    'click #say': function(event){
    currentComment = this._id;
    var msg = new SpeechSynthesisUtterance(Comments.findOne({_id:this._id}).comment);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },
  'click #delete': function(){
    removeComment(this._id);
    // Comments.remove(this._id);
  },
	'click': function(){
      var commentId = this._id;
      Session.set('comment', commentId); 
    },

    'click #flag': function(){
      if(Meteor.user()) {
        var selectedComment = Comments.findOne({_id:this._id});
        console.log($.inArray(Meteor.userId(), selectedComment.hasFlagged));
        if($.inArray(Meteor.userId(), selectedComment.hasFlagged) == -1){
          var r = confirm('This cannot be undone. Are you sure you want to flag the comment?');
          if(r){
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {numberFlags: 1}});
            Comments.update(commentId, {$addToSet: {hasFlagged: Meteor.userId()}});
          }
        checkFlags(selectedComment)
        } else{
          alert("You've already flagged this comment.")  
        }
      }else{
        alert("You must log in to vote. Log in and try again.");
      }
    },
    'click #increment': function () {
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.upVoted) !== -1){
            //console.log("up vote & vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: -1}});
            Comments.update(commentId, {$pull: {voted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {upVoted: Meteor.userId()}});
          } else {
           // console.log("up voted; down vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: 2}});
            Comments.update(commentId, {$addToSet: {upVoted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {downVoted: Meteor.userId()}});
          }
        } else {
          //console.log("up voted & voted");
          var commentId = Session.get('comment');
          Comments.update(commentId, {$inc: {score: 1}});
          Comments.update(commentId, {$addToSet: {voted: Meteor.userId()}});
          Comments.update(commentId, {$addToSet: {upVoted: Meteor.userId()}});
        }
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
      
    },

    'click #decrement': function(){
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.downVoted) !== -1){
            //console.log("down vote & vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: 1}});
            Comments.update(commentId, {$pull: {voted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {downVoted: Meteor.userId()}});
          } else {
            //console.log("down voted; up vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: -2}});
            Comments.update(commentId, {$addToSet: {downVoted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {upVoted: Meteor.userId()}});
          }
        } else {
          //console.log("down voted & voted");
          var commentId =Session.get('comment');
          Comments.update(commentId, {$inc: {score: -1}});
          Comments.update(commentId, {$addToSet: {voted: Meteor.userId()}});
          Comments.update(commentId, {$addToSet: {downVoted: Meteor.userId()}});
        }
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
  },

  'click #messageButton': function(){
    if(Meteor.user()){
      Meteor.defer(function() {Router.go('commentMessage');});
    } else {
      alert("You must be logged in to send a message. Login and try again.");
    }
  }
})


function checkFlags(selected){
  if(selected.numberFlags >= 4){
    removeComment(selected._id);
    //should delete if more than 5 flags
  }
}

function removeComment(selectedId){ 
  _.each(ComMessages.find({commentId:selectedId}).fetch(), function(message){
    ComMessages.remove(message._id)
  });
  Comments.remove(selectedId);
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
       
       document.getElementById("comment").value = final_transcript;
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


