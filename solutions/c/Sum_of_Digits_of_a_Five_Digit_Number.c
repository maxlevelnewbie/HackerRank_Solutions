#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

int main()
{

    int n;
    scanf("%d", &n);
    int a, b, c, d, e, sum;

    a = n / 10000;
    n = n % 10000;

    b = n / 1000;
    n = n % 1000;

    c = n / 100;
    n = n % 100;

    d = n / 10;
    n = n % 10;

    e = n / 1;

    sum = a + b + c + d + e;

    printf("%d", sum);
    // Complete the code to calculate the sum of the five digits on n.
    return 0;
}