import { Database, Tables, TablesInsert, TablesUpdate } from '@/supabase/types';
import { ChatSettings } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { CreateMessage, OpenAIStream, StreamingTextResponse } from 'ai';
import { ServerRuntime } from 'next';
import OpenAI from 'openai';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs';
import { getServerProfile } from '@/lib/server/server-chat-helpers';
import { wrapOpenAI } from 'langsmith/wrappers';
import { traceable } from 'langsmith/traceable';
import {
  createGame,
  getGameResultByUserID,
  getGameResultByUserIDAndGameIdAndType,
  updateGameQuestionCount,
  updateGameScore
} from '@/db/games';
import { TableContent } from 'mdast';

export const runtime: ServerRuntime = 'edge';

export async function POST(request: Request) {
  const json = await request.json();

  let { chatSettings, messages, customModelId } = json as {
    chatSettings: ChatSettings;
    messages: any[];
    customModelId: string;
  };

  console.log('customModelId', customModelId);
  // convert customModelId to int
  const customModelIdInt = parseInt(customModelId);

  try {
    const profile = await getServerProfile();

    const latestUserMessage = messages
      .filter(message => message.role === 'user')
      .pop();

    // console.log('latestUserMessage', latestUserMessage.content);

    const url = 'https://ryeon.elpai.org/submit/v1';
    const model = 'olympiad';

    let game = (await getGameResultByUserIDAndGameIdAndType(
      profile.user_id,
      customModelIdInt,
      'finetuning'
    )) as TablesUpdate<'game_results'>;

    // Create a new game if it doesn't exist
    if (game == null) {
      console.log('createGame start');
      await createGame({
        name: chatSettings.model,
        created_at: new Date().toISOString(),
        question_id: customModelIdInt,
        question_count: 0,
        game_type: 'finetuning',
        score: null,
        updated_at: new Date().toISOString(),
        user_id: profile.user_id
      } as TablesInsert<'game_results'>);

      game = (await getGameResultByUserIDAndGameIdAndType(
        profile.user_id,
        customModelIdInt,
        'finetuning'
      )) as TablesUpdate<'game_results'>;
    }

    if (!game.id || game.question_count === undefined) {
      return new Response(JSON.stringify({ message: 'Game ID not found' }), {
        status: 400
      });
    }

    const openai = wrapOpenAI(
      new OpenAI({
        baseURL: url,
        defaultHeaders: {
          'Content-Type': 'application/json',
          'Question-ID': customModelIdInt.toString()
        }
      }),
      {
        name: chatSettings.model,
        tags: [
          profile.display_name,
          profile.user_id,
          profile.team ? profile.team : 'unknown team',
          profile.department ? profile.department : 'unknown department'
        ]
      }
    );

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages as ChatCompletionCreateParamsBase['messages'],
      temperature: chatSettings.temperature,
      max_tokens: null,
      stream: false
    });
    // console.log('response', response);

    //@ts-ignore
    const score = parseFloat(response.score);

    await updateGameScore(game.id, score);

    return new Response(
      //@ts-ignore
      JSON.stringify(response.response + '\n이유:' + response.reasoning),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    let errorMessage = error.message || 'An unexpected error occurred';
    const errorCode = error.status || 500;

    if (errorMessage.toLowerCase().includes('api key not found')) {
      errorMessage =
        'Custom API Key not found. Please set it in your profile settings.';
    } else if (errorMessage.toLowerCase().includes('incorrect api key')) {
      errorMessage =
        'Custom API Key is incorrect. Please fix it in your profile settings.';
    }

    return new Response(
      JSON.stringify({
        message: 'error: ' + errorMessage
      }),
      {
        status: errorCode
      }
    );
  }
}
