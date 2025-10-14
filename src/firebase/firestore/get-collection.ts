'use client';

import {
  Query,
  getDocs,
  DocumentData,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { WithId } from './use-collection';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


/**
 * Performs a one-time fetch of a Firestore collection or query.
 * This is useful for scenarios where you don't need real-time updates.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData>} targetRefOrQuery -
 * The Firestore CollectionReference or Query to fetch from.
 * @returns {Promise<WithId<T>[]>} A promise that resolves to an array of document data, each including its ID.
 */
export async function getCollection<T = any>(
  targetRefOrQuery: CollectionReference<DocumentData> | Query<DocumentData>
): Promise<WithId<T>[]> {
  try {
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(targetRefOrQuery);
    const results: WithId<T>[] = [];
    snapshot.forEach((doc) => {
      results.push({ ...(doc.data() as T), id: doc.id });
    });
    return results;
  } catch (error) {
    const permissionError = new FirestorePermissionError({
      path: (targetRefOrQuery as CollectionReference).path,
      operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error so the calling function knows the operation failed.
    throw permissionError;
  }
}
