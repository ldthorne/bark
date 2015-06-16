Template.inbox.helpers({
   messagefunc: function(){return Messages.find({},{sort:{time: 1}});}
 });

Template.messageform.events({
	"submit #sendmessage": function(event){
		event.preventDefault();

		
		var timestamp = new Date();
		var message= event.target.message.value;

		console.log(JSON.stringify(message));

		Messages.insert({timestamp:timestamp, message:message});

		Router.go('/inbox');	
	}
})