import { collection, writeBatch, doc, getDocs, limit, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Question } from '../features/parser/QuestionParser';

const QUESTIONS_COLLECTION = 'questions';

export const saveQuestionsBatch = async (questions: Question[]) => {
  const batch = writeBatch(db);
  const qRef = collection(db, QUESTIONS_COLLECTION);
  
  questions.forEach(q => {
    // Generate a new document reference
    const docRef = doc(qRef);
    batch.set(docRef, {
      ...q,
      createdAt: new Date().toISOString()
    });
  });

  await batch.commit();
};

export const getRandomQuestions = async (limitCount = 25): Promise<Question[]> => {
  // To keep it light for Phase 2 without complex indexes or random shuffles on DB,
  // we fetch a default batch and shuffle client side.
  // In a massive DB we'd use random ID boundaries, but this works for proto.
  const qRef = collection(db, QUESTIONS_COLLECTION);
  const currentQuery = query(qRef, limit(100)); // PULL 100 max
  
  const snapshot = await getDocs(currentQuery);
  const allQs: Question[] = [];
  snapshot.forEach(doc => {
    const data = doc.data() as Question;
    // Map id from firestore if you want, but for now we have it inside
    allQs.push({ ...data, id: doc.id });
  });

  // Client side shuffle for true randomness
  for (let i = allQs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
  }

  return allQs.slice(0, limitCount);
};
