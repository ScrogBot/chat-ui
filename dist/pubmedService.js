var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
const fetchArticles = (querykey, webenv) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=xml`);
        const xmlData = yield response.text();
        const parser = new XMLParser();
        const data = parser.parse(xmlData);
        // Log the data to understand the structure
        console.log('Fetched data:', data);
        // Map the response to an array of PubMedArticle
        const articles = data.PubmedArticleSet.PubmedArticle.map((article) => {
            var _a;
            return ({
                id: article.MedlineCitation.PMID,
                title: article.MedlineCitation.Article.ArticleTitle,
                abstract: ((_a = article.MedlineCitation.Article.Abstract) === null || _a === void 0 ? void 0 : _a.AbstractText) || 'No abstract available',
            });
        });
        return articles;
    }
    catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
});
export const performPubMedSearch = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json&retmax=20&rettype=abstract`);
        const data = yield response.json();
        return data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in performPubMedSearch: ${error.message}`);
            throw new Error(`Failed to perform PubMed search: ${error.message}`);
        }
        else {
            console.error(`Error in performPubMedSearch: ${String(error)}`);
            throw new Error(`Failed to perform PubMed search: ${String(error)}`);
        }
    }
});
export const performPubMedFetch = (querykey, webenv) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield fetchArticles(querykey, webenv);
        console.log(`performPubMedFetch articles: ${JSON.stringify(articles)}`);
        return { articles };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error in performPubMedFetch: ${error.message}`);
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
        else {
            console.error(`Error in performPubMedFetch: ${String(error)}`);
            throw new Error(`Failed to fetch articles: ${String(error)}`);
        }
    }
});
