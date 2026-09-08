#include <iostream>
#include <string>
using namespace std;

int main()
{
    string a;
    string b;

    cin >> a;
    cin >> b;

    cout << a.size() << " " << b.size() << endl;

    cout << a + b << endl;

    char c = a[0];
    char d = b[0];
    char r = b[0];
    b[0] = c;
    a[0] = r;

    cout << a << " " << b;

    // Complete the progra
    return 0;
}