Meteor.methods({
  postInsert: function(post, location) {
    var postId = Posts.insert({
      level: 0,
      radius : 2,
      numberFlags: 0,
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
    Messages.update({_id: messageId}, {$set:{lastUpdate: new Date()}});
    Messages.update({_id: messageId}, {$push: {messageArray: {message:text, originalPoster:isOrig, createdAt: new Date()}}});
  },


  comMessageStart: function(text, commentId, senderId, ownerId) {

    var comMes = ComMessages.insert({
      commentId: commentId,
      origComment: Comments.findOne({_id:commentId}).comment,
      senderId: senderId,
      ownerId: ownerId,
      lastUpdate: new Date(),
      messageArray: [{message:text, originalPoster:false, createdAt: new Date()}]
    });

  },

  comMessageReply: function(text, comMessageId, isOrig){
    ComMessages.update({_id: comMessageId}, {$set:{lastUpdate: new Date()}});
    ComMessages.update({_id: comMessageId}, {$push: {messageArray: {message:text, originalPoster:isOrig, createdAt: new Date()}}});
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
