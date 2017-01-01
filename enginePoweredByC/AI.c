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

void static init_WaysToWin(struct AI *pAI);
void static init_statisticPossibleToWin(struct AI *pAI);

void init_AI(struct AI *pAI, struct Gomoku *pGame)
{
    pAI->game = pGame;

    init_WaysToWin(pAI);
    init_statisticPossibleToWin(pAI);
}

void static init_statisticPossibleToWin(struct AI *pAI)
{
    if(!pAI || pAI->wayToWinCount <= 0)
    {
        printf("ERROR! init_statisticPossibleToWin()\n");
        return;
    }

    int i = 0;
    int wayToWinCount = pAI->wayToWinCount;
    for(i = 0; i < wayToWinCount; i++)
    {
        pAI->whiteWins[i] = 0;
        pAI->blackWins[i] = 0;

        pAI->whiteWinsPossible[i] = TRUE;
        pAI->blackWinsPossible[i] = TRUE;
    }
}

void static setWayToWin(struct AI *pAI, int i, int j, struct Point direction)
{
    if(!pAI)
    {
        printf("pAI can not be NULL!\n");
        return;
    }

    int m = direction.row;
    int n = direction.col;

    int x = i + m * (5 - 1);
    int y = j + n * (5 - 1);

    if(!legalIndex(x, y)  || !legalIndex(i, j))
    {
        return;
    }

    struct WayToWin wayToWin;

    wayToWin.existed = TRUE;
    wayToWin.startPoint.row = i;
    wayToWin.startPoint.col = j;
    wayToWin.direction = direction;

    int k = 0;
    for(k = 0; k < 5; k++)
    {
        x = i + m * k;
        y = j + n * k;

        pAI->waysToWin[x][y][pAI->wayToWinCount] = wayToWin;
    }

    pAI->wayToWinCount++;
}

void static init_WaysToWin(struct AI *pAI)
{
    int i = 0, j = 0, k = 0;
    for(i = 0; i < BOARD_SIZE; i++)
    {
        for(j = 0; j < BOARD_SIZE; j++)
        {
            for(k = 0; k < WAYS_TO_WIN_BUF_SIZE; k++)
            {
                pAI->waysToWin[i][j][k].existed = FALSE;
            }
        }
        
    }

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

    for(i = 0; i < BOARD_SIZE; i++)
    {
        for(j = 0; j < BOARD_SIZE; j++)
        {
            setWayToWin(pAI, i, j, slash);
            setWayToWin(pAI, i, j, backSlash);
            setWayToWin(pAI, i, j, vertical);
            setWayToWin(pAI, i, j, horizon);
        }
    }

    printf("There %4d ways to win in %dx%d size board! \n", pAI->wayToWinCount, BOARD_SIZE, BOARD_SIZE);

}


/*
 * Return a #Line start at position #startPoint and in the #direction.
 * The #Line has #count pieces.
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


int static isFive(struct Line *line, enum PIECE_TYPE pieceType)
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

enum ConnectedType checkConnectedType(struct Board *pBoard, struct WayToWin wayToWin, enum PIECE_TYPE pieceType, int count)
{
    if(count == 0)
    {
        return ConnectedType_NONE;
    }

    struct Line line;

    if(count != 4 && count != 3)
    {
        line = getPiecesOnALine(pBoard, wayToWin.startPoint, wayToWin.direction, 5);
    }
    else
    {
        line = getPiecesOnALine(pBoard, wayToWin.startPoint, wayToWin.direction, 6);
    }

    if(count == 5 && isFive(&line, pieceType))
    {
        return ConnectedType_FIVE;
    }

    if(count == 4 && isWakedFour(&line, pieceType))
    {
        return ConnectedType_WAKED_FOUR;
    }

    if(count == 4 && isSleepFour(&line, pieceType))
    {
        return ConnectedType_SLEEP_FOUR;
    }

    if(count == 3 && isWakedThree(&line, pieceType))
    {
        return ConnectedType_WAKED_THREE;
    }

    if(count == 3 && isSleepThree(&line, pieceType))
    {
        return ConnectedType_SLEEP_THREE;
    }

    if(count == 2 && isWakedTwo(&line, pieceType))
    {
        return ConnectedType_WAKED_TWO;
    }

    if(count == 2 && isSleepTwo(&line, pieceType))
    {
        return ConnectedType_SLEEP_TWO;
    }

    if(count == 1 && isWakedOne(&line, pieceType))
    {
        return ConnectedType_WAKED_ONE;
    }

    if(count == 1 && isSleepOne(&line, pieceType))
    {
        return ConnectedType_SLEEP_ONE;
    }


    printf("ERROR! program should not reach here\n");
}


enum PIECE_TYPE getCurrentPlayer(struct Gomoku *pGame)
{
    return pGame->whoseTurn;
}

enum PIECE_TYPE getOpponentPlayer(struct Gomoku *pGame)
{
    if(pGame->whoseTurn == WHITE)
    {
        return BLACK;
    }
    else
    {
        return WHITE;
    }
}

int static judgement(struct AI *pAI)
{
    if(!pAI || !pAI->game)
    {
        printf("pBoard should not be NULL!\n");
        return -1;
    }

    struct Board *pBoard = &( pAI->game->gameBoard);
    struct Gomoku *pGame = pAI->game;

    enum PIECE_TYPE currentPlayer  = getCurrentPlayer(pGame);
    enum PIECE_TYPE opponentPlayer = getOpponentPlayer(pGame);

    int currentPlayerScore[BOARD_SIZE][BOARD_SIZE];
    int opponentPlayerScore[BOARD_SIZE][BOARD_SIZE];

    int maxScore_CurrentPlayer  = 0;
    int maxScore_OpponentPlayer = 0;

    int *currentPlayerWinsPossible;
    int *currentPlayerWins;

    int *opponentPlayerWinsPossible;
    int *opponentPlayerWins;

    if(currentPlayer == WHITE)
    {
        currentPlayerWinsPossible = pAI->whiteWinsPossible;
        currentPlayerWins         = pAI->whiteWins;

        opponentPlayerWinsPossible= pAI->blackWinsPossible;
        opponentPlayerWins        = pAI->blackWins;
    }
    else
    {
        opponentPlayerWinsPossible = pAI->whiteWinsPossible;
        opponentPlayerWins         = pAI->whiteWins;

        currentPlayerWinsPossible  = pAI->blackWinsPossible;
        currentPlayerWins          = pAI->blackWins;
        
    }

    struct Point lowBoundary = pAI->game->gameBoard.lowBoundary;
    struct Point upBoundary  = pAI->game->gameBoard.upBoundary;

    struct WayToWin *pWayToWin;
    enum ConnectedType connectedType;

    int count = 0;

    int i = 0, j = 0, k = 0;
    for(i = lowBoundary.row; i <= upBoundary.row; i++)
    {
        for(j = lowBoundary.col; j <= upBoundary.col; j++)
        {
            if(pBoard->board[i * BOARD_SIZE + j] == currentPlayer)
            {
                for(k = 0; k < pAI->wayToWinCount; k++)
                {
                    count = currentPlayerWins[k];
                    pWayToWin = &(pAI->waysToWin[i][j][k]);

                    // need to modify
                    if(pWayToWin->existed == TRUE && currentPlayerWinsPossible[k])
                    {
                        connectedType = checkConnectedType(pBoard, *pWayToWin, currentPlayer, count);
                        if(count == 5)
                        {
                            currentPlayerScore[i][j] += GradeTable.Five;
                            maxScore_CurrentPlayer = currentPlayerScore[i][j];
                            break;
                        }
                        else if(count == 4)
                        {
                            if(connectedType == ConnectedType_WAKED_FOUR)
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_WakedFour;
                            }
                            else
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_SleepFour;
                            }
                        }
                        else if(count == 3)
                        {
                            if(connectedType == ConnectedType_WAKED_THREE)
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_WakedThree;
                            }
                            else
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_SleepThree;
                            }
                        }
                        else if(count == 2)
                        {
                            if(connectedType == ConnectedType_WAKED_TWO)
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_WakedTwo;
                            }
                            else
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_SleepTwo;
                            }
                        }
                        else if(count == 1)
                        {

                            if(connectedType == ConnectedType_WAKED_TWO)
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_WakedOne;
                            }
                            else
                            {
                                currentPlayerScore[i][j] += GradeTable.Cur_SleepOne;
                            }
                        }

                    }
                }

                if(opponentPlayerScore[i][j] > maxScore_OpponentPlayer)
                {
                    maxScore_OpponentPlayer = opponentPlayerScore[i][j];
                }
            }
            else if(pBoard->board[i * BOARD_SIZE + j] != NONE)
            {
                for(k = 0; k < pAI->wayToWinCount; k++)
                {
                    count = currentPlayerWins[k];

                    pWayToWin = & (pAI->waysToWin[i][j][k]);

                    // need to modify
                    if(pWayToWin->existed == TRUE && opponentPlayerWinsPossible[k])
                    {
                        connectedType = checkConnectedType(pBoard, *pWayToWin, opponentPlayer, count);
                        if(count == 5)
                        {
                            opponentPlayerScore[i][j] += GradeTable.Five;
                            maxScore_CurrentPlayer = opponentPlayerScore[i][j];
                            break;
                        }
                        else if(count == 4)
                        {
                            if(connectedType == ConnectedType_WAKED_FOUR)
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_WakedFour;
                            }
                            else
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_SleepFour;
                            }
                        }
                        else if(count == 3)
                        {
                            if(connectedType == ConnectedType_WAKED_THREE)
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_WakedThree;
                            }
                            else
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_SleepThree;
                            }
                        }
                        else if(count == 2)
                        {
                            if(connectedType == ConnectedType_WAKED_TWO)
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_WakedTwo;
                            }
                            else
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_SleepTwo;
                            }
                        }
                        else if(count == 1)
                        {

                            if(connectedType == ConnectedType_WAKED_TWO)
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_WakedOne;
                            }
                            else
                            {
                                opponentPlayerScore[i][j] += GradeTable.Cur_SleepOne;
                            }
                        }
                    }
                }

                if(opponentPlayerScore[i][j] > maxScore_OpponentPlayer)
                {
                    maxScore_OpponentPlayer = opponentPlayerScore[i][j];
                }
            }
        }
    }

    return maxScore_CurrentPlayer - maxScore_OpponentPlayer;
}

void static oneStep(struct Board *pBoard, struct Point step)
{
    //TODO
}

void static undoStep(struct Board *pBoard, struct Point step, enum PIECE_TYPE whoseTurn)
{
    //TODO
}

void updateStatisticArray(struct AI* pAI, int row, int col)
{
    int k = 0;
    int waysToWinCount = pAI->wayToWinCount;
    struct WayToWin wayToWin;
    if(pAI->game->whoseTurn == WHITE)
    {
        for(k = 0; k < waysToWinCount; k++)
        {
            wayToWin = pAI->waysToWin[row][col][k];
            if(wayToWin.existed == TRUE)
            {
                pAI->whiteWins[k]++;
                pAI->blackWinsPossible[k] = FALSE;
            }
        }
    }
    else
    {
        for(k = 0; k < waysToWinCount; k++)
        {
            wayToWin = pAI->waysToWin[row][col][k];
            if(wayToWin.existed == TRUE)
            {
                pAI->blackWins[k]++;
                pAI->whiteWinsPossible[k] = FALSE;
            }
        }
    }
}


int main()
{

    struct AI* pAI = (struct AI*) malloc(sizeof(struct AI));

    struct Gomoku game = gomokuFactory();

    game.pAI = pAI;

    init_AI(pAI, &game);

    setPiece(pAI->game, 7, 7);
    setPiece(pAI->game, 7, 8);
    setPiece(pAI->game, 8, 7);
    setPiece(pAI->game, 8, 8);

    boardShow(& (game.gameBoard) );

    judgement(pAI);

    free(pAI);
    return 0;
}
