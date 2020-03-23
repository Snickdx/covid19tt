

function toTimestamp(strDate=(new Date()).toLocaleDateString()){
 var datum = Date.parse(strDate);
 return datum/1000;
}

console.log(toTimestamp());