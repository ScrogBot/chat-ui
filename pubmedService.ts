import { DOMParser } from 'xmldom';

export interface PubMedSearchResponse {
  header: {
    type: string;
    version: string;
  };
  esearchresult: {
    count: string;
    retmax: string;
    retstart: string;
    querykey: string;
    webenv: string;
    idlist: string[];
    translationset: any[];
    querytranslation: string;
  }
}

export interface PubMedArticle {
  id: string;
  title?: string;
  abstract: abstract !== null ? abstract : undefined,
  authors?: string[];
  // Add other fields if necessary
}

export interface PubMedFetchResponse {
  articles: PubMedArticle[];
}

export const performPubMedSearch = async (query: string): Promise<PubMedSearchResponse> => {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json`);
  const data: PubMedSearchResponse = await response.json();
  return data;
};

export const performPubMedFetch = async (webenv: string, querykey: string): Promise<PubMedFetchResponse> => {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=xml&retmax=15&rettype=abstract`);
  const textData = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(textData, "application/xml");

  const articles: PubMedArticle[] = Array.from(xmlDoc.getElementsByTagName("PubmedArticle")).map(article => {
    const id = article.getElementsByTagName("PMID")[0].textContent || '';
    const title = article.getElementsByTagName("ArticleTitle")[0]?.textContent || '';
    const abstractNode = article.getElementsByTagName("AbstractText")[0];
    const abstract = abstractNode ? abstractNode.textContent : '';
    const authors = Array.from(article.getElementsByTagName("Author")).map(author => {
      const lastName = author.getElementsByTagName("LastName")[0]?.textContent || '';
      const foreName = author.getElementsByTagName("ForeName")[0]?.textContent || '';
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
};
