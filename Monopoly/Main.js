

const numOfPlayers = 2;
let turn = 1;
$(document).ready(init);

function createPlayer(playerId, startPosition) {
    return $("<img>").attr({ "src": "images3/player" + playerId + ".png", "width": "40", "height": "40", "id": playerId }).data('currentPosition', startPosition);
}

function init() {

    if (localStorage["Players"] != null) {
        var continueG = window.confirm("Do you want to continue the previous game?");
        if (continueG) {
            Players = JSON.parse(localStorage["Players"]);
            initMonopoly(localStorage["type"])
        } else localStorage.clear();
    }

    $Container1 = $('<div>').attr('class', "Container1");
    $headerDiv = $('<div>').attr('class', "HeadDiv");
    $mainHeader = $('<h1>').html("Choose Your Theme").attr('class', "HeadDiv");
    $headerDiv.append($mainHeader)
    $chooseTheme = $('<div>').attr('class',"theme-chooser");
    $animeBtn = $('<button>').attr({ 'type': "button","id":"animeBtn"}).addClass('chooseBtn').click(function () {
        $chooseTheme.remove();
        localStorage.type = 'Anime';
        $('body').empty();
        initMonopoly('Anime')
    })
    $harryPotterBtn = $('<button>').attr({ 'type': "button", "id": "hpBtn" }).addClass('chooseBtn').click(function () {
        $chooseTheme.remove();
        localStorage.type = 'HarryPotter';
        $('body').empty();
        initMonopoly('HarryPotter')
    });
    $chooseTheme.append($animeBtn, $harryPotterBtn);
    $Container1.append($headerDiv, $chooseTheme);

    $('body').append($Container1)
}

function initMonopoly(type) {

    if (localStorage.Players == null) {
        var userInput = prompt("Please enter the desired initial amount of cash for each player:","2500");
        if (userInput != null) {
            for (var i = 0; i < Players.length; i++) {
                Players[i].cash = parseInt(userInput);
                Players[i].wealth = parseInt(userInput);
            }
        }
    }

    $container = $("<div>").attr("id", "monopoly")
    $ul = $("<ul>");
    const theme = type == 'Anime' ? Anime : HarryPotter;

    // Initiate play board
    for (var i = 0; i < theme.length; i++) {
        if (i == 0) {
            $li = $("<li>").attr({ 'style': 'background-image:url(' + theme[i].picture + ');', "id": "start" });
        }
        $li = $("<li>").attr({ 'style': 'background-image:url(' + theme[i].picture + ');', "id": i });
        if (Players[0].ownedProperties.filter(op => op == i).length > 0) {
            $li.addClass('owned1');
        } else if (Players[1].ownedProperties.filter(op => op == i).length > 0) {
            
            $li.addClass('owned2');
        }
        $PlayerContainer = $("<div>").attr("class", "player-container");
        $tileHeader = $("<div>").attr("class", "tile-header").html(theme[i].Name);
        $tileCost = $("<div>").attr("class", "tile-cost").html(theme[i].cost + "$");

        if (i == 0) {
            $li.append($PlayerContainer);
        } else {
            $li.append($tileHeader, $tileCost, $PlayerContainer);
        }
        $ul.append($li)
    }

    // initiate players


    $player1 = createPlayer(1, Players[0].position);
    $player2 = createPlayer(2, Players[1].position);
    $($ul.find('.player-container')[Players[0].position]).append($player1) 
    $($ul.find('.player-container')[Players[1].position]).append($player2) 


    $li = $("<li>");
    $divContainer = $("<div>").attr("class", "field-container");
    $div1 = $("<div>").attr("class", "field1");
    $divImg1 = $("<div>");
    $divImg2 = $("<div>");

    // initiate dice
    $dice1 = $("<img>").attr({ "src": "images3/dice1.png", "width": "55" });
    $dice2 = $("<img>").attr({ "src": "images3/dice1.png", "width": "55" });
    showDice();

    //adds the dice to the board
    function showDice() {
        $divImg1.append($dice1);
        $divImg2.append($dice2);
        $div1.append($divImg1, $divImg2);
    }

    //player info setting
    $player1info = $("<div>").attr("class", "p1info");
    $player2info = $("<div>").attr("class", "p2info");
    $P1name = $("<h2>").html(Players[0].name + ":").attr({ "class": "pName", "id": "p1name" });
    $P2name = $("<h2>").html(Players[1].name + ":").attr({ "class": "pName", "id": "p2name" });
    $P1cash = $("<h3>").html("cash: " + Players[0].cash).attr({ "class": "pCash", "id": "p1cash" });
    $P2cash = $("<h3>").html("cash: " + Players[1].cash).attr({ "class": "pCash", "id": "p2cash" });
    $P1wealth = $("<h3>").html("wealth: " + Players[0].wealth).attr({ "class": "pWealth", "id": "p1wealth" });
    $P2wealth = $("<h3>").html("wealth: " + Players[1].wealth).attr({ "class": "pWealth", "id": "p2wealth" });
    $player1info.append($P1name, $P1cash, $P1wealth);
    $player2info.append($P2name, $P2cash, $P2cash, $P2wealth);


    //add buy buttons, move players to position
    $buyBtn = $("<button type='button' class='buy-btn' disabled='true'>").text('Buy').click(function () {
        let playerObj = Players[turn - 1];
        $playerEl = turn == 1 ? $player1 : $player2
        position = $playerEl.data('currentPosition');
    
        var purchase = window.confirm(
            playerObj.name +
            ": " + theme[position].Name + " is not owned. Would you like to buy this property for " +
            theme[position].cost +
            "?");

        if (purchase) {
            if (playerObj.cash < theme[position].cost) {
                window.alert("You don't have enough money to buy this station!!")
                $buyBtn.attr('disabled', true)
                return;
            }
            playerObj.ownedProperties.push(position);
            $($ul.find('li[id=' + position + ']')).addClass('owned' + turn);
            playerObj.cash = (playerObj.cash - theme[position].cost);
            playerObj.wealth = wealthCalc(turn-1);
            $('#p' + turn + 'cash').html("cash: " + playerObj.cash);
            $('#p' + turn + 'wealth').html("wealth: " + playerObj.wealth);

            Players[turn - 1] = playerObj;
            localStorage.Players = JSON.stringify(Players);
            $buyBtn.attr('disabled', true)
            
        }


    })



    //add end game button 

    $endBtn = $("<button>").text('End Game').attr({ "type": "button", "id": "endBtn" });

    //mid-board setting
    $div2 = $("<div>").attr("class", "logo");
    if (theme == Anime) {
        $div2.append($('<img>').attr({ 'src':'images3/Anime.png', 'id':'logo'}))
    } else $div2.append($('<img>').attr({ 'src': 'images3/HarryPotter.png', 'id':'logo'}))
    $div3 = $("<div>").attr("class", "field2");
    $rollBtn = $("<button type='button' class='roll-btn'>").text('ROLL').attr({ "id": "rollBtn" });
    $div3.append($rollBtn);
    $divContainer.append($div1, $div2, $div3);
    $li.append($divContainer, $player1info, $player2info, $endBtn, $buyBtn);
    $ul.append($li);
    $container.prepend($ul);
    $("body").append($container);

    //generates random dice numbers-rolling when click on roll button
    //and positions players according to dice roll
    $rollBtn.click(rollingDice);

    function rollingDice() {
        const rolledNumber = rollDice();
        let playerObj = Players[turn - 1];
        let $playerEl = turn == 1 ? $player1 : $player2
        let nextPosition = getNextPosition($playerEl.data('currentPosition'), rolledNumber + 2);
        $($ul.find('img[id=' + $playerEl.attr('id') + ']')).remove();
        $($ul.find('.player-container')[nextPosition]).append($playerEl);
        $playerEl.data('currentPosition', nextPosition);
        $currProperty = $('ul li[id=' + nextPosition + ']')
        Players[turn - 1].position = nextPosition;
        localStorage.Players = JSON.stringify(Players);

        //localStorage['positionP' + turn] = parseInt(nextPosition);
        console.log($playerEl)
        enemy = turn === 1 ? 2 : 1;   
        if (nextPosition == 0) {
            $buyBtn.attr('disabled', true)
        } else if (playerObj.ownedProperties.filter(op => op == $currProperty.attr('id')).length > 0) {
            console.log('in here')
            $buyBtn.attr('disabled', true)
        } else if (Players[enemy - 1].ownedProperties.filter(op => op == $currProperty.attr('id')).length > 0) {
            console.log('in here')
            let commission = theme[nextPosition].cost * (10 / 100)
            Players[turn - 1].cash = (Players[turn - 1].cash - commission);
            Players[turn - 1].wealth = wealthCalc(turn - 1);
            Players[enemy - 1].cash = (Players[enemy - 1].cash + commission);
            Players[enemy - 1].wealth = wealthCalc(enemy - 1);
            $('#p' + turn + 'cash').html("cash: " + Players[turn - 1].cash);
            $('#p' + turn + 'wealth').html("wealth: " + Players[turn - 1].wealth);
            $('#p' + enemy + 'cash').html("cash: " + Players[enemy - 1].cash);
            $('#p' + enemy + 'wealth').html("wealth: " + Players[enemy - 1].wealth);

            $buyBtn.attr('disabled', true)
            localStorage.Players = JSON.stringify(Players);
        } else $buyBtn.attr('disabled', false);
        

        $rollBtn.unbind().text('END TURN').click(endTurn);
    }
    $endBtn.click(endGame)

    function endTurn() {
        $buyBtn.attr('disabled', true);
        turn = turn === 1 ? 2 : 1;
        $rollBtn.unbind().text('ROLL').click(rollingDice);
    }

    function endGame() {
        var end = window.confirm("Are you sure you want to end the game?");

        if (end) {
            if (Players[0].wealth > Players[1].wealth) {
                window.alert("The Winner Is Player1!!")
            }
            else if (Players[0].wealth < Players[1].wealth) {
                window.alert("The Winner Is Player2!!")
            }
            else { window.alert("It's a Tie!!") }

            localStorage.clear();
            location.reload();
        }
    }
   

    function getNextPosition(currentPosition, rolledNumber) {

        let nextPos = currentPosition + rolledNumber;
        return nextPos >= 20 ? nextPos - 20 : nextPos;
    }

    function rollDice() {
        var rand1 = getRandomInt();
        var rand2 = getRandomInt();

        $dice1.attr('src', Dice[rand1].src)
        $dice2.attr('src', Dice[rand2].src)
        return rand1 + rand2
    }

    function getRandomInt() {
        return Math.floor(Math.random() * Math.floor(6));
    }
    function wealthCalc(playerNum) {
        var sumOfProperty = 0;
        for (var i = 0; i < Players[playerNum].ownedProperties.length; i++) {
            var Pid = Players[playerNum].ownedProperties[i]
            sumOfProperty = sumOfProperty + theme[Pid].cost;
        }

        console.log(theme[Pid].cost)

        return Players[turn - 1].cash + sumOfProperty / 2;
    }



}