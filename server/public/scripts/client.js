$(document).ready(function() {
  console.log('JQ linked');

  //Initialize textarea counter
  $('input#input_text, textarea#message').characterCounter();

  //Load pre-built Responses
  getResponses();

  //Start of Code from Code Pen
  $(function(){
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function() {
      var $voicelist = $('#voices');

      if($voicelist.find('option').length == 0) {
        speechSynthesis.getVoices().forEach(function(voice, index) {
          var $option = $('<option>')
          .val(index)
          .html(voice.name + (voice.default ? ' (default)' :''));

          $voicelist.append($option);
        });

        $voicelist.material_select();
      }
    };

    $('#speak').click(function(){
      var text = $('#message').val();
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[$('#voices').val()];
      msg.text = text;

      msg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      speechSynthesis.speak(msg);
    });

    //My addition of function for pre-built cards
    $('.say').click(function(){
      console.log('Response say button clicked.');
      var buttonID = $(this).data("id");
      var query = "#" + buttonID + " span";
      console.log(buttonID);
      var text = $(query).text();
      console.log(text);
      var msg = new SpeechSynthesisUtterance();
      msg.text = text;

      msg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      speechSynthesis.speak(msg);
    });


  } else {
    $('#modal1').openModal();
  }
});
//End of code from Code Pen


}); //end of doc.ready

function getResponses(){
  console.log( 'in getResponses' );
  $('#viewResponses').empty();
  // ajax call to server to get responses
  $.ajax({
    url: '/responses',
    type: 'GET',
    success: function( response ){
      console.log( 'got some response: ', response );
      var responses = response.responses;
      for(var i = 0; i < responses.length; i++){
        var text = responses[i];
        var $div1 = $('<div class="col s6 m4"></div>');
        var $div2 = $('<div class="card blue-grey darken-1"></div>');
        var $div3 = $('<div class="card-content white-text" data-keyword="' + text.response_id +'"></div>');
        $div3.append('<span class="card-title">' + text.response_text + '</span>');

        var $div4 = $('<div class="card-action"><div>');
        $div4.append('<button class="say" class="waves-effect waves-light btn" data-keyword="' + text.response_id + '">Speak</button>');
        $div4.append('<button class="delete" class="waves-effect waves-light btn" data-id="' + text.id +'">Delete</button>');

        $div2.append($div3);
        $div2.append($div4);
        $div1.append($div2);
        $('#viewResponses').append($div1);

      }
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
} // end getResponses
