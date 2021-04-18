module.exports.startGame = startGame;
module.exports.makeMove = makeMove;
const miscCom = require('./MiscCommands.js');

var rows = [];
var board = [];
var boardSize = 9;


startGame();
function startGame()
{
    rows = [];
    board = [];
    for(i = 0; i < boardSize; i++)
    {
        for(j = 0; j < boardSize; j++)
        {
            rows.push(' / ');
        }
        board.push(rows);
        rows = [];
    }
}



function printBoard(board)
{
    var boardString = "";
    for(i = 0; i < boardSize; i++)
    {
        var rows = board[i];
        var t = "";
        for(j = 0; j < boardSize; j++)
        {
            t += rows[j];
        }
        boardString += t + "\n";
    }
    return "------\n"+boardString;
}

function putPiece(board, column, piece)
{

    for(i = boardSize-1; i >= 0; i = i - 1)
    {
        var row = board[i];
        var index = row[column];
        var currentPiece = getPiece(index);

        if(currentPiece == 0)
        {
            row[column] = piece;
            break;
        }
    }
}



function getPiece(currentPiece)
{
    var ret = -1;
    if(currentPiece.includes("/")) ret = 0;
    else if(currentPiece.includes(" x ")) ret = 1;
    else if(currentPiece.includes(" o ")) ret = 2;

    return ret;
}

var turn = 0;
function makeMove(mesg)
{
    var column = mesg.content.split('/tic ')[1];
    if(gameOver(board) == 0)
    {
        var piece = " x ";
        if(turn % 2 == 0)
        {
            piece = " o "
        }


        if(column >= 1 && column <= 9)
        {
            putPiece(board, (column-1), piece);
            turn++;
        }
    }

    var winner = gameOver(board);
    var w;
    if(winner == 1)
    {
        w = 'x';
    }
    else
    {
        w = 'o'
    }

    if(winner == 0)
    {
        miscCom.send(printBoard(board), mesg.channel);
    }
    else
    {
        miscCom.send(printBoard(board) + "\n\nTHE WINNER WAS: " + w, mesg.channel);
    }
}




// Possible win cases?
// connect 4 in a line
// Diagonal line, or veritcal, or horizontal
function gameOver(board)
{
    var winner = horizontalWin(board);
    if(winner == 0)
    {
        winner = verticalWin(board);
    }
    if(winner == 0)
    {
        winner = diagonalWin(board);
    }

    return winner;
}





//What is a horizontal win? How to define?
//Check a row -> If 4 pieces of the same type are in a row that is a win
function horizontalWin(board)
{

    for(i = 0; i < board.length; i++)
    {
        var row = board[i];

        for(j = 0; j < (board.length-4); j++)
        {

            var c1 = getPiece(row[j]);
            var c2 = getPiece(row[j+1]);
            var c3 = getPiece(row[j+2]);
            var c4 = getPiece(row[j+3]);

            if(c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1)
            {
                return 1;
            }
            if(c1 == 2 && c2 == 2 && c3 == 2 && c4 == 2)
            {
                return 2;
            }
        }

    }


    return 0;

}





function verticalWin(board)
{
    //i is the current row/height
    for(i = boardSize-1; i >= 3; i--)
    {
        

        //j is the current column/width
        for(j = 0; j < board.length; j++)
        {

            var row1 = board[i];
            var c1 = getPiece(row1[j]);


            var row2 = board[i-1];
            var c2 = getPiece(row2[j]);

            var row3 = board[i-2];
            var c3 = getPiece(row3[j]);

            var row4 = board[i-3];
            var c4 = getPiece(row4[j]);

            if(c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1)
            {
                return 1;
            }
            if(c1 == 2 && c2 == 2 && c3 == 2 && c4 == 2)
            {
                return 2;
            }
        }

    }


    return 0;
}





function diagonalWin(board)
{
    //i is the current row/height
    for(i = boardSize-1; i >= 3; i--)
    {
        

        //j is the current column/width
        for(j = 0; j < board.length; j++)
        {

            if(j < board.length-3)
            {
                var row1 = board[i];
                var c1 = getPiece(row1[j]);

                var row2 = board[i-1];
                var c2 = getPiece(row2[j+1]);

                var row3 = board[i-2];
                var c3 = getPiece(row3[j+2]);

                var row4 = board[i-3];
                var c4 = getPiece(row4[j+3]);

                if(c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1)
                {
                    return 1;
                }
                if(c1 == 2 && c2 == 2 && c3 == 2 && c4 == 2)
                {
                    return 2;
                }
            }
            if(j > 3)
            {
                var row1 = board[i];
                var c1 = getPiece(row1[j]);

                var row2 = board[i-1];
                var c2 = getPiece(row2[j-1]);

                var row3 = board[i-2];
                var c3 = getPiece(row3[j-2]);

                var row4 = board[i-3];
                var c4 = getPiece(row4[j-3]);

                if(c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1)
                {
                    return 1;
                }
                if(c1 == 2 && c2 == 2 && c3 == 2 && c4 == 2)
                {
                    return 2;
                }
            }
            
        }

    }


    return 0;
}
