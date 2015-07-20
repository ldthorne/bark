Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');



Template.newsfeed.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}});
  }

});

Template.postInfo.helpers({
  ismyrow: function(){return Meteor.userId() == this.owner},
  commentCount: function(){return Comments.find({fromPost:this._id}).count()}
});

Template.postInfo.events({
  'click #say': function(event){
    currentPost = this._id;
    var msg = new SpeechSynthesisUtterance(Posts.findOne({_id:this._id}).post);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },
  
  'click #delete': function(){
    Posts.remove(this._id);
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

Template.newsfeed.events({
    'click': function(){
      var postId = this._id;
      Session.set('post', postId);
      //checkVotes(Posts.findOne({_id: postId})); 
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
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
      
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