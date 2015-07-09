
Template.inbox.helpers({
   messagefunc: function(){return Messages.find({},{sort:{time: 1}});}
 });

// Template.messageblock.helpers({
// 	postData: function(){return Posts.find(this.postId);}
// });


// Template.messageform.events({
// 	"submit #sendmessage": function(event){
// 		event.preventDefault();

		
// 		var timestamp = new Date();
// 		var message= event.target.message.value;
// 		var to_whom= event.target.to_whom.value;
// 		var sender = Meteor.userId();
// 		console.log(JSON.stringify(message));

// 		Messages.insert({timestamp:timestamp, message:message, to_whom:to_whom, sender:sender});

// 		Router.go('/inbox');	
// 	}
// })