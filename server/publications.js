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

Meteor.publish("theEmojis", function(){return Emojis.find();});

Meteor.publish("closePosts",function(position){
	console.log("published closePosts with p="+JSON.stringify(position));
	return Posts.find({level:0}, { "location.loc": {
		$nearSphere: {
			$geometry: {
				type: "Point",
				coordinates: [ position.longitude, position.latitude]
			},
			$minDistance: 0,
			$maxDistance: 3218.68
		}}
	});
});

Meteor.publish("farPosts",function(){
	console.log("published level 1 posts");
	return Posts.find({level:1});
});

 