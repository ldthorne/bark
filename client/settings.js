

Template.settings.helpers({

});

Template.settings.events({
	'change #mesOnOff':function(){
		if($('#mesOnOff').is(":checked")){
			console.log("mes on");
		} else {
			console.log("mes off");
		}
	},
	'click #deleteAccount': function(){
		//console.log('clicked the button');
		user = Meteor.userId();
		var k = confirm("Deleting your account cannot be undone! Do it anyway?");
		if(k){
		//	console.log('deleting');
			Meteor.call('removeAccount', user);
			alert("Your account has been removed.");
			Router.go('newsfeed');

		} else {
		//	console.log('not deleting');

		}

		//
	}
});