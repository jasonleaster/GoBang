#include <stdio.h>

struct Foo
{
    int x;
};

struct Bar
{
    struct Foo array[10][10][10];
};


int main()
{
    struct Bar bar;

    struct Bar *pBar = &bar;


    printf("%x\n", pBar->array);
    return 0;
}
