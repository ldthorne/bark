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

  messageStart: function(text, postId, senderId, ownerId) {
    
    var mes = Messages.insert({
  		postId: postId,
      origPost: Posts.findOne({_id:postId}).post,
  		senderId: senderId,
  		ownerId: ownerId,
  		lastUpdate: new Date(),
      messageArray: [{message:text, originalPoster:false, createdAt: new Date()}]
  	});

  },

  messageReply: function(text, messageId, isOrig){
    var block = {message:text, originalPoster:isOrig, createdAt: new Date()};
    Messages.update({_id: messageId}, 
      {$set:{lastUpdate: new Date()}, 
      $push: {messageArray: block}}
    );

  },

  commentInsert: function(comment, fromPost){
    var com = Comments.insert({
      comment:comment,
      submitted: new Date(),
      fromPost: fromPost,
      commenter: Meteor.userId(),
      score: 0
    })
  }

});