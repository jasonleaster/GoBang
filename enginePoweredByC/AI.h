#ifndef __AI__
#define __AI__

#define WAYS_TO_WIN_BUF_SIZE 1024
struct WayToWin
{
    int existed; // boolean value
    struct Point startPoint;
    struct Point direction;
};

struct AI
{
    //char cacheTable[];
    struct Gomoku *game;

    struct WayToWin waysToWin[BOARD_SIZE][BOARD_SIZE][WAYS_TO_WIN_BUF_SIZE];

    /*
     * how many different way to win
     * */
    int wayToWinCount;
    
    /*
     * statistic array for different ways to win
     * */
    int whiteWins[WAYS_TO_WIN_BUF_SIZE];
    int blackWins[WAYS_TO_WIN_BUF_SIZE];

    /*
     * Boolean array for different ways are possible to win
     * */
    int whiteWinsPossible[WAYS_TO_WIN_BUF_SIZE];
    int blackWinsPossible[WAYS_TO_WIN_BUF_SIZE];
};

void updateStatisticArray(struct AI* pAI, int row, int col);

enum ConnectedType
{

    ConnectedType_NONE,

    ConnectedType_SLEEP_ONE,
    ConnectedType_SLEEP_TWO,
    ConnectedType_SLEEP_THREE,
    ConnectedType_SLEEP_FOUR,

    ConnectedType_WAKED_ONE,
    ConnectedType_WAKED_TWO,
    ConnectedType_WAKED_THREE,
    ConnectedType_WAKED_FOUR,

    ConnectedType_FIVE

};

struct
{
    int Cur_SleepOne;
    int Cur_SleepTwo;
    int Cur_SleepThree;
    int Cur_SleepFour;

    int Cur_WakedOne;
    int Cur_WakedTwo;
    int Cur_WakedThree;
    int Cur_WakedFour;

    int Opp_SleepOne;
    int Opp_SleepTwo;
    int Opp_SleepThree;
    int Opp_SleepFour;

    int Opp_WakedOne;
    int Opp_WakedTwo;
    int Opp_WakedThree;
    int Opp_WakedFour;

    int Five;
} GradeTable;

#endif
