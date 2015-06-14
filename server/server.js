Meteor.methods({
  postInsert: function(post) {
    var postId = Posts.insert({
      post : post, 
      score : 0, 
      submitted : new Date(), 
    });
  }
});