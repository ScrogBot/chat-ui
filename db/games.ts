import { supabase } from '@/lib/supabase/browser-client';
import { TablesInsert, TablesUpdate } from '@/supabase/types';

export const getGameResultByUserID = async (userId: string) => {
  const { data: chat } = await supabase
    .from('game_results')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return chat;
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

export const updateGame = async (
  gameId: string,
  game: TablesUpdate<'game_results'>
) => {
  const { data: updatedGame, error } = await supabase
    .from('game_results')
    .update(game)
    .eq('id', gameId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedGame;
};

export const deleteChat = async (chatId: string) => {
  const { error } = await supabase.from('chats').delete().eq('id', chatId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
