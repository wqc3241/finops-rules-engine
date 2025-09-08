
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, BarChart3, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'report' | 'dashboard';
  data?: any;
}

interface AIAgentChatProps {
  onClose: () => void;
}

const AIAgentChat: React.FC<AIAgentChatProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. I can help you generate reports and dashboards using natural language. Try asking me things like:\n\n• "Show me all pending applications from last month"\n• "Create a dashboard with loan vs lease applications"\n• "Generate a report of applications by status"\n\nHow can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to use the AI assistant');
      }

      // Call AI report generator edge function
      const { data, error } = await supabase.functions.invoke('ai-report-generator', {
        body: {
          message: messageText,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to process AI request');
      }

      const result = data;
      
      if (!result.success) {
        throw new Error(result.error || 'AI processing failed');
      }

      // Create AI response message with generated data
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        sender: 'ai',
        timestamp: new Date(),
        type: result.intent.type,
        data: result.data
      };

      setMessages(prev => [...prev, aiResponse]);
      
      toast({
        title: "Success",
        description: `${result.intent.type === 'report' ? 'Report' : 'Dashboard'} generated successfully!`,
      });

    } catch (error) {
      console.error('Error processing AI request:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure you're logged in and try again.`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to process request',
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      report: "Generate a report showing all applications with their current status",
      dashboard: "Create a dashboard with application metrics and charts",
      pending: "Show me all pending applications that need decisions"
    };
    
    setInputValue(quickMessages[action as keyof typeof quickMessages] || '');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-96 h-[500px] shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">AI Report Generator</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Quick Actions */}
        <div className="p-4 border-b bg-muted/50">
          <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('report')}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('dashboard')}
              className="text-xs"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('pending')}
              className="text-xs"
            >
              Pending
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      {message.data && (
                        <div className="mt-2 p-2 bg-background/50 rounded border">
                          <div className="text-xs font-medium mb-1">Generated Data:</div>
                          <div className="text-xs space-y-1">
                            <div>Total Applications: {message.data.totalApplications}</div>
                            {message.data.summary?.statusDistribution && (
                              <div>
                                Status Distribution: {Object.entries(message.data.summary.statusDistribution)
                                  .map(([status, count]) => `${status}: ${count}`)
                                  .join(', ')}
                              </div>
                            )}
                            {message.data.summary?.averageAmount && (
                              <div>
                                Average Amount: ${message.data.summary.averageAmount.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the report or dashboard you want..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} size="sm" disabled={isTyping || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAgentChat;
