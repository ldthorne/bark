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



Meteor.publish("closePosts",function(position){
	// console.log("published closePosts with p="+JSON.stringify(position));
	var closePosts = Posts.find(
		{level:0, 
		 location:{
				$near:
				{
					$geometry: { type: "Point",  coordinates: [ -71.2586913, 42.3669788 ] },
					$minDistance: 0,
					$maxDistance: 5000
				}
			}
		}
	);
	var cpArray = closePosts.fetch();
	console.log("closePosts = "+cpArray);
	// _.each(cpArray,function(x){console.dir(x)});
	return closePosts;
});

var levels = [5,50,500,5000,50000]; // distance in miles for each level

Meteor.publish("viewablePosts",function(level, position){
	// console.log("published closePosts with p="+JSON.stringify(position));
	var closePosts = Posts.find(
		{level:level, 
		 location:{
				$near:
				{
					$geometry: { type: "Point",  coordinates: [ position.longitude, position.latitude ] },
					$minDistance: 0,
					$maxDistance: levels[level]*1609.344
				}
			}
		}
	);
	var cpArray = closePosts.fetch();
	// console.log("closePosts = "+cpArray);
	// _.each(cpArray,function(x){console.dir(x)});
	return closePosts;
});

Meteor.publish("farPosts",function(){
	// console.log("published level 1 posts");
	return Posts.find({level:1});
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

