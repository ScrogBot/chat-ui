var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { performPubMedSearch, performPubMedFetch } from './pubmedService.js';
const testPerformPubMedSearch = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchResults = yield performPubMedSearch(query);
        console.log('Search Results:', searchResults);
        const { querykey, webenv } = searchResults.esearchresult;
        if (querykey && webenv) {
            const fetchResults = yield performPubMedFetch(querykey, webenv);
            console.log('Fetch Results:', fetchResults);
        }
        else {
            console.log('No query key or web environment found for the query.');
        }
    }
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
});
const query = 'COVID-19 and new lupus'; // Replace with your test query
testPerformPubMedSearch(query);
