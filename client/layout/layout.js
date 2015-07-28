Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');
alreadyRead = false;


Template.layout.rendered = function(){
  $(".button-collapse").sideNav({
    closeOnClick:true
  });
  $(".dropdown-button").dropdown({ 
    hover: true,
    belowOrigin: true
  });
  $(".dropdown-button1").dropdown({ 
    hover: false,
    belowOrigin: true
  });

}




// function readPosts(){
//     allPosts = Posts.find().fetch();
//     console.log(allPosts);
    
//     var posts = _.pluck(allPosts, 'post');
//     var postsId = _.pluck(allPosts, '_id')
//     var reversePosts = posts.reverse()
//     var reversePostsId = postsId.reverse()
//     var zipped = _.zip(reversePosts, reversePostsId)
//     _.each(zipped, function(pair){
//       // console.log(pair[0]);
//       // console.log(pair[1]);
//       Session.set("currentPost", pair[1])
//       console.log(Session.get("currentPost"));
//       var msg = new SpeechSynthesisUtterance(pair[0]);
//       msg.onend = function(){
//         playAudio();      
//       }      
//       window.speechSynthesis.speak(msg);
//     })


// }

// function readPosts(){
//     allPosts = Posts.find().fetch();
//     console.log(allPosts);
    
//     var posts = _.pluck(allPosts, 'post');
//     var postsId = _.pluck(allPosts, '_id')
//     var reversePosts = posts.reverse()
//     var reversePostsId = postsId.reverse()
//     var zipped = _.zip(reversePosts, reversePostsId)
//     _.each(zipped, function(pair){
//       // var myVar=setInterval(function () {timedOutput(pair)}, 1000);
//       timedOutput(pair);      

//     })
//   }

// function timedOutput(pair){
//   Session.set("currentPost", pair[1])
//   var msg = new SpeechSynthesisUtterance(pair[0]);
//   msg.onend = function(){
//     playAudio();      
//   }      
//   var myVar=setInterval(function() {readOut()},10000);
//   function readOut(){
//     window.speechSynthesis.speak(msg);
//   }
// }


// function playAudio(){
//   audio.play();
// }




// function startMic(event) {
//   if (recognizing) {
//     recognition.stop();
//     return;
//   }
//   final_transcript = '';
//   recognition.lang = 'en-US';
//   recognition.start();
// }


Template.layout.helpers({
  loggedIn: function(){
    return (Meteor.userId() != null && Meteor.userId() != undefined && Meteor.userId() !="");
  }
})
