Template.newsfeed.helpers({
  posts: function() {
    return Posts.find();
  }
});

Template.newsfeed.events({
    'click': function(){
      var postId = this._id;
      Session.set('post', postId); 
    },
    'click .increment': function () {
      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          return "voted";
        } else {
          var postId = Session.get('post');
          Posts.update(postId, {$inc: {score: 1}});
          Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
        }
      }
      
    },
    'click .decrement': function(){
      if(Meteor.user()) {
        var selectedAnime = Posts.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          return "ok";
        } else {
          var postId =Session.get('post');
          Posts.update(postId, {$inc: {score: -1}});
          Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});

        }
      }
  }
});