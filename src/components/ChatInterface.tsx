
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { generateSmartReplies } from '@/ai/flows/smart-replies';
import { contextualAssistance } from '@/ai/flows/contextual-assistance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'gemini';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [contextualInfo, setContextualInfo] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');

    // Generate smart replies
    const replies = await generateSmartReplies({ message: newMessage });
    setSmartReplies(replies.replies);

    // Fetch contextual assistance
    const context = await contextualAssistance({ topic: newMessage });
    setContextualInfo(context.information);
  };

  const handleSmartReply = (reply: string) => {
    setNewMessage(reply);
  };

  const otherUserImage = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/50/50`;

  return (
    <div className="flex flex-col flex-grow bg-secondary">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'gemini' && (
              <Avatar className="mr-2">
                <AvatarImage src={otherUserImage} alt="Gemini Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div className={`rounded-xl px-4 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {message.text}
            </div>
            {message.sender === 'user' && (
              <Avatar className="ml-2">
                <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {contextualInfo && (
        <div className="bg-accent text-accent-foreground p-4 rounded-md m-4">
          <h3 className="font-semibold">Contextual Assistance:</h3>
          <p>{contextualInfo}</p>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow rounded-l-md"
          />
          <Button onClick={sendMessage} className="rounded-r-md bg-accent text-accent-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {smartReplies.length > 0 && (
          <div className="mt-2 flex space-x-2">
            {smartReplies.map((reply) => (
              <Button key={reply} variant="outline" size="sm" onClick={() => handleSmartReply(reply)}>
                {reply}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
