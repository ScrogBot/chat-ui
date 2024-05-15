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

export interface PubMedFetchResponse {
  result: {
    [key: string]: {
      uid: string;
      title: string;
      abstract: string;
      source: string;
      authors: string[];
      pubdate: string;
    };
  };
}

export const performPubMedSearch = async (query: string): Promise<PubMedSearchResponse> => {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json`);
  const data: PubMedSearchResponse = await response.json();
  return data;
};

export const performPubMedFetch = async (webenv: string, querykey: string): Promise<PubMedFetchResponse> => {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=json&retmax=15&rettype=abstract`);
  const data: PubMedFetchResponse = await response.json();
  return data;
};
