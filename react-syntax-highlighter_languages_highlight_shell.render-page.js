exports.ids = ["react-syntax-highlighter_languages_highlight_shell"];
exports.modules = {

/***/ "../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/shell.js":
/*!*************************************************************************************************!*\
  !*** ../node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/shell.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(hljs) {
  return {
    aliases: ['console'],
    contains: [
      {
        className: 'meta',
        begin: '^\\s{0,3}[\\w\\d\\[\\]()@-]*[>%$#]',
        starts: {
          end: '$', subLanguage: 'bash'
        }
      }
    ]
  }
};

/***/ })

};;
//# sourceMappingURL=react-syntax-highlighter_languages_highlight_shell.render-page.js.map