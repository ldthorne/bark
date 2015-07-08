
Meteor.startup(function() {
    start = currentLocation();
});

Template.submit.events({
  'submit .postsSubmitForm': function(event) {
    event.preventDefault();
    var post = event.target.post.value; // get post vote value
    var location = currentLocation();
    // check if the value is empty
    if (post == "") {
      alert("You can’t insert empty post. Try to write something funny instead.");
    } else {

      Meteor.call('postInsert', post, location);
      Router.go('newsfeed');
    }
  },
  'click #whereAmI': function(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function(position) {
    console.log(start);
    start = new Point(position.coords.latitude,position.coords.longitude);
    console.log(start);
    Session.set("currentLocation",start);
    });
  }
});

Template.submit.helpers({

  getLat: function(){
    var location = Session.get('currentLocation');
    return location.x;
  },

  getLng: function(){
    var location = Session.get('currentLocation');
    return location.y;
  }
});

function currentLocation() {
    // watchPosition watches to see if position changes
    // the function then sets the new location
    // and calls searchLocations to determine the new location
    navigator.geolocation.watchPosition(function(position){
      var current = new Point(position.coords.latitude,position.coords.longitude);
      Session.set("currentLocation",current); 
    });
    return Session.get("currentLocation");

}

function Point(x,y) {
  this.x = x;
  this.y = y;
}



