// chat-input.tsx
import { useContext } from "react";
import { ChatbotUIContext } from "@/context/context";

interface ChatInputProps {
  onUserInput: (input: string) => Promise<void>;
}

export const ChatInput: FC<ChatInputProps> = ({ onUserInput }) => {
  const { setUserInput, userInput } = useContext(ChatbotUIContext);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const query = userInput.trim();
      await onUserInput(query);
      setUserInput(""); // Clear the input after sending the message
    }
  };

  return (
    <form>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
};
