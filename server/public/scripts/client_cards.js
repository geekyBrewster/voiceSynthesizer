$(document).ready(function() {
  console.log('JQ no.2 linked');

  //Initialize textarea counter
  $('input#input_text, textarea#message').characterCounter();

  //Load pre-built Responses
  getResponses();

  // add koala button click
$( '#addBtn' ).on( 'click', function(){
  console.log( 'in addButton on click' );
  // get user input and put in an object

  var responseToSend = {
    response_id: $('#nresponse_id').val(),
    response_text: $('#response_text').val()
  };
  saveResponse( responseToSend );
  clearInputs();
}); //end addButton on click

// add delete button click
$('.deleteBtn').on('click', function(){
  console.log("Delete button clicked with id: ", $(this).data('id'));
  $.ajax({
    type: 'DELETE',
    url: '/responses/' + $(this).data('id'),
    success: function(response){
      console.log("Response removed.");
      getResponses();
    }
  });
}); // end of delete button

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

    /** My addition of function for pre-built cards **/

    $('#viewResponses').on('click', '.sayBtn', function(){
      console.log('Response say button clicked.');
      var buttonID = $(this).data("keyword");
      var query = "#" + buttonID + " span";
      console.log("Data-keyword= ", buttonID);
      console.log("Text location: ", query);
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
        var $div3 = $('<div class="card-content white-text" id="' + text.response_id +'"></div>');
        $div3.append('<span class="card-title">' + text.response_text + '</span>');

        var $div4 = $('<div class="card-action"><div>');
        $div4.append('<button class="sayBtn" class="waves-effect waves-light btn" data-keyword="' + text.response_id + '">Speak</button>');
        $div4.append('<button class="deleteBtn" class="waves-effect waves-light btn" data-id="' + text.id +'">Delete</button>');

        $div2.append($div3);
        $div2.append($div4);
        $div1.append($div2);
        $('#viewResponses').append($div1);

      }
    } // end success
  }); //end ajax
  // display on DOM with buttons that allow edit of each
} // end getResponses

function saveResponse( newResponse ){
  console.log( 'in saveResponse', newResponse );
  // ajax call to server to get responses
  $.ajax({
    url: '/responses',
    type: 'POST',
    data: newResponse,
    success: function( data ){
      console.log( 'got some responses: ', data );
      getResponses();
    } // end success
  }); //end ajax
}
function clearInputs(){
  $('#response_text').val("");
  $('#response_id').val("");
}
