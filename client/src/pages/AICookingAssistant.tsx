
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AIThinkingIndicator } from '@/components/AIThinkingIndicator';

export default function AICookingAssistant() {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    const newMessage = { role: 'user' as const, content: userInput };
    setConversation(prev => [...prev, newMessage]);
    setUserInput('');

    try {
      const response = await fetch('/api/cooking-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      
      const data = await response.json();
      setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Cooking Assistant</h1>
      
      <Card className="mb-6 p-4">
        <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary/10 ml-12' 
                  : 'bg-secondary/10 mr-12'
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </p>
              <p className="text-gray-800">{message.content}</p>
            </div>
          ))}
          {loading && (
            <div className="mr-12">
              <AIThinkingIndicator aiThinkingStage="Analyzing your request..." />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about cooking techniques, recipes, or ingredients..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={loading || !userInput.trim()}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
