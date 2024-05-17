import type { NextApiRequest, NextApiResponse } from 'next';
import { performPubMedSearch, performPubMedFetch, PubMedArticle } from '../../lib/pubmedService';

interface UserQueryResponse {
  articles: PubMedArticle[];
  error?: string;
}

const handleUserQuery = async (userInput: string): Promise<UserQueryResponse> => {
  try {
    const searchResponse = await performPubMedSearch(userInput);

    if (searchResponse.esearchresult.idlist.length === 0) {
      return { articles: [], error: 'No articles found for the given query.' };
    }

    const { webenv, querykey } = searchResponse.esearchresult;
    const fetchResponse = await performPubMedFetch(webenv, querykey);

    return { articles: fetchResponse.articles };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in handleUserQuery: ${error.message}`);
      return { articles: [], error: `Error fetching articles: ${error.message}` };
    } else {
      console.error(`Unexpected error in handleUserQuery: ${error}`);
      return { articles: [], error: 'An unexpected error occurred' };
    }
  }
};

const processJsonInput = async (req: NextApiRequest, res: NextApiResponse) => {
  const json = req.body;

  try {
    if (json.functionName === "handleUserQuery" && json.parameters?.userInput) {
      const result = await handleUserQuery(json.parameters.userInput);
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: "Invalid function name or parameters" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in processJsonInput: ${error.message}`);
      res.status(500).json({ error: `Error processing input: ${error.message}` });
    } else {
      console.error(`Unexpected error in processJsonInput: ${error}`);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export default processJsonInput;
