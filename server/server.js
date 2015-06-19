Meteor.methods({
  postInsert: function(post, location) {
    var postId = Posts.insert({
      post : post, 
      score : 0, 
      submitted : new Date(),
      location : location
    });
  }
});