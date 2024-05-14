// src/pubmedService.ts
import axios from 'axios';

export interface PubMedSearchResponse {
  esearchresult: {
    count: string;
    retmax: string;
    retstart: string;
    querykey: string;
    webenv: string;
    idlist: string[];
  };
}

export const performPubMedSearch = async (query: string): Promise<PubMedSearchResponse> => {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json`);
  const data: PubMedSearchResponse = await response.json();
  return data;
};


export interface PubMedSearchResponse {
  query: string;
  results: PubMedArticle[];
}

export async function performPubMedSearch(query: string): Promise<PubMedSearchResponse> {
  const searchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
  const searchParams = {
    db: "pubmed",
    term: query,
    usehistory: "y",
    retmode: "json"
  };

  const searchResponse = await axios.get(searchUrl, { params: searchParams });
  const searchData = searchResponse.data;

  const webenv = searchData.esearchresult.webenv;
  const queryKey = searchData.esearchresult.querykey;

  const fetchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
  const fetchParams = {
    db: "pubmed",
    webenv: webenv,
    query_key: queryKey,
    retmode: "xml",
    retmax: 15,
    rettype: "abstract"
  };

  const fetchResponse = await axios.get(fetchUrl, { params: fetchParams });
  const fetchData = fetchResponse.data;

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fetchData, "application/xml");

  const articles: PubMedArticle[] = Array.from(xmlDoc.getElementsByTagName('PubmedArticle')).map(article => {
    const title = article.getElementsByTagName('ArticleTitle')[0]?.textContent || 'No title';
    const abstract = article.getElementsByTagName('AbstractText')[0]?.textContent || 'No abstract available';
    const pmid = article.getElementsByTagName('PMID')[0]?.textContent || 'No PMID';
    const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

    return { title, abstract, pmid, url };
  });

  return {
    query: query,
    results: articles
  };
}
