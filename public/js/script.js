var questionNumber=1

$(function() {
  var USERS = window.USERS = {}
    , windowStatus
    , afkDeliveredMessages = 0
    , roomName = $('#room_name').text();

  // First update the title with room's name
  updateTitle();

  focusInput();

  // Then check users online!
  $('.people a').each(function(index, element) {
    USERS[$(element).data('provider') + ":" + $(element).data('username')] = 1;
  });

  //View handlers
  $(".dropdown a.selected").click(function() {
    $('.create-room').show().next("form .text").hide();
    $(this).toggleClass("active");
    $(this).next(".dropdown-options").toggle();
  });

  $(".create-room").click(function() {
    $(this).hide();
    $(this).next(".text").fadeIn();
  });

  $(".lock").click(function() {
    $(this).toggleClass('active');
  });

  $(".fancybox").fancybox({'margin': 0, 'padding': 0});

  $(".invite-people").click(function(){
    $(this).hide().after('<p class="inviting-people">Inviting peple, please wait.</p>').delay(2000).hide().after('something');
  });

  //Socket.io
  var socket = io.connect();

  socket.on('error', function (reason){
    console.error('Unable to connect Socket.IO', reason);
  });

  socket.on('connect', function (){
    console.info('successfully established a working connection');
    if($('.chat .chat-box').length == 0) {
      socket.emit('history request');
    }
    if($('.code .question .problem').children().length == 0) {
      socket.emit('problem request' + questionNumber);  //get problem one two or three for demo

    }
  });

  // problem sockets
  socket.on('problem response', function(res){
      console.log('Problem response', res);
      window.problem = res.response;
      $('.code .question .problem').html("<div class='title'>" + res.response.challengeTitle + "</div><div class='description'>" + res.response.challengeCopy + "</div>");
      editor.setValue(res.response.templateCode);

  });

  // submit sockets
  $('.answer-input').on('click','.button', function(){
      socket.emit('submit request', { solution: editor.getValue(), problem_id : window.problem.id });
  });

  socket.on('question answered', function(){

    questionNumber = questionNumber + 1;
    socket.emit('problem request' + questionNumber); //get problem one two or three for demo
    if (!window.winner) {
      $('#myModal').modal('show').find('.modal-body').html('<h1 style="text-align: center; color:#333"><span style="color:red;">Sorry you lost!</span><br>Click close to move on to the next round!</h1>');
    }

  });

  socket.on('submit response', function(res){


    console.log(res);

    var messages = [],
        errors = false;

    $.each(res.response, function(i, val){
        if (val.isPassed !== true){
          errors = true;
          messages.push(val.failedTestCase);
        }
    });




    if (errors === false){

      window.winner = true;

      $('.submit-modal .modal-body').html("<div>" + "<div style=\"text-align:center;color:#333\"><h1><span style=\"color:green;\">Correct!</span><br>Close this window to get the next question.</h1></div>" + "</div>");



    } else {

      var delay = 10000;

      $('.submit-modal').find('.btn').hide();
      $('.submit-modal .modal-body').html("<div style=\"text-align:center;color:#333\"><h1>Incorrect Answer - 10 second penalty.</h1><p>"+ messages.join('<br>') +"</p>" + '<div class="timer"><input data-fgcolor="#ff0000" data-thickness=".4" data-readonly="true" data-width="80" data-height="80" value="22" class="timeDelay" readonly="readonly"></div>' + "</div>");

      $('.timeDelay').knob();

      $({value: 0}).animate({value: 100}, {
        duration: 10000,
        easing:'swing',
        step: function()
        {
          $('.timeDelay').val(Math.ceil(this.value)).trigger('change');
        }
        });

      setTimeout(function(){
        $('.timer').slideUp(function(){
          $('.submit-modal').find('.btn').fadeIn();
          $('#myModal').modal('hide');
          $(this).show();
        });


      }, 9500);


    }



  });

  socket.on('history response', function(data) {
    if(data.history && data.history.length) {
      var $lastInput
        , lastInputUser;

      data.history.forEach(function(historyLine) {
        var time = new Date(historyLine.atTime)
          , msnData = historyLine.from.split(':')
          , nickname = msnData.length > 1 ? msnData[1] : msnData[0]
          , provider = msnData.length > 1 ? msnData[0] : "twitter"
          , chatBoxData = {
              nickname: nickname,
              provider: provider,
              msg: historyLine.withData,
              type: 'history',
              time: timeParser(time)
            };

        $lastInput = $('.chat .history').children().last();
        lastInputUserKey = $lastInput.data('provider') + ':' + $lastInput.data('user');

        if($lastInput.hasClass('chat-box') && lastInputUserKey === chatBoxData.provider + ':' + chatBoxData.nickname) {
          $lastInput.append(parseChatBoxMsg(ich.chat_box_text(chatBoxData)));
        } else {
          $('.chat .history').append(parseChatBox(ich.chat_box(chatBoxData)));
        }

        $('.chat').scrollTop($('.chat').prop('scrollHeight'));
      });
    }
  });

  socket.on('new user', function(data) {
    var message = "$username has joined the room.";

    //If user is not 'there'
    if(!$('.people a[data-username="' + data.nickname + '"][data-provider="' + data.provider + '"]').length) {
      //Then add it
      $('.online .people').prepend(ich.people_box(data));
      USERS[data.provider + ":" + data.nickname] = 1;

      // Chat notice
      message = message
            .replace('$username', data.nickname);

      // Check update time
      var time = new Date()
        , noticeBoxData = {
            user: data.nickname,
            noticeMsg: message,
            time: timeParser(time)
          };

      var $lastChatInput = $('.chat .current').children().last();

      if($lastChatInput.hasClass('notice') && $lastChatInput.data('user') === data.nickname) {
        $lastChatInput.replaceWith(ich.chat_notice(noticeBoxData));
      } else {
        $('.chat .current').append(ich.chat_notice(noticeBoxData));
        $('.chat').scrollTop($('.chat').prop('scrollHeight'));
      }
    } else {
      //Instead, just check him as 'back'
      USERS[data.provider + ":" + data.nickname] = 1;
    }
  });

  socket.on('user-info update', function(data) {
    var message = "$username is now $status.";

    // Update dropdown
    if(data.username === $('#username').text() && data.provider === $('#provider').text()) {
      $('.dropdown-status .list a').toggleClass('current', false);
      $('.dropdown-status .list a.' + data.status).toggleClass('current', true);

      $('.dropdown-status a.selected')
        .removeClass('available away busy');

      $('.dropdown-status a.selected').addClass(data.status).html('<b></b>' + data.status);
    }

    // Update users list
    $('.people a[data-username=' + data.username + '][data-provider="' + data.provider + '"]')
      .removeClass('available away busy')
      .addClass(data.status);

    // Chat notice
    message = message
          .replace('$username', data.username)
          .replace('$status', data.status);

    // Check update time
    var time = new Date()
      , noticeBoxData = {
          user: data.username,
          noticeMsg: message,
          time: timeParser(time)
        };

      var $lastChatInput = $('.chat .current').children().last();

      if($lastChatInput.hasClass('notice') && $lastChatInput.data('user') === data.username) {
        $lastChatInput.replaceWith(ich.chat_notice(noticeBoxData));
      } else {
        $('.chat .current').append(ich.chat_notice(noticeBoxData));
        $('.chat').scrollTop($('.chat').prop('scrollHeight'));
      }
  });

  socket.on('new msg', function(data) {
    var time = new Date(),
        $lastInput = $('.chat .current').children().last(),
        lastInputUserKey = $lastInput.data('provider') + ':' + $lastInput.data('user');

    data.type = 'chat';
    data.time = timeParser(time)

    if($lastInput.hasClass('chat-box') && lastInputUserKey === data.provider + ':' + data.nickname) {
      $lastInput.append(parseChatBoxMsg(ich.chat_box_text(data)));
    } else {
      $('.chat .current').append(parseChatBox(ich.chat_box(data)));
    }

    $('.chat').scrollTop($('.chat').prop('scrollHeight'));

    //update title if window is hidden
    if(windowStatus == "hidden") {
      afkDeliveredMessages +=1;
      updateTitle();
    }

  });

  socket.on('user leave', function(data) {
    var nickname = $('#username').text()
      , message = "$username has left the room.";

    for (var userKey in USERS) {
      if(userKey === data.provider + ":" + data.nickname && data.nickname != nickname) {
        //Mark user as leaving
        USERS[userKey] = 0;

        //Wait a little before removing user
        setTimeout(function() {
          //If not re-connected
          if (!USERS[userKey]) {
            //Remove it and notify
            $('.people a[data-username="' + data.nickname + '"][data-provider="' + data.provider + '"]').remove();

            // Chat notice
            message = message
                  .replace('$username', data.nickname);

            // Check update time
            var time = new Date(),
              noticeBoxData = {
                user: data.nickname,
                noticeMsg: message,
                time: timeParser(time)
              };

            var $lastChatInput = $('.chat .current').children().last();

            if($lastChatInput.hasClass('notice') && $lastChatInput.data('user') === data.nickname) {
              $lastChatInput.replaceWith(ich.chat_notice(noticeBoxData));
            } else {
              $('.chat .current').append(ich.chat_notice(noticeBoxData));
              $('.chat').scrollTop($('.chat').prop('scrollHeight'));
            }
          };
        }, 2000);
      }
    }
  });

  $(".chat-input input").keypress(function(e) {
    var inputText = $(this).val().trim();
    if(e.which == 13 && inputText) {
      var chunks = inputText.match(/.{1,1024}/g)
        , len = chunks.length;

      for(var i = 0; i<len; i++) {
        socket.emit('my msg', {
          msg: chunks[i]
        });
      }

      $(this).val('');

      return false;
    }
  });

  $('.dropdown-status .list a.status').click(function(e) {
    socket.emit('set status', {
      status: $(this).data('status')
    });
  });

  var timeParser = function(date) {
    var hours = date.getHours()
      , minutes = date.getMinutes()
      , seconds = date.getSeconds();
    return {
      hours: hours > 12 ? hours - 12 : hours,
      minutes: minutes > 10 ? minutes : '0' + minutes,
      seconds: seconds > 10 ? seconds : '0' + seconds,
      meridiem: hours > 12 ? 'PM' : 'AM'
    }
  };

  var textParser = function(text) {
    text = text
      .replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href=\"$1\" target='_blank'>$1</a>")
      .replace(/(@)([a-zA-Z0-9_]+)/g, "<a href=\"http://twitter.com/$2\" target=\"_blank\">$1$2</a>");

   return  injectEmoticons(text);
  };

  var parseChatBox = function(chatBox) {
    var chatBoxMsg = chatBox.find('p');
    parseChatBoxMsg(chatBoxMsg);
    return chatBox;
  };

  var parseChatBoxMsg = function(chatBoxMsg) {
    var msg = chatBoxMsg.html();
    return chatBoxMsg.html(textParser(msg));
  };

  var patterns = {
    angry: /\&gt;:-o|\&gt;:o|\&gt;:-O|\&gt;:O|\&gt;:-\(|\&gt;:\(/g,
    naughty: /\&gt;:-\)|\&gt;:\)|\&gt;:-\&gt;|\&gt;:\&gt;/g,
    sick: /:-\&amp;|:\&amp;|=\&amp;|=-\&amp;|:-@|:@|=@|=-@/g,
    smile: /:-\)|:\)|=-\)|=\)/g,
    wink: /;-\)|;\)/g,
    frown: /:-\(|:\(|=\(|=-\(/g,
    ambivalent: /:-\||:\|/g,
    gasp: /:-O|:O|:-o|:o|=-O|=O|=-o|=o/g,
    laugh: /:-D|:D|=-D|=D/g,
    kiss: /:-\*|:\*|=-\*|=\*/g,
    yuck: /:-P|:-p|:-b|:P|:p|:b|=-P|=-p|=-b|=P|=p|=b/g,
    yum: /:-d|:d/g,
    grin: /\^_\^|\^\^|\^-\^/g,
    sarcastic: /:-\&gt;|:\&gt;|\^o\)/g,
    cry: /:'\(|='\(|:'-\(|='-\(/g,
    cool: /8-\)|8\)|B-\)|B\)/g,
    nerd: /:-B|:B|8-B|8B/g,
    innocent: /O:-\)|o:-\)|O:\)|o:\)/g,
    sealed: /:-X|:X|=X|=-X/g,
    footinmouth: /:-!|:!/g,
    embarrassed: /:-\[|:\[|=\[|=-\[/g,
    crazy: /%-\)|%\)/g,
    confused: /:-S|:S|:-s|:s|%-\(|%\(|X-\(|X\(/g,
    moneymouth: /:-\$|:\$|=\$|=-\$/g,
    heart: /\(L\)|\(l\)/g,
    thumbsup: /\(Y\)|\(y\)/g,
    thumbsdown: /\(N\)|\(n\)/g,
    "not-amused": /-.-\"|-.-|-_-\"|-_-/g,
    "mini-smile": /c:|C:|c-:|C-:/g,
    "mini-frown": /:c|:C|:-c|:-C/g,
    content: /:j|:J/g,
    hearteyes: /\&lt;3/g
  };

  var emoticHTML = "<span class='emoticon $emotic'></span>";

  var injectEmoticons = function(text) {
    for(var emotic in patterns) {
      text = text.replace(patterns[emotic],emoticHTML.replace("$emotic", "emoticon-" + emotic));
    }
    return text;
  }

  // TITLE notifications
  var hidden
    , change
    , vis = {
        hidden: "visibilitychange",
        mozHidden: "mozvisibilitychange",
        webkitHidden: "webkitvisibilitychange",
        msHidden: "msvisibilitychange",
        oHidden: "ovisibilitychange" /* not currently supported */
    };

  for (var hidden in vis) {
    if (vis.hasOwnProperty(hidden) && hidden in document) {
        change = vis[hidden];
        break;
    }
  }

  if (change) {
    document.addEventListener(change, onchange);
  } else if (/*@cc_on!@*/false) { // IE 9 and lower
    document.onfocusin = document.onfocusout = onchange
  } else {
    window.onfocus = window.onblur = onchange;
  }

  function onchange (evt) {
    var body = document.body;
    evt = evt || window.event;

    if (evt.type == "focus" || evt.type == "focusin") {
      windowStatus = "visible";
    } else if (evt.type == "blur" || evt.type == "focusout") {
      windowStatus = "hidden";
    } else {
      windowStatus = this[hidden] ? "hidden" : "visible";
    }

    if(windowStatus == "visible" && afkDeliveredMessages) {
      afkDeliveredMessages = 0;
      updateTitle();
    }

    if (windowStatus == "visible") {
      focusInput();
    }
  }

  function updateTitle() {
    // On chrome, we have to add a timer for updating the title after the focus event
    // else the title will not update
    window.setTimeout(function () {
      $('title').html(ich.title_template({
        count: afkDeliveredMessages,
        roomName: roomName
      }, true));
    },100);
  }

  function focusInput() {
    $(".chat-input input.text").focus();
  }


  if ($('body').hasClass('room')){

    var $chatInput = $('.chat-input')
      , $problem = $('.problem')
      , $header = $('header');

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/javascript");

    // problem sockets
    socket.on('problem response', function(res){
      console.log('####res', res);
    });

/*    setTimeout(function(){
        console.log('sending request');
        socket.emit('problem request');
    }, 1000);*/



    function resizedw(){
      $('.answer').height($(window).height() - $header.outerHeight() - $chatInput.outerHeight() - $chatInput.outerHeight() + 15);
    }

    resizedw();

    var doit;
    $(window).resize(function(){
      clearTimeout(doit);
      doit = setTimeout(resizedw, 100);
    });
  };

  var fbid = (window.location.href.indexOf('198.199.81.151') > -1) ? '135123666677844' :  '572742529414533';
  FB.init({appId: fbid, xfbml: true, cookie: true});


  $('.fbfriends').click(function(e){
    e.preventDefault();
   // alert(window.location.href)
    FB.ui({
      method: 'send',
      name: 'test hack',
      link: 'http://www.craigishere.me'
    });
  });
  // knob shit
  setTimeout(function(){
    $(".knob").knob({
      draw : function(){
        $('.knob').css('visibility', 'visible');
      }
    });

    setTimeout(function(){
      $({value: 0}).animate({value: 75}, {
        duration: 1000,
        easing:'swing',
        step: function()
        {
          $('.people a:first .knob').val(Math.ceil(this.value)).trigger('change');
        }
      })
    }, 2000);
  }, 1000);









});
