import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ChatbotUIContext } from '@/context/context';
import { updateChat, getChatSharing } from '@/db/chats';
import { Tables } from '@/supabase/types';
import { IconLock, IconWorld } from '@tabler/icons-react';
import { FC, useContext, useRef, useState, useEffect } from 'react';

interface ShareChatProps {
  chat: Tables<'chats'>;
}

export const ShareChat: FC<ShareChatProps> = ({ chat }) => {
  const { setChats } = useContext(ChatbotUIContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [showChatDialog, setShowChatDialog] = useState(false);
  const [isShared, setIsShared] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharingStatus = async () => {
      setIsLoading(true);
      try {
        const sharingData = await getChatSharing(chat.id);
        setIsShared(sharingData.sharing === 'public');
      } catch (error) {
        console.error('Error fetching chat sharing status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharingStatus();
  }, [chat.id]);

  const handleToggleShare = async (newStatus: 'public' | 'private') => {
    try {
      const updatedChat = await updateChat(chat.id, {
        sharing: newStatus
      });
      setChats(prevState =>
        prevState.map(c => (c.id === chat.id ? updatedChat : c))
      );
      setIsShared(newStatus === 'public');
      setShowChatDialog(false);
    } catch (error) {
      console.error('Failed to update chat sharing status:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          {isShared ? (
            <IconWorld className="text-green-500 hover:opacity-50" size={18} />
          ) : (
            <IconLock className="hover:opacity-50" size={18} />
          )}
        </div>
      </DialogTrigger>

      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Chat Sharing Settings</DialogTitle>
          <DialogDescription>
            {isShared
              ? 'This chat is currently shared publicly. You can make it private or cancel sharing.'
              : 'This chat is currently private. You can choose to share it publicly.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col space-y-4">
          <Button
            ref={buttonRef}
            variant={isShared ? 'outline' : 'default'}
            onClick={() => handleToggleShare('public')}
            className="flex items-center justify-center"
          >
            <IconWorld className="mr-2" size={18} />
            {isShared ? 'Keep Public' : 'Make Public'}
          </Button>
          <Button
            variant={isShared ? 'default' : 'outline'}
            onClick={() => handleToggleShare('private')}
            className="flex items-center justify-center"
          >
            <IconLock className="mr-2" size={18} />
            {isShared ? 'Make Private' : 'Keep Private'}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
