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
  '프롬프트 학습(Prompt Learning)이란 무엇인가요? 그리고 그것이 어떻게 작동하는지 설명해주세요.',
  '트랜스포머 아키텍처의 기본 구성 요소는 무엇이고, 이들 요소들이 어떻게 상호 작용하여 효과적인 언어 모델을 구현하는데 도움을 주는지 설명해주세요.',
  '지식 표현과 저장 메커니즘은 언어 모델, 특히 대형 언어 모델에서 어떻게 작동하나요? 그리고 이러한 메커니즘은 어떻게 활용되는지 설명해주세요.'
  // '인코더-디코더와 디코더 전용 모델의 기본적인 차이점은 무엇이며, 각각의 아키텍처가 어떠한 상황에서 유용하게 적용될 수 있는지 설명해주세요.',
  // '멀티모달 LLM의 구조와 특징에 대해 설명해주세요.',
  // '모델의 과적합을 방지하기 위한 정규화 기법에는 어떤 것들이 있으며, 각각 어떠한 원리로 작동하는지 설명해주세요.',
  // '혼합 전문가 모델(Mixture of Experts, MoE)은 어떤 원리로 작동하며, 그 특징과 장단점은 무엇인가요?',
  // '사전 학습(pre-training)과 파인튜닝(fine-tuning)은 어떻게 다른가요? 그리고 대형 언어 모델 학습에서 이 두 과정이 왜 중요한지 설명해주세요.',
  // '임베딩의 개념과 표현 학습이란 무엇이며, 이것이 어떻게 대형 언어 모델의 성능에 기여하는지 설명해주세요.',
  // '토큰화(Tokenization)의 원리와 방식은 무엇이며, 이 과정이 언어 모델링에서 어떤 역할을 하는지 설명해주세요.',
  // '환각(Hallucination)이 언어 모델에서 어떤 문제를 일으키는지, 그리고 이를 감지하고 방지하기 위한 기본적인 방법은 무엇인지 설명해주세요.',
  // '대형 언어 모델의 지속 학습(Continuous Learning)은 어떤 개념이며, 이것이 어떻게 모델의 성능과 지식 업데이트에 도움을 주는지 설명해주세요.',
  // '퍼셉트론(Perceptron)이란 무엇이며, 이것이 대형 언어 모델에서 어떤 역할을 하는지 설명해주세요.',
  // '지식 그래프(Knowledge Graph)가 언어 모델, 특히 대형 언어 모델에서 어떻게 활용되며, 이를 통해 어떤 정보를 추론하고 학습하는지 설명해주세요.',
  // '신경망에서 드롭아웃(Dropout)이란 무엇이며, 이것이 언어 모델, 특히 대형 언어 모델의 과적합을 방지하는데 어떻게 도움을 주는지 설명해주세요.',
  // '대형 언어 모델에서 Zero-shot, Few-shot, Many-shot 학습이란 무엇이며, 각각 어떻게 작동하고 어떤 환경에 적합한지 설명해주세요.',
  // 'Few-shot 학습에서 프롬프트를 어떻게 구성하는 것이 효과적인가요?',
  // '프롬프트의 길이와 토큰 제한 사이의 관계는 어떻게 되는가?',
  // '프롬프트 최적화를 위해 반복적 개선과 피드백을 어떻게 활용하는가?',
  // 'Chain of Thought 프롬프팅 기법은 무엇이며, 어떤 효과를 기대할 수 있는가?',
  // '자기 일관성(Self-consistency) 향상 기법이란 무엇이고, 이를 프롬프트에 어떻게 적용할 수 있는가?',
  // '시스템 프롬프트와 사용자 프롬프트의 차이점과 각각의 활용 방법은 무엇인가요?',
  // '프롬프트에 대한 컨텍스트 설정이 중요한 이유와 그에 따른 효과적인 기법은 무엇인가요?',
  // '역할 기반 프롬프팅이란 무엇이며, 이를 통해 어떤 효과를 얻을 수 있는지 설명해주세요.',
  // '프롬프트의 출력 품질 제어와 일관성 유지를 위한 전략들은 무엇인가요?',
  // '도메인 특화 프롬프트 설계란 무엇이며, 이를 통해 어떠한 이점을 얻을 수 있는지 설명해주세요.',
  // '프롬프트의 구성 요소 중 "제약 조건 설정"이란 무엇이며, 이를 효과적으로 활용하기 위한 방법은 무엇인가요?',
  // '복잡한 작업을 분해하고 프롬프트 체인을 구성하는 과정은 어떻게 진행되나요?',
  // '프롬프트에서 맥락 유지와 메모리 관리는 어떤 방식으로 이루어지나요?',
  // '프롬프트에 대한 다국어 최적화 전략을 구현하려면 어떤 점들을 고려해야 하나요?',
  // '프롬프트에서 "맥락 유지(Context Preservation)"란 무엇이며, 이를 효과적으로 구현하기 위한 전략들은 무엇인가요?',
  // '전이 학습(Transfer learning)이란 무엇이며, 이를 효과적으로 활용하는 방법은 어떤 것이 있을까요?',
  // 'RAG(Retrieval-Augmented Generation)이 어떤 원리로 동작하며, 어떤 상황에서 이를 활용하는 것이 효과적일까요?',
  // '모델 압축과 양자화 전략이란 무엇이며, 어떤 상황에서 이를 적용하는 것이 효과적인가요?',
  // '준지도 학습(Semi-Supervised Learning)이란 무엇이며, 이를 구현할 때 고려해야 할 전략은 무엇인가요?',
  // '멀티모달 학습 아키텍처란 무엇이며, 이를 사용하면 어떤 이점이 있을까요?',
  // '강화 학습과 다른 학습 방법론을 결합하는 방법에는 어떤 것들이 있고, 이를 통해 어떤 이점을 얻을 수 있을까요?',
  // '연속 학습(Continual Learning)이란 무엇이며, 이를 실제 시스템에 적용할 때 고려해야 하는 관점들은 무엇인가요?',
  // 'LoRA와 QLoRA의 원리와 차이점은 무엇인가요?',
  // '벡터 데이터베이스란 무엇이며, 어떤 특징을 가지고 있는지 설명하시오.',
  // '메타 러닝(Meta-Learning)이란 무엇이며, 이를 실제 시스템에 적용할 때 고려해야 하는 관점들은 무엇인가요?',
  // '임베딩 모델 선택과 최적화 과정에서는 어떤 요소들을 고려해야 하며, 이를 통해 어떤 이점을 얻을 수 있을까요?',
  // '청크 사이즈와 오버랩 전략이란 무엇이며, 이것들을 효과적으로 적용하기 위한 기술적 고려사항은 무엇인가요?',
  // '검색 알고리즘과 유사도 측정 방법이란 무엇인지 각각 정의하고, 이들이 데이터 처리에서 어떤 역할을 하는지 설명하시오.',
  // '추론 최적화와 가속화 기법에는 어떤 것들이 있으며, 이를 효과적으로 적용하기 위한 전략은 무엇인가요?',
  // '분산 학습 구현 방법의 핵심 원리와 장단점은 무엇인가요?',
  // '과적합 방지와 평가 지표에는 어떤 것들이 있으며, 이들을 효과적으로 적용하기 위한 전략은 무엇인가요?',
  // '유사도 측정에는 어떤 방법들이 있으며, 이들 중 특정 상황에서 적합한 측정 방법을 선택하는 기준은 무엇인가요?',
  // '추론 최적화와 가속화 기법 중 하나인 Pruning이란 무엇이며, 이를 효과적으로 활용하기 위한 전략은 무엇인가요?',
  // '신경망 모델에서 Batch Normalization은 어떤 원리로 작동하며, 이 기법을 통해 어떤 이점을 얻을 수 있나요?'
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
        count++;
        messageContent = question;

        let retrievedFileItems: Tables<'file_items'>[] = [];

        if (
          (newMessageFiles.length > 0 || chatFiles.length > 0) &&
          useRetrieval
        ) {
          setToolInUse('retrieval');

          console.log('messageContent', messageContent);

          retrievedFileItems = await handleRetrieval(
            userInput,
            newMessageFiles,
            chatFiles,
            chatSettings!.embeddingsProvider,
            sourceCount
          );

          // use first file item to get the file
          if (retrievedFileItems.length >= 1) {
            retrievedFileItems = retrievedFileItems.slice(0, 1);
          }
          console.log('retrievedFileItems', retrievedFileItems);
        }

        console.log(
          'messageContent',
          messageContent,
          'chatMessages',
          chatMessages,
          'isRegeneration',
          isRegeneration
        );

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

    handleSendMessage(editedContent, filteredMessages, false);
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
