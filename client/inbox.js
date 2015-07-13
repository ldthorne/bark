
Template.inbox.helpers({

	// messageThread: function(){
	// 	postList=[]
	// 	for( var i = 0 ; i < Messages.find().count(); i++){
	// 		postList.push(Messages.find()[i].postId);
	// 	}
	// 	console.log(postList);
	// 	for(var k = 0; k < postList.length ; k++){
			
	// 	}
	// }
   messagefunc: function(){
   	
   	return Messages.find({},{sort:{time: 1}});
   },

   origPost: function(){
   	return Posts.findOne(this.postId).post;
   }
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