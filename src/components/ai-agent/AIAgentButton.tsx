
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAgentChat from './AIAgentChat';

const AIAgentButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Agent Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Bot className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>

      {/* AI Agent Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <AIAgentChat onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default AIAgentButton;
