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
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Tables } from '@/supabase/types';
import { FC, useContext, useEffect, useState } from 'react';
import { getGameResultByQuestionId } from '@/db/games';
import { getProfileByUserId } from '@/db/profile';

interface GameResultProps {}

export const GameResult: FC<GameResultProps> = ({}) => {
  const params = useParams();
  const questionId = params.gameId;

  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert questionId to number
  const questionIdNumber =
    typeof questionId === 'string' ? parseInt(questionId) : -1;

  // Fetch game results
  useEffect(() => {
    console.log('useEffect');

    const fetchGameResult = async () => {
      console.log('Fetching game results...');

      setLoading(true);
      try {
        const gameResults = await getGameResultByQuestionId(questionIdNumber);

        const updatedUserResults: any[] = [];
        for (const gameResult of gameResults) {
          // Fetch user profile by user_id
          // Convert user_id to string and delete spaces
          const user_id: string = gameResult.user_id.toString().trim();
          console.log('user_id:', user_id);

          const profile = await getProfileByUserId(user_id);

          // if id is not found in userResults, add it to userResults
          // if score is null, do not add it to userResults
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
          }
        }

        // sort userResults by score
        updatedUserResults.sort((a, b) => b.score - a.score);
        setUserResults(updatedUserResults); // Update state
      } catch (error) {
        console.error('Failed to fetch game results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResult();
  }, []);

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {userResults.length > 0 ? (
              userResults.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell className="text-right">
                    {user.score ?? 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
