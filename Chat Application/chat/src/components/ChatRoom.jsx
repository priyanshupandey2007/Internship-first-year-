import React, { useEffect, useRef } from 'react';
import { useChatMessages } from '../hooks/useChatMessages';
import { MessageForm } from './MessageForm';

export function ChatRoom() {
  const { messages, loading } = useChatMessages(50);
  const dummySpace = useRef(null);

  // Auto-scroll anchor point trick whenever a new chat bubble renders
  useEffect(() => {
    if (dummySpace.current) {
      dummySpace.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>💬 Dev Channel</h2>
      
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '15px' }}>
        {loading ? (
          <p>Syncing cloud nodes...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '12px' }}>
              <strong style={{ color: '#007bff' }}>{msg.displayName}</strong>: <span>{msg.text}</span>
            </div>
          ))
        )}
        <div ref={dummySpace} />
      </div>

      <MessageForm />
    </div>
  );
}