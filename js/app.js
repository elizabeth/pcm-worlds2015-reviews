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

    var review = Parse.Object.extend("PCMWorlds2015Reviews");
    var reviewsQuery = new Parse.Query(review);
    reviewsQuery.descending('createdAt');

    // Current set of reviews
    var reviews = [];

    //reference to the error message alert
    var errorMessage = $("#error-message");

    // Reference the reviews list element
    var reviewsList = $("#reviews-list");

    // Reference to rating element
    var ratingElem = $("#rating");

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
                averageRating = parseInt(averageRating / count);
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

            $(document.createElement('span'))
                .text(eachReview.get('title'))
                .addClass("reviewTitle")
                .appendTo(li);

            var span = $(document.createElement('span'))
                .addClass("icons")
                .appendTo(li);

            $(document.createElement('p'))
                .text(eachReview.get('review'))
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
    $("#review-form").submit(function(evt) {
        evt.preventDefault();

        var titleInput = $(this).find("[name='title']");
        var reviewInput = $(this).find("[name='review']");

        //get value of review input
        var input = reviewInput.val();
        //get value of title input
        var title = titleInput.val();

        // create a new review and set the review attributes
        var worldsReview = new review();
        worldsReview.set('title', title);
        worldsReview.set('review', input);
        worldsReview.set('rating', ratingElem.raty('score') || 0);
        worldsReview.set('voted', 0);
        worldsReview.set('helpful', 0);
        worldsReview.save().then(getReviews, displayError).then(function () {
            titleInput.val("");
            reviewInput.val("");
            ratingElem.raty('set', {});
            $("#success").text("Thanks for your feedback!").fadeIn();
        });
        return false;
    });
});