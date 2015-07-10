Meteor.startup(function() {


});

function Point(x,y) {
	this.x = x;
  	this.y = y;
}

function currentLocation() {
	navigator.geolocation.watchPosition(function(position){
	  	var current = new Point(position.coords.latitude,position.coords.longitude);
		Session.set("currentLocation",current); 
	});
	return Session.get("currentLocation");

}

Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;

function GetLocation(location) {
  	lat = location.coords.latitude;
  	Session.set("lat",lat);
  	// console.log(Session.get("lat"));
  	lng = location.coords.longitude;
  	Session.set("lng",lng);
  	// console.log(Session.get("lng"));
}

Template.radiustest.helpers({
	posts: function() {
		return Posts.find({}, {sort: {submitted: -1}});
	},
	closePosts: function(){
		start = currentLocation();
		navigator.geolocation.getCurrentPosition(GetLocation);
		
		allPosts = Posts.find().fetch();
		// console.log(allPosts);

		if(Session.get("lat")==undefined){
			
			return [];
		}
		closePosts = _.filter(allPosts,function(post){
		// console.dir(post);
		// console.dir(Session.get("lat"));
		// console.dir(Session.get("lng"));
			return geolib.isPointInCircle(
			{latitude: post.location.x, longitude: post.location.y},
			{latitude: Session.get("lat"), longitude: Session.get("lng")},
			post.radius*1609.34
	  		);
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