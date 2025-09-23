import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, Sparkles, Loader } from "lucide-react";
import { getCookingAssistance } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import FormattedResponse from "./FormattedResponse";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI cooking assistant. Ask me anything about cooking, recipes, nutrition, or meal planning. How can I help you today?\n\n**I can help you with:**\n- Recipe modifications and substitutions\n- Cooking techniques and tips\n- Nutritional information\n- Meal preparation advice\n- Kitchen equipment guidance",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getCookingAssistance(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Assistant Unavailable",
        description: "Please check your API key and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How do I make quinoa?",
    "What's a good protein substitute?",
    "Tips for meal prep beginners?",
    "How to reduce sodium in recipes?"
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            AI Cooking Assistant
          </h2>
          <p className="text-muted-foreground">
            Get instant cooking advice, recipe help, and nutritional guidance from our AI assistant
          </p>
        </div>

        <Card className="shadow-glow border-0 bg-card/80 backdrop-blur">
          <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Your Personal Cooking Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages */}
            <ScrollArea className="h-96 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                          <FormattedResponse content={message.content} />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-3">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      message.type === 'user' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="px-6 py-3 border-t">
              <div className="text-sm text-muted-foreground mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t bg-muted/30">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about cooking, recipes, or nutrition..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  variant="ai"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Pro Tips</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ask for ingredient substitutions</li>
                <li>• Get cooking technique explanations</li>
                <li>• Request recipe modifications</li>
                <li>• Learn about nutritional benefits</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold">Example Questions</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "How can I make this recipe vegan?"</li>
                <li>• "What spices go well with salmon?"</li>
                <li>• "How to store fresh herbs?"</li>
                <li>• "Best cooking methods for vegetables?"</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}