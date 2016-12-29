#include "Gomoku.h"

struct AI
{
    //char cacheTable[];
    struct Gomoku *game;
};

enum ConnectedType
{
    SLEEP_ONE,
    SLEEP_TWO,
    SLEEP_THREE,
    SLEEP_FOUR,
    SLEEP_FIVE,

    WAKED_ONE,
    WAKED_TWO,
    WAKED_THREE,
    WAKED_FOUR,
    WAKED_FIVE

};


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

/**
 * TODO
 */

enum ConnectedType checkConnectedType(struct Gomoku *pGame)
{

    struct Point startPoint;
    struct Point direction;
    
    startPoint.row = 7;
    startPoint.col = 7;

    direction.row = +1;
    direction.col = +1;

    int count = 5;

    struct Line line = getPiecesOnALine(&pGame->gameBoard, startPoint, direction, count);

}

int main()
{

    struct Gomoku game = gomokuFactory();
      
    setPiece(&game, 7, 7);
    setPiece(&game, 8, 8);
    setPiece(&game, 9, 9);
    setPiece(&game, 10, 10);

    checkConnectedType(&game);
                                      
    boardShow(& (game.gameBoard) );

    return 0;
}
