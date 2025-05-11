import { firestore } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc
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
  const chatSnap = await getDocs(
    query(collection(firestore, 'chats'), where('chatId', '==', chatId))
  );

  if (chatSnap.empty) {
    await setDoc(chatRef, {
      chatId,
      participants: [currentUserId, receiverId],
      participantsInfo: [
        { id: currentUserId, name: currentUserName, image: currentUserImage || null },
        { id: receiverId, name: receiverName, image: receiverImage || null },
      ],
      createdAt: Date.now(),
      lastMessage: '',
      updatedAt: Date.now(),
    });
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
    console.log('Sohbet ve mesajlar silindi:', chatId);
  } catch (error) {
    console.error('Sohbet silme hatası:', error);
  }
};
