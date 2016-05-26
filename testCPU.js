'use strict';
var os          = require('os');
var oldUsage    = [];
var oldTotals   = [];

//Print the header of the table
printHeader();

//Call Meter every second
setInterval(function() {
    getCPU();
}, 1000);

//Prints the Table Headers for each coloumn and a horizantal line
function printHeader() {
    var lines   = '';
    var str     = 'CPU   ';
    for (var i = 0; i < os.cpus().length; i++) {
        str += ' | ' + 'CPU' + ' ' + i + ' ';
    };
    for (var i = 0; i < str.length; i++) {
        lines += '-';
    };
    console.log(str + '\n' + lines);
}

//Get CPU utilization
function getCPU(cpu_n) {
    var timers  = [],
        totals  = [],
        totDiff = [],
        usage   = [],
        usgDiff = [];
    var sum     = 0;
    var avg     = 0;
    var tempStr = '';
    var tempPer = 0;

    //Loop through each core present
    for (var i = 0; i < os.cpus().length; i++) {
        timers[i] = os.cpus()[i].times;
        if (timers[i] == undefined)
            return null;

        //Get the total time (user + sys + nice + idle)
        totals[i]   = timers[i].user + timers[i].sys + timers[i].nice + timers[i].idle;
        totDiff[i]  = totals[i] - oldTotals[i];

        //Get the usage (total - idle)
        usage[i]    = totals[i] - timers[i].idle;
        //Get the difference between the old timer and the new one
        usgDiff[i]  = usage[i]  - oldUsage[i];

        //If a previous timer exists calculate the usage percentage
        if (oldUsage[i] && oldTotals[i]) {
            //Usage sum of all cores
            sum     += usgDiff[i]  * 100 / totDiff[i];
            //Usage of individual core rounded to 2 decimals
            tempPer  = (usgDiff[i] * 100 / totDiff[i]).toFixed(2);
            tempStr += ' | ' + pad(tempPer);
        }

        //Reset old counters
        oldUsage[i]     = usage[i];
        oldTotals[i]    = totals[i];
    }
    //Average usage of cores
    avg = pad((sum / os.cpus().length).toFixed(2));
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(avg + tempStr);
}

function pad(n) {
    if(n < 10)
        n = '  ' + n.toString();
    else if(n > 10 && n < 100)
        n = ' ' + n.toString();
    return n;
};

//Caputure keyboars interupt to add a newline to the end
process.on('SIGINT', function() {
    console.log();
    process.exit();
});
