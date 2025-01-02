import { ChatbotUIContext } from '@/context/context';
import { getAssistantCollectionsByAssistantId } from '@/db/assistant-collections';
import { getAssistantFilesByAssistantId } from '@/db/assistant-files';
import { getAssistantToolsByAssistantId } from '@/db/assistant-tools';
import { updateChat } from '@/db/chats';
import { getCollectionFilesByCollectionId } from '@/db/collection-files';
import { deleteMessagesIncludingAndAfter } from '@/db/messages';
import { buildFinalMessages } from '@/lib/build-prompt';
import { Tables } from '@/supabase/types';
import { ChatMessage, ChatPayload, LLMID, ModelProvider } from '@/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';
import { LLM_LIST } from '../../../lib/models/llm/llm-list';
import {
  createTempMessages,
  handleCreateChat,
  handleCreateMessages,
  handleHostedChat,
  handleLocalChat,
  handleRetrieval,
  processResponse,
  validateChatSettings
} from '../chat-helpers';
import { v4 as uuidv4 } from 'uuid';

const submitQuestion = [
  //  TEST
  // 'New York, St. Louis, San Francisco and Los Angeles 설명해줘',
  // '스테이지점수 알려줘'
  // Real Questions
  '인공지능(AI), 머신 러닝(ML), 딥 러닝(DL)의 차이를 간단히 설명하세요.',
  'Open AI의 GPT 모델에서 대해서 설명하시오',
  '메타는 라마를 어떻게 활용하고 있는가?',
  '가트너 그룹이 발표한 Hyper Cycle for Artificial Intelligence 2024에 대해서 설명하고 Computer Vision 기술은 어디쯤 위치해 있는지 설명하시오.',
  '1981년과 1995년 그리고 2009과 2023년에 대해서 각각 어떤 IT 이슈가 있었는지 설명하고 당시 성장한 주요 업체들을 나열하시오',
  'Microsoft 가 OpenAI에 이제까지 투자하면서 얻은 것은 무엇인가?',
  '1990년대의 세계 최대의 부자들과 2020년의 최대 부자들을 비교하고 어떤 특이점이 있는지 기술하시오',
  'Microsoft의 사티아 CEO가 최근 Ignite 2024 행사에서 언급한 Scaling laws는 무엇인가?',
  '딥 러닝 모델의 파라메터 개수가 가지는 의미를 설명하시오',
  '제프리 힌튼 교수가 최근 노벨 상을 받았는데 어떤 분야이고 어떤 연구로 상을 받았는지 설명하시오',
  '프롬프트 학습(Prompt Learning)이란 무엇인가요? 그리고 그것이 어떻게 작동하는지 설명해주세요.',
  '트랜스포머 아키텍처의 기본 구성 요소는 무엇이고, 이들 요소들이 어떻게 상호 작용하여 효과적인 언어 모델을 구현하는데 도움을 주는지 설명해주세요.',
  '인코더-디코더와 디코더 전용 모델의 기본적인 차이점은 무엇이며, 각각의 아키텍처가 어떠한 상황에서 유용하게 적용될 수 있는지 설명해주세요.',
  '멀티모달 LLM의 구조와 특징에 대해 설명해주세요.',
  '모델의 과적합을 방지하기 위한 정규화 기법에는 어떤 것들이 있으며, 각각 어떠한 원리로 작동하는지 설명해주세요.',
  '사전 학습(pre-training)과 파인튜닝(fine-tuning)은 어떻게 다른가요? 그리고 대형 언어 모델 학습에서 이 두 과정이 왜 중요한지 설명해주세요.',
  '임베딩의 개념과 표현 학습이란 무엇이며, 이것이 어떻게 대형 언어 모델의 성능에 기여하는지 설명해주세요.',
  '토큰화(Tokenization)의 원리와 방식은 무엇이며, 이 과정이 언어 모델링에서 어떤 역할을 하는지 설명해주세요.',
  '환각(Hallucination)이 언어 모델에서 어떤 문제를 일으키는지, 그리고 이를 감지하고 방지하기 위한 기본적인 방법은 무엇인지 설명해주세요.',
  '대형 언어 모델의 지속 학습(Continuous Learning)은 어떤 개념이며, 이것이 어떻게 모델의 성능과 지식 업데이트에 도움을 주는지 설명해주세요.',
  '지식 그래프(Knowledge Graph)가 언어 모델, 특히 대형 언어 모델에서 어떻게 활용되며, 이를 통해 어떤 정보를 추론하고 학습하는지 설명해주세요.',
  '메타인지란 무엇이며, 이를 "생각에 대한 생각"이라고 표현하는 이유는 무엇인가요?',
  '메타인지적 지식의 세 가지 유형(내용 지식, 과제 지식, 전략적 지식)은 각각 어떤 상황에서 활용될 수 있나요?',
  '메타인지적 조절의 세 가지 단계(계획, 모니터링, 평가)는 학습 과정에서 각각 어떤 역할을 하나요?',
  '"인지 과정에 대한 의식적 인식"이란 무엇이며, 이를 통해 학습자는 무엇을 알 수 있나요?',
  'AI가 학습 데이터를 통해 메타인지를 강화하는 구체적인 방법은 무엇인가요?',
  '메타인지와 AI의 공통점은 무엇이며, 이를 활용한 학습 설계의 이점은 무엇인가요?',
  '메타인지적 조절에서 "통제" 단계는 학습자에게 어떤 구체적인 도움을 주나요?',
  'AI가 제공하는 시뮬레이션과 시나리오가 학습자의 메타인지 향상에 어떻게 기여하나요?',
  '메타인지가 문제 해결에서 중요한 이유를 구체적인 예를 들어 설명해주세요.',
  '대형 언어 모델에서 Zero-shot, Few-shot, Many-shot 학습이란 무엇이며, 각각 어떻게 작동하고 어떤 환경에 적합한지 설명해주세요.',
  '프롬프트의 길이와 토큰 제한 사이의 관계는 어떻게 되는가?',
  'Chain of Thought 프롬프팅 기법은 무엇이며, 어떤 효과를 기대할 수 있는가?',
  '시스템 프롬프트와 사용자 프롬프트의 차이점과 각각의 활용 방법은 무엇인가요?',
  '프롬프트에 대한 컨텍스트 설정이 중요한 이유와 그에 따른 효과적인 기법은 무엇인가요?',
  '역할 기반 프롬프팅이란 무엇이며, 이를 통해 어떤 효과를 얻을 수 있는지 설명해주세요.',
  '프롬프트에서 "맥락 유지(Context Preservation)"란 무엇이며, 이를 효과적으로 구현하기 위한 전략들은 무엇인가요?',
  'RAG(Retrieval-Augmented Generation)이 어떤 원리로 동작하며, 어떤 상황에서 이를 활용하는 것이 효과적일까요?',
  '모델 압축과 양자화 전략이란 무엇이며, 어떤 상황에서 이를 적용하는 것이 효과적인가요?',
  '벡터 데이터베이스란 무엇이며, 어떤 특징을 가지고 있는지 설명하시오.',
  '임베딩 모델 선택과 최적화 과정에서는 어떤 요소들을 고려해야 하며, 이를 통해 어떤 이점을 얻을 수 있을까요?',
  '청크 사이즈와 오버랩 전략이란 무엇이며, 이것들을 효과적으로 적용하기 위한 기술적 고려사항은 무엇인가요?',
  '추론 최적화와 가속화 기법에는 어떤 것들이 있으며, 이를 효과적으로 적용하기 위한 전략은 무엇인가요?',
  '유사도 측정에는 어떤 방법들이 있으며, 이들 중 특정 상황에서 적합한 측정 방법을 선택하는 기준은 무엇인가요?',
  '신경망 모델에서 Batch Normalization은 어떤 원리로 작동하며, 이 기법을 통해 어떤 이점을 얻을 수 있나요?',
  '과적합 방지와 평가 지표에는 어떤 것들이 있으며, 이들을 효과적으로 적용하기 위한 전략은 무엇인가요?',
  '메타 러닝(Meta-Learning)이란 무엇이며, 이를 실제 시스템에 적용할 때 고려해야 하는 관점들은 무엇인가요?',
  '연속 학습(Continual Learning)이란 무엇이며, 이를 실제 시스템에 적용할 때 고려해야 하는 관점들은 무엇인가요?',
  '강화 학습과 다른 학습 방법론을 결합하는 방법에는 어떤 것들이 있고, 이를 통해 어떤 이점을 얻을 수 있을까요?',
  '전이 학습(Transfer learning)이란 무엇이며, 이를 효과적으로 활용하는 방법은 어떤 것이 있을까요?'
];
export const useChatHandler = () => {
  const router = useRouter();

  const {
    userInput,
    chatFiles,
    setUserInput,
    setNewMessageImages,
    profile,
    setIsGenerating,
    setChatMessages,
    setFirstTokenReceived,
    selectedChat,
    selectedWorkspace,
    setSelectedChat,
    setChats,
    setSelectedTools,
    availableLocalModels,
    availableOpenRouterModels,
    abortController,
    setAbortController,
    chatSettings,
    newMessageImages,
    selectedAssistant,
    chatMessages,
    chatImages,
    setChatImages,
    setChatFiles,
    setNewMessageFiles,
    setShowFilesDisplay,
    newMessageFiles,
    chatFileItems,
    setChatFileItems,
    setToolInUse,
    useRetrieval,
    sourceCount,
    setIsPromptPickerOpen,
    setIsFilePickerOpen,
    selectedTools,
    selectedPreset,
    setChatSettings,
    models,
    isPromptPickerOpen,
    isFilePickerOpen,
    isToolPickerOpen
  } = useContext(ChatbotUIContext);

  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isPromptPickerOpen || !isFilePickerOpen || !isToolPickerOpen) {
      chatInputRef.current?.focus();
    }
  }, [isPromptPickerOpen, isFilePickerOpen, isToolPickerOpen]);

  const handleNewChat = async () => {
    if (!selectedWorkspace) return;

    setUserInput('');
    setChatMessages([]);
    setSelectedChat(null);
    setChatFileItems([]);

    setIsGenerating(false);
    setFirstTokenReceived(false);

    setChatFiles([]);
    setChatImages([]);
    setNewMessageFiles([]);
    setNewMessageImages([]);
    setShowFilesDisplay(false);
    setIsPromptPickerOpen(false);
    setIsFilePickerOpen(false);

    setSelectedTools([]);
    setToolInUse('none');

    if (selectedAssistant) {
      setChatSettings({
        model: selectedAssistant.model as LLMID,
        prompt: selectedAssistant.prompt,
        temperature: selectedAssistant.temperature,
        contextLength: selectedAssistant.context_length,
        includeProfileContext: selectedAssistant.include_profile_context,
        includeWorkspaceInstructions:
          selectedAssistant.include_workspace_instructions,
        embeddingsProvider: selectedAssistant.embeddings_provider as
          | 'openai'
          | 'local'
      });

      let allFiles = [];

      const assistantFiles = (
        await getAssistantFilesByAssistantId(selectedAssistant.id)
      ).files;
      allFiles = [...assistantFiles];
      const assistantCollections = (
        await getAssistantCollectionsByAssistantId(selectedAssistant.id)
      ).collections;
      for (const collection of assistantCollections) {
        const collectionFiles = (
          await getCollectionFilesByCollectionId(collection.id)
        ).files;
        allFiles = [...allFiles, ...collectionFiles];
      }
      const assistantTools = (
        await getAssistantToolsByAssistantId(selectedAssistant.id)
      ).tools;

      setSelectedTools(assistantTools);
      setChatFiles(
        allFiles.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          file: null
        }))
      );

      if (allFiles.length > 0) setShowFilesDisplay(true);
    } else if (selectedPreset) {
      setChatSettings({
        model: selectedPreset.model as LLMID,
        prompt: selectedPreset.prompt,
        temperature: selectedPreset.temperature,
        contextLength: selectedPreset.context_length,
        includeProfileContext: selectedPreset.include_profile_context,
        includeWorkspaceInstructions:
          selectedPreset.include_workspace_instructions,
        embeddingsProvider: selectedPreset.embeddings_provider as
          | 'openai'
          | 'local'
      });
    } else if (selectedWorkspace) {
      // setChatSettings({
      //   model: (selectedWorkspace.default_model ||
      //     "gpt-4-1106-preview") as LLMID,
      //   prompt:
      //     selectedWorkspace.default_prompt ||
      //     "You are a friendly, helpful AI assistant.",
      //   temperature: selectedWorkspace.default_temperature || 0.5,
      //   contextLength: selectedWorkspace.default_context_length || 4096,
      //   includeProfileContext:
      //     selectedWorkspace.include_profile_context || true,
      //   includeWorkspaceInstructions:
      //     selectedWorkspace.include_workspace_instructions || true,
      //   embeddingsProvider:
      //     (selectedWorkspace.embeddings_provider as "openai" | "local") ||
      //     "openai"
      // })
    }

    return router.push(`/${selectedWorkspace.id}/chat`);
  };

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus();
  };

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    const startingInput = messageContent;

    try {
      setUserInput('');
      setIsGenerating(true);
      setIsPromptPickerOpen(false);
      setIsFilePickerOpen(false);
      setNewMessageImages([]);

      const newAbortController = new AbortController();
      setAbortController(newAbortController);

      const modelData = [
        ...models.map(model => ({
          modelId: model.model_id as LLMID,
          modelName: model.name,
          provider: 'custom' as ModelProvider,
          hostedId: model.id,
          platformLink: '',
          imageInput: false
        })),
        ...LLM_LIST,
        ...availableLocalModels,
        ...availableOpenRouterModels
      ].find(llm => llm.modelId === chatSettings?.model);

      validateChatSettings(
        chatSettings,
        modelData,
        profile,
        selectedWorkspace,
        messageContent
      );

      let currentChat = selectedChat ? { ...selectedChat } : null;

      const b64Images = newMessageImages.map(image => image.base64);

      let retrievedFileItems: Tables<'file_items'>[] = [];

      if (
        (newMessageFiles.length > 0 || chatFiles.length > 0) &&
        useRetrieval
      ) {
        setToolInUse('retrieval');

        retrievedFileItems = await handleRetrieval(
          userInput,
          newMessageFiles,
          chatFiles,
          chatSettings!.embeddingsProvider,
          sourceCount
        );
      }

      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          chatSettings!,
          b64Images,
          isRegeneration,
          setChatMessages,
          selectedAssistant
        );

      const payload: ChatPayload = {
        chatSettings: chatSettings!,
        workspaceInstructions: selectedWorkspace!.instructions || '',
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
        assistant: selectedChat?.assistant_id ? selectedAssistant : null,
        messageFileItems: retrievedFileItems,
        chatFileItems: chatFileItems
      };

      let generatedText = '';

      if (selectedTools.length > 0) {
        setToolInUse('Tools');

        const formattedMessages = await buildFinalMessages(
          payload,
          profile!,
          chatImages
        );

        const response = await fetch('/api/chat/tools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatSettings: payload.chatSettings,
            messages: formattedMessages,
            selectedTools
          })
        });

        setToolInUse('none');

        generatedText = await processResponse(
          response,
          isRegeneration
            ? payload.chatMessages[payload.chatMessages.length - 1]
            : tempAssistantChatMessage,
          true,
          newAbortController,
          setFirstTokenReceived,
          setChatMessages,
          setToolInUse
        );
      } else {
        if (modelData!.provider === 'ollama') {
          generatedText = await handleLocalChat(
            payload,
            profile!,
            chatSettings!,
            tempAssistantChatMessage,
            isRegeneration,
            newAbortController,
            setIsGenerating,
            setFirstTokenReceived,
            setChatMessages,
            setToolInUse
          );
        } else {
          generatedText = await handleHostedChat(
            payload,
            profile!,
            modelData!,
            tempAssistantChatMessage,
            isRegeneration,
            newAbortController,
            newMessageImages,
            chatImages,
            setIsGenerating,
            setFirstTokenReceived,
            setChatMessages,
            setToolInUse
          );
        }
      }

      if (!currentChat) {
        currentChat = await handleCreateChat(
          chatSettings!,
          profile!,
          selectedWorkspace!,
          messageContent,
          selectedAssistant!,
          newMessageFiles,
          setSelectedChat,
          setChats,
          setChatFiles
        );
      } else {
        const updatedChat = await updateChat(currentChat.id, {
          updated_at: new Date().toISOString()
        });

        setChats(prevChats => {
          const updatedChats = prevChats.map(prevChat =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
          );

          return updatedChats;
        });
      }

      await handleCreateMessages(
        chatMessages,
        currentChat,
        profile!,
        modelData!,
        messageContent,
        generatedText,
        newMessageImages,
        isRegeneration,
        retrievedFileItems,
        setChatMessages,
        setChatFileItems,
        setChatImages,
        selectedAssistant
      );

      setIsGenerating(false);
      setFirstTokenReceived(false);
    } catch (error) {
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput(startingInput);
    }
  };

  const handleSubmitMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    const startingInput = messageContent;

    // overwrite chatMessages
    chatMessages = [];

    try {
      setUserInput('');
      setIsGenerating(true);
      setIsPromptPickerOpen(false);
      setIsFilePickerOpen(false);
      setNewMessageImages([]);

      const newAbortController = new AbortController();
      setAbortController(newAbortController);

      const modelData = [
        ...models.map(model => ({
          modelId: model.model_id as LLMID,
          modelName: model.name,
          provider: 'finetuned' as ModelProvider,
          hostedId: model.id,
          platformLink: '',
          imageInput: false
        })),
        ...LLM_LIST,
        ...availableLocalModels,
        ...availableOpenRouterModels
      ].find(llm => llm.modelId === chatSettings?.model);

      validateChatSettings(
        chatSettings,
        modelData,
        profile,
        selectedWorkspace,
        'submit'
      );

      let currentChat = selectedChat ? { ...selectedChat } : null;

      const b64Images = newMessageImages.map(image => image.base64);

      let count = 0;
      for (const question of submitQuestion) {
        console.log('question', question);
        count++;
        messageContent = question;

        let retrievedFileItems: Tables<'file_items'>[] = [];

        if (
          (newMessageFiles.length > 0 || chatFiles.length > 0) &&
          useRetrieval
        ) {
          setToolInUse('retrieval');

          retrievedFileItems = await handleRetrieval(
            question,
            newMessageFiles,
            chatFiles,
            chatSettings!.embeddingsProvider,
            sourceCount
          );

          // use first file item to get the file
          if (retrievedFileItems.length >= 1) {
            retrievedFileItems = retrievedFileItems.slice(0, 1);
          }
          // console.log('retrievedFileItems', retrievedFileItems);
        }

        const tempUserChatMessage: ChatMessage = {
          message: {
            chat_id: '',
            assistant_id: null,
            content: messageContent,
            created_at: '',
            id: uuidv4(),
            image_paths: b64Images,
            model: 'FineTuning_LLM',
            role: 'user',
            sequence_number: chatMessages.length,
            updated_at: '',
            user_id: ''
          },
          fileItems: []
        };

        const tempAssistantChatMessage: ChatMessage = {
          message: {
            chat_id: '',
            assistant_id: selectedAssistant?.id || null,
            content: '',
            created_at: '',
            id: uuidv4(),
            image_paths: [],
            model: 'FineTuning_LLM',
            role: 'assistant',
            sequence_number: chatMessages.length + 1,
            updated_at: '',
            user_id: ''
          },
          fileItems: []
        };

        const payload: ChatPayload = {
          chatSettings: chatSettings!,
          workspaceInstructions: selectedWorkspace!.instructions || '',
          chatMessages: isRegeneration
            ? [...chatMessages]
            : [...chatMessages, tempUserChatMessage],
          assistant: selectedChat?.assistant_id ? selectedAssistant : null,
          messageFileItems: retrievedFileItems,
          chatFileItems: chatFileItems
        };

        payload.workspaceInstructions = count + '';
        console.log('payload', payload);

        let generatedText = '';

        generatedText = await handleHostedChat(
          payload,
          profile!,
          modelData!,
          tempAssistantChatMessage,
          isRegeneration,
          newAbortController,
          newMessageImages,
          chatImages,
          null,
          setFirstTokenReceived,
          null,
          setToolInUse
        );
        console.log('generatedText', generatedText);
      }

      setIsGenerating(false);
      setFirstTokenReceived(false);
    } catch (error) {
      setIsGenerating(false);
      setFirstTokenReceived(false);
      setUserInput(startingInput);
    }
  };

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return;

    await deleteMessagesIncludingAndAfter(
      selectedChat.user_id,
      selectedChat.id,
      sequenceNumber
    );

    const filteredMessages = chatMessages.filter(
      chatMessage => chatMessage.message.sequence_number < sequenceNumber
    );

    setChatMessages(filteredMessages);

    handleSendMessage(editedContent, [], false);
  };

  return {
    chatInputRef,
    prompt,
    handleNewChat,
    handleSendMessage,
    handleFocusChatInput,
    handleStopMessage,
    handleSendEdit,
    handleSubmitMessage
  };
};
