import { useSelector } from '@/store/hooks';
import { selectTopCategories } from '@/store/modules/cache';

/** top categories selector */
export const useTopCategories = () => useSelector(selectTopCategories);
