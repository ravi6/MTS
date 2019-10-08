importScripts("geometry.js", "board.js", "treasure.js", "node.js",
              "tree.js", "pdf.js", "robot.js", "util.js");
var rob = new robot("dog", new point(0,0));
self.onmessage ( function (msg) {
                  postMessage("Dog Received a message");
                });
