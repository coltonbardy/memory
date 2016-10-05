/**
 * Created by coltonbardy on 4/20/16.
 */
var first_card = null;
var second_card = null;
var total_matches = 0; //Can change with more cards
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;

var cards= ['images/boba-fett-star-wars-stencil.jpg', 'images/boba-fett-star-wars-stencil.jpg','images/c3po-stencil.jpg','images/c3po-stencil.jpg','images/7.jpg','images/7.jpg','images/8.jpg','images/8.jpg','images/8-1.jpg','images/8-1.jpg','images/10.jpg','images/10.jpg','images/3.jpg','images/3.jpg','images/7-1.jpg','images/7-1.jpg','images/queen.jpg','images/queen.jpg'];

var imageSrc = cards[index];

$(document).ready(function(){
    total_matches = $('.card').length/2;
    $("#game-area").on("click", ".card", function(){
        card_clicked(this);
        display_stats();
    });
    $("#stats").on("click", "button", function(){
        reset();
    });
    $(".my_audio").trigger('load');
});


function randomize() {
    var cardFront = $('<div>', {
        class: 'front'
    });

    var cardBack = $('<div>', {
        class: 'back'
    });

    var cardImg = $('<img>', {
        src: imageSrc
    });
};


function card_clicked(card) {
    console.log("In card_clicked function, card =", card);

    display_stats();

    if(first_card == null) {
        $(card).toggleClass('flipcard');
        first_card = card;
        console.log("first card", first_card);
    }

    else if(first_card != null && second_card == null){
        $(card).toggleClass('flipcard');
        second_card = card;
        attempts++;
        console.log("attempts", attempts);
        console.log("second card", second_card);

        if(($(first_card).find('.front img').attr('src') == $(second_card).find('.front img').attr('src')) && $(first_card).attr('id') != $(second_card).attr('id')){
            correct();

            if(match_counter == total_matches) {
                alert("You have beaten the game!");
                play_audio();
                console.log("match counter", match_counter);
                console.log("total matches", total_matches);
            }
        }
        else {
            setTimeout("incorrect()", 1500);
        }
    }
}

function shuffle(){
    var i = cards.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i));
        temp = cards[j];
        cards[j]= cards[i];
        cards[i]= temp;
    }
    shuffleInto();
}

function shuffleInto(){
    for(var i = 0; i < cards.length; i++) {
        imageSrc = cards[i];
        
    }
}

function correct(){
    $(first_card).find('.front img, .back img').css('visibility', 'hidden');
    $(second_card).find('.front img, .back img').css('visibility', 'hidden');
    first_card= null;
    console.log("first_card is now: ", first_card);
    second_card= null;
    console.log("second_card is now: ", second_card);
    match_counter++;
    console.log("match counter", match_counter);
    matches++;
    console.log('matches', matches);
    accuracy = Math.round((matches/attempts) * 100);
    console.log("accuracy", accuracy);
}

function incorrect(){
    $(first_card).removeClass('flipcard');
    $(second_card).removeClass('flipcard');
    first_card = null;
    second_card = null;
    accuracy = Math.round((matches/attempts) * 100);
    console.log("accuracy", accuracy);
}

function reset(){
    $(".card").find(".front img, .back img").css('visibility', 'visible');
    match_counter= 0;
    first_card= null;
    second_card= null;
    games_played++;
    flip_cards();
    reset_stats();
    display_stats();

}

function reset_stats(){
    accuracy= 0;
    matches= 0;
    attempts= 0;
    display_stats();
}

function flip_cards(){
    $(".card").removeClass('flipcard');
}

function display_stats(){
    $('.games-played .value').html(games_played);
    $('.attempts .value').html(attempts);
    $('.accuracy .value').html(accuracy);
}

function play_audio() {
    $("#my_audio").trigger('play');
    }