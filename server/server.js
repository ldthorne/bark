Meteor.methods({
  postInsert: function(post, location) {
    var postId = Posts.insert({
      level: 0,
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
  },

    increase: function(selectedAnime){
      console.log('starting');
    if(_.contains(selectedAnime.voted, Meteor.userId()) == true) {
          if(_.contains(selectedAnime.upVoted, Meteor.userId()) == true){
            console.log("up vote & vote removed");
            var postId = selectedAnime._id;
            Posts.update(postId, {$inc: {score: -1}});
            Posts.update(postId, {$pull: {voted: Meteor.userId()}});
            Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
          } else {
            console.log("up voted; down vote removed");
             var postId = selectedAnime._id;
            Posts.update(postId, {$inc: {score: 2}});
            Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
            Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
          }
    } else {
          console.log("up voted & voted");
          var postId = selectedAnime._id;
          Posts.update(postId, {$inc: {score: 1}});
          Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
          Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
        }
        checkVotes(selectedAnime);
  },

  decrease: function(selectedAnime){

    if(_.contains(selectedAnime.voted, Meteor.userId()) == true) {
        if(_.contains(selectedAnime.downVoted, Meteor.userId()) == true){
          console.log("down vote & vote removed");
          var postId = selectedAnime._id;
          Posts.update(postId, {$inc: {score: 1}});
          Posts.update(postId, {$pull: {voted: Meteor.userId()}});
          Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
        } else {
          console.log("down voted; up vote removed");
          var postId = selectedAnime._id;
          Posts.update(postId, {$inc: {score: -2}});
          Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
          Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
        }
      } else {
        console.log("down voted & voted");
        var postId = selectedAnime._id;
        Posts.update(postId, {$inc: {score: -1}});
        Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
        Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
      }

       checkVotes(selectedAnime);

  },


});

function checkVotes(selected){
  console.log("checking votes");
    var p = Posts.findOne({_id:selected._id});
    //numbers may seem off.. were not sure how to fix

    //console.log(selected.score);
   if(selected.score >=5 && selected.score <10){
    Posts.update({_id: p._id}, {$set: {radius:4}});
    //console.log("radius should be 4");
     //console.log(selected.radius);
  } else if(selected.score >=10 && selected.score <20){
    Posts.update({_id: p._id}, {$set: {radius:6}});
     //console.log("radius should be 6");
     //console.log(selected.radius);
  }else if(selected.score >=20 && selected.score <40){
    Posts.update({_id: p._id}, {$set: {radius:8}});
  }else if(selected.score >=40 && selected.score <50){
    Posts.update({_id: p._id}, {$set: {radius:10}});
  }else if(selected.score >=50 && selected.score <100){
    Posts.update({_id: p._id}, {$set: {radius:15}});
  }else if(selected.score >=100 && selected.score <200){
    Posts.update({_id: p._id}, {$set: {radius:20}});
  }else if(selected.score >=200 && selected.score <400){
    Posts.update({_id: p._id}, {$set: {radius:30}});
  }else if(selected.score >=400 && selected.score <800){
    Posts.update({_id: p._id}, {$set: {radius:35}});
  }else if(selected.score >=800 && selected.score <1600){
    Posts.update({_id: p._id}, {$set: {radius:50}});
  }else if(selected.score >=1600 && selected.score <3200){
    Posts.update({_id: p._id}, {$set: {radius:100}});
  }else if(selected.score >=1600){
    Posts.update({_id: p._id}, {$set: {radius:1000000}});
  }
  if(selected.score <= -4){
    removePost(selected._id);
    //console.log("should delete");
  }
}
