require("dotenv").config();
if (process.env.NODE_ENV === "production") {
  require("./dist/index.js");
} else {
  require("nodemon")({ script: "dev.js" });
}
