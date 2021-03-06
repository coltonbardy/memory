/**
 * Created by coltonbardy on 4/20/16.
 */
var first_card = null;
var second_card = null;
var match_counter = 0;
var total_matches = 9; //change this when you add more cards
var canClick = true;
var attempts = 0;
var accuracy = 0;
var games_played = 0;
var newHP = 1000;
var card_flip_timer = null;
var currentGold = 300;

//player stats from items
var baseHP = 1000;
var critChance = 0;
var armor = 0;
var lifeSteal = 0;
var passiveGold = 0;

/*
 * To randomize cards:
 * make an array with the cards in them
 * randomly select a card and slice it out of the array and push it onto a new array
 *
 * */

var items = [
      //health pot heals for 100
      {
            name: 'Health Pot',
            cost: 200,
            type: 'consume',
            src: 'images/healthpot.png',
            effect: function () {
                  update_hp(50);
            }
      },

      //armor reduces damage from 100 to 50 from hit
      {
            name: 'Armor',
            cost: 200,
            type: 'passive',
            src: 'images/armor.png',
            effect: function () {
                  armor += .2;
            }
      },

      //health item raises base HP by 200
      {
            name: 'Health Item',
            cost: 200,
            type: 'passive',
            src: 'images/healthitem.png',
            effect: function () {

                  baseHP += 200;
                  update_hp(0);
            }
      }
];

var inventory = [];

//function for when first and second cards don't match, shows the backs of them again
function showBack(first, second) {
      canClick = false;
      card_flip_timer = setTimeout(function(){
            card_flip_timer = null;
            first.find('.back').show();
            second.find('.back').show();
            canClick = true;
      }, 1000);
}

//run after first and second cards are flipped, resets values
function reset_cards() {
      first_card = null;
      second_card = null;
}

//display stats
function display_stats() {
      $('.games-played .value').text(games_played);
      $('.attempts .value').text(attempts);
      $('.accuracy .value').text(accuracy + "%");
}

//resets stats when "reset game" button is clicked
function reset_stats() {
      attempts = 0;
      accuracy = 0;
      match_counter = 0;
      display_stats();
}

//only set accuracy when called so it doesn't divide 0 by 0
function set_accuracy() {
      accuracy = Math.round((match_counter / attempts) * 100);
}

function card_clicked(current) {
      //check if can click
      //check if the card is already flipped
      //then do nothing if either are true
      console.log(canClick);
      if(canClick === false || current.find('.back').css('display') == 'none') {
            return;
      }

      //flips the card over, showing the front
      current.find('.back').hide();

      //if first card hasn't been flipped, set this one to first card
      if(first_card == null) {
            first_card = current;
            return;
      }
      //if first card has been set, set this one to second card
      else {
            second_card = current;
            attempts++;

            //compares the two image source values
            //if they are the same
            if(first_card.find('.front img').attr('src') == second_card.find('.front img').attr('src')) {
                  update_gold(300);
                  match_counter++;
                  //now that you've made a match, you can't divide by 0 anymore so we can now calculate accuracy
                  set_accuracy();

                  //now start over
                  reset_cards();

                  //check if all cards are matched then display a "you win" message
                  if(match_counter === total_matches) {
                        $('#victory').fadeIn();
                  }
            }
            else { //cards don't match

                  showBack(first_card, second_card);
                  reset_cards();
                  if(match_counter > 0) {
                        set_accuracy();
                  }
                  update_hp(-100 + (100 * armor));
            }

            //refresh stats after every attempt
            display_stats();
      }
}

function randomize_cards() {
      var images = [
            'images/boba-fett-star-wars-stencil.jpg', 'images/boba-fett-star-wars-stencil.jpg', 'images/c3po-stencil.jpg', 'images/c3po-stencil.jpg', 'images/han-solo-stencil.jpg','images/han-solo-stencil.jpg','images/luke-skywalker-stencil.jpg','images/luke-skywalker-stencil.jpg','images/princess-leia-stencil.jpg','images/princess-leia-stencil.jpg','images/r2d2-stencil.jpg','images/r2d2-stencil.jpg','images/tie-fighter-stencil.jpg','images/tie-fighter-stencil.jpg','images/x-wing-stencil.jpg','images/x-wing-stencil.jpg','images/Darth-Vader-Stencil-thumb.jpg','images/Darth-Vader-Stencil-thumb.jpg'];

      var slots = images.length;
      var imagesCopy = [];
      for (var i = 0; i < slots; i++) {
            var randomNum = Math.floor((Math.random() * images.length));
            imagesCopy.push(images.splice(randomNum, 1));

      }

      for (var j = 0; j < imagesCopy.length; j++) {
            $('#game-area .card:nth-child(' + (j + 1) + ')').append('<div class="front"><img src="' + imagesCopy[j] + '"></div>');
      }
      return imagesCopy;

}

function remove_cards() {
      $('.front').remove();
}
function game_over() {
      clearTimeout(card_flip_timer);
      $('#defeat').fadeIn();
      $('.back').hide();
}

function update_hp(val) {
      if(newHP + val <= 0) {
            $('#hp-count').html(0 + ' / ' + baseHP);
            $('#hp-bar').css('width', 0);
            game_over();
            return;
      }
      else if (newHP + val > baseHP) {
            $('#hp-count').html(baseHP + ' / ' + baseHP);
            return;
      }
      else {
            newHP += val;
            $('#hp-count').html(newHP + ' / ' + baseHP);
      }
      $('#hp-bar').css('width', newHP/baseHP * 100 + '%');

}

function update_gold(val) {
      if(currentGold + val < 0) {
            return;
      }

      currentGold += val;
      $('#total-gold').html(currentGold);
      $('.gold').addClass('gold-active');
      setTimeout(function(){
            $('.gold').removeClass('gold-active');
      }, 500);

}

function reset() {
      games_played++;
      remove_cards();
      randomize_cards();
      reset_stats();
      display_stats();
      $('.back').show();
      $('#victory').fadeOut();
      $('#defeat').fadeOut();
      canClick = true;
      newHP = 1000;
      baseHP = 1000;
      critChance = 0;
      armor = 0;
      lifeSteal = 0;
      passiveGold = 0;
      $('#hp-count').html(newHP + ' / ' + baseHP);
      $('#hp-bar').css('width', newHP/baseHP * 100 + '%');
      currentGold = 300;
      update_gold(0);
      clear_inventory();
}

function update_inventory(item) {
      /*
       loop through item slots
       check if empty
       if empty, put purchased item into slot
       if not empty, move on
       if there are no empty slots, do nothing, don't buy item
       */

      for(var i = 0; i < 3; i++) {
            if($('#inventory .item-slot:nth-child(' + (i + 1) + ')').html() == '') {
                  $('#inventory .item-slot:nth-child(' + (i + 1) + ')').append('<img src="' + item.src + '" alt="' + item.name + '"></div>');
                  return;
            }
      }
}

function clear_inventory() {
      $('#inventory .item-slot').empty();
}

function item_clicked(item) {
      var item_bought;

      //search for that item's info
      for(var i = 0; i < items.length; i++) {
            if(item.find('img').attr('alt') == items[i].name) {
                  item_bought = items[i];
            }
      }

      //check if item is already in inventory

      //Check if item can be bought
      if(currentGold >= item_bought.cost) {


            //check if item is a consumable, then use immediately
            if(item_bought.type == "consume"){
                  item_bought.effect();
            }

            //check if item is a passive item, then put into inventory
            if(item_bought.type == "passive") {
                  update_inventory(item_bought);
                  item_bought.effect();
            }

            //subtract item cost from current gold
            update_gold(-(item_bought.cost));
      }

}

$(document).ready(function() {
      update_gold(0);
      update_hp(0);
      randomize_cards();
      display_stats();

      $('.card').click(function() {
            card_clicked($(this));
      });

      $('.shop-item').click(function() {
            item_clicked($(this));
      });

      $('.reset').click(function() {
            reset();
      });

});