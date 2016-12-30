/**********************************************
 *
 * Author: EOF
 * E-mail: jasonleaster@gmail.com
 * Date  : 2016.12.30
 * File  : AI.c
 *
 ***********************************************/

#include "Gomoku.h"
#include "AI.h"

struct WayToWin waysToWin[BOARD_SIZE][BOARD_SIZE][WAYS_TO_WIN_BUF_SIZE];
static int wayToWinCount = 0;

void static setWayToWin(int i, int j, struct Point direction)
{
    int m = direction.row;
    int n = direction.col;

    int x = i + m * (5 - 1);
    int y = j + n * (5 - 1);

    if(!legalIndex(x, y)  || !legalIndex(i, j))
    {
        return;
    }

    struct WayToWin wayToWin;

    wayToWin.startPoint.row = i;
    wayToWin.startPoint.col = j;
    wayToWin.direction = direction;

    int k = 0;
    for(k = 0; k < 5; k++)
    {
        x = i + m * k;
        y = j + n * k;

        waysToWin[x][y][wayToWinCount] = wayToWin;
    }

    wayToWinCount++;
}

void static init_WaysToWin()
{
    /*
     * Direction
     * */
    struct Point slash;         // "/"
    struct Point horizon;       // "-"
    struct Point backSlash;     // "\"
    struct Point vertical;      // "|"

    slash.row       = -1;
    slash.col       = +1;
    backSlash.row   = +1;
    backSlash.col   = +1;
    horizon.row     = 0;
    horizon.col     = +1;
    vertical.row    = +1;
    vertical.col    = 0;


    int i = 0, j = 0;
    for(i = 0; i < BOARD_SIZE; i++)
    {
        for(j = 0; j < BOARD_SIZE; j++)
        {
            setWayToWin(i, j, slash);
            setWayToWin(i, j, backSlash);
            setWayToWin(i, j, vertical);
            setWayToWin(i, j, horizon);
        }
    }

    printf("There %4d ways to win in %dx%d size board! \n", wayToWinCount, BOARD_SIZE, BOARD_SIZE);

}


/*
 * 
 * */

struct Line static getPiecesOnALine(struct Board *pBoard, struct Point startPoint, struct Point direction, int count)
{
    struct Line line;

    line.length = count;

    int row = startPoint.row;
    int col = startPoint.col;

    int i = 0;
    for(i = 0; i < count; i++)
    {
        if(legalIndex(row, col) == TRUE)
        {
            line.pieces[i] = pBoard->board[row * BOARD_SIZE + col];
        }
        else
        {
            break;
        }
        row += direction.row;
        col += direction.col;
    }

    return line;
}

int static isWakedOne(struct Line *line, enum PIECE_TYPE pieceType)
{
    if(!line)
    {
        printf("Error! line can not be NULL!\n");
        return FALSE;
    }

    if(line->length != NOR_PIECE_IN_A_LINE)
    {
        printf("Error! The size of line must be %d\n", NOR_PIECE_IN_A_LINE);
        return FALSE;
    }

    int condition = (
            line->pieces[1] == pieceType ||
            line->pieces[2] == pieceType ||
            line->pieces[3] == pieceType);

    if(condition)
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}

int static isSleepOne(struct Line *line, enum PIECE_TYPE pieceType)
{
    return !isWakedOne(line, pieceType);
}

int static isWakedTwo(struct Line *line, enum PIECE_TYPE pieceType)
{
    if(!line)
    {
        printf("Error! line can not be NULL!\n");
        return FALSE;
    }

    if(line->length != NOR_PIECE_IN_A_LINE)
    {
        printf("Error! The size of line must be %d\n", NOR_PIECE_IN_A_LINE);
        return FALSE;
    }

    int condition = (
            line->pieces[1] == pieceType ||
            line->pieces[2] == pieceType ||
            line->pieces[3] == pieceType);

    if(condition)
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}


int static isSleepTwo(struct Line *line, enum PIECE_TYPE pieceType)
{
    return !isWakedTwo(line, pieceType);
}


int static isWakedThree(struct Line *line, enum PIECE_TYPE pieceType)
{
    if(!line)
    {
        printf("Error! line can not be NULL!\n");
        return FALSE;
    }

    if(line->length != MAX_PIECE_IN_A_LINE)
    {
        printf("Error! The size of line must be %d\n", MAX_PIECE_IN_A_LINE);
        return FALSE;
    }

    enum PIECE_TYPE *pieces = line->pieces;

    int condition_A = pieces[1] == pieceType && pieces[2] == pieceType && pieces[3] == pieceType;

    int condition_B = (pieces[0] == NONE || pieces[0] == pieceType ) && 
                      (pieces[5] == NONE || pieces[5] == pieceType ) &&
                      (pieces[1] == pieceType && pieces[2] == pieceType && pieces[4] == pieceType);

    int condition_C = (pieces[0] == NONE || pieces[0] == pieceType ) && 
                      (pieces[5] == NONE || pieces[5] == pieceType ) &&
                      (pieces[1] == pieceType && pieces[3] == pieceType && pieces[4] == pieceType);

    int condition = condition_A || condition_B || condition_C;

    if(condition)
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}




int static isSleepThree(struct Line *line, enum PIECE_TYPE pieceType)
{
    return !isWakedThree(line, pieceType);
}

int static isWakedFour(struct Line *line, enum PIECE_TYPE pieceType)
{
    if(!line)
    {
        printf("Error! line can not be NULL!\n");
        return FALSE;
    }

    if(line->length != MAX_PIECE_IN_A_LINE)
    {
        printf("Error! The size of line must be %d\n", MAX_PIECE_IN_A_LINE);
        return FALSE;
    }

    enum PIECE_TYPE *pieces = line->pieces;

    int condition = pieces[0] == NONE      && pieces[5] == NONE &&
                    pieces[1] == pieceType && pieces[2] == pieceType && 
                    pieces[3] == pieceType && pieces[4] == pieceType;

    if(condition)
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}


int static isSleepFour(struct Line *line, enum PIECE_TYPE pieceType)
{
    return !isWakedFour(line, pieceType);
}


int static isWakedFive(struct Line *line, enum PIECE_TYPE pieceType)
{
    if(!line)
    {
        printf("Error! line can not be NULL!\n");
        return FALSE;
    }

    if(line->length != NOR_PIECE_IN_A_LINE)
    {
        printf("Error! The size of line must be %d\n", NOR_PIECE_IN_A_LINE);
        return FALSE;
    }

    enum PIECE_TYPE *pieces = line->pieces;

    int condition = pieces[0] == pieceType && pieces[1] == pieceType && 
                    pieces[2] == pieceType && pieces[3] == pieceType && 
                    pieces[4] == pieceType;

    if(condition)
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}


int static isSleepFive(struct Line *line, enum PIECE_TYPE pieceType)
{
    return !isWakedFive(line, pieceType);
}

enum ConnectedType checkConnectedType(struct Gomoku *pGame, struct WayToWin wayToWin, enum PIECE_TYPE pieceType, int count)
{
    if(count == 0)
    {
        return 
    }

    struct Point startPoint;
    struct Point direction;
    
    startPoint.row = 7;
    startPoint.col = 7;

    direction.row = +1;
    direction.col = +1;

    struct Line line = getPiecesOnALine(&pGame->gameBoard, startPoint, direction, count);

}

int main()
{

    init_WaysToWin();

    /**
    struct Gomoku game = gomokuFactory();
      
    setPiece(&game, 7, 7);
    setPiece(&game, 8, 8);
    setPiece(&game, 9, 9);
    setPiece(&game, 10, 10);

    checkConnectedType(&game, BLACK, 5);
                                      
    boardShow(& (game.gameBoard) );

    */
    return 0;
}
