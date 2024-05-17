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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserQuery = void 0;
const pubmedService_1 = require("./pubmedService");
const handleUserQuery = (userInput) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchResponse = yield (0, pubmedService_1.performPubMedSearch)(userInput);
        if (searchResponse.esearchresult.idlist.length === 0) {
            return { articles: [], error: 'No articles found for the given query.' };
        }
        const { webenv, querykey } = searchResponse.esearchresult;
        const fetchResponse = yield (0, pubmedService_1.performPubMedFetch)(webenv, querykey);
        return { articles: fetchResponse.articles };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in handleUserQuery: ${error.message}`);
            return { articles: [], error: `Error fetching articles: ${error.message}` };
        }
        else {
            console.error(`Unexpected error in handleUserQuery: ${error}`);
            return { articles: [], error: 'An unexpected error occurred' };
        }
    }
});
exports.handleUserQuery = handleUserQuery;
const processJsonInput = (json) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (json.functionName === "handleUserQuery" && ((_a = json.parameters) === null || _a === void 0 ? void 0 : _a.userInput)) {
            const result = yield (0, exports.handleUserQuery)(json.parameters.userInput);
            console.log(result);
        }
        else {
            console.error("Invalid function name or parameters");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in processJsonInput: ${error.message}`);
        }
        else {
            console.error(`Unexpected error in processJsonInput: ${error}`);
        }
    }
});
// Simulating JSON input (this would come from your chat bot in a real scenario)
const jsonInput = {
    "functionName": "handleUserQuery",
    "parameters": {
        "userInput": "example search query"
    }
};
// Process the JSON input
processJsonInput(jsonInput);
