#include "Gomoku.h"

struct Point readStepFromStdInput(void)
{
    printf("Please input the location where you want to drop your piece.\n");

    struct Point step;
    
    printf("row: ");
    scanf("%d", &step.row);

    printf("col: ");
    scanf("%d", &step.col);

    return step;
}

struct Gomoku gomokuFactory()
{
    struct Gomoku game;

    game.whoseTurn = BLACK;
    game.gameBoard = boardFactory();

    return game;
}

/* 
 *
 * int main()
{
    struct Gomoku game = gomokuFactory();
    struct Point step;

    while(1)
    {
        step = readStepFromStdInput();

        setPiece(&game, step.row, step.col);

        boardShow(& (game.gameBoard) );

    }

    printf("%d", NONE);

    return 0;
}*/
