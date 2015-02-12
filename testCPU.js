'use strict';
var os = require('os');
var oldUsage = [];
var oldTotals = [];


printHeader();

//Call Meter every second
setInterval(function() {
    getCPU();
}, 1000);

//Print the Table Headers for each coloumn and a horizantal line
function printHeader() {
    var lines = '';
    var str = 'CPU     ';
    for (var i = 0; i < os.cpus().length; i++) {
        str += 'CPU' + ' ' + i + '   ';
    };
    for (var i = 0; i < str.trim().length; i++) {
        lines += '-';
    };
    console.log(str + '\n' + lines);
}

//Get CPU utilization
function getCPU(cpu_n) {
    var timers = [],
        totals = [],
        totDiff = [],
        usage = [],
        usgDiff = [];
    var sum = 0;
    var tempStr = '';

    for (var i = 0; i < os.cpus().length; i++) {
        timers[i] = os.cpus()[i].times;
        if (timers[i] == undefined)
            return null;

        totals[i] = timers[i].user + timers[i].sys + timers[i].nice + timers[i].idle;
        totDiff[i] = totals[i] - oldTotals[i];

        usage[i] = totals[i] - timers[i].idle;
        usgDiff[i] = usage[i] - oldUsage[i];

        if (oldUsage[i] && oldTotals[i]) {
            sum += usgDiff[i] * 100 / totDiff[i];
            tempStr += '    ' + (usgDiff[i] * 100 / totDiff[i]).toFixed(2);
        }

        oldUsage[i] = usage[i];
        oldTotals[i] = totals[i];
    }
    var avg = sum / os.cpus().length;
    avg = avg.toFixed(2);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(avg + tempStr);
}

//Caputure keyboars interupt to add a newline to the end
process.on('SIGINT', function() {
    console.log();
    process.exit();
});
