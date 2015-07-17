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
          } if ((event.results[i][0].transcript.indexOf("newsfeed") > -1) || (event.results[i][0].transcript.indexOf("home") > -1)) {
          	recognition.stop();
          	Router.go("newsfeed");
          } if (Router.current().route.getName() == "submit"){
          		if((event.results[i][0].transcript.indexOf("dictate") > -1) || (event.results[i][0].transcript.indexOf("dictation") > -1)){
          			dictating=true;
          			
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

 
  function startMic(event) {
    if (recognizing) {
      recognition.stop();
      return;
    }
    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
    //final_span.innerHTML = '';
    //interim_span.innerHTML = '';
  }