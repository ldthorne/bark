Template.message.events({
  'submit .messageForm': function(event) {
    event.preventDefault();
    var text = event.target.messageText.value; // get post vote value
    // check if the value is empty
    if (text == "") {
      alert("You can’t send a blank message. Try sending something funny instead.");
    } else {
      postId = Session.get('post');
      senderId =Meteor.userId();
      ownerId= Posts.find(postId).fetch()[0].owner;
      Meteor.call('messageStart', text, postId, senderId, ownerId);
      Meteor.defer(function() { Router.go('inbox'); });
    }
  },
});