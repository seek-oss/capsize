exports.ids = ["react-syntax-highlighter_languages_highlight_clojureRepl"];
exports.modules = {

/***/ "../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/clojure-repl.js":
/*!********************************************************************************************************!*\
  !*** ../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/clojure-repl.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  return {
    contains: [
      {
        className: 'meta',
        begin: /^([\w.-]+|\s*#_)?=>/,
        starts: {
          end: /$/,
          subLanguage: 'clojure'
        }
      }
    ]
  }
};

/***/ })

};;
//# sourceMappingURL=react-syntax-highlighter_languages_highlight_clojureRepl.render-page.js.map