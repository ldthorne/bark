Router.configure({
	layoutTemplate: 'layout',
	//loadingTemplate: 'loading',
	//waitOn: function() {return true;}   // later we'll add more interesting things here .... 
});

Router.route('/', {name: 'newsfeed'});

Router.route('/inbox', {name: 'inbox'});

Router.route('/submit', {name: 'submit'});