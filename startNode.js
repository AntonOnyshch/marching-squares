var http = require("http");
const fs = require("fs");

http.createServer(function(request, response){
     
    const filePath = request.url.substr(1);

    fs.access(filePath, fs.constants.R_OK, err => {

        if(err){
            response.statusCode = 404;
            response.end("Resourse not found!");
        }
        else{
            let filename = filePath.split('.').pop();
            
            if(filename === "js")
            {
                response.setHeader("Content-Type", 'text/javascript');
            }
            if(filename === "wasm")
            {
                response.setHeader("Content-Type", 'application/wasm');
            }
            fs.createReadStream(filePath).pipe(response);
        }
      });
     
}).listen(3000);