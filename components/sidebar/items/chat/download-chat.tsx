import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChatbotUIContext } from '@/context/context';
import { updateChat } from '@/db/chats';
import { Tables } from '@/supabase/types';
import { IconEdit, IconMessageUp } from '@tabler/icons-react';
import { FC, useContext, useRef, useState } from 'react';
import { getMessagesByChatId } from '@/db/messages';
import { MessageImage } from '@/types';
import { getMessageImageFromStorage } from '@/db/storage/message-images';
import { convertBlobToBase64 } from '@/lib/blob-to-b64';
import { getMessageFileItemsByMessageId } from '@/db/message-file-items';
import { getChatFilesByChatId } from '@/db/chat-files';

interface UpdateChatProps {
  chat: Tables<'chats'>;
}

export const DownloadChat: FC<UpdateChatProps> = ({ chat }) => {
  const { setChats } = useContext(ChatbotUIContext);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showChatDialog, setShowChatDialog] = useState(false);
  const [name, setName] = useState(chat.name);

  const fetchMessages = async () => {
    const fetchedMessages = await getMessagesByChatId(chat.id as string);

    const imagePromises: Promise<MessageImage>[] = fetchedMessages.flatMap(
      message =>
        message.image_paths
          ? message.image_paths.map(async imagePath => {
              const url = await getMessageImageFromStorage(imagePath);

              if (url) {
                const response = await fetch(url);
                const blob = await response.blob();
                const base64 = await convertBlobToBase64(blob);

                return {
                  messageId: message.id,
                  path: imagePath,
                  base64,
                  url,
                  file: null
                };
              }

              return {
                messageId: message.id,
                path: imagePath,
                base64: '',
                url,
                file: null
              };
            })
          : []
    );

    const images: MessageImage[] = await Promise.all(imagePromises.flat());
    console.log('images', images);

    const messageFileItemPromises = fetchedMessages.map(
      async message => await getMessageFileItemsByMessageId(message.id)
    );

    const messageFileItems = await Promise.all(messageFileItemPromises);

    const uniqueFileItems = messageFileItems.flatMap(item => item.file_items);
    console.log('uniqueFileItems', uniqueFileItems);

    const chatFiles = await getChatFilesByChatId(chat.id as string);

    const fetchedChatMessages = fetchedMessages.map(message => {
      return {
        message,
        fileItems: messageFileItems
          .filter(messageFileItem => messageFileItem.id === message.id)
          .flatMap(messageFileItem =>
            messageFileItem.file_items.map(fileItem => fileItem.id)
          )
      };
    });

    return fetchedChatMessages;
  };

  const handleDownloadChat = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const message = await fetchMessages();

    const chatData = {
      id: chat.id,
      name: name,
      content: message, // 가정: chat 객체에 content가 포함됨
      updated_at: chat.updated_at
    };

    // JSON 데이터 생성
    const json = JSON.stringify(chatData, null, 2);

    // Blob 생성
    const blob = new Blob([json], { type: 'application/json' });

    // 다운로드 링크 생성
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name || 'chat'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Dialog 닫기
    setShowChatDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>
        <IconMessageUp className="hover:opacity-50" size={18} />
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Download Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Label>Name</Label>

          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>

          <Button ref={buttonRef} onClick={handleDownloadChat}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
