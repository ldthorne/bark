Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;

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
      Meteor.defer(function() {Router.go('comment');});
      $("#comment").val('');
    }
  }

});

Template.commentBloc.helpers({
   ismyrow: function(){return Meteor.userId() == this.commenter}
});


Template.commentBloc.events({
    'click .say': function(event){
    currentComment = this._id;
    var msg = new SpeechSynthesisUtterance(Comments.findOne({_id:this._id}).comment);
    if (theVoice) msg.voice=theVoice;
    window.speechSynthesis.speak(msg);
  },
  'click .jbsapp-delete-icon': function(){Comments.remove(this._id);},
	'click': function(){
      var commentId = this._id;
      Session.set('comment', commentId); 
    },
    'click .increment': function () {
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.upVoted) !== -1){
            //console.log("up vote & vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: -1}});
            Comments.update(commentId, {$pull: {voted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {upVoted: Meteor.userId()}});
          } else {
           // console.log("up voted; down vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: 2}});
            Comments.update(commentId, {$addToSet: {upVoted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {downVoted: Meteor.userId()}});
          }
        } else {
          //console.log("up voted & voted");
          var commentId = Session.get('comment');
          Comments.update(commentId, {$inc: {score: 1}});
          Comments.update(commentId, {$addToSet: {voted: Meteor.userId()}});
          Comments.update(commentId, {$addToSet: {upVoted: Meteor.userId()}});
        }
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
      
    },

    'click .decrement': function(){
      if(Meteor.user()) {
        var selectedAnime = Comments.findOne({_id:this._id});
        if($.inArray(Meteor.userId(), selectedAnime.voted) !== -1) {
          if($.inArray(Meteor.userId(), selectedAnime.downVoted) !== -1){
            //console.log("down vote & vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: 1}});
            Comments.update(commentId, {$pull: {voted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {downVoted: Meteor.userId()}});
          } else {
            //console.log("down voted; up vote removed");
            var commentId = Session.get('comment');
            Comments.update(commentId, {$inc: {score: -2}});
            Comments.update(commentId, {$addToSet: {downVoted: Meteor.userId()}});
            Comments.update(commentId, {$pull: {upVoted: Meteor.userId()}});
          }
        } else {
          //console.log("down voted & voted");
          var commentId =Session.get('comment');
          Comments.update(commentId, {$inc: {score: -1}});
          Comments.update(commentId, {$addToSet: {voted: Meteor.userId()}});
          Comments.update(commentId, {$addToSet: {downVoted: Meteor.userId()}});
        }
      } else {
        alert("You must log in to vote. Log in and try again.");
      }
  }
})