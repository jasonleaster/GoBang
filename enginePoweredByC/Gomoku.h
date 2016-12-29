#ifndef _GOMOKU_
#define _GOMOKU_

#include<stdio.h>
#include<stdlib.h>

#define TRUE  1
#define FALSE 0

#define BUF_SIZE 1024

#define BOARD_SIZE 16

enum PIECE_TYPE {NONE, WHITE, BLACK};

struct Point
{
    int row;
    int col;
};

#define MAX_PIECE_IN_A_LINE 6
#define NOR_PIECE_IN_A_LINE 5 //normal mode
struct Line
{
    enum PIECE_TYPE pieces[MAX_PIECE_IN_A_LINE];
    int length;
};

struct Board
{
    char hashString[BOARD_SIZE * BOARD_SIZE];

    /*
     * One dimension array to represent a two dimension board
     * */
    enum PIECE_TYPE board[BOARD_SIZE * BOARD_SIZE];

};

struct Gomoku
{
    enum PIECE_TYPE whoseTurn;
    struct Board gameBoard;
};

/**
 * Operation on board
 */
struct Board boardFactory(void);

int legalIndex(int row, int col);

void boardShow(struct Board *pBoard);

void setPiece(struct Gomoku * pGame, int row, int col);


/**
 * Operation on AI
 */
 
struct Point readStepFromStdInput(void);

struct Gomoku gomokuFactory();

#endif
