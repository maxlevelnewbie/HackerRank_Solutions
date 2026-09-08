#include <stdio.h>
void update(int *a, int *b)
{
    // *a = 4
    // *b = 5
    // Complete this function
    int oa = *a;
    int ob = *b;

    *a = oa + ob;
    *b = oa - ob;

    if (*b < 0)
    {
        *b = *b * -1;
    }
    else
    {
        *b = *b * 1;
    }
}

int main()
{
    int a, b;
    int *pa = &a, *pb = &b;

    scanf("%d %d", &a, &b);
    update(pa, pb);
    printf("%d\n%d", a, b);
    return 0;
}