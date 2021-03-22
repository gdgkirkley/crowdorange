(async () => {
  require("regenerator-runtime/runtime");
  require("@babel/register")({ extensions: [".js", ".ts"] });
  require("./src/index.ts");
})();
