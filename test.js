var async = require("async");
var sys = require("sys");

var a = ["foo", "bar", "baz"];

var f = function(arg, callback) {
    sys.log(arg);
    callback();
}

async.forEach(a, f, function(err) {
    sys.log("finished");
});