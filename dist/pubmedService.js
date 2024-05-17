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
exports.performPubMedFetch = exports.performPubMedSearch = void 0;
const xmldom_1 = require("xmldom");
const performPubMedSearch = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json`);
    const data = yield response.json();
    return data;
});
exports.performPubMedSearch = performPubMedSearch;
const performPubMedFetch = (webenv, querykey) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=xml&retmax=15&rettype=abstract`);
    const textData = yield response.text();
    const parser = new xmldom_1.DOMParser();
    const xmlDoc = parser.parseFromString(textData, "application/xml");
    const articles = Array.from(xmlDoc.getElementsByTagName("PubmedArticle")).map(article => {
        var _a;
        const id = article.getElementsByTagName("PMID")[0].textContent || '';
        const title = ((_a = article.getElementsByTagName("ArticleTitle")[0]) === null || _a === void 0 ? void 0 : _a.textContent) || '';
        const abstractNode = article.getElementsByTagName("AbstractText")[0];
        const abstract = abstractNode ? abstractNode.textContent : '';
        const authors = Array.from(article.getElementsByTagName("Author")).map(author => {
            var _a, _b;
            const lastName = ((_a = author.getElementsByTagName("LastName")[0]) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            const foreName = ((_b = author.getElementsByTagName("ForeName")[0]) === null || _b === void 0 ? void 0 : _b.textContent) || '';
            return `${foreName} ${lastName}`;
        });
        return {
            id,
            title,
            abstract,
            authors,
        };
    });
    return { articles };
});
exports.performPubMedFetch = performPubMedFetch;
