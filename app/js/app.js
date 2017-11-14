/**
 * Created by LT-0324 on 2017/11/13.
 */
import name from './test.js'
let obj = {a: 1, b: 2, c: 3}
Object.keys(obj).forEach((key) =>
{
    console.log(obj[key]); // 输出1, 2, 3
});

console.log( Object.entries(obj)); //[[a,1],[b,2],[c,3]]
console.log(1,2);
