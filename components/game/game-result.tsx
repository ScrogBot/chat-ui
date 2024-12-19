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

interface GameResultProps {}

export const GameResult: FC<GameResultProps> = ({}) => {
  const params = useParams();

  // Extract questionId from params
  const questionId = params.gameId;
  const [gameResults, setGameResults] = useState<Tables<'game_results'>>();
  const [loading, setLoading] = useState(true);

  console.log('params:', params);
  console.log('questionId:', questionId);

  // Convert questionId to number
  const questionIdNumber =
    typeof questionId === 'string' ? parseInt(questionId) : -1;

  console.log('questionIdNumber:', questionIdNumber);

  // Fetch game results
  useEffect(() => {
    console.log('useEffect');

    const fetchGameResult = async () => {
      console.log('Fetching game results...');

      setLoading(true);
      try {
        const results = await getGameResultByQuestionId(questionIdNumber);
        console.log('results:', results);
        setGameResults(results);
      } catch (error) {
        console.error('Failed to fetch game results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameResult();
  }, []);

  console.log('gameResults:', gameResults);

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
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gameResults ? (
              <TableRow>
                <TableCell className="font-medium">{gameResults.id}</TableCell>
                <TableCell>{gameResults.name}</TableCell>
                <TableCell className="text-right">
                  {gameResults.score ?? 'N/A'}
                </TableCell>
                <TableCell>{gameResults.folder_id ?? 'No Folder'}</TableCell>
                <TableCell>{gameResults.question_count}</TableCell>
                <TableCell>{gameResults.user_id}</TableCell>
              </TableRow>
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
    </div>
  );
};
