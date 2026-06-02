import { cleanSlug } from './permalinks';

export const getContentSlug = ({ id }: { id: string }) => cleanSlug(id.replace(/\.(md|mdx)$/i, ''));
