// pubmedService.ts

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
  };
}

export interface PubMedArticle {
  id: string;
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
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=json&retmax=15&rettype=abstract`);
  const data: any = await response.json();
  // Transform the data to match PubMedArticle[]
  const articles: PubMedArticle[] = data.map((article: any) => ({
    id: article.uid,
    // Add other fields if necessary
  }));
  return { articles };
};
