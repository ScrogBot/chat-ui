import { performPubMedSearch, performPubMedFetch } from './pubmedService.js';

const testPerformPubMedSearch = async (query: string) => {
  try {
    const searchResults = await performPubMedSearch(query);
    console.log('Search Results:', searchResults);
    
    const { querykey, webenv } = searchResults.esearchresult;
    if (querykey && webenv) {
      const fetchResults = await performPubMedFetch(querykey, webenv);
      console.log('Fetch Results:', fetchResults);
    } else {
      console.log('No query key or web environment found for the query.');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
};

const query = 'COVID-19 and new lupus'; // Replace with your test query
testPerformPubMedSearch(query);
