import Loading from '@/app/[locale]/loading';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useParams } from 'next/navigation';
import { FC, useContext, useEffect, useState } from 'react';
import { getGameResultByGameType } from '@/db/games';
import { getProfileByUserId } from '@/db/profile';
import { ChatbotUIContext } from '@/context/context';

interface GameResultProps {}

export const GameResult: FC<GameResultProps> = ({}) => {
  const params = useParams();
  const gameType = params.gametype;
  console.log('gameType:', gameType);

  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isReasponseExpanded, setIsResponseExpanded] = useState(false);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);

  const { profile } = useContext(ChatbotUIContext);

  let gameTypeString = gameType as string;
  console.log('gameTypeString:', gameTypeString);

  useEffect(() => {
    const fetchGameResult = async () => {
      setLoading(true);
      try {
        const gameResults = await getGameResultByGameType(gameTypeString);
        console.log('gameResults:', gameResults);

        const updatedUserResults: any[] = [];
        for (const gameResult of gameResults) {
          const user_id: string = gameResult.user_id.toString().trim();
          const profile = await getProfileByUserId(user_id);

          if (!updatedUserResults.find(user => user.id === profile.id)) {
            updatedUserResults.push({
              id: profile.id,
              name: profile.display_name,
              team: profile.team,
              department: profile.department,
              user_id: gameResult.user_id,
              score: gameResult.score,
              question_count: gameResult.question_count
            });
          } else {
            const user = updatedUserResults.find(
              user => user.id === profile.id
            );
            if (user) {
              user.score += gameResult.score;
              user.question_count += gameResult.question_count;
            }
          }
        }

        updatedUserResults.sort((a, b) => b.score - a.score);
        setUserResults(updatedUserResults);
      } catch (error) {
        console.error('Failed to fetch game results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResult();
  }, []);

  const handleDetailClick = async (userId: string) => {
    if (activeUserId === userId) {
      setActiveUserId(null);
      setDetailData([]);
      return;
    }

    setLoading(true);
    try {
      const gameResults = await getGameResultByGameType(gameTypeString);
      const userDetails = gameResults.filter(
        (result: any) => result.user_id === userId
      );
      setDetailData(userDetails);
      setActiveUserId(userId);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Leaderboard</h1>
      {loading ? (
        <Loading />
      ) : (
        <Table>
          <TableCaption>Top Players</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">순위</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>팀</TableHead>
              <TableHead>소속</TableHead>
              <TableHead className="text-right">점수</TableHead>
              <TableHead className="text-right">세부정보</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userResults.length > 0 ? (
              userResults.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={user.id === profile?.id ? 'bg-blue-700' : ''}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell className="text-right">
                    {user.score ?? 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleDetailClick(user.user_id)}
                    >
                      {activeUserId === user.user_id ? '닫기' : '보기'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {activeUserId && detailData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">세부정보 </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead>context</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Reasoning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailData.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.question}</TableCell>
                  <TableCell>
                    {isPromptExpanded
                      ? detail.prompt
                      : truncateText(detail.prompt, 50)}
                    <button
                      className="ml-2 text-blue-500 hover:underline"
                      onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    >
                      {isPromptExpanded ? '간략히' : '더보기'}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div>
                      {isContextExpanded
                        ? detail.context
                        : truncateText(detail.context, 50)}
                      <button
                        className="ml-2 text-blue-500 hover:underline"
                        onClick={() => setIsContextExpanded(!isContextExpanded)}
                      >
                        {isContextExpanded ? '간략히' : '더보기'}
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>{detail.file}</TableCell>
                  <TableCell>
                    <div>
                      {isReasponseExpanded
                        ? detail.response
                        : truncateText(detail.response, 50)}
                      <button
                        className="ml-2 text-blue-500 hover:underline"
                        onClick={() =>
                          setIsResponseExpanded(!isReasponseExpanded)
                        }
                      >
                        {isReasponseExpanded ? '간략히' : '더보기'}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{detail.score}</TableCell>
                  <TableCell>
                    <div>
                      {isReasoningExpanded
                        ? detail.reason
                        : truncateText(detail.reason, 50)}
                      <button
                        className="ml-2 text-blue-500 hover:underline"
                        onClick={() =>
                          setIsReasoningExpanded(!isReasoningExpanded)
                        }
                      >
                        {isReasoningExpanded ? '간략히' : '더보기'}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
