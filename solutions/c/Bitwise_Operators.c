#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

void calculate_the_maximum(int n, int k) {
    int maxAnd = 0, maxOr = 0, maxXor = 0;

    for (int a = 1; a <= n; a++) {
        for (int b = a + 1; b <= n; b++) {
            int andValue = a & b;
            int orValue = a | b;
            int xorValue = a ^ b;

            if (andValue < k && andValue > maxAnd)
                maxAnd = andValue;

            if (orValue < k && orValue > maxOr)
                maxOr = orValue;

            if (xorValue < k && xorValue > maxXor)
                maxXor = xorValue;
        }
    }

    printf("%d\n", maxAnd);
    printf("%d\n", maxOr);
    printf("%d\n", maxXor);
}

int main() {
    int n, k;
    scanf("%d %d", &n, &k);

    calculate_the_maximum(n, k);

    return 0;
}