// var name = "sharif";
// if(name.length > 4)
// {
//     name = "arif";
    
// }
// console.log(name);

// function fibo(n)
// {
//     if(n == 0){
//         return 0;
//     }
//     if(n == 1){
//         return 1;
//     }
//     else{
//         return fibo(n - 1) + fibo(n-2);
//     }

// }
// var result = fibo(10);
// console.log(result); 
// var x = 10;
// var y = 20;
// var z = 30;
// var a = 45;
// var b = 23;
// var maximum = Math.max(x,y,z,a,b);
// console.log(maximum);


 
 function reverseString(str){
    var reverse = "";
    for(var i = 0; i<=str.length; i++){
        var char = str[i];
        reverse = char + reverse;

    }
    return reverse;
 }
 var letter = "I am sharif hossain mollah. I am a students of kuet.";
 var rev = reverseString(letter);
 console.log(rev);
 var food = reverseString("Ami valo  maner fall khaabo");
 console.log(food);
