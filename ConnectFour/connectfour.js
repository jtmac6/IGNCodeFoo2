// JavaScript Document


window.ConnectFour = window.ConnectFour || {};

ConnectFour.Board = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];

ConnectFour.TurnCounter = 1;
ConnectFour.HelpButtonClicked = false;
ConnectFour.HelpStage = 0; //0=Click New Game, 1=Choose Game Mode, 2=Explanantion
ConnectFour.GameMode = 0; //0=Init Config, 1 = Human vs. CPU, 2 = Human vs. Human

												
ConnectFour.DropChip = function(col, player, board){
	var ChipDropped = false;
	var row = 5;
	while(!ChipDropped && row>-1){
		
		if(ConnectFour.Board[row][col]==0){
			
			ConnectFour.Board[row][col] = player;
			ChipDropped=true;
			ConnectFour.DropAnimation(player, row, col);
			var space = [row,col];
			return space;
		}else{row--;}
	}
};

ConnectFour.DropAnimation = function (player, row, col) {
	
	if(player==1){
		
		var Link = $('div#blackchips > a').eq(col);
		var Chip = $('img.chip',Link);
		var ChipPosition = $(Chip).offset();
		var Clone = $('div#templates img.blackchip').clone();
		$('div#boardchips').append(Clone);
		$(Clone).css({top: ChipPosition.top, left: ChipPosition.left});
		$('#blackchips').css("visibility","hidden");
		
		//calculate animation distance
		var pos = 100*row+116;

		$('div#boardchips img:last').animate({top: "+="+pos+"px"}, function(){
			
			if(ConnectFour.IsWinner(player,ConnectFour.Board)){
				
				if(ConnectFour.GameMode==2){alert("Player 1 Wins!");}else{alert("You Win!");}
				
			}else{
				if(ConnectFour.TurnCounter==42){alert("It's a draw.");}
				else{ConnectFour.NextTurn(player);}
			}
			
		});
		
	}else{
		var Link = $('div#redchips > a').eq(col);
		var Chip = $('img.chip',Link);
		var ChipPosition = $(Chip).offset();		
		var Clone = $('div#templates img.redchip').clone();
		$('div#boardchips').append(Clone);
		$(Clone).css({top: ChipPosition.top, left: ChipPosition.left});
		$('#redchips').css("visibility","hidden");
		
		//calculate animation distance
		var pos = 100*row+116;
		
		$('div#boardchips img:last').animate({top: "+="+pos+"px"},function(){
			
			if(ConnectFour.IsWinner(player,ConnectFour.Board)){
				if(ConnectFour.GameMode==2){alert("Player 2 Wins!");}else{alert("Computer Wins.");}
			}else{
				if(ConnectFour.TurnCounter==42){alert("It's a draw.");}
				else{ConnectFour.NextTurn(player);}
				
			}
			
		});
	}

};

ConnectFour.NextTurn = function (currentplayer) {
	
		ConnectFour.TurnCounter++;
		if(currentplayer == 1){
			
			$('#blackchips').css("visibility","hidden");
			$('#redchips').css("visibility","visible");
			$('p.gamemsg').hide();
			$('p.gamemsg').eq(1).show();
			
			if(ConnectFour.GameMode == 1){
				ConnectFour.CPUMove(ConnectFour.Board);	
			}	
			
		}else{
			$('#redchips').css("visibility","hidden");
			$('#blackchips').css("visibility","visible");
			$('p.gamemsg').hide();
			$('p.gamemsg').eq(0).show();
		}
};

ConnectFour.PossibleMoves = function (board){
	
	var movelist = [];
	for(var col=0; col<7; col++){
		for(var row=board.length-1;row>-1; row--){
			if(board[row][col]==0){var move = {r:row, c:col}; movelist.push(move);break;}	
		}
	}
	return movelist;
};

ConnectFour.CheckForCPUWin = function (board, move) {
	
	var tempboard = $.extend(true, [], board);
	tempboard[move.r][move.c]=2;
	if(ConnectFour.IsWinner(2,tempboard)){
		return true;
	}	
	return false;
};

ConnectFour.CheckForOpponentWin = function (board, move) {
	
	var tempboard = $.extend(true, [], board);
	tempboard[move.r][move.c]=1;
	if(ConnectFour.IsWinner(1,tempboard)){
		return true;
	}	
	return false;
};

ConnectFour.CPUMove = function(board){

	//Easy - Random
	//Medium - Random + Block Opponent
	//Hard -  Block Opponent + Best Solution
	//Unbeatable - Always Wins

	//Find Best Move
	//Execute a click on the appropriate image	
	
	var movelist = ConnectFour.PossibleMoves(ConnectFour.Board);
	for(var i = 0; i<movelist.length; i++){
		var move = movelist[i];
		if(ConnectFour.CheckForCPUWin(ConnectFour.Board, move)){
			$('div#redchips a').eq(move.c).trigger('click'); 
			return;
		}	
		if(ConnectFour.CheckForOpponentWin(ConnectFour.Board, move)){
			$('div#redchips a').eq(move.c).trigger('click'); 
			return;
		}	
	}
	if(board[5][3]==0){$('div#redchips a').eq(3).trigger('click');}
	else{
		var randomnumber = Math.floor(Math.random()*movelist.length);
		$('div#redchips a').eq(movelist[randomnumber].c).trigger('click');
	}
};


/*
	8 Direction Win Checking Functions
*/

ConnectFour.CheckUp = function(row, col, board){
	
	if( board[row][col] !=0
		&& board[row][col]==board[row-1][col]
		&& board[row][col]==board[row-2][col]
		&& board[row][col]==board[row-3][col]
		){return true;}else{return false;}
	};
ConnectFour.CheckDown = function (row, col, board) {
	
		if(board[row][col] !=0
		&&board[row][col]==board[row+1][col]
		&& board[row][col]==board[row+2][col]
		&& board[row][col]==board[row+3][col] 
		){return true;}else{return false;}
	
	};
ConnectFour.CheckRight = function (row, col, board) {
	
		if(board[row][col] !=0
		&& board[row][col]==board[row][col+1]
		&& board[row][col]==board[row][col+2]
		&& board[row][col]==board[row][col+3]
		){return true;}else{return false;}
	
	};
ConnectFour.CheckLeft  = function (row, col, board) {
	
		if(board[row][col] !=0
		&& board[row][col]==board[row][col-1]
		&& board[row][col]==board[row][col-2]
		&& board[row][col]==board[row][col-3]
		){return true;}else{return false;}
	
	};
	
ConnectFour.CheckULDiagonal = function (row, col, board) {
	
		if(board[row][col] !=0
		&& board[row][col]==board[row-1][col-1]
		&& board[row][col]==board[row-2][col-2]
		&& board[row][col]==board[row-3][col-3]
		){return true;}else{return false;}
	
	};
ConnectFour.CheckURDiagonal = function (row, col, board){
	
		if(board[row][col] !=0
		&& board[row][col]==board[row-1][col+1]
		&& board[row][col]==board[row-2][col+2]
		&& board[row][col]==board[row-3][col+3]
		){return true;}else{return false;}
	
	};
ConnectFour.CheckDLDiagonal = function (row, col, board){
	
		if(board[row][col] !=0
		&& board[row][col]==board[row+1][col-1]
		&& board[row][col]==board[row+2][col-2]
		&& board[row][col]==board[row+3][col-3]
		){return true;}else{return false;}
	
	};
ConnectFour.CheckDRDiagonal = function (row, col, board){
	
		if(board[row][col] !=0
		&& board[row][col]==board[row+1][col+1]
		&& board[row][col]==board[row+2][col+2]
		&& board[row][col]==board[row+3][col+3]
		){return true;}else{return false;}
	};

ConnectFour.IsWinner = function (player, board) {

	//Search the board for the player's chip, when a chip is found check for solutions
	for(var row=0; row<board.length; row++){
		
		for(var col=0; col<board[row].length; col++){
			
			if( board[row][col] == player){
			
				if(col+3<=6){
					//check if the three space to the right are the same as player
					if(ConnectFour.CheckRight(row,col,board)){return true;}
					if(row + 3 <= 5){
						//check the three spaces downward
						if(ConnectFour.CheckDown(row,col,board)){return true;}
						//check the three spaces on the downward right diagonal
						if(ConnectFour.CheckDRDiagonal(row,col,board)){return true;}
					}
					if(row - 3 >= 0 ){
						//check the three spaces upward
						if(ConnectFour.CheckUp(row,col, board)){return true;}
						//check the three spaces on the upward right diagonal
						if(ConnectFour.CheckURDiagonal(row,col,board)){return true;}
					}		
				}
				
				if(col-3>=0){
					//check if the three space to the left are the same as currentspace
					if(ConnectFour.CheckLeft(row,col,board)){return true;}
					if(row + 3 <= 5){
						//check the three spaces downward
						if(ConnectFour.CheckDown(row,col,board)){return true;}
						//check the three spaces on the downward left diagonal
						if(ConnectFour.CheckDLDiagonal(row,col,board)){return true;}
					}
					if(row - 3 >= 0 ){
						//check the three spaces upward
						if(ConnectFour.CheckUp(row,col,board)){return true;}
						//check the three spaces on the upward left diagonal
						if(ConnectFour.CheckULDiagonal(row,col,board)){return true;}
					}
				}
			
			}

		}//End col for loop	
	}//End row for loop	
	
};

ConnectFour.ResetBoard = function () {
	
	ConnectFour.Board = [[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0]];	 
};


ConnectFour.ChooseFirstPlayer = function () {
	
	var randomnumber = Math.floor(Math.random()*101)
	
	if(randomnumber>50){
		$('#blackchips').css("visibility","visible");
	}
	else{
		
		$('#redchips').css("visibility","visible");
		if(ConnectFour.GameMode==1){
			
			ConnectFour.CPUMove(ConnectFour.Board);
		}
	}	
};

ConnectFour.HideInvalidSlots = function () {

	for(var col=0;col<ConnectFour.Board[0].length;col++){
		
		if(ConnectFour.Board[0][col]!=0){
			$('#blackchips a').eq(col).css("visibility","visible");
			$('#redchips a').eq(col).css("visibility","visible");
		}
	}
};

ConnectFour.StartNewGame = function (mode) {
	
	ConnectFour.TurnCounter=1;
	if(mode==1){
		ConnectFour.GameMode=1;
		/*if(ConnectFour.HelpButtonClicked){
			$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
			ConnectFour.HelpStage++;
			$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
		}*/
	}
	else{
		ConnectFour.GameMode=2;
		/*if(ConnectFour.HelpButtonClicked){
	
			$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
			ConnectFour.HelpStage+2;
			$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
		}*/
	}
	
	$('#gamemodes').hide();
	/*if(ConnectFour.HelpButtonClicked){$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");}*/
	$('#blackchips').css("visibility","hidden");
	$('#redchips').css("visibility","hidden");
	ConnectFour.ResetBoard();
	$('#boardchips').empty();
	ConnectFour.ChooseFirstPlayer();
	
};

/*ConnectFour.DisplayHelp = function (){
	
	ConnectFour.HelpButtonClicked=true;
	$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
};*/

ConnectFour.DisplayGameModes = function () {

	$('#gamemodes').toggle();
	/*if(ConnectFour.HelpButtonClicked){
	
		$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
		ConnectFour.HelpStage++;
		$('div#helpdiv p').eq(ConnectFour.HelpStage).toggle("slow");
	}*/
	
};








