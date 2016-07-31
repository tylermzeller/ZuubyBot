var Chess = require('chess.js').Chess;
var stockfish = require('stockfish');

var playMove = function(fen, move, callback) {
	var chess = new Chess(fen); // init board state

	var validMove = chess.move(move); // play the player's move

	if (!validMove) {
		console.log('Invalid move by player. ' + move);
		callback('Invalid move. All moves must be in SAN notation. Read more about SAN here: ');
		return;
	}

	// pass new board state to engine
	var newFen = chess.fen();
	getEngineMove(newFen, function(engineMove){
		var validEngineMove = chess.move(engineMove, {sloppy: true});
		if (!validEngineMove){
			console.log('Invalid move by engine. ' + engineMove);
			callback('Whoops! Looks like I made a mistake! Try again.');
			return;
		}
		callback(null, chess.fen(), validEngineMove.san, chess.ascii());
	});
};

function send(engine, str)
{
    engine.postMessage(str);
}

function getEngineMove(fen, callback) {
	var engine = stockfish();
	var position = "fen " + fen;
	var got_uci = false;
	//var started_thinking;
	var best_move;

	send(engine, 'uci');

	engine.onmessage = function (line) {
	    var match;	    
	    if (typeof line !== "string") {
	        console.log("Got line:");
	        console.log(typeof line);
	        console.log(line);
	        return;
	    }
	    
	    if (!got_uci && line === "uciok") {
	        got_uci = true;
            send(engine, "position " + position);
            // send("eval");
            // send("d")
	        
	        send(engine, "go depth 10");
	    } else if (line.indexOf("info depth") > -1) {
	        console.log("Thinking...");
	    } else if (line.indexOf("bestmove") > -1) {
	        match = line.match(/bestmove\s+(\S+)/);
	        if (match) {
	            best_move = match[1];
	            console.log("Best move " + best_move);
	            callback(best_move);
	        }
	    }
	};
}

module.exports = {
	playMove: playMove
};