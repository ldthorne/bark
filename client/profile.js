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

  totalScore: function(){
    sum=0;
    yourComments= Comments.find({commenter: Meteor.userId()}).fetch();
    var scores = _.pluck(yourComments, 'score');
    _.each(scores, function(score){
      sum+=score;
      console.log(sum);
    });

    yourPosts = Posts.find({owner: Meteor.userId()}).fetch();
    var scores = _.pluck(yourPosts, 'score');
    _.each(scores, function(score){
      sum+=score;
      console.log(sum);

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

  'click .jbsapp-delete-icon': function(){removePost(this._id);
  },


  'click #flagPost': function(){
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
  'click #flagComment': function(){
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
      Meteor.call("checkFlag", selectedComment)
      } else{
        alert("You've already flagged this comment.")
      }
    }else{
      alert("You must log in to vote. Log in and try again.");
    }
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
      var selectedAnime = Posts.findOne({_id:this._id});
      Meteor.call('increase', selectedAnime);

    },

    'click #decrementPost': function(){
      var selectedAnime = Posts.findOne({_id:this._id});
      Meteor.call('decrease', selectedAnime);
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
  } else {
    //console.log('should not delete');
  }
}

function removePost(selectedId){
  _.each(Comments.find({fromPost:selectedId}).fetch(), function(comment){
    Comments.remove(comment._id);
  });
  _.each(Messages.find({postId:selectedId}).fetch(), function(message){
    Messages.remove(message._id)
  });
  Posts.remove(selectedId);
}
