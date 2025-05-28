/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/create/page",{

/***/ "(app-pages-browser)/./src/components/route/config/targetRegistry.ts":
/*!*******************************************************!*\
  !*** ./src/components/route/config/targetRegistry.ts ***!
  \*******************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getTargetConfig: function() { return /* binding */ getTargetConfig; },\n/* harmony export */   getTargetOptions: function() { return /* binding */ getTargetOptions; },\n/* harmony export */   targetRegistry: function() { return /* binding */ targetRegistry; }\n/* harmony export */ });\n/* harmony import */ var _targets_GoogleSheetsTargetForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../targets/GoogleSheetsTargetForm */ \"(app-pages-browser)/./src/components/route/targets/GoogleSheetsTargetForm.tsx\");\n/* harmony import */ var _targets_NotionTargetForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../targets/NotionTargetForm */ \"(app-pages-browser)/./src/components/route/targets/NotionTargetForm.tsx\");\n/* harmony import */ var _targets_NotionTargetForm__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_targets_NotionTargetForm__WEBPACK_IMPORTED_MODULE_1__);\n// Target Registry - Реестр целей (destinations)\n// Импорты компонентов целей\n\n\n// Реестр всех доступных целей\nconst targetRegistry = {\n    googleSheets: {\n        label: \"Google Sheets\",\n        component: _targets_GoogleSheetsTargetForm__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n        defaultConfig: {\n            sheetId: \"\",\n            sheetName: \"\",\n            publicAccess: false\n        },\n        description: \"Отправлять данные в Google Таблицы\"\n    },\n    notion: {\n        label: \"Notion\",\n        component: (_targets_NotionTargetForm__WEBPACK_IMPORTED_MODULE_1___default()),\n        defaultConfig: {\n            integrationToken: \"\",\n            databaseId: \"\"\n        },\n        description: \"Отправлять данные в базу данных Notion\"\n    }\n};\n// Функция получения всех доступных целей для селекта\nconst getTargetOptions = ()=>{\n    return Object.entries(targetRegistry).map((param)=>{\n        let [key, config] = param;\n        return {\n            value: key,\n            label: config.label\n        };\n    });\n};\n// Функция получения конфигурации цели по типу\nconst getTargetConfig = (type)=>{\n    return targetRegistry[type] || null;\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL3JvdXRlL2NvbmZpZy90YXJnZXRSZWdpc3RyeS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxnREFBZ0Q7QUFpQmhELDRCQUE0QjtBQUMyQztBQUNaO0FBRTNELDhCQUE4QjtBQUN2QixNQUFNRSxpQkFBK0M7SUFDMURDLGNBQWM7UUFDWkMsT0FBTztRQUNQQyxXQUFXTCx1RUFBc0JBO1FBQ2pDTSxlQUFlO1lBQ2JDLFNBQVM7WUFDVEMsV0FBVztZQUNYQyxjQUFjO1FBQ2hCO1FBQ0FDLGFBQWE7SUFDZjtJQUNBQyxRQUFRO1FBQ05QLE9BQU87UUFDUEMsV0FBV0osa0VBQWdCQTtRQUMzQkssZUFBZTtZQUNiTSxrQkFBa0I7WUFDbEJDLFlBQVk7UUFDZDtRQUNBSCxhQUFhO0lBQ2Y7QUFFRixFQUFFO0FBRUYscURBQXFEO0FBQzlDLE1BQU1JLG1CQUFtQjtJQUM5QixPQUFPQyxPQUFPQyxPQUFPLENBQUNkLGdCQUFnQmUsR0FBRyxDQUFDO1lBQUMsQ0FBQ0MsS0FBS0MsT0FBTztlQUFNO1lBQzVEQyxPQUFPRjtZQUNQZCxPQUFPZSxPQUFPZixLQUFLO1FBQ3JCOztBQUNGLEVBQUU7QUFFRiw4Q0FBOEM7QUFDdkMsTUFBTWlCLGtCQUFrQixDQUFDQztJQUM5QixPQUFPcEIsY0FBYyxDQUFDb0IsS0FBSyxJQUFJO0FBQ2pDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvcm91dGUvY29uZmlnL3RhcmdldFJlZ2lzdHJ5LnRzP2FkMGUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGFyZ2V0IFJlZ2lzdHJ5IC0g0KDQtdC10YHRgtGAINGG0LXQu9C10LkgKGRlc3RpbmF0aW9ucylcclxuaW1wb3J0IHsgQ29tcG9uZW50VHlwZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbi8vINCY0L3RgtC10YDRhNC10LnRgSDQtNC70Y8g0LrQvtC90YTQuNCz0YPRgNCw0YbQuNC4INGG0LXQu9C4XHJcbmV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0Q29uZmlnIHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGNvbXBvbmVudDogQ29tcG9uZW50VHlwZTxUYXJnZXRGb3JtUHJvcHM+O1xyXG4gIGRlZmF1bHRDb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vINCY0L3RgtC10YDRhNC10LnRgSDQv9GA0L7Qv9GB0L7QsiDQtNC70Y8g0LrQvtC80L/QvtC90LXQvdGC0L7QsiDRhtC10LvQtdC5XHJcbmV4cG9ydCBpbnRlcmZhY2UgVGFyZ2V0Rm9ybVByb3BzIHtcclxuICBjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgb25DaGFuZ2U6IChjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHZvaWQ7XHJcbn1cclxuXHJcbi8vINCY0LzQv9C+0YDRgtGLINC60L7QvNC/0L7QvdC10L3RgtC+0LIg0YbQtdC70LXQuVxyXG5pbXBvcnQgR29vZ2xlU2hlZXRzVGFyZ2V0Rm9ybSBmcm9tICcuLi90YXJnZXRzL0dvb2dsZVNoZWV0c1RhcmdldEZvcm0nO1xyXG5pbXBvcnQgTm90aW9uVGFyZ2V0Rm9ybSBmcm9tICcuLi90YXJnZXRzL05vdGlvblRhcmdldEZvcm0nO1xyXG5cclxuLy8g0KDQtdC10YHRgtGAINCy0YHQtdGFINC00L7RgdGC0YPQv9C90YvRhSDRhtC10LvQtdC5XHJcbmV4cG9ydCBjb25zdCB0YXJnZXRSZWdpc3RyeTogUmVjb3JkPHN0cmluZywgVGFyZ2V0Q29uZmlnPiA9IHtcclxuICBnb29nbGVTaGVldHM6IHtcclxuICAgIGxhYmVsOiBcIkdvb2dsZSBTaGVldHNcIixcclxuICAgIGNvbXBvbmVudDogR29vZ2xlU2hlZXRzVGFyZ2V0Rm9ybSxcclxuICAgIGRlZmF1bHRDb25maWc6IHsgXHJcbiAgICAgIHNoZWV0SWQ6IFwiXCIsIFxyXG4gICAgICBzaGVldE5hbWU6IFwiXCIsXHJcbiAgICAgIHB1YmxpY0FjY2VzczogZmFsc2UgXHJcbiAgICB9LFxyXG4gICAgZGVzY3JpcHRpb246IFwi0J7RgtC/0YDQsNCy0LvRj9GC0Ywg0LTQsNC90L3Ri9C1INCyIEdvb2dsZSDQotCw0LHQu9C40YbRi1wiXHJcbiAgfSxcclxuICBub3Rpb246IHtcclxuICAgIGxhYmVsOiBcIk5vdGlvblwiLFxyXG4gICAgY29tcG9uZW50OiBOb3Rpb25UYXJnZXRGb3JtLFxyXG4gICAgZGVmYXVsdENvbmZpZzogeyBcclxuICAgICAgaW50ZWdyYXRpb25Ub2tlbjogXCJcIiwgXHJcbiAgICAgIGRhdGFiYXNlSWQ6IFwiXCIgXHJcbiAgICB9LFxyXG4gICAgZGVzY3JpcHRpb246IFwi0J7RgtC/0YDQsNCy0LvRj9GC0Ywg0LTQsNC90L3Ri9C1INCyINCx0LDQt9GDINC00LDQvdC90YvRhSBOb3Rpb25cIlxyXG4gIH1cclxuICAvLyDQl9C00LXRgdGMINC80L7QttC90L4g0LvQtdCz0LrQviDQtNC+0LHQsNCy0LjRgtGMINC90L7QstGL0LUg0YbQtdC70LhcclxufTtcclxuXHJcbi8vINCk0YPQvdC60YbQuNGPINC/0L7Qu9GD0YfQtdC90LjRjyDQstGB0LXRhSDQtNC+0YHRgtGD0L/QvdGL0YUg0YbQtdC70LXQuSDQtNC70Y8g0YHQtdC70LXQutGC0LBcclxuZXhwb3J0IGNvbnN0IGdldFRhcmdldE9wdGlvbnMgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRhcmdldFJlZ2lzdHJ5KS5tYXAoKFtrZXksIGNvbmZpZ10pID0+ICh7XHJcbiAgICB2YWx1ZToga2V5LFxyXG4gICAgbGFiZWw6IGNvbmZpZy5sYWJlbFxyXG4gIH0pKTtcclxufTtcclxuXHJcbi8vINCk0YPQvdC60YbQuNGPINC/0L7Qu9GD0YfQtdC90LjRjyDQutC+0L3RhNC40LPRg9GA0LDRhtC40Lgg0YbQtdC70Lgg0L/QviDRgtC40L/Rg1xyXG5leHBvcnQgY29uc3QgZ2V0VGFyZ2V0Q29uZmlnID0gKHR5cGU6IHN0cmluZyk6IFRhcmdldENvbmZpZyB8IG51bGwgPT4ge1xyXG4gIHJldHVybiB0YXJnZXRSZWdpc3RyeVt0eXBlXSB8fCBudWxsO1xyXG59O1xyXG4iXSwibmFtZXMiOlsiR29vZ2xlU2hlZXRzVGFyZ2V0Rm9ybSIsIk5vdGlvblRhcmdldEZvcm0iLCJ0YXJnZXRSZWdpc3RyeSIsImdvb2dsZVNoZWV0cyIsImxhYmVsIiwiY29tcG9uZW50IiwiZGVmYXVsdENvbmZpZyIsInNoZWV0SWQiLCJzaGVldE5hbWUiLCJwdWJsaWNBY2Nlc3MiLCJkZXNjcmlwdGlvbiIsIm5vdGlvbiIsImludGVncmF0aW9uVG9rZW4iLCJkYXRhYmFzZUlkIiwiZ2V0VGFyZ2V0T3B0aW9ucyIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJrZXkiLCJjb25maWciLCJ2YWx1ZSIsImdldFRhcmdldENvbmZpZyIsInR5cGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/route/config/targetRegistry.ts\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/components/route/targets/NotionTargetForm.tsx":
/*!***********************************************************!*\
  !*** ./src/components/route/targets/NotionTargetForm.tsx ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ })

});