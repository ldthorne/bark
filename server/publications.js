Meteor.publish("thePosts",function(){return Posts.find();});
Meteor.publish("theComments",function(){return Comments.find();});
Meteor.publish("theProfiles",function(){return Profiles.find();});

Meteor.publish("theSentMessages",function(){
	var currentUserId = this.userId;
	return Messages.find({senderId: currentUserId});;
});

Meteor.publish("theReceivedMessages", function(){
	var currentUserId = this.userId;
	return Messages.find({ownerId: currentUserId});
});

Meteor.publish("theSentComMessages",function(){
	var currentUserId = this.userId;
	return ComMessages.find({senderId: currentUserId});;
});

Meteor.publish("theReceivedComMessages", function(){
	var currentUserId = this.userId;
	return ComMessages.find({ownerId: currentUserId});
});



Meteor.publish("theEmojis", function(){return Emojis.find();});