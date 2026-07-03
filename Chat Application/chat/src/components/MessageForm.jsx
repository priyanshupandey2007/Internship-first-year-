import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function MessageForm() {
  const [text, setText] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: text.trim(),
        createdAt: serverTimestamp(), // Ensures exact global database sorting order
        displayName: 'User Dev'        // Replace with auth.currentUser dynamic data later
      });
      setText('');
    } catch (err) {
      console.error("Error writing document to cloud:", err);
    }
  };

  return (
    <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '10px' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ flexGrow: 1, padding: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
    </form>
  );
}