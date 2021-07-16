// to get Mathquill to play nicely with webpack we use
// export-loader and import-loader. We don't have such
// plugins for jest. The solution is:
// 1. First load jQuery into global scope (in setupFiles.js)
// 2. Then load mathQuill from ./vendor
// 3. This file is then used to import Mathquill using
//     jests moduleNameMapper option.
export default MathQuill;
