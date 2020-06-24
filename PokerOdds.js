// ==UserScript==
// @name         Poker Odds
// @namespace    somethingintheshadows
// @version      0.1.2
// @description  Poker Odds
// @author       somethingintheshadows
// @match        https://www.zyngapoker.com/*
// @updateURL    https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @downloadURL  https://raw.githubusercontent.com/jseaton612/OddsUserscript/master/PokerOdds.js
// @grant        none
// @run-at document-start
// ==/UserScript==

(function() {
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
            if (event.data.includes("dealHoles")) {
                var holes = /%[\d-]+%([\d-]+)%([\d-]+)%([\d-]+)%([\d-]+)%([\d-]+)%[\d-]+%[\d-]+%[\d-]+%[\d-]+%/.exec(event.data);
                console.log(holes);
                console.log(event.data);
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
                console.log(cards[1] + " " + cards[3] + " " + cards[5]);
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
                console.log(card[1]);
            } else if (event.data.includes("sitsFilled")) {
                console.log(/CDATA\[(\d)/.exec(event.data)[1] + " players");
            } else if (event.data.includes("fold")) {
                console.log("Fold");
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