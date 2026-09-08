#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>



int main() 
{
    int a, b;
    scanf("%d\n%d", &a, &b);
    
    for (int n = a; n<=b; n++) {
        if (n>=1 && n<=9) {
            char* labels[]={"one","two","three","four","five","six","seven","eight","nine"};
            printf("%s\n",labels[n-1]);
        }
        else if (n>9) {
            if (n%2==0) {
                printf("even\n");
            }
            else {
                printf("odd\n");
            }
        }
    }
  	// Complete the code.

    return 0;
}