import { firestore } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

interface StartChatOptions {
  currentUserId: string;
  currentUserName: string;
  currentUserImage?: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
}

export const startChat = async ({
  currentUserId,
  currentUserName,
  currentUserImage,
  receiverId,
  receiverName,
  receiverImage,
}: StartChatOptions) => {
  const chatParticipants = [currentUserId, receiverId].sort();
  const chatId = chatParticipants.join('_');

  const chatRef = doc(firestore, 'chats', chatId);
  
  const chatDocSnap = await getDoc(chatRef);

  if (!chatDocSnap.exists()) {
    await setDoc(chatRef, {
      participants: chatParticipants,
      participantsInfo: [
        {
          id: currentUserId,
          name: currentUserName,
          image: currentUserImage && currentUserImage.trim() !== ""
        ? currentUserImage
        : null,
        },
        {
          id: receiverId,
          name: receiverName,
          image: receiverImage && receiverImage.trim() !== ""
        ? receiverImage
        : null,
        },
      ],
      createdAt: Date.now(),
      lastMessage: '',
      updatedAt: Date.now(),
    });
    console.log('New chat created with ID:', chatId);
  } else {
    console.log('Chat already exists with ID:', chatId);
  }

  return chatId;
};

export const deleteChatWithMessages = async (chatId: string) => {
  try {
    const messagesRef = collection(firestore, 'chats', chatId, 'messages');
    const messagesSnap = await getDocs(messagesRef);
    const deletePromises = messagesSnap.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    await deleteDoc(doc(firestore, 'chats', chatId));
    console.log('Chat and messages deleted:', chatId);
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};