module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            "module-resolver",
            {
                "extensions": [
                    ".ts",
                ],
                "alias": {
                    "@theme/*": "./src/theme/*",
                    "@app/*": "./src/*",
                }
            }
        ]
    ]
};