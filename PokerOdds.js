// ==UserScript==
// @name         Poker Odds
// @namespace    somethingintheshadows
// @version      0.3.6
// @description  Poker Odds
// @author       somethingintheshadows
// @match        https://www.zyngapoker.com/*
// @connect      githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @downloadURL  https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @run-at document-start
// ==/UserScript==

(function() {
    var Game = {
        holeCards: [],
        revealedCards: [],
        plus2hand: [],
        plus2Conversion: {"C":1, "D":2, "H":3, "S":4},
        playersAtTable: 0,
        playersActive: 0,
        newRound: function(cards) {
            Game.holeCards = cards;
            Game.revealedCards = [];
            Game.playersActive = Game.playersAtTable;
            Game.convertCards();
            console.log(Game);
        },
        reveal: function(cards) {
            Game.revealedCards = Game.revealedCards.concat(cards);
            if (Game.holeCards.length > 0) {Game.convertCards();}
            if (Game.plus2hand.length === 7) {console.log(Game.plus2HandEval());}
            console.log(Game);
        },
        fold: function() {
            Game.playersActive--;
            console.log(Game);
        },
        convertCards: function() {
            for (var i = 0; i < 7; i++) {
                if (i < 2) {
                    Game.plus2hand[i] = (Game.holeCards[i] - 2) * 4 + Game.plus2Conversion[Game.holeCards[i].slice(-1)];
                }
                else if (i - 2 < Game.revealedCards.length){
                    Game.plus2hand[i] = (Game.revealedCards[i - 2]) * 4 + Game.plus2Conversion[Game.revealedCards[i - 2].slice(-1)];
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
                var holes = /%[\d-]+%\d\.0%(\d+)%(\d+)%(\d+)%(\d+)%\d+%\d+%\d+%\d+%/.exec(event.data);
                for (var i = 2; i < holes.length; i += 2) {
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
                var cards = /\d%(\d+)%(\d)%(\d+)%(\d)%(\d+)%(\d)%/.exec(event.data);
                for (var i = 2; i < cards.length; i += 2) {
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
                var card = /\d%(\d+)%(\d)%/.exec(event.data);
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
            } else {console.log(event.data);}
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
