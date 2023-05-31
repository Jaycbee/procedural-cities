import * as path from "path";

//import { noise } from "perlin";
//noise
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

      app.get("/get/some-data", function (req: any, res: any) {


        import("./src/mapgen")
          .then(module => {
            console.log(req);

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
              console.log(final_generation.value);
              res.send(final_generation.value.segments.length.toString());
            }
          })
          .catch(error => console.log(error));
      })
    }
  }
}