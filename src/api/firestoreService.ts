import { collection, writeBatch, doc, getDocs, limit, query, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Question } from '../features/parser/QuestionParser';

const QUESTIONS_COLLECTION = 'questions';

export const saveQuestionsBatch = async (questions: Question[]) => {
  const batch = writeBatch(db);
  const qRef = collection(db, QUESTIONS_COLLECTION);
  
  questions.forEach(q => {
    const docRef = doc(qRef);
    batch.set(docRef, { ...q, createdAt: new Date().toISOString() });
  });

  await batch.commit();
};

export const getRandomQuestions = async (limitCount = 25): Promise<Question[]> => {
  const qRef = collection(db, QUESTIONS_COLLECTION);
  const currentQuery = query(qRef, limit(100)); 
  
  const snapshot = await getDocs(currentQuery);
  const allQs: Question[] = [];
  snapshot.forEach(doc => {
    const data = doc.data() as Question;
    allQs.push({ ...data, id: doc.id });
  });

  for (let i = allQs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
  }

  return allQs.slice(0, limitCount);
};

export const getAllQuestions = async (): Promise<Question[]> => {
  const qRef = collection(db, QUESTIONS_COLLECTION);
  const currentQuery = query(qRef, limit(500)); // limit 500 for admin view
  
  const snapshot = await getDocs(currentQuery);
  const allQs: Question[] = [];
  snapshot.forEach(doc => {
    const data = doc.data() as Question;
    allQs.push({ ...data, id: doc.id });
  });
  
  return allQs;
};

export const deleteQuestion = async (id: string) => {
  await deleteDoc(doc(db, QUESTIONS_COLLECTION, id));
};

export const updateQuestion = async (id: string, data: Partial<Question>) => {
  await updateDoc(doc(db, QUESTIONS_COLLECTION, id), data);
};
