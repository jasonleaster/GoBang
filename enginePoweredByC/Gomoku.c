#include "Gomoku.h"
#include "AI.h"

struct Point readStepFromStdInput(void)
{
    printf("Please input the location where you want to drop your piece.\n");

    struct Point step;

    char col;
    
    printf("row[1-16]: ");
    scanf("%d\n", &step.row);

    step.row -= 1;

    printf("col[A-Z]: ");
    scanf("%c\n", &col);

    step.col = col - 'A';

    return step;
}

struct Gomoku gomokuFactory()
{
    struct Gomoku game;

    game.whoseTurn = BLACK;
    game.gameBoard = boardFactory();

    return game;
}

int main()
{

    struct Gomoku game = gomokuFactory();

    struct AI* pAI = AI_Factory(&game);

    struct Point step;

    while(1)
    {
        step = readStepFromStdInput();

        while( FALSE == setPiece(&game, step.row, step.col, game.whoseTurn))
        {
        }

        boardShow(& (game.gameBoard) );

        step = AI_takeStep(pAI);

        setPiece(&game, step.row, step.col, game.whoseTurn);

        boardShow(& (game.gameBoard) );

    }

    free(pAI);

    return 0;
}
