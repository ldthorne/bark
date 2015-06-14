Template.submit.events({
  'submit .postsSubmitForm': function(event) {
    event.preventDefault();
    var post = event.target.post.value; // get yak value
    // check if the value is empty
    if (post == "") {
      alert("You can’t insert empty post. Try to write something funny instead.");
    } else {
      console.log("we got past else");
      Meteor.call('postInsert', post);
      Router.go('newsfeed');
    }
  }
});

