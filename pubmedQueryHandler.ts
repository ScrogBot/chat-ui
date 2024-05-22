import { performPubMedSearch, performPubMedFetch, PubMedArticle } from './src/pubmedService';

interface UserQueryResponse {
  articles: PubMedArticle[];
  error?: string;
}

export const handleUserQuery = async (userInput: string): Promise<UserQueryResponse> => {
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

const processJsonInput = async (json: any) => {
  try {
    if (json.functionName === "handleUserQuery" && json.parameters?.userInput) {
      const result = await handleUserQuery(json.parameters.userInput);
      console.log(result);
    } else {
      console.error("Invalid function name or parameters");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in processJsonInput: ${error.message}`);
    } else {
      console.error(`Unexpected error in processJsonInput: ${error}`);
    }
  }
};

// Simulating JSON input (this would come from your chat bot in a real scenario)
const jsonInput = {
  "functionName": "handleUserQuery",
  "parameters": {
    "userInput": "example search query"
  }
};

// Process the JSON input
processJsonInput(jsonInput);
