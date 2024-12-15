import { supabase } from '@/lib/supabase/browser-client';
import { TablesInsert, TablesUpdate } from '@/supabase/types';

export const getGameResultByUserID = async (userId: string) => {
  const { data: game } = await supabase
    .from('game_results')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return game;
};

export const getGameResultByUserIDAndGameId = async (
  userId: string,
  questionId: number
) => {
  const { data: game } = await supabase
    .from('game_results')
    .select('*')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .maybeSingle();

  return game;
};

export const createGame = async (game: TablesInsert<'game_results'>) => {
  const { data: createdGame, error } = await supabase
    .from('game_results')
    .insert([game])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdGame;
};

export const updateGameScore = async (gameId: string, score: number) => {
  const { data: updatedGame, error } = await supabase
    .from('game_results')
    .update({ score: score })
    .eq('id', gameId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedGame;
};

export const updateGameQuestionCount = async (
  gameId: string,
  questionCount: number
) => {
  const { data: updatedGame, error } = await supabase
    .from('game_results')
    .update({ question_count: questionCount })
    .eq('id', gameId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedGame;
};
