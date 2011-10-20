// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

jQuery(function($) {
    var frequency = 2000;

    setContainerHeight();
    $(window).resize(setContainerHeight);
    
    setInterval(updateTweetsTime, frequency);

    $('.tweets').scroll(fetchTweets);
});

function setContainerHeight() {
    var b = $('body').first(),
        bodyMarginHeight = b.outerHeight(true) - b.height(),
        c = $('#container'),
        containerMarginHeight = c.outerHeight(true) - c.height(),
        containerNewHeight, tweetsNewHeight;

    // fija la altura del #container
    containerNewHeight = $(window).height() - bodyMarginHeight - containerMarginHeight;
    c.height(containerNewHeight);

    // fija la altura de .tweets
    tweetsNewHeight = containerNewHeight - c.find('.header').first().outerHeight(true);
    c.find('.tweets').height(tweetsNewHeight);
}

function updateTweetsTime() {
    var currentTime = new Date(),
        pageTime = $('.tweets').data('timestamp') * 1000,
        elapsedTime = currentTime - startTime,
        newPageTime = pageTime + elapsedTime;
    
    $('.time.refresh').each(function(i, v) {
        var tweetTime = $(v).data('timestamp') * 1000;

        $(v).html(timeAgo(newPageTime - tweetTime));
    });
}

function timeAgo(time) {
    var secondsAgo = (time / 1000),
        measure = '', quantity;

    if (secondsAgo < 60) {
        measure = 'second';
        quantity = secondsAgo;
    } else if (secondsAgo < 60 * 60) {
        measure = 'minute';
        quantity = secondsAgo / 60;
    } else if (secondsAgo < 60 * 60 * 24) {
        measure = 'hour';
        quantity = secondsAgo / (60 * 60);
    } else if (secondsAgo < 60 * 60 * 24 * 30) {
        measure = 'day';
        quantity = secondsAgo / (60 * 60 * 24);
    } else {
        measure = 'month';
        quantity = secondsAgo / (60 * 60 * 24 * 30);
    }

    if (Math.floor(quantity) > 1) measure += 's';

    return Math.floor(quantity) + " " + measure + " ago";
}

function fetchTweets() {
    var t = $('.tweets'),
        scrollHeight = t.get(0).scrollHeight,
        bottomScrollTop = scrollHeight - t.height(),
        pixelsFromBottom = 200, // cantidad de pixeles desde abajo para empezar a buscar mas tweets
        userId = t.data('user-id'),
        nextPage = parseInt(t.data('page')) + 1;

    if (t.scrollTop() >= bottomScrollTop - pixelsFromBottom) {
        $.ajax('/users/' + userId, {
            type: 'get',
            data: {
                page: nextPage
            },

            beforeSend: function() {
                            t.unbind();
                            loader(true);
                        },

            success: function(r) {
                         t.append(r);
                         t.data('page', nextPage);
                         t.scroll(fetchTweets);
                     },

            complete: function() {
                          loader(false);
                      }
        });
    }
}

function loader(show) {
    var l = $('#loader');
    if (show) l.show(); else l.hide();
}
