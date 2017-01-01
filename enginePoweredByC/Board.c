#include "Gomoku.h"
#include "AI.h"

struct Board boardFactory(void)
{
    struct Board board;
    
    int i = 0;

    for(i = 0; i < BOARD_SIZE * BOARD_SIZE; i++)
    {
        board.board[i] = NONE;
    }

    board.lowBoundary.row = BOARD_SIZE;
    board.lowBoundary.col = BOARD_SIZE;

    board.upBoundary.row = 0;
    board.upBoundary.col = 0;

    return board;
}

int legalIndex(int row, int col)
{
    if(row < 0 || col < 0 ||
       row >= BOARD_SIZE || col >= BOARD_SIZE)
    {
        return FALSE;
    }

    return TRUE;
}


void setPiece(struct Gomoku * pGame, int row, int col)
{ 
    if(!pGame)
    {
        printf("pGame can not be NULL!\n");
        return;
    }

    struct Board *pBoard = &pGame->gameBoard;
    
    if( legalIndex( row, col) == FALSE)
    {
        printf("illegal Index row: %d col: %d\n", row, col);
        return;
    }

    int index = row * BOARD_SIZE + col;
    if(pBoard->board[index] != NONE)
    {
        printf("You are trying to drop piece where already have another piece.\n");
        return;
    }

    pBoard->board[index] = pGame->whoseTurn;

    updateStatisticArray(pGame->pAI, row, col);

    /*
     * Switch turn
     * */
    if(pGame->whoseTurn == WHITE)
    {
        pGame->whoseTurn = BLACK;
    }
    else
    {
        pGame->whoseTurn = WHITE;
    }

    /*
     * Update Boundary Point
     * */
    if( pGame->gameBoard.lowBoundary.row > row)
    {
        pGame->gameBoard.lowBoundary.row = row;
    }

    if( pGame->gameBoard.lowBoundary.col > col)
    {
        pGame->gameBoard.lowBoundary.col = col;
    }

    if( pGame->gameBoard.upBoundary.row < row)
    {
        pGame->gameBoard.upBoundary.row = row;
    }

    if( pGame->gameBoard.upBoundary.col < col)
    {
        pGame->gameBoard.upBoundary.col = col;
    }
}


void boardShow(struct Board *pBoard)
{
    if(!pBoard)
    {
        printf("pBoard can not be NULL!");
    }

    char strBuffer[BUF_SIZE];

    enum PIECE_TYPE* board = pBoard->board;

    int boardIndex = 0;
    int strIndex   = 0;

    strBuffer[strIndex++] = '\n';

    int i = 0, j = 0;
    
    strBuffer[strIndex++] = ' ';
    strBuffer[strIndex++] = ' ';
    for(i = 0; i < BOARD_SIZE; i++)
    {
        strBuffer[strIndex++] = 'A' + i ;
    }

    strBuffer[strIndex++] = '\n';

    for(i = 0; i < BOARD_SIZE; i++)
    {
        strIndex += sprintf(strBuffer + strIndex, "%2d", i + 1);

        for(j = 0; j < BOARD_SIZE; j++)
        {
            boardIndex = i * BOARD_SIZE + j;

            if( board[boardIndex] == NONE)
            {
                strBuffer[strIndex] = '+';
            }
            else if( board[boardIndex] == WHITE)
            {
                strBuffer[strIndex] = 'o';
            }
            else if( board[boardIndex] == BLACK)
            {
                strBuffer[strIndex] = 'x';
            }

            strIndex++;
        }

        strBuffer[strIndex++] = '\n';
    }


    strBuffer[strIndex++] = '\0';

    printf("%s", strBuffer);
}
