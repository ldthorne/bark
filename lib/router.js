Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'newsfeed'});

Router.route('/inbox', {name: 'inbox'});

Router.route('/submit', {name: 'submit'});

Router.route('/message', {name: 'message'});

Router.route('/radiustest', {name: 'radiustest'});

Router.route('/feedback', {name: 'feedback'});

Router.route('/comment', {name: 'comment'});

Router.route("/emojiTable", {name: 'emojiTable'});