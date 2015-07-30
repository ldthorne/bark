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

Router.route("/login", {name: 'login'});

Router.route("/profile", {name: 'profile'});

Router.route("/settings", {name: 'settings'});

Router.route("/commentMessage", {name: 'commentMessage'});
Router.route("/contact", {name: 'contact'});
