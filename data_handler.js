window.visitor = 'thatfatbird';

// stores length of streams.home from the last refresh
var lastHomeLength;

// creates refresh button div
var $refresh = $('<div class="refresh clicky">Refresh</div>');

// text box placeholder messages
var messages = [
  'Compose your twit here...',
  'Hey! Over here! Type a message here to twit.',
  'I get it, you\'re bad with computers. That\'s fine, I guess. Type a message here and then click twit.',
  'Maybe I\'m being impatient. Take your time and twit when you\'re ready.'
];



$(document).ready(function() {
  // wipes timeline
  var $timeline = $('.timeline');
  $timeline.html('');

  // sets value to current length of streams.home
  lastHomeLength = streams.home.length;



  // --=+=-- HELPER FUNCTIONS --=+=--

  // used in for-loops to prepend tweets to timeline
  var prependTweet = function(i) {
    var tweet = streams.home[i];
    var $user = $('<div class="tweet-head tweet-user clicky"></div>');
    var $time = $('<div class="tweet-head tweet-time"></div>');
    var $tweet = $('<div class="tweet group"></div>');
    $user.text('@' + tweet.user);
    $time.text(tweet.created_at.toLocaleString());
    $tweet.text(tweet.message);
    $tweet.prependTo($timeline);
    $time.prependTo($timeline);
    $user.prependTo($timeline);
    $user.click(viewUserTweets); // adds click behavior to username of tweet
  };

  // used in for-loops to append tweets to timeline
  var appendTweet = function(i) {
    var tweet = streams.home[i];
    var $user = $('<div class="tweet-head tweet-user clicky"></div>');
    var $time = $('<div class="tweet-head tweet-time"></div>');
    var $tweet = $('<div class="tweet group"></div>');
    $user.text('@' + tweet.user);
    $time.text(tweet.created_at.toLocaleString());
    $tweet.text(tweet.message);
    $user.appendTo($timeline);
    $user.click(viewUserTweets); // adds click behavior to username of tweet
    $time.appendTo($timeline);
    $tweet.appendTo($timeline);
  };

  // refreshes timeline with new tweets
  var refreshTweets = function() {
    for (lastHomeLength; lastHomeLength < streams.home.length; lastHomeLength++) {
      prependTweet(lastHomeLength);
    }
    // add refresh button to top of timeline
    $refresh.prependTo($timeline);
  };

  // builds full timeline from scratch
  var goHome = function() {
    $timeline.html('');
    $refresh.appendTo($timeline);
    $refresh.click(refreshTweets);
    for (var i = streams.home.length-1; i >=0; i--) {
      appendTweet(i);
    }
  };



  // --=+=-- ON FIRST LOAD DO THE FOLLOWING --=+=--

  // add refresh button to top of timeline
  $refresh.appendTo($timeline);
  $refresh.click(refreshTweets);

  // build timeline
  goHome();



  // --=+=-- CLICK EVENTS DEFINED --=+=--

  // top-right title in header loads full timeline on click
  $('.head-right').click(goHome);

  // clears placeholder text from text box on click
  $('#twit-box').click(clearTwitBox);

  // add text from text field to timeline and cycle placholder text
  $('.twit').click(function() {
    streams.users[visitor] = streams.users[visitor] || [];
    var $twit = $('.text-field').val();

    // cycle placholder text
    if (!$twit) {
      $('.text-field').val(messages[0]);
    } else if ($twit === messages[0]) {
      $('.text-field').val(messages[1]);
    } else if ($twit === messages[1]) {
      $('.text-field').val(messages[2]);
    } else if ($twit === messages[2]) {
      $('.text-field').val(messages[3]);
    } else if ($twit === messages[3]) {
      $('.text-field').val('');
    } else {

      // add tween to steams and populate in timeline
      writeTweet($twit);
      goHome();

      // clear text box
      $('.text-field').val('');
      $refresh.prependTo($timeline); // adds refresh button to top of timeline
      $refresh.click(refreshTweets);
    }
  });

  // pressing enter triggers twit button
  $('#twit-box').keyup(function(event){
    if (!$('.text-field').val().trim()) {
      $('.text-field').val('');
    } else {
      if (event.keyCode == 13){
        $("#twit-button").click();
        $('.text-field').val('');
      }
    }
  });

  // fade-toggles #twittler title to #home on hover
  $('.head-right').hover(function() {
      $(this).fadeOut('fast', function(){
        $(this).text('#home');
      });
      $(this).fadeIn('fast', function() {
        $(this).text('#home');
      });
    }, function() {
      $(this).fadeOut('fast', function(){
        $(this).text('#twittler');
      });
      $(this).fadeIn('fast', function() {
        $(this).text('#twittler');
      });
    }
  );

});



// clears timeline and displays tweets only by the username clicked
var viewUserTweets = function() {
  var $timeline = $('.timeline');

  // stores user name from clicked div without @ symbol
  var user = ($(this).text()).substr(1);
  
  // creates refresh button unique to user
  var $refreshUser = $('<div class="refresh clicky">Refresh @' + user + '</div>');

  // builds timeline exclusively with tweets by user clicked
  var buildUserTimeline = function() {
    $timeline.html('');
    var index = streams.users[user].length - 1;
    $refreshUser.appendTo($timeline);
    $($refreshUser).click(buildUserTimeline);

    while(index >= 0) {
      var tweet = streams.users[user][index];
      var $time = $('<div class="tweet-head tweet-time"></div>');
      var $tweet = $('<div class="tweet group"></div>');
      $time.text(tweet.created_at.toLocaleString());
      $tweet.text(tweet.message);
      $time.appendTo($timeline);
      $tweet.appendTo($timeline);
      index--;
    }
  };
  buildUserTimeline();
};

// clears placeholder text from twit box on click
var clearTwitBox = function() {
  if(this.value === messages[0] || this.value === messages[1] || this.value === messages[2] || this.value === messages[3]) {
    this.value = '';
  }
};

