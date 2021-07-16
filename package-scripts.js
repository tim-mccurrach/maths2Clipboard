module.exports = {
    scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        build: "webpack",
        develop: "webpack --watch",
        serve: "http-server ./dist/site",
    },
};
