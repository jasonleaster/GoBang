#ifndef __AI__
#define __AI__

struct WayToWin
{
    struct Point startPoint;
    struct Point direction;
};

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

#define WAYS_TO_WIN_BUF_SIZE 1024

#endif
