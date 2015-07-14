Template.emojiTable.helpers({
	emojifunc: function(){
		return Emojis.find({});
	},
	selectedemoji: function(){
		if(Session.get('emoji') !== "" && Session.get('emoji') != null){
			return Session.get('emoji')
		} else {
			return "No emoji selected yet..."
		}
		
	}
})

Template.emojiTable.events({
	'click': function(){
		if(this.code != undefined){
			var emoji = this.code;
			Session.set('emoji', emoji);
			console.log(Session.get('emoji'))
		}
      
      
    }
})