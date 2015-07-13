Template.comment.helpers({
	isComments: function() {
		return (Comments.find({fromPost: Session.get('post')}).count() > 0);
	},

	postTitle: function() {
		var pt =  Posts.findOne(Session.get('post'));
		return pt.post;
	}, 

	commentFunc: function(){
		return Comments.find({fromPost: Session.get('post')}, {sort: {submitted: 1}});
	}
});

Template.commentForm.events({

  'submit .commentsSubmitForm': function(event) {
    event.preventDefault();
    var comment = event.target.comment.value; // get comment value

    // check if the value is empty
    if (comment == "") {
      alert("You can’t insert an empty comment. Try to write something funny instead.");
    } else {
      var fromPost = Session.get('post');
      Meteor.call('commentInsert', comment, fromPost);
      Meteor.defer(function() {Router.go('newsfeed');});
    }
  }

});