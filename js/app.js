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
                .text("Venue comments: " + eachReview.get('venueComments'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Rate event activities: " + eachReview.get('rateActivities'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Would attend in the future again: " + eachReview.get('attend'))
                .appendTo(li);

            $(document.createElement('p'))
                .text("Event comments: " + eachReview.get('additEvent'))
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
    $("#review-form").submit(function(evt) {
        evt.preventDefault();

        var heardInput = $(this).find("[name='heard']");
        var instructInput = $(this).find("[name='instruct']");
        var challInput = $(this).find("[name='chall']");
        var challYesInput = $(this).find("[name='challYes']");
        var challPackInput = $(this).find("[name='challPack']");
        var venueInput = $(this).find("[name='venue']");
        var activitiesInput = $(this).find("[name='activities']");
        var attendInput = $(this).find("[name='attend']");
        var additEventInput = $(this).find("[name='additEvent']");
        var commentsInput = $(this).find("[name='comments']");
        var futureInput = $(this).find("[name='future']");

        //get value of how they heard about the event input
        var heard = heardInput.val();
        //get value of clearness of website instructions
        var instruct = instructInput.val();
        //get value of whether challenger pack was purchased
        var chall = challInput.val();
        //get value of satisfaction of pack
        var challYes = challYesInput.val();
        //get value of how the bus ride was
        var challPack = challPackInput.val();
        //get value of additional comments about venue
        var venue = venueInput.val();
        //get value of rate of activities
        var activities = activitiesInput.val();
        //get value of whether would attend again next year
        var attend = attendInput.val();
        //get value of additional comments of the event
        var additEvent = additEventInput.val();
        //get value of additional comments
        var comments = commentsInput.val();
        //get value of comments of future events
        var future = futureInput.val();


        // create a new review and set the review attributes
        var worldsReview = new review();
        worldsReview.set('heardFrom', heard);
        worldsReview.set('clearnessWeb', instruct);
        worldsReview.set('challengerPurchased', chall);
        worldsReview.set('challengerSatisfaction', challYes);
        worldsReview.set('challengerBus', challPack);
        worldsReview.set('venueComments', venue);
        worldsReview.set('rateActivities', activities);
        worldsReview.set('attendAgain', attend);
        worldsReview.set('eventComments', additEvent);
        worldsReview.set('additionalComments', comments);
        worldsReview.set('futureComments', future);
        worldsReview.set('rating', ratingElem.raty('score') || 0);
        worldsReview.save().then(getReviews, displayError).then(function () {
            titleInput.val("");
            reviewInput.val("");
            ratingElem.raty('set', {});
            $("#success").text("Thanks for your feedback!").fadeIn();
        });
        return false;
    });
});