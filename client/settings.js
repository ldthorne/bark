

Template.settings.helpers({

});

Template.settings.events({
	'change #mesOnOff':function(){
		if($('#mesOnOff').is(":checked")){
			console.log("mes on");
		} else {
			console.log("mes off");
		}
	}
});