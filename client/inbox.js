
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
Template.inbox.events({
	'click': function(){
    console.log(this._id);
		if(this._id != undefined && this._id != null){
	 		
      		var messageId = this._id;
      		//console.log(messageId)
      		Session.set('message', messageId);
      		console.log(Session.get('message'));
      	}
    },
});

Template.inbox.helpers({
  selected: function(){
    return (this._id == Session.get('message'));
  }
})

Template.reply.events({

  'submit #replyForm': function(event) {
    event.preventDefault();
    console.log("kkkk");
    var text = event.target.messageReply.value; // get reply value
    // check if the value is empty
    if (text == "") {
      alert("You can’t send a blank message. Try sending something funny instead.");
    } else {
      messageId = Session.get('message');
      isOrig = (Messages.findOne({_id:messageId}).ownerId == Meteor.userId());

      console.log("text: " + text);
      console.log("messageId: " + messageId)
      console.log("isOrig: " + isOrig);

      Meteor.call('messageReply', text, messageId, isOrig);
      Meteor.defer(function() { Router.go('inbox'); });
      $("#messageReply").val('');
      //$("#messageReply").val('');
    }
  },
 
});