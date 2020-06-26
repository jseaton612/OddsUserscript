// ==UserScript==
// @name         Poker Odds
// @namespace    somethingintheshadows
// @version      0.4.0
// @description  Poker Odds
// @author       somethingintheshadows
// @match        https://www.zyngapoker.com/*
// @connect      githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @downloadURL  https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @grant none
// @run-at document-start
// ==/UserScript==

(function() {
    var counter = 0;
    var Game = {
        holeCards: ["14C", "14D"],
        revealedCards: [],
        plus2hand: [],
        plus2Conversion: {"C":1, "D":2, "H":3, "S":4},
        playersAtTable: 0,
        otherPlayersActive: 1,
        newRound: function(cards) {
            Game.holeCards = cards;
            Game.revealedCards = [];
            Game.otherPlayersActive = Game.playersAtTable - 1;
            Game.convertCards();
            console.log(Game.plus2Eval());
        },
        reveal: function(cards) {
            Game.revealedCards = Game.revealedCards.concat(cards);
            if (Game.holeCards.length > 0) {
                Game.convertCards();
                console.log(Game.plus2Eval());
                console.log(counter);
            }
            else {console.log(Game);}
        },
        fold: function() {
            Game.otherPlayersActive--;
            console.log(Game);
        },
        convertCards: function() {
            for (var i = 0; i < 7; i++) {
                if (i < 2) {
                    Game.plus2hand[i] = (Game.holeCards[i].slice(0, -1) - 2) * 4 + Game.plus2Conversion[Game.holeCards[i].slice(-1)];
                }
                else if (i - 2 < Game.revealedCards.length){
                    Game.plus2hand[i] = (Game.revealedCards[i - 2].slice(0, -1) - 2) * 4 + Game.plus2Conversion[Game.revealedCards[i - 2].slice(-1)];
                }
                else {
                    Game.plus2hand[i] = -1;
                }
            }
        },
        getPlus2File: function() {
            fetch("https://raw.githubusercontent.com/christophschmalhofer/poker/master/XPokerEval/XPokerEval.TwoPlusTwo/HandRanks.dat")
                .then(response => response.arrayBuffer())
                .then(function(buffer) {
                    Game.lookupTable = new Int32Array(buffer);
                    console.log("Lookup Table Aquired! (hopefully)");
                    Game.reveal(["11D", "12D"]);
                });
        },
        plus2HandEval: function(hand = Game.plus2hand) {
            if (Game.lookupTable) {counter++;return Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[53 + hand[0]] + hand[1]] + hand[2]] + hand[3]] + hand[4]] + hand[5]] + hand[6]];}
        },
        plus2Eval: function() {
            var tableCards = [];
            var winRates = [];

            if (Game.plus2hand[6] === -1) {
                for (tableCards[0] = 1; tableCards[0] <= 52; tableCards[0]++) {
                    if (Game.plus2hand.includes(tableCards[0])) {continue;}
                    console.log(tableCards[0]);
                    if (Game.plus2hand[5] > -1) {
                        if (tableCards.length < 5) {
                            tableCards = tableCards.concat(Game.plus2hand.slice(2, -1));
                        }
                        winRates.push(Game.comparePlayerCards(tableCards));
                        continue;
                    }
                    for (tableCards[1] = tableCards[0] + 1; tableCards[1] <= 52; tableCards[1]++) {
                        if (Game.plus2hand.includes(tableCards[1])) {continue;}
                        if (Game.plus2hand[4] > -1) {
                            if (tableCards.length < 5) {
                                tableCards = tableCards.concat(Game.plus2hand.slice(2, -2));
                            }
                            winRates.push(Game.comparePlayerCards(tableCards));
                            continue;
                        }
                        for (tableCards[2] = tableCards[1] + 1; tableCards[2] <= 52; tableCards[2]++) {
                            if (Game.plus2hand.includes(tableCards[2])) {continue;}
                            if (Game.plus2hand[3] > -1) {
                                if (tableCards.length < 5) {
                                    tableCards = tableCards.concat(Game.plus2hand.slice(3, -2));
                                }
                                winRates.push(Game.comparePlayerCards(tableCards));
                                continue;
                            }
                            for (tableCards[3] = tableCards[2] + 1; tableCards[3] <= 52; tableCards[3]++) {
                                if (Game.plus2hand.includes(tableCards[3])) {continue;}
                                for (tableCards[4] = tableCards[3] + 1; tableCards[4] <= 52; tableCards[4]++) {
                                    if (Game.plus2hand.includes(tableCards[4])) {continue;}
                                    winRates.push(Game.comparePlayerCards(tableCards));
                                }
                            }
                        }
                    }
                }
                return winRates.reduce((sum, cur) => sum + cur) / winRates.length;
            }
            else {return Game.comparePlayerCards();}
        },
        // Attempt Monte Carlo here
        comparePlayerCards: function(table=Game.plus2hand.slice(2), iterations=1) {
            var losses = 0;
            var remainingCards = [];

            for (let i = 1; i <= 52; i++) {if (!table.includes(i) && !Game.plus2hand.includes(i)) {remainingCards.push(i);}}

            for (var iter = 0; iter < iterations; iter++)
            {
                var possibleHoles = [];
                var cards = remainingCards.slice();
                for (let i = 0; i < Game.otherPlayersActive; i++) {
                    var randI = Math.floor(Math.random() * cards.length);
                    possibleHoles[i] = [cards.splice(randI,1)[0]];
                    randI = Math.floor(Math.random() * cards.length);
                    possibleHoles[i].push(cards.splice(randI,1)[0]);
                }
                var playerScore = Game.plus2HandEval(Game.plus2hand.slice(0,2).concat(table));
                for (let i = 0; i < possibleHoles.length; i++) {
                    if (Game.plus2HandEval(possibleHoles[i].concat(table)) > playerScore) {
                        losses++;
                        break;
                    }
                }
            }
            return (iterations - losses) / iterations;
        }
    };

    Game.getPlus2File();
    var OrigWebSocket = window.WebSocket;
    var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
    var wsAddListener = OrigWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);
    window.WebSocket = function WebSocket(url, protocols) {
        var ws;
        if (!(this instanceof WebSocket)) {
            // Called without 'new' (browsers will throw an error).
            ws = callWebSocket(this, arguments);
        } else if (arguments.length === 1) {
            ws = new OrigWebSocket(url);
        } else if (arguments.length >= 2) {
            ws = new OrigWebSocket(url, protocols);
        } else { // No arguments (browsers will throw an error)
            ws = new OrigWebSocket();
        }

        wsAddListener(ws, "message", function(event) {
            if (event.data.includes("dealHoles") && event.data.includes(".0")) {
                let holes = /%[\d-]+%\d\.0%(\d+)%(\d+)%(\d+)%(\d+)%\d+%\d+%\d+%\d+%/.exec(event.data);
                for (let i = 2; i < holes.length; i += 2) {
                    switch (parseInt(holes[i])) {
                    case 0:
                        holes[i-1] += "D";
                        break;
                    case 1:
                        holes[i-1] += "H";
                        break;
                    case 2:
                        holes[i-1] += "S";
                        break;
                    case 3:
                        holes[i-1] += "C";
                        break;
                    }
                }
                Game.newRound([holes[1], holes[3]]);
            } else if (event.data.includes("flop")) {
                let cards = /\d%(\d+)%(\d)%(\d+)%(\d)%(\d+)%(\d)%/.exec(event.data);
                for (let i = 2; i < cards.length; i += 2) {
                    switch (parseInt(cards[i])) {
                    case 0:
                        cards[i-1] += "D";
                        break;
                    case 1:
                        cards[i-1] += "H";
                        break;
                    case 2:
                        cards[i-1] += "S";
                        break;
                    case 3:
                        cards[i-1] += "C";
                        break;
                    }
                }
                Game.reveal([cards[1], cards[3], cards[5]]);
            } else if (event.data.includes("street") || event.data.includes("river")) {
                let card = /\d%(\d+)%(\d)%/.exec(event.data);
                switch (parseInt(card[2])) {
                case 0:
                    card[1] += "D";
                    break;
                case 1:
                    card[1] += "H";
                    break;
                case 2:
                    card[1] += "S";
                    break;
                case 3:
                    card[1] += "C";
                    break;
                }
                Game.reveal(card[1]);
            } else if (event.data.includes("sitsFilled")) {
                Game.playersAtTable = parseInt(/CDATA\[(\d)/.exec(event.data)[1]);
            } else if (event.data.includes("tableState")) {
                Game.playersAtTable = event.data.match(/"fn"/g).length;
            } else if (event.data.includes("fold")) {
                Game.fold();
            } //else {console.log(event.data);}
        });
        return ws;
    }.bind();
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    var wsSend = OrigWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OrigWebSocket.prototype.send = function(data) {
        // TODO: Do something with the sent data if you wish.
        return wsSend(this, arguments);
    };
})();
