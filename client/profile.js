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
  submittedPost:function(){

    return submittime(this.submitted);
  }
});

Template.yourComments.helpers({
  ismyrow: function(){return Meteor.userId() == this.commenter},
  submittedComment:function(){
    return submittime(this.submitted);
  }
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

  'click #comment': function(){
    if(Meteor.user()){
      Meteor.defer(function() {Router.go('comment');});
    } else {
      alert("You must be logged in to comment. Login and try again.");
    }
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
  },


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

var votesForLevels = [-5,5,10,20,40,50,100,200,400,800,1600,3200,6400];

function checkVotes(selected){
    var p = Posts.findOne({_id:selected._id});
    var postLevel = selected.level;
    var score = selected.score;

    if(score<votesForLevels[postLevel]){
      Posts.update({_id: p._id}, {$inc: {level:-1}});
    }else if (score>=votesForLevels[postLevel+1]){
      Posts.update({_id: p._id}, {$inc: {level:1}});
    }
  if(selected.score <= -4){
    removePost(selected._id);
    //console.log("should delete");
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
