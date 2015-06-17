window.onload = function() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    document.getElementById('startLat').innerHTML = startPos.coords.latitude;
    document.getElementById('startLon').innerHTML = startPos.coords.longitude;
  };
  navigator.geolocation.getCurrentPosition(geoSuccess);
  console.log(navigator.geolocation.getCurrentPosition(geoSuccess));
};


Template.submit.events({
  'submit .postsSubmitForm': function(event) {
    event.preventDefault();
    var post = event.target.post.value; // get post vote value
    // check if the value is empty
    if (post == "") {
      alert("You can’t insert empty post. Try to write something funny instead.");
    } else {
      Meteor.call('postInsert', post);
      Router.go('newsfeed');
    }
  }
});






