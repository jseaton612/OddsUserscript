// ==UserScript==
// @name         Poker Odds
// @namespace    somethingintheshadows
// @version      1.0.0
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
    var Game = {
        holeCards: [],
        revealedCards: [],
        plus2hand: [],
        plus2Conversion: {"C":1, "D":2, "H":3, "S":4},
        playersAtTable: 0,
        otherPlayersActive: 0,
        newRound: function(cards) {
            Game.holeCards = cards;
            Game.revealedCards = [];
            Game.otherPlayersActive = Game.playersAtTable - 1;
            Game.convertCards();
            console.log(Math.round(100*Game.plus2Eval()));
        },
        reveal: function(cards) {
            Game.revealedCards = Game.revealedCards.concat(cards);
            if (Game.holeCards.length > 0) {
                Game.convertCards();
                console.log(Math.round(100*Game.plus2Eval()));
            }
        },
        fold: function() {
            Game.otherPlayersActive--;
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
                });
        },
        plus2HandEval: function(hand) {
            if (Game.lookupTable) {return Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[53 + hand[0]] + hand[1]] + hand[2]] + hand[3]] + hand[4]] + hand[5]] + hand[6]];}
        },
        plus2HandEval2: function(hole1, hole2, table) {
            if (Game.lookupTable) {return Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[53 + hole1] + hole2] + table[0]] + table[1]] + table[2]] + table[3]] + table[4]];}
        },
        plus2Eval: function() {
            var tableCards = Game.plus2hand.slice(0,2);
            var winRates = [];
            var remainingCards = [];
            for (let i = 1; i <= 52; i++) {if (!Game.plus2hand.includes(i)) {remainingCards.push(i);}}

            if (Game.plus2hand[6] === -1) {
                for (let card1 = 0; card1 < remainingCards.length; card1++) {
                    tableCards[2] = remainingCards[card1];
                    if (Game.plus2hand[5] > -1) {
                        if (tableCards.length < 7) {
                            tableCards = tableCards.concat(Game.plus2hand.slice(2, -1));
                        }
                        winRates.push(Game.compareAllPlayerCards(tableCards));
                        continue;
                    }
                    for (let card2 = card1 + 1; card2 < remainingCards.length; card2++) {
                        tableCards[3] = remainingCards[card2];
                        if (Game.plus2hand[4] > -1) {
                            if (tableCards.length < 7) {
                                tableCards = tableCards.concat(Game.plus2hand.slice(2, -2));
                            }
                            winRates.push(Game.compareAllPlayerCards(tableCards));
                            continue;
                        }
                        for (let card3 = card2 + 1; card3 < remainingCards.length; card3++) {
                            tableCards[4] = remainingCards[card3];
                            for (let card4 = card3 + 1; card4 < remainingCards.length; card4++) {
                                tableCards[5] = remainingCards[card4];
                                for (let card5 = card4 + 1; card5 < remainingCards.length; card5++) {
                                    tableCards[6] = remainingCards[card5];
                                    winRates.push(Game.comparePlayerCards(tableCards));
                                }
                            }
                        }
                    }
                }
                return winRates.reduce((sum, cur) => sum + cur) / winRates.length;
            }
            else {return Game.compareAllPlayerCards();}
        },
        // Attempt Monte Carlo here
        comparePlayerCards: function(table=Game.plus2hand, iterations=1) {
            var losses = 0;
            var remainingCards = [];
            var playerScore = Game.plus2HandEval(table);

            for (let i = 1; i <= 52; i++) {if (!table.includes(i)) {remainingCards.push(i);}}

            for (var iter = 0; iter < iterations; iter++)
            {
                var possibleHoles = [];
                var cards = remainingCards.slice();
                for (let i = 0; i < Game.otherPlayersActive; i++) {
                    var randI = Math.floor(Math.random() * cards.length);
                    possibleHoles[i] = cards.splice(randI,1);
                    randI = Math.floor(Math.random() * cards.length);
                    possibleHoles[i].push(cards.splice(randI,1)[0]);
                }
                for (let i = 0; i < possibleHoles.length; i++) {
                    if (Game.plus2HandEval2(possibleHoles[i][0], possibleHoles[i][1], table.slice(2)) > playerScore) {
                        losses++;
                        break;
                    }
                }
            }
            return (iterations - losses) / iterations;
        },
        // Confirmed 100% accurate
        compareAllPlayerCards: function(table=Game.plus2hand) {
            var losses = 0;
            var total = 45*44/2
            var chance = 1;
            var remainingCards = [];
            var playerScore = Game.plus2HandEval(table);

            for (let i = 1; i <= 52; i++) {if (!table.includes(i)) {remainingCards.push(i);}}

            for (let i = 0; i < remainingCards.length; i++) {
                for(let j = i + 1; j < remainingCards.length; j++) {
                    if (Game.plus2HandEval2(remainingCards[i], remainingCards[j], table.slice(2)) > playerScore) {
                        losses++;
                    }
                }
            }
            //Ties don't exist
            var wins = total - losses

            for (let player = 0; player < Game.otherPlayersActive; player++) {
                chance *= (wins - player) / (total - player);
            }

            return chance;
        },

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
