'use client';

import {
  Query,
  getDocs,
  DocumentData,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { WithId } from './use-collection';

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
    console.error("Error fetching collection: ", error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it in a specific way (e.g., return an empty array).
    return [];
  }
}
