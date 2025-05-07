import { firestore } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

interface StartChatOptions {
  currentUserId: string;
  currentUserName: string;
  receiverId: string;
  receiverName: string;
}

export const startChat = async ({
  currentUserId,
  currentUserName,
  receiverId,
  receiverName,
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
        { id: currentUserId, name: currentUserName },
        { id: receiverId, name: receiverName },
      ],
      createdAt: Date.now(),
      lastMessage: '',
      updatedAt: Date.now(),
    });
  }

  return chatId;
};
