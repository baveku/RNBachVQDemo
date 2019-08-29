var path = require("path");

var config = {
    extraNodeModules: {
        "react-native": path.resolve(__dirname, "node_modules/react-native"),
        "react": path.resolve(__dirname, "node_modules/react"),
    },
    getProjectRoots() {
        return [
            // Keep your project directory.
            path.resolve(__dirname),
            path.resolve(__dirname, "../native"), // path to the external module you want to import
        ];
    }
}
module.exports = config;