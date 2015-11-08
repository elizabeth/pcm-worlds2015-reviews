// Reviews table
Parse.initialize('eKRYapkjFAO9WJQgbrWTAxycmijkQujwXv6SuaSA', 'XZPU2LM3Unsdgs9UQOiV0TIcpR5mIZSoPp1abHvx');

$(function() {
    'use strict';
    $(".container").hide().fadeIn(function() {
        clearMessage();
        // Get reviews from Parse
        getReviews();
        ratingElem.raty();
    });

    var review = Parse.Object.extend("PCMWorlds2015Survey");
    var reviewsQuery = new Parse.Query(review);
    reviewsQuery.descending('createdAt');

    // Current set of reviews
    var reviews = [];

    //reference to the error message alert
    var errorMessage = $("#error-message");

    // Reference the reviews list element
    var reviewsList = $("#responses-list");

    // Reference to rating element
    var ratingElem = $("#rating");

    $('#other').focus(function() {
        $('#otherCheck').prop('checked', true);
    });

    $('#otherCheck').bind('click', function() {
        if ($(this).not(':checked')) {
            $('#other').val("");
        }
    })

    // Average rating
    var averageRating = 0;
    // Number of reviews
    var count = 0;

    // Every 5 seconds, call the getReviews function
    //window.setInterval(getReviews, 5000);

    function clearMessage() {
        errorMessage.fadeOut();
        $("#success").fadeOut();
    }

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    // Show spinner
    function showSpinner() {
        $(".fa-spinner").show();
    }

    // Hide spinner
    function hideSpinner() {
        $(".fa-spinner").hide();
    }

    // Get current reviews
    function getReviews() {
        clearMessage();
        showSpinner();
        $(reviewsList).fadeOut();
        reviewsList.empty();
        $(reviewsList).hide().fadeIn();

        reviewsQuery.find()
            .then(onData, displayError)
            .then(function() {
                averageRating = averageRating / count;
            })
            .then(avgRate)
            .always(hideSpinner);
    }

    // Set current reviews to variable
    function onData(data) {
        reviews = data;
        renderReviews();
    }

    // Show the stored reviews
    function renderReviews() {
        averageRating = 0;
        count = 0;
        reviews.forEach(function(eachReview) {
            var eachRate = eachReview.get('rating');
            var li = $(document.createElement('li'))
                .raty({
                    readOnly: true,
                    score: (eachRate),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']
                })
                .appendTo(reviewsList);

            count++;
            averageRating += eachRate;

            $(document.createElement('p'))
                .text("Time: " + eachReview.get('createdAt'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Heard about event from: " + eachReview.get('heardFrom'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Rate clearness of instructions: " + eachReview.get('clearnessWeb'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Purchased challenger package?: " + eachReview.get('challengerPurchased'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Satisfaction of pack: " + eachReview.get('challengerSatisfaction'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Comments about bus: " + eachReview.get('challengerBus'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Venue Rating: " + eachReview.get('venueRate'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Venue comments: " + eachReview.get('venueComments'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Rate event activities: " + eachReview.get('rateActivities'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Would attend in the future again: " + eachReview.get('attendAgain'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Event comments: " + eachReview.get('eventComments'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Additional comments: " + eachReview.get('additionalComments'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Future event comments: " + eachReview.get('futureComments'))
                .appendTo(li);
        });
    }

    // Get the average rating
    function avgRate() {
        $("#average-rate").raty({readOnly: true,
            score: (averageRating),
            hints: ['crap', 'awful', 'ok', 'nice', 'awesome']});
    }

    // When the user submits a new review
    $("#survey-form").submit(function(evt) {
        evt.preventDefault();

        //get values of how they heard about the event input
        var heard = "";
        $("input:checked").each(function(){
            heard += $(this).val() + " ";
        });
        //
        heard += $('#other').val();

        console.log(heard);
        //get value of clearness of website instructions
        var instruct = $('#instruct').val();
        //get value of whether challenger pack was purchased
        var chall = $('#chall :selected').text();
        //get value of satisfaction of pack
        var challYes = $('#challYes').val();
        //get value of how the bus ride was
        var challPack = $('#challPack').val();
        //get value of rate of venue
        var venue = $('#venueRate').val();
        //get value of additional comments about venue
        var venueComments = $('#venueComment').val();
        //get value of rate of activities
        var activities = $('#activities').val();
        //get value of whether would attend again next year
        var attend = $('#attendAgain :selected').val();
        //get value of additional comments of the event
        var additEvent = $('#eventComments').val();
        //get value of additional comments
        var comments = $('#comments').val();
        //get value of comments of future events
        var future = $('#future').val();


        // create a new review and set the review attributes
        var worldsReview = new review();
        worldsReview.set('heardFrom', heard);
        worldsReview.set('clearnessWeb', instruct);
        worldsReview.set('challengerPurchased', chall);
        worldsReview.set('challengerSatisfaction', challYes || "none");
        worldsReview.set('challengerBus', challPack || "none");
        worldsReview.set('venueRate', venue);
        worldsReview.set('venueComments', venueComments || "none");
        worldsReview.set('rateActivities', activities);
        worldsReview.set('attendAgain', attend);
        worldsReview.set('eventComments', additEvent || "none");
        worldsReview.set('additionalComments', comments || "none");
        worldsReview.set('futureComments', future || "none");
        worldsReview.set('rating', ratingElem.raty('score') || 0);
        worldsReview.save().then(getReviews, displayError).then(function () {
            $('#survey-form').trigger("reset");
            ratingElem.raty('set', {});
            $("#success").text("Thanks for your feedback!").fadeIn();
        });
        return false;
    });
});
