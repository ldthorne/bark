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
  },

  removeAccount: function(user){
      _.each(Messages.find({ownerId:user}).fetch(), function(message){
          Messages.remove(message._id)
      });
      _.each(Messages.find({senderId:user}).fetch(), function(message){
          Messages.remove(message._id)
      });
      _.each(ComMessages.find({ownerId:user}).fetch(), function(commessage){
          ComMessages.remove(commessage._id)
      });
      _.each(ComMessages.find({senderId:user}).fetch(), function(commessage){
          ComMessages.remove(commessage._id)
      });

      _.each(Comments.find({commenter:user}).fetch(), function(comment){  
          _.each(ComMessages.find({comment:comment._id}).fetch(), function(commessage){
            ComMessages.remove(commessage._id);
          });
          Comments.remove(comment._id);
      });

      _.each(Posts.find({owner:user}).fetch(), function(post){
          _.each(Comments.find({fromPost:post._id}).fetch(), function(comment){
            _.each(ComMessages.find({commentId:comment._id}.fetch()), function(commessage){
              ComMessages.remove(commessage._id);
            });
            Comments.remove(comment._id);
          });
          _.each(Messages.find({postId:post._id}).fetch(), function(message){
            Messages.remove(message._id);
          });
          Posts.remove(post._id);
      });
      Meteor.users.remove(Meteor.userId());
  }

});
