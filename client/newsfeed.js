Template.newsfeed.helpers({
  posts: function() {
    return Posts.find();
  }
});

Template.newsfeed.events({
    'click .posts': function(){
      var playerId = this._id;
      Session.set('posts', playerId); 
    },
    'click .increment': function () {
      var selectedAnime = Session.get('posts');
      posts.update(post, {$inc: {score: 1}});
    },
    'click .decrement': function(){
      var selectedAnime = Session.get('posts');
      posts.update(post, {$inc: {score: -1}});
    }
  
});