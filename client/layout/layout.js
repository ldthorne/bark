Session.set('voices',window.speechSynthesis.getVoices());
voices = [];
theVoice=null;
audio = new Audio('audio/bark.wav');
alreadyRead = false;

Template.layout.rendered = function(){
	$(".button-collapse").sideNav();
}

Template.layout.events({
	'click #micbutton': function(event) {
		startMic(event);
	}

})

  var final_transcript = '';
  var recognizing = false;
  var dictating = false;
  
  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
 
      recognition.onstart = function() {
        recognizing = true;
      };
 
      recognition.onerror = function(event) {
        console.log(event.error);
      };
 
      recognition.onend = function() {
        recognizing = false;
      };
 
      recognition.onresult = function(event) {

      myevent = event;
        var interim_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
        	console.log("recognizing" + event.results[i][0].transcript);
        	//$("#test").html(interim_transcript);
          if (event.results[i][0].transcript.indexOf("stop") > -1){
            recognition.stop();
            return;
          } if((event.results[i][0].transcript.indexOf("submit") > -1) || (event.results[i][0].transcript.indexOf("post") > -1)){
          	recognition.stop();
          	Router.go("submit");
          } if ((event.results[i][0].transcript.indexOf("inbox") > -1) || (event.results[i][0].transcript.indexOf("messages") > -1)) {
          	recognition.stop();
          	Router.go("inbox");
          } if ((event.results[i][0].transcript.indexOf("newsfeed") > -1) || (event.results[i][0].transcript.indexOf("home") > -1) || (event.results[i][0].transcript.indexOf("news feed") > -1)) {
          	recognition.stop();
          	Router.go("newsfeed");

          } if (Router.current().route.getName() == "submit"){
          		if((event.results[i][0].transcript.indexOf("dictate") > -1) || (event.results[i][0].transcript.indexOf("dictation") > -1)){
          			dictating=true;
          			
          		}
          }
          if((Router.current().route.getName() == "newsfeed")){
                if((event.results[i][0].transcript.indexOf("read") > -1)){
                    if(!alreadyRead){
                      readPosts();
                      alreadyRead = true;
                    }
                    if(
                      (event.results[i][0].transcript.indexOf("upvote") > -1) || 
                      (event.results[i][0].transcript.indexOf("a boat") > -1) || 
                      (event.results[i][0].transcript.indexOf("like") > -1) || 
                      (event.results[i][0].transcript.indexOf("upload") > -1) || 
                      (event.results[i][0].transcript.indexOf("up vote") > -1)){
                        console.log("done");
                        recognition.stop();
                    }
                }
          } 
          // if (Router.current().route.getName() == "newsfeed"){

          // }
          if(event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript.trim() +".\n";
            console.log("final :");
            if(dictating){
            	dictating=false;
            	 $("#post").val(final_transcript);
            	} else{
            		 $("#test").html("bark! thinks you said: " + final_transcript);
            	}
            
          } else {
            interim_transcript += event.results[i][0].transcript;
            console.log("not final");
            if (dictating){
             	$("#post").val(interim_transcript);
            } else{
            	$("#test").html("bark! thinks you said: " + interim_transcript);
            }
          }
        }
        
      };
  }

function readPosts(){
    allPosts = Posts.find().fetch();
    console.log(allPosts);
    
    var posts = _.pluck(allPosts, 'post');
    var postsId = _.pluck(allPosts, '_id')
    var reversePosts = posts.reverse()
    var reversePostsId = postsId.reverse()
    var zipped = _.zip(reversePosts, reversePostsId)
    _.each(zipped, function(pair){
      // console.log(pair[0]);
      // console.log(pair[1]);
      Session.set("currentPost", pair[1])
      console.log(Session.get("currentPost"));
      var msg = new SpeechSynthesisUtterance(pair[0]);
      msg.onend = function(){
        playAudio();      
      }      
      window.speechSynthesis.speak(msg);
    })


}

function playAudio(){
  audio.play();
}




function startMic(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'en-US';
  recognition.start();
}