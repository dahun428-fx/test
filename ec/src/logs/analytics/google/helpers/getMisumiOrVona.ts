import { MisumiOrVona } from '@/logs/analytics/google/types';
import { Flag } from '@/models/api/Flag';

export function getMisumiOrVona(misumiFlag: Flag): MisumiOrVona {
	return Flag.isTrue(misumiFlag) ? 'misumi' : 'vona';
}
