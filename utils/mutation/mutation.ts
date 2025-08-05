'use server';

import { revalidatePath } from 'next/cache';

/**
 * Generic handler for all mutations
 * @param action - Name of the action for error logging
 * @param path - Path to revalidate, defaults to '/'
 */
export async function handleMutation(action: string = 'mutation', path: string = '/hiring') {
  try {
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error(`Failed to handle ${action}:`, error);
    return { success: false, error: `Failed to handle ${action}` };
  }
}
