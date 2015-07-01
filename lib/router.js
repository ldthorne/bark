Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'newsfeed'});

Router.route('/inbox', {name: 'inbox'});

Router.route('/submit', {name: 'submit'});

Router.route('/map', {name: 'postlocations'});

Router.route('/index', {name: "index"});

Router.route('/postpage', {name: "postpage"});

Router.route('/postItem', {name: "postItem"});

