import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from 'axios';

export default function AICookingAssistant() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{type: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to conversation
      setConversation(prev => [...prev, { type: 'user', content: message }]);

      // Send message to AI
      const response = await axios.post('/api/cooking-assistant', { message });

      // Add AI response to conversation
      setConversation(prev => [...prev, { type: 'assistant', content: response.data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">AI Cooking Assistant</h1>

      <div className="mb-6 space-y-4">
        {conversation.map((msg, i) => (
          <Card key={i} className={`p-4 ${msg.type === 'assistant' ? 'bg-secondary' : 'bg-primary/10'}`}>
            <p className="font-semibold mb-1">{msg.type === 'assistant' ? '👩‍🍳 Assistant' : '👤 You'}</p>
            <p>{msg.content}</p>
          </Card>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about recipes, cooking techniques, or ingredients..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Send'}
        </Button>
      </form>
    </div>
  );
}