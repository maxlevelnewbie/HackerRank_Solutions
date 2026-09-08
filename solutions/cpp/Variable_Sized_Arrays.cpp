#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int main()
{
    int p, q;
    cin >> p >> q;

    vector<vector<int>> outer_arr(p);

    for (int i = 0; i < p; i++)
    {
        int k;
        cin >> k;

        outer_arr[i].resize(k);

        for (int j = 0; j < k; j++)
        {
            cin >> outer_arr[i][j];
        }
    }

    for (int query = 0; query < q; query++)
    {
        int i, j;
        cin >> i >> j;

        cout << outer_arr[i][j] << endl;
    }
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */
    return 0;
}