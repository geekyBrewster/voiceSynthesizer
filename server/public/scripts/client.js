$(document).ready(function() {
  console.log('JQ linked');

  //Initialize textarea counter
  $('input#input_text, textarea#message').characterCounter();

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
