var http = require('http');

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");


// 
// app.get('/listDeps', function (req, res) {
//     var QueryString = {
//         filename: 'xpcom/glue/nsINIParser.cpp'
//     };
// 
//     if(!QueryString.filename) {
//         error();
//     } else {
//         d3.text('../matlab_in/dependencies.csv.deps', function(data_dependencies) {
//             d3.text('../misc/dependencies.csv.files', function(data_files) {
//                 var dependencies = [];
//                 var fileNames = [];
// 
//                 data_dependencies.split('\n').forEach(function(line) {
//                     var d = line.split(',');
//                     dependencies.push({from: d[0], to: d[1]});
//                 });
// 
//                 data_files.split('\n').forEach(function(line) {
//                     var fileName = '';
//                     var startRecordingPath;
// 
//                     line.split('/').forEach(function(d, i) {
//                         if(d === 'understand_in') {
//                             startRecordingPath = i;
//                         }
// 
//                         if(i > (startRecordingPath + 1)) {
//                             fileName += '/' + d;
//                         }
//                     });
// 
//                     fileNames.push(fileName);
//                 });
// 
//                 //lookup file number for this file name
//                 var fileNumber = fileNames.indexOf('/' + QueryString.filename);
//                 
//                 if(fileNumber === -1) {
//                     error();
//                 } else {
//                     fileNumber += 1; //1-indexed
// 
//                     var fanIn = dependencies.filter(function(d) {
//                         return d.to == fileNumber;
//                     });
// 
//                     var fanOut = dependencies.filter(function(d) {
//                         return d.from == fileNumber;
//                     });
// 
//                     var json = {file: QueryString.filename, fanIn: [], fanOut: []};
// 
//                     fanIn.forEach(function(d) {
//                         json.fanIn.push(fileNames[d.from].substr(1));
//                     });
// 
//                     fanOut.forEach(function(d) {
//                         json.fanOut.push(fileNames[d.to].substr(1));
//                     });
// 
//                     console.log(json);
// 
//                     response.writeHead(200, {"Content-Type": "application/json"});
//                     response.end(JSON.stringify(json));
//                     
//                     
//                 }
//             });
//         });
//     }
// }
// 
//     function error() {
//         var json = {error: 'File name missing or does not exist in the codebase, usage: https://metrics.mozilla.com/code-quality/dep/?filename=xpcom/glue/nsINIParser.cpp'};
//         //document.write('<pre>' + JSON.stringify(json, null, '  ') + '</pre>');
// 
//         response.writeHead(200, {"Content-Type": "application/json"});
//         response.end(JSON.stringify(json));
// 
//     }
//     
//     var server = app.listen(8081, function () {
//         var host = server.address().address
//         var port = server.address().port
// 
//         console.log("Example app listening at http://%s:%s", host, port)
//     })