Meteor.publish("thePosts",function(){return Posts.find();});
Meteor.publish("theComments",function(){return Comments.find();});
Meteor.publish("theUsers",function(){return Users.find();});
Meteor.publish("theMessages",function(){return Messages.find();});