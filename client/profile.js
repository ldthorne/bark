Template.profile.helpers({
  posts: function() {
    return Posts.find({owner: Meteor.userId()}, {sort: {submitted: -1}});
  },

  comments: function() {
    return Comments.find({commenter: Meteor.userId()}, {sort: {submitted: -1}});
  },

  totalPostScore: function() {
    sum=0;
    yourPosts = Posts.find({owner: Meteor.userId()}).fetch();
    var scores = _.pluck(yourPosts, 'score');
    _.each(scores, function(score){
      sum+=score;
    });
  
    return sum;
  },

  totalCommentScore: function() {
    sum=0;
    yourComments= Comments.find({commenter: Meteor.userId()}).fetch();
    var scores = _.pluck(yourComments, 'score');
    _.each(scores, function(score){
      sum+=score;
    });
  
    return sum;
  },

  hasPosts: function(){
    return Posts.find({owner:Meteor.userId()}).count() >= 0;
  },

  hasComments: function(){
    return Comments.find({commenter:Meteor.userId()}).count() >= 0;
  }

});

Template.yourPosts.helpers({
  ismyrow: function(){return Meteor.userId() == this.owner},
  commentCount: function(){return Comments.find({fromPost:this._id}).count()}
});

Template.yourComments.helpers({
  ismyrow: function(){return Meteor.userId() == this.commenter},
});

Template.yourPosts.events({
  'click #say': function(event){
    currentPost = this._id;
    var msg = new SpeechSynthesisUtterance(Posts.findOne({_id:this._id}).post);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },
  
  'click .jbsapp-delete-icon': function(){Posts.remove(this._id);
  },

  'click #comment': function(){
    if(Meteor.user()){
      Meteor.defer(function() {Router.go('comment');});
    } else {
      alert("You must be logged in to comment. Login and try again.");
    }
  }

 
});

Template.yourComments.events({
  'click #say': function(event){
    currentPost = this._id;
    var msg = new SpeechSynthesisUtterance(Comments.findOne({_id:this._id}).comment);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },
  
  'click .jbsapp-delete-icon': function(){Comments.remove(this._id);
  },

  'click #comment': function(){
    if(Meteor.user()){
      Meteor.defer(function() {Router.go('comment');});
    } else {
      alert("You must be logged in to comment. Login and try again.");
    }
  }

 
});


function playAudio(){
  audio.play();
}

Template.profile.events({
    'click': function(){
      var postId = this._id;
      Session.set('post', postId);
      var commentId = this._id;
      Session.set('comment', commentId); 

      //checkVotes(Posts.findOne({_id: postId})); 
    },
    'click #incrementPost': function () {
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
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
      
    },

    'click #decrementPost': function(){

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

  'click #incrementComment': function () {
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.upVoted) !== -1){
            // console.log("up vote & vote removed");
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
          // console.log("up voted & voted");
          var commentId = Session.get('comment');
          Comments.update(commentId, {$inc: {score: 1}});
          Comments.update(commentId, {$addToSet: {voted: Meteor.userId()}});
          Comments.update(commentId, {$addToSet: {upVoted: Meteor.userId()}});
        }
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
      
    },

    'click #decrementComment': function(){
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.downVoted) !== -1){
            // console.log("down vote & vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: 1}});
            Comments.update(commentId, {$pull: {voted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {downVoted: Meteor.userId()}});
          } else {
            // console.log("down voted; up vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: -2}});
            Comments.update(commentId, {$addToSet: {downVoted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {upVoted: Meteor.userId()}});
          }
        } else {
          // console.log("down voted & voted");
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
      Meteor.defer(function() {Router.go('message');});
    } else {
      alert("You must be logged in to send a message. Login and try again.");
    }
  },

   'click #readAllPosts': function(){
    allPosts = Posts.find({owner:Meteor.userId()}).fetch();
    console.log(allPosts);
    
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

    'click #readAllComments': function(){
    allComments = Comments.find({commenter:Meteor.userId()}).fetch();
    console.log(allComments);
    
    var comments = _.pluck(allComments, 'comment');
    var reverseComments = comments.reverse()

    _.each(reverseComments, function(comment){
      var msg = new SpeechSynthesisUtterance(comment);
      msg.onend = function(){
        playAudio();      
      }      
      window.speechSynthesis.speak(msg);
    })
  }

});

function checkVotes(selected){
  if(selected.score <= -4){
    Posts.remove(selected._id);
    //console.log("should delete");
  } else {
    //console.log('should not delete');
  }
}
