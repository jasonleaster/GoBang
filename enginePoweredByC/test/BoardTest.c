#include "Gomoku.h"

int main()
{
    struct Board board;
    
    board = boardFactory();
 
    setPiece(&board, 7, 7, WHITE);

    boardShow(&board);

    printf("%d", NONE);

    return 0;
}
