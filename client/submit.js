


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
  },
  'click .whereAmI': function(event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function(position) {
      var current = new Point(position.coords.latitude,position.coords.longitude);
      Session.set("currentLocation",current);
    });
    

    Meteor.call("searchLocations",      
      Session.get("currentLocation"),
      function(error, data) {
        if (error) {
          console.log(error);
        }
        else {
          Session.set("inLocation",data);
        }
      }
    );
  }
});

Template.submit.helpers({
  currentLocation: function() {
    // watchPosition watches to see if position changes
    // the function then sets the new location
    // and calls searchLocations to determine the new location
    navigator.geolocation.watchPosition(function(position){
      var current = new Point(position.coords.latitude,position.coords.longitude);
      Session.set("currentLocation",current);

      Meteor.call("searchLocations",      
        Session.get("currentLocation"),
        function(error, data) {
          if (error) {
            console.log(error);
          }
          else {
            Session.set("inLocation",data);
          }
        }
      );
      
    });

    
    return Session.get("currentLocation");

  }
});

function Point(x,y) {
  this.x = x;
  this.y = y;
}






