import * as path from "path";
import { GeneratorResult } from "./src/mapgen";



module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "bin"),
    filename: "main.js",
    publicPath: "/",


  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],


  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },


  devServer: {
    inline: true,
    port: 8080,

    setup(app: any) {

      var bodyParser = require('body-parser');
      app.use(bodyParser.json());


      /* | side-load  generator and output JSON list of segments |

        Segments : [
          {
            u : {x : number, y : number},
            v : {x : number, y : number}
            t? : number
          }
        ]

      */

      app.get("/compute", function (req: any, res: any) {

        import("./src/mapgen")
          .then(module => {

            for (var k in req.query) {
              if (typeof module.config != "undefined") {
                module.config[k] = req.query[k] as number
              }
            }

            let generator: Iterator<GeneratorResult> = module.generate(`${Math.random()}`);
            let final_generation;

            while (true) {
              let iter = generator.next();
              if (iter.done) {
                break;
              } else {
                final_generation = iter
              }
            }

            if (final_generation) {

              let segments = final_generation.value.segments;
              let output = []

              for (const seg of segments) {
                output.push({
                  'u': seg.start,
                  'v': seg.end
                })
              }
              res.send(JSON.stringify(output));
            }
          })
          .catch(error => console.log(error));
      })
    }
  }
}