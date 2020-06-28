// ==UserScript==
// @name         Poker Odds
// @namespace    somethingintheshadows
// @version      1.1.0
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
        holeWinChance: [{
            "AK": ["67.0", "50.7", "41.4", "35.4", "31.1", "27.7", "25.0", "22.7"],
            "AQ": ["66.1", "49.4", "39.9", "33.7", "29.4", "26.0", "23.3", "21.1"],
            "AJ": ["65.4", "48.2", "38.5", "32.2", "27.8", "24.5", "22.0", "19.9"],
            "AT": ["64.7", "47.1", "37.2", "31.0", "26.7", "23.5", "21.0", "18.9"],
            "A9": ["63.0", "44.8", "34.6", "28.4", "24.2", "21.1", "18.8", "16.9"],
            "A8": ["62.1", "43.7", "33.6", "27.4", "23.3", "20.3", "18.0", "16.2"],
            "A7": ["61.1", "42.6", "32.6", "26.5", "22.5", "19.6", "17.4", "15.7"],
            "A6": ["60.0", "41.3", "31.4", "25.6", "21.7", "19.0", "16.9", "15.3"],
            "A5": ["59.9", "41.4", "31.8", "26.0", "22.2", "19.6", "17.5", "15.9"],
            "A4": ["58.9", "40.4", "30.9", "25.3", "21.6", "19.0", "17.0", "15.5"],
            "A3": ["58.0", "39.4", "30.0", "24.6", "21.0", "18.5", "16.6", "15.1"],
            "A2": ["57.0", "38.5", "29.2", "23.9", "20.4", "18.0", "16.1", "14.6"],
            "KQ": ["63.4", "47.1", "38.2", "32.5", "28.3", "25.1", "22.5", "20.4"],
            "KJ": ["62.6", "45.9", "36.8", "31.1", "26.9", "23.8", "21.3", "19.3"],
            "KT": ["61.9", "44.9", "35.7", "29.9", "25.8", "22.8", "20.4", "18.5"],
            "K9": ["60.0", "42.4", "32.9", "27.2", "23.2", "20.3", "18.1", "16.3"],
            "K8": ["58.5", "40.2", "30.8", "25.1", "21.3", "18.6", "16.5", "14.8"],
            "K7": ["57.8", "39.4", "30.1", "24.5", "20.8", "18.1", "16.0", "14.5"],
            "K6": ["56.8", "38.4", "29.1", "23.7", "20.1", "17.5", "15.6", "14.0"],
            "K5": ["55.8", "37.4", "28.2", "23.0", "19.5", "17.0", "15.2", "13.7"],
            "K4": ["54.7", "36.4", "27.4", "22.3", "19.0", "16.6", "14.8", "13.4"],
            "K3": ["53.8", "35.5", "26.7", "21.7", "18.4", "16.2", "14.5", "13.1"],
            "K2": ["52.9", "34.6", "26.0", "21.2", "18.1", "15.9", "14.3", "13.0"],
            "QJ": ["60.3", "44.1", "35.6", "30.1", "26.1", "23.0", "20.7", "18.7"],
            "QT": ["59.5", "43.1", "34.6", "29.1", "25.2", "22.3", "19.9", "18.1"],
            "Q9": ["57.9", "40.7", "31.9", "26.4", "22.5", "19.7", "17.6", "15.9"],
            "Q8": ["56.2", "38.6", "29.7", "24.4", "20.7", "18.0", "16.0", "14.4"],
            
        },
        {
            "AA": ["85.3", "73.4", "63.9", "55.9", "49.2", "43.6", "38.8", "34.7"],
            "AK": ["65.4", "48.2", "38.6", "32.4", "27.9", "24.4", "21.6", "19.2"],
            "AQ": ["64.5", "46.8", "36.9", "30.4", "25.9", "22.5", "19.7", "17.5"],
            "AJ": ["63.6", "45.6", "35.4", "28.9", "24.4", "21.0", "18.3", "16.1"],
            "AT": ["62.9", "44.4", "34.1", "27.6", "23.1", "19.8", "17.2", "15.1"],
            "A9": ["60.9", "41.8", "31.2", "24.7", "20.3", "17.1", "14.7", "12.8"],
            "A8": ["60.1", "40.8", "30.1", "23.7", "19.4", "16.2", "13.9", "12.0"],
            "A7": ["59.1", "39.4", "28.9", "22.6", "18.4", "15.4", "13.2", "11.4"],
            "A6": ["57.8", "38.0", "27.6", "21.5", "17.5", "14.7", "12.6", "10.9"],
            "A5": ["57.7", "38.2", "27.9", "22.0", "18.0", "15.2", "13.1", "11.5"],
            "A4": ["56.4", "36.9", "26.9", "21.1", "17.3", "14.7", "12.6", "11.0"],
            "A3": ["55.6", "35.9", "26.1", "20.4", "16.7", "14.2", "12.2", "10.7"],
            "A2": ["54.6", "35.0", "25.2", "19.6", "16.1", "13.6", "11.7", "10.2"],
            "KK": ["82.4", "68.9", "58.2", "49.8", "43.0", "37.5", "32.9", "29.2"],
            "KQ": ["61.4", "44.4", "35.2", "29.3", "25.1", "21.8", "19.1", "16.9"],
            "KJ": ["60.6", "43.1", "33.6", "27.6", "23.5", "20.2", "17.7", "15.6"],
            "KT": ["59.9", "42.0", "32.5", "26.5", "22.3", "19.2", "16.7", "14.7"],
            "K9": ["58.0", "39.5", "29.6", "23.6", "19.5", "16.5", "14.1", "12.3"],
            "K8": ["56.3", "37.2", "27.3", "21.4", "17.4", "14.6", "12.5", "10.8"],
            "K7": ["55.4", "36.1", "26.3", "20.5", "16.7", "13.9", "11.8", "10.2"],
            "K6": ["54.3", "35.0", "25.3", "19.7", "16.0", "13.3", "11.3", "9.8"],
            "K5": ["53.3", "34.0", "24.5", "19.0", "15.4", "12.9", "11.0", "9.5"],
            "K4": ["52.1", "32.8", "23.4", "18.1", "14.7", "12.3", "10.5", "9.1"],
            "K3": ["51.2", "31.9", "22.7", "17.6", "14.2", "11.9", "10.2", "8.9"],
            "K2": ["50.2", "30.9", "21.8", "16.9", "13.7", "11.5", "9.8", "8.6"],
            "QQ": ["79.9", "64.9", "53.5", "44.7", "37.9", "32.5", "28.3", "24.9"],
            "QJ": ["58.2", "41.4", "32.6", "26.9", "22.9", "19.8", "17.3", "15.3"],
            "QT": ["57.4", "40.2", "31.3", "25.7", "21.6", "18.6", "16.3", "14.4"],
            "Q9": ["55.5", "37.6", "28.5", "22.9", "19.0", "16.1", "13.8", "12.1"],
            "Q8": ["53.8", "35.4", "26.2", "20.6", "16.9", "14.1", "12.1", "10.5"],
            "Q7": ["51.9", "33.2", "24.0", "18.6", "15.1", "12.5", "10.6", "9.2"],
            "Q6": ["51.1", "32.3", "23.2", "17.9", "14.4", "12.0", "10.1", "8.8"],
            "Q5": ["50.2", "31.3", "22.3", "17.3", "13.9", "11.6", "9.8", "8.5"],
            "Q4": ["49.0", "30.2", "21.4", "16.4", "13.3", "11.0", "9.4", "8.1"],
            "Q3": ["47.9", "29.2", "20.7", "15.9", "12.8", "10.7", "9.1", "7.9"],
            "Q2": ["47.0", "28.4", "19.9", "15.3", "12.3", "10.3", "8.8", "7.7"],
            "JJ": ["77.5", "61.2", "49.2", "40.3", "33.6", "28.5", "24.6", "21.6"],
            "JT": ["55.4", "39.0", "30.7", "25.3", "21.5", "18.6", "16.3", "14.5"],
            "J9": ["53.4", "36.5", "27.9", "22.5", "18.7", "15.9", "13.8", "12.1"],
            "J8": ["51.7", "34.2", "25.6", "20.4", "16.8", "14.1", "12.2", "10.7"],
            "J7": ["49.9", "32.1", "23.5", "18.3", "14.9", "12.4", "10.6", "9.2"],
            "J6": ["47.9", "29.8", "21.4", "16.5", "13.2", "11.0", "9.3", "8.0"],
            "J5": ["47.1", "29.1", "20.7", "15.9", "12.8", "10.6", "8.9", "7.7"],
            "J4": ["46.1", "28.1", "19.9", "15.3", "12.3", "10.2", "8.6", "7.5"],
            "J3": ["45.0", "27.1", "19.1", "14.6", "11.7", "9.8", "8.3", "7.2"],
            "J2": ["44.0", "26.2", "18.4", "14.1", "11.3", "9.4", "8.0", "7.0"],
            "TT": ["75.1", "57.7", "45.2", "36.4", "30.0", "25.3", "21.8", "19.2"],
            "T9": ["51.7", "35.7", "27.7", "22.5", "18.9", "16.2", "14.1", "12.6"],
            "T8": ["50.0", "33.6", "25.4", "20.4", "16.9", "14.4", "12.5", "11.0"],
            "T7": ["48.2", "31.4", "23.4", "18.4", "15.1", "12.8", "11.0", "9.7"],
            "T6": ["46.3", "29.2", "21.2", "16.5", "13.4", "11.2", "9.5", "8.3"],
            "T5": ["44.2", "27.1", "19.3", "14.8", "11.9", "9.9", "8.4", "7.2"],
            "T4": ["43.4", "26.4", "18.7", "14.3", "11.5", "9.5", "8.1", "7.0"],
            "T3": ["42.4", "25.5", "18.0", "13.7", "11.0", "9.1", "7.8", "6.8"],
            "T2": ["41.5", "24.7", "17.3", "13.2", "10.6", "8.8", "7.5", "6.6"],
            "99": ["72.1", "53.5", "41.1", "32.6", "26.6", "22.4", "19.4", "17.2"],
            "98": ["48.4", "32.9", "25.1", "20.1", "16.6", "14.2", "12.3", "10.9"],
            "97": ["46.7", "30.9", "23.1", "18.4", "15.1", "12.8", "11.1", "9.8"],
            "96": ["44.9", "28.8", "21.2", "16.6", "13.5", "11.4", "9.8", "8.7"],
            "95": ["42.9", "26.7", "19.2", "14.8", "12.0", "10.0", "8.5", "7.4"],
            "94": ["40.7", "24.6", "17.3", "13.2", "10.5", "8.7", "7.3", "6.4"],
            "93": ["39.9", "23.9", "16.7", "12.7", "10.1", "8.3", "7.1", "6.1"],
            "92": ["38.9", "22.9", "16.0", "12.1", "9.6", "8.0", "6.8", "5.9"],
            "88": ["69.1", "49.9", "37.5", "29.4", "24.0", "20.3", "17.7", "15.8"],
            "87": ["45.5", "30.6", "23.2", "18.5", "15.4", "13.1", "11.5", "10.3"],
            "86": ["43.6", "28.6", "21.3", "16.9", "13.9", "11.8", "10.4", "9.2"],
            "85": ["41.7", "26.5", "19.4", "15.2", "12.4", "10.5", "9.1", "8.1"],
            "84": ["39.6", "24.4", "17.5", "13.4", "10.8", "9.0", "7.8", "6.8"],
            "83": ["37.5", "22.4", "15.7", "11.9", "9.5", "7.9", "6.7", "5.8"],
            "82": ["36.8", "21.7", "15.1", "11.4", "9.1", "7.5", "6.4", "5.6"],
            "77": ["66.2", "46.4", "34.4", "26.8", "21.9", "18.6", "16.4", "14.8"],
            "76": ["42.7", "28.5", "21.5", "17.1", "14.2", "12.2", "10.8", "9.6"],
            "75": ["40.8", "26.5", "19.7", "15.5", "12.8", "11.0", "9.7", "8.7"],
            "74": ["38.6", "24.5", "17.9", "13.9", "11.4", "9.7", "8.5", "7.6"],
            "73": ["36.6", "22.4", "16.0", "12.3", "9.9", "8.4", "7.2", "6.4"],
            "72": ["34.6", "20.4", "14.2", "10.7", "8.6", "7.2", "6.1", "5.4"],
            "66": ["63.3", "43.2", "31.5", "24.5", "20.1", "17.3", "15.4", "14.0"],
            "65": ["40.1", "26.7", "20.0", "15.9", "13.3", "11.5", "10.2", "9.2"],
            "64": ["38.0", "24.7", "18.2", "14.4", "12.0", "10.3", "9.2", "8.3"],
            "63": ["35.9", "22.7", "16.4", "12.8", "10.6", "9.1", "8.0", "7.2"],
            "62": ["34.0", "20.7", "14.6", "11.2", "9.1", "7.8", "6.8", "6.0"],
            "55": ["60.3", "40.1", "28.8", "22.4", "18.5", "16.0", "14.4", "13.2"],
            "54": ["37.9", "25.2", "18.8", "15.0", "12.6", "11.0", "9.8", "8.9"],
            "53": ["35.8", "23.3", "17.1", "13.6", "11.4", "9.9", "8.8", "8.0"],
            "52": ["33.9", "21.3", "15.3", "12.0", "10.0", "8.6", "7.6", "6.8"],
            "44": ["57.0", "36.8", "26.3", "20.6", "17.3", "15.2", "13.9", "12.9"],
            "43": ["34.4", "22.3", "16.3", "12.8", "10.7", "9.3", "8.3", "7.5"],
            "42": ["32.5", "20.5", "14.7", "11.5", "9.5", "8.3", "7.3", "6.6"],
            "33": ["53.7", "33.5", "23.9", "19.0", "16.2", "14.6", "13.5", "12.6"],
            "32": ["31.2", "19.5", "13.9", "10.8", "8.9", "7.7", "6.8", "6.1"],
            "22": ["50.3", "30.7", "22.0", "17.8", "15.5", "14.2", "13.3", "12.5"]
        }],
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
            if (parseInt(cards[0].splice(0,-1)) > parseInt(cards[1].splice(0,-1))) {
                let temp = cards[0];
                cards[0] = cards[1];
                cards[1] = temp;
            }
            if (cards[0].slice(-1) === cards[1].slice(-1)) {console.log(Game.holeWinChance[0][cards[0].slice(0, -1) + cards[1].slice(0, -1)][Game.otherPlayersActive - 1]);}
            else {console.log(Game.holeWinChance[0][cards[0].slice(0, -1) + cards[1].slice(0, -1)][Game.otherPlayersActive - 1]);}
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
            if (Game.lookupTable) {return Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[Game.lookupTable[53 + hole1] + hole2] + table[2]] + table[3]] + table[4]] + table[5]] + table[6]];}
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
                        winRates.push(Game.comparePlayerCards(tableCards));
                        continue;
                    }
                    for (let card2 = card1 + 1; card2 < remainingCards.length; card2++) {
                        tableCards[3] = remainingCards[card2];
                        if (tableCards.length < 7) {
                            tableCards = tableCards.concat(Game.plus2hand.slice(2, -2));
                        }
                        winRates.push(Game.comparePlayerCards(tableCards));
                    }
                }
                return winRates.reduce((sum, cur) => sum + cur) / winRates.length;
            }
            else {return Game.comparePlayerCards();}
        },
        comparePlayerCards: function(table=Game.plus2hand) {
            var losses = 0;
            var total = 45*44/2;
            var chance = 1;
            var remainingCards = new Array(45);
            var playerScore = Game.plus2HandEval(table);

            let index = 0;
            for (let i = 1; i <= 52; i++) {if (!table.includes(i)) {remainingCards[index++] = i;}}

            for (let i = 0; i < remainingCards.length; i++) {
                for(let j = i + 1; j < remainingCards.length; j++) {
                    if (Game.plus2HandEval2(remainingCards[i], remainingCards[j], table.slice()) > playerScore) {
                        losses++;
                    }
                }
            }
            //Ties don't exist
            var wins = total - losses;

            // Close enough
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
