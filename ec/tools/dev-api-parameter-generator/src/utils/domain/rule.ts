import { v4 } from 'uuid';
import { ArrayRewriteMethod } from '@/components/pages/Home/RulesEditor/types';

export const createRule = () => ({
	id: v4(),
	arrayRewriteMethod: ArrayRewriteMethod.OVERWRITE,
	response: '',
});
