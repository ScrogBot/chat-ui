// src/pubmed.ts
export interface PubMedArticle {
  title: string;
  abstract: string;
  pmid: string;
  url: string;
}

export async function fetchPubMedArticles(query: string): Promise<PubMedArticle[]> {
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retstart=0&retmax=15&usehistory=y&format=json`;

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error('Error performing e-search');
  }

  const searchData = await searchResponse.json();
  const webenv = searchData.esearchresult.webenv;
  const queryKey = searchData.esearchresult.querykey;

  const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&webenv=${webenv}&query_key=${queryKey}&retmode=xml&retmax=15&rettype=abstract`;
  const fetchResponse = await fetch(fetchUrl);
  if (!fetchResponse.ok) {
    throw new Error('Error fetching abstracts');
  }

  const fetchData = await fetchResponse.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fetchData, "application/xml");

  const articles: PubMedArticle[] = Array.from(xmlDoc.getElementsByTagName('PubmedArticle')).map(article => {
    const title = article.getElementsByTagName('ArticleTitle')[0]?.textContent || 'No title';
    const abstract = article.getElementsByTagName('AbstractText')[0]?.textContent || 'No abstract available';
    const pmid = article.getElementsByTagName('PMID')[0]?.textContent || 'No PMID';
    const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

    return { title, abstract, pmid, url };
  });

  return articles;
}
