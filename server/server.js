Meteor.methods({
  postInsert: function(post, location) {
    var postId = Posts.insert({
      radius : 5,
      post : post, 
      score : 0, 
      submitted : new Date(),
      location : location,
      owner: Meteor.userId()
    });
  },

  messageInsert: function(text, postId, senderId, ownerId) {

  	var mes = Messages.insert({
  		text:text,
  		postId: postId,
  		senderId: senderId,
  		ownerId: ownerId,
  		submitted: new Date()
  	});

  }

});