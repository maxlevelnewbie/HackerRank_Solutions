#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

int min(int a, int b) {
    return (a < b) ? a : b;
}

int main() 
{    int n;
    scanf("%d", &n);
    
   int size = 2 * n - 1;

    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            int top = i;
            int left = j;
            int bottom = size - 1 - i;
            int right = size - 1 - j;

            int minDist = min(min(top, bottom), min(left, right));

            printf("%d ", n - minDist);
        }
        printf("\n");
    }
}
