
// if(Session.get('choice') == null || Session.get('choice') == undefined){
makechoice();
function makechoice(){
  var elements = document.getElementsByName("group1");
    for (var i = 0, l = elements.length; i < l; i++){
      if (elements[i].checked){
        choice = elements[i].id;
        Session.set('choice', choice);
      }
    }
};

Session.set('messageSort', {lastUpdate: -1});

Template.inbox.helpers({

   messagefunc: function(){
    if(Session.get('choice') == "posMes"){
        return Messages.find({},{sort: Session.get('messageSort')});
    } else if(Session.get('choice') == "comMes") {
        return ComMessages.find({},{sort: Session.get('messageSort')});
    }
   
   },

   origTitle: function(){
    if(Session.get('choice') == "posMes"){
        return Posts.findOne(this.postId).post;
    } else if(Session.get('choice') == "comMes") {
        return Comments.findOne(this.commentId).comment;
    }
   },

    selected: function(){
    return (this._id == Session.get('message'));
    },

    isMessages: function(){
      return (Messages.find().count() != 0 || ComMessages.find().count() != 0);
    }
   	
 });

Template.inbox.events({
	'click': function(){
		if(this._id != undefined && this._id != null){
	 		
      		var messageId = this._id;
      		console.log(messageId)
      		Session.set('message', messageId);
      	  console.log(Session.get('message'));
      	}
    },

    'click #updateUp':function(){
      Session.set('messageSort', {lastUpdate: -1});
               
    },

   'click #updateDown':function(){
       Session.set('messageSort', {lastUpdate: 1});
       
    },

    'change .choose': function(){
      var choice = "";
      var elements = document.getElementsByName("group1");
      for (var i = 0, l = elements.length; i < l; i++){
        if (elements[i].checked){
            choice = elements[i].id;
            Session.set('choice', choice);
        }
      }

    }

});


Template.reply.events({

  'submit #postReplyForm': function(event) {
    event.preventDefault();
    var text = event.target.postReply.value; // get reply value
    // check if the value is empty
    if (text == "") {
      alert("You can’t send a blank message. Try sending something funny instead.");
    } else {
      messageId = Session.get('message');
      isOrig = (Messages.findOne({_id:messageId}).ownerId == Meteor.userId());

      //console.log("text: " + text);
      //console.log("messageId: " + messageId)
      //console.log("isOrig: " + isOrig);

      Meteor.call('messageReply', text, messageId, isOrig);
      Meteor.defer(function() { Router.go('inbox'); });
      $("#postReply").val('');
      //$("#messageReply").val('');
    }
  },

  'submit #commentReplyForm': function(event) {
    event.preventDefault();
    var text = event.target.commentReply.value; // get reply value
    // check if the value is empty
    if (text == "") {
      alert("You can’t send a blank message. Try sending something funny instead.");
    } else {
      comMessageId = Session.get('message');
      isOrig = (ComMessages.findOne({_id:comMessageId}).ownerId == Meteor.userId());

      //console.log("text: " + text);
      //console.log("messageId: " + messageId)
      //console.log("isOrig: " + isOrig);

      Meteor.call('comMessageReply', text, comMessageId, isOrig);
      Meteor.defer(function() { Router.go('inbox'); });
      $("#commentReply").val('');
      //$("#messageReply").val('');
    }
  }
 
});

Template.reply.helpers({
  isPost: function(){
    return(Session.get('choice') == "posMes");
  }
});