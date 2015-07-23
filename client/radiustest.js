Meteor.startup(function() {


});

function Point(x,y) {
	this.x = x;
  	this.y = y;
}

function currentLocation() {
	watcher = navigator.geolocation.watchPosition(function(position){
	  	var current = new Point(position.coords.latitude,position.coords.longitude);
		Session.set("currentLocation",current); 
		console.log("in currentlocation: lat="+ current.x+", lng="+current.y);
	});
	return Session.get("currentLocation");

}

Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
var watcher=null;

function GetLocation(location) {
  	lat = location.coords.latitude;
  	Session.set("lat",lat);
  	//console.log(Session.get("lat"));
  	lng = location.coords.longitude;
  	Session.set("lng",lng);
  	console.log("in GetLocation: lat="+ Session.get("lat")+", lng="+Session.get("lng"));
}

Template.radiustest.helpers({
	posts: function() {
		return Posts.find({}, {sort: {submitted: -1}});
	},
	closePosts: function(){
		console.log(" reactively computing the closePosts!!");
		start = currentLocation();
		//watcher = navigator.geolocation.watchPosition(GetLocation);
		var myLocation = Session.get("currentLocation");
		if (myLocation == undefined) {
			console.log("my location is undefined, watcher="+watcher);
			return;
		}
		console.log("myLocation = ");console.dir(myLocation);
		var mylat = myLocation.x;
		var mylng = myLocation.y;
		
		allPosts = Posts.find().fetch();
		// console.log(allPosts);
		console.log("allPosts size = "+allPosts.length);
		
		closePosts = _.filter(allPosts,function(post){
		// console.dir(post);
		// console.dir(Session.get("lat"));
		// console.dir(Session.get("lng"));
		console.log("filtering "+JSON.stringify(post));
		
		var isInCircle = geolib.isPointInCircle(
			{latitude: post.location.x, longitude: post.location.y},
			{latitude: mylat, longitude: mylng},
			post.radius*1609.34
	  		);
			console.log("is in Circle = "+isInCircle+"/n/n");
			return isInCircle
		});
		return closePosts;
	}
});

Template.radiInfo.events({
	'click .say': function(event){
		currentPost = this._id;
		var msg = new SpeechSynthesisUtterance(Posts.findOne({_id:this._id}).post);
		if (theVoice) msg.voice=theVoice;
		window.speechSynthesis.speak(msg);
	},
  	'click .jbsapp-delete-icon': function(){Posts.remove(this._id);
  	}

});

Template.radiInfo.helpers({
	ismyrow: function(){return Meteor.userId() == this.owner}
});

Template.radiustest.events({
	'click': function(){
	  var postId = this._id;
	  Session.set('post', postId); 
	},
	'click .increment': function () {
		if(Meteor.user()) {
			var selectedAnime = Posts.findOne({_id:this._id});
			if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
			  	if($.inArray(Meteor.userId(), selectedAnime.upVoted) !== -1){
					//console.log("up vote & vote removed");
					var postId = Session.get('post');
					Posts.update(postId, {$inc: {score: -1}});
					Posts.update(postId, {$pull: {voted: Meteor.userId()}});
					Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
			  	} else {
					//console.log("up voted; down vote removed");
					var postId = Session.get('post');
					Posts.update(postId, {$inc: {score: 2}});
					Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
					Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
				}
			} else {
				//console.log("up voted & voted");
				var postId = Session.get('post');
				Posts.update(postId, {$inc: {score: 1}});
				Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
				Posts.update(postId, {$addToSet: {upVoted: Meteor.userId()}});
			}
	  	} else {
			alert("You must log in to vote. Log in and try again.");
	  	}  
	},
	'click .decrement': function(){
		if(Meteor.user()) {
			var selectedAnime = Posts.findOne({_id:this._id});
			if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
		  		if($.inArray(Meteor.userId(), selectedAnime.downVoted) !== -1){
					//console.log("down vote & vote removed");
					var postId = Session.get('post');
					Posts.update(postId, {$inc: {score: 1}});
					Posts.update(postId, {$pull: {voted: Meteor.userId()}});
					Posts.update(postId, {$pull: {downVoted: Meteor.userId()}});
		  		} else {
					//console.log("down voted; up vote removed");
					var postId = Session.get('post');
				Posts.update(postId, {$inc: {score: -2}});
				Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
				Posts.update(postId, {$pull: {upVoted: Meteor.userId()}});
		  		}
			} else {
		  		//console.log("down voted & voted");
		  		var postId =Session.get('post');
		  		Posts.update(postId, {$inc: {score: -1}});
		  		Posts.update(postId, {$addToSet: {voted: Meteor.userId()}});
		  		Posts.update(postId, {$addToSet: {downVoted: Meteor.userId()}});
			}
	  	} else {
			alert("You must log in to vote. Log in and try again.");
	  	}
  	}
});