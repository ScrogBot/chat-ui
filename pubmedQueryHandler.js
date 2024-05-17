"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserQuery = void 0;
var pubmedService_ts_1 = require("./pubmedService.ts");
var handleUserQuery = function (userInput) { return __awaiter(void 0, void 0, void 0, function () {
    var searchResponse, _a, webenv, querykey, fetchResponse, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, pubmedService_ts_1.performPubMedSearch)(userInput)];
            case 1:
                searchResponse = _b.sent();
                if (searchResponse.esearchresult.idlist.length === 0) {
                    return [2 /*return*/, { articles: [], error: 'No articles found for the given query.' }];
                }
                _a = searchResponse.esearchresult, webenv = _a.webenv, querykey = _a.querykey;
                return [4 /*yield*/, (0, pubmedService_ts_1.performPubMedFetch)(webenv, querykey)];
            case 2:
                fetchResponse = _b.sent();
                return [2 /*return*/, { articles: fetchResponse.articles }];
            case 3:
                error_1 = _b.sent();
                console.error("Error in handleUserQuery: ".concat(error_1.message));
                return [2 /*return*/, { articles: [], error: "Error fetching articles: ".concat(error_1.message) }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.handleUserQuery = handleUserQuery;
var processJsonInput = function (json) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                if (!(json.functionName === "handleUserQuery" && ((_a = json.parameters) === null || _a === void 0 ? void 0 : _a.userInput))) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.handleUserQuery)(json.parameters.userInput)];
            case 1:
                result = _b.sent();
                console.log(result);
                return [3 /*break*/, 3];
            case 2:
                console.error("Invalid function name or parameters");
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Error in processJsonInput: ".concat(error_2.message));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Simulating JSON input (this would come from your chat bot in a real scenario)
var jsonInput = {
    "functionName": "handleUserQuery",
    "parameters": {
        "userInput": "example search query"
    }
};
// Process the JSON input
processJsonInput(jsonInput);
