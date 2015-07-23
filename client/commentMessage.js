Template.commentMessage.events({
  'submit .comMessageForm': function(event) {
    event.preventDefault();
    var text = event.target.comMessageText.value; // get post vote value
    // check if the value is empty
    if (text == "") {
      alert("You can’t send a blank message. Try sending something funny instead.");
    } else {
      commentId = Session.get('comment');
      senderId =Meteor.userId();
      ownerId= Comments.find(commentId).fetch()[0].commenter;
      console.log("text: " + text);
      console.log("commentId: " + commentId);
      console.log("sender: " + senderId);
      console.log("ownerId: " + ownerId);
      Meteor.call('comMessageStart', text, commentId, senderId, ownerId);
      Meteor.defer(function() { Router.go('inbox'); });
    }
  },
});