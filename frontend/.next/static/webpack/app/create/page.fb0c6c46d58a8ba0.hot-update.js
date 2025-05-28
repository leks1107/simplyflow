/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/create/page",{

/***/ "(app-pages-browser)/./src/components/route/config/sourceRegistry.ts":
/*!*******************************************************!*\
  !*** ./src/components/route/config/sourceRegistry.ts ***!
  \*******************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSourceConfig: function() { return /* binding */ getSourceConfig; },\n/* harmony export */   getSourceOptions: function() { return /* binding */ getSourceOptions; },\n/* harmony export */   sourceRegistry: function() { return /* binding */ sourceRegistry; }\n/* harmony export */ });\n/* harmony import */ var _sources_TypeformSourceForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sources/TypeformSourceForm */ \"(app-pages-browser)/./src/components/route/sources/TypeformSourceForm.tsx\");\n/* harmony import */ var _sources_TallySourceForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sources/TallySourceForm */ \"(app-pages-browser)/./src/components/route/sources/TallySourceForm.tsx\");\n/* harmony import */ var _sources_TallySourceForm__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sources_TallySourceForm__WEBPACK_IMPORTED_MODULE_1__);\n// Source Registry - Реестр источников данных\n// Импорты компонентов источников\n\n\n// Реестр всех доступных источников\nconst sourceRegistry = {\n    typeform: {\n        label: \"Typeform\",\n        component: _sources_TypeformSourceForm__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n        defaultConfig: {\n            secret: \"\"\n        },\n        description: \"Получать данные из форм Typeform\"\n    },\n    tally: {\n        label: \"Tally\",\n        component: (_sources_TallySourceForm__WEBPACK_IMPORTED_MODULE_1___default()),\n        defaultConfig: {\n            apiKey: \"\"\n        },\n        description: \"Получать данные из форм Tally\"\n    }\n};\n// Функция получения всех доступных источников для селекта\nconst getSourceOptions = ()=>{\n    return Object.entries(sourceRegistry).map((param)=>{\n        let [key, config] = param;\n        return {\n            value: key,\n            label: config.label\n        };\n    });\n};\n// Функция получения конфигурации источника по типу\nconst getSourceConfig = (type)=>{\n    return sourceRegistry[type] || null;\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL3JvdXRlL2NvbmZpZy9zb3VyY2VSZWdpc3RyeS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBNkM7QUFrQjdDLGlDQUFpQztBQUM4QjtBQUNOO0FBRXpELG1DQUFtQztBQUM1QixNQUFNRSxpQkFBK0M7SUFDMURDLFVBQVU7UUFDUkMsT0FBTztRQUNQQyxXQUFXTCxtRUFBa0JBO1FBQzdCTSxlQUFlO1lBQUVDLFFBQVE7UUFBRztRQUM1QkMsYUFBYTtJQUNmO0lBQ0FDLE9BQU87UUFDTEwsT0FBTztRQUNQQyxXQUFXSixpRUFBZUE7UUFDMUJLLGVBQWU7WUFBRUksUUFBUTtRQUFHO1FBQzVCRixhQUFhO0lBQ2Y7QUFFRixFQUFFO0FBRUYsMERBQTBEO0FBQ25ELE1BQU1HLG1CQUFtQjtJQUM5QixPQUFPQyxPQUFPQyxPQUFPLENBQUNYLGdCQUFnQlksR0FBRyxDQUFDO1lBQUMsQ0FBQ0MsS0FBS0MsT0FBTztlQUFNO1lBQzVEQyxPQUFPRjtZQUNQWCxPQUFPWSxPQUFPWixLQUFLO1FBQ3JCOztBQUNGLEVBQUU7QUFFRixtREFBbUQ7QUFDNUMsTUFBTWMsa0JBQWtCLENBQUNDO0lBQzlCLE9BQU9qQixjQUFjLENBQUNpQixLQUFLLElBQUk7QUFDakMsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvY29tcG9uZW50cy9yb3V0ZS9jb25maWcvc291cmNlUmVnaXN0cnkudHM/NGI3YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTb3VyY2UgUmVnaXN0cnkgLSDQoNC10LXRgdGC0YAg0LjRgdGC0L7Rh9C90LjQutC+0LIg0LTQsNC90L3Ri9GFXHJcbmltcG9ydCB7IENvbXBvbmVudFR5cGUgfSBmcm9tICdyZWFjdCc7XHJcblxyXG4vLyDQmNC90YLQtdGA0YTQtdC50YEg0LTQu9GPINC60L7QvdGE0LjQs9GD0YDQsNGG0LjQuCDQuNGB0YLQvtGH0L3QuNC60LBcclxuZXhwb3J0IGludGVyZmFjZSBTb3VyY2VDb25maWcge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFNvdXJjZUZvcm1Qcm9wcz47XHJcbiAgZGVmYXVsdENvbmZpZzogUmVjb3JkPHN0cmluZywgYW55PjtcclxuICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxufVxyXG5cclxuLy8g0JjQvdGC0LXRgNGE0LXQudGBINC/0YDQvtC/0YHQvtCyINC00LvRjyDQutC+0LzQv9C+0L3QtdC90YLQvtCyINC40YHRgtC+0YfQvdC40LrQvtCyXHJcbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlRm9ybVByb3BzIHtcclxuICBjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT47XHJcbiAgb25DaGFuZ2U6IChjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHZvaWQ7XHJcbiAgd2ViaG9va1VybD86IHN0cmluZztcclxufVxyXG5cclxuLy8g0JjQvNC/0L7RgNGC0Ysg0LrQvtC80L/QvtC90LXQvdGC0L7QsiDQuNGB0YLQvtGH0L3QuNC60L7QslxyXG5pbXBvcnQgVHlwZWZvcm1Tb3VyY2VGb3JtIGZyb20gJy4uL3NvdXJjZXMvVHlwZWZvcm1Tb3VyY2VGb3JtJztcclxuaW1wb3J0IFRhbGx5U291cmNlRm9ybSBmcm9tICcuLi9zb3VyY2VzL1RhbGx5U291cmNlRm9ybSc7XHJcblxyXG4vLyDQoNC10LXRgdGC0YAg0LLRgdC10YUg0LTQvtGB0YLRg9C/0L3Ri9GFINC40YHRgtC+0YfQvdC40LrQvtCyXHJcbmV4cG9ydCBjb25zdCBzb3VyY2VSZWdpc3RyeTogUmVjb3JkPHN0cmluZywgU291cmNlQ29uZmlnPiA9IHtcclxuICB0eXBlZm9ybToge1xyXG4gICAgbGFiZWw6IFwiVHlwZWZvcm1cIixcclxuICAgIGNvbXBvbmVudDogVHlwZWZvcm1Tb3VyY2VGb3JtLFxyXG4gICAgZGVmYXVsdENvbmZpZzogeyBzZWNyZXQ6IFwiXCIgfSxcclxuICAgIGRlc2NyaXB0aW9uOiBcItCf0L7Qu9GD0YfQsNGC0Ywg0LTQsNC90L3Ri9C1INC40Lcg0YTQvtGA0LwgVHlwZWZvcm1cIlxyXG4gIH0sXHJcbiAgdGFsbHk6IHtcclxuICAgIGxhYmVsOiBcIlRhbGx5XCIsXHJcbiAgICBjb21wb25lbnQ6IFRhbGx5U291cmNlRm9ybSxcclxuICAgIGRlZmF1bHRDb25maWc6IHsgYXBpS2V5OiBcIlwiIH0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCLQn9C+0LvRg9GH0LDRgtGMINC00LDQvdC90YvQtSDQuNC3INGE0L7RgNC8IFRhbGx5XCJcclxuICB9XHJcbiAgLy8g0JfQtNC10YHRjCDQvNC+0LbQvdC+INC70LXQs9C60L4g0LTQvtCx0LDQstC40YLRjCDQvdC+0LLRi9C1INC40YHRgtC+0YfQvdC40LrQuFxyXG59O1xyXG5cclxuLy8g0KTRg9C90LrRhtC40Y8g0L/QvtC70YPRh9C10L3QuNGPINCy0YHQtdGFINC00L7RgdGC0YPQv9C90YvRhSDQuNGB0YLQvtGH0L3QuNC60L7QsiDQtNC70Y8g0YHQtdC70LXQutGC0LBcclxuZXhwb3J0IGNvbnN0IGdldFNvdXJjZU9wdGlvbnMgPSAoKSA9PiB7XHJcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHNvdXJjZVJlZ2lzdHJ5KS5tYXAoKFtrZXksIGNvbmZpZ10pID0+ICh7XHJcbiAgICB2YWx1ZToga2V5LFxyXG4gICAgbGFiZWw6IGNvbmZpZy5sYWJlbFxyXG4gIH0pKTtcclxufTtcclxuXHJcbi8vINCk0YPQvdC60YbQuNGPINC/0L7Qu9GD0YfQtdC90LjRjyDQutC+0L3RhNC40LPRg9GA0LDRhtC40Lgg0LjRgdGC0L7Rh9C90LjQutCwINC/0L4g0YLQuNC/0YNcclxuZXhwb3J0IGNvbnN0IGdldFNvdXJjZUNvbmZpZyA9ICh0eXBlOiBzdHJpbmcpOiBTb3VyY2VDb25maWcgfCBudWxsID0+IHtcclxuICByZXR1cm4gc291cmNlUmVnaXN0cnlbdHlwZV0gfHwgbnVsbDtcclxufTtcclxuIl0sIm5hbWVzIjpbIlR5cGVmb3JtU291cmNlRm9ybSIsIlRhbGx5U291cmNlRm9ybSIsInNvdXJjZVJlZ2lzdHJ5IiwidHlwZWZvcm0iLCJsYWJlbCIsImNvbXBvbmVudCIsImRlZmF1bHRDb25maWciLCJzZWNyZXQiLCJkZXNjcmlwdGlvbiIsInRhbGx5IiwiYXBpS2V5IiwiZ2V0U291cmNlT3B0aW9ucyIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJrZXkiLCJjb25maWciLCJ2YWx1ZSIsImdldFNvdXJjZUNvbmZpZyIsInR5cGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/route/config/sourceRegistry.ts\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/components/route/sources/TallySourceForm.tsx":
/*!**********************************************************!*\
  !*** ./src/components/route/sources/TallySourceForm.tsx ***!
  \**********************************************************/
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