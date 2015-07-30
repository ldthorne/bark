Session.set('emojiSelect', 'first');

Template.emojiTable.helpers({
	emojifunc: function(){
		var selected = Session.get('emojiSelect')
		return Emojis.find({section: selected});
	},
	selectedemoji: function(){
		if(Session.get('emoji') !== "" && Session.get('emoji') != null){
			return Session.get('emoji')
		}
	}
})

Template.emojiTable.events({
	'click': function(){
		if(this.code != undefined){
			var emoji = this.code;
			Session.set('emoji', emoji);
			//console.log(Session.get('emoji'))
			$("#messageText").val($("#messageText").val()+this.code);
			$("#post").val($("#post").val()+this.code);
			$("#comment").val($("#comment").val()+this.code);
			$("#comMessageText").val($("#comMessageText").val()+this.code);
		}
    },
    'click #one': function(){
    	Session.set('emojiSelect', "first");
    },
    'click #two': function(){
    	Session.set('emojiSelect', "second");
    },
    'click #three': function(){
    	Session.set('emojiSelect', "third");
    },
    'click #four': function(){
    	Session.set('emojiSelect', "fourth");
    },
    'click #five': function(){
    	Session.set('emojiSelect', "fifth");
    }
})