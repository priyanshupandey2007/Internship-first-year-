import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export function useChatMessages(limitCount = 50) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(limitCount));

    // Listen to database variations in real-time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error streaming messages:", error);
      setLoading(false);
    });

    // Clean up subscriber connection when unmounting
    return () => unsubscribe();
  }, [limitCount]);

  return { messages, loading };
}