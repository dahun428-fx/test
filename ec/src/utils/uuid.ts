import { v4 } from 'uuid';

/**
 * Generate uuid v4
 * - 無用なオプション指定をさせない目的と、将来何らかの処理を挟みたくなった時のためと、
 *   uuidv4 の名前で import できるようにする目的でこのような wrapper を書いています。
 */
export const uuidv4 = () => v4();
