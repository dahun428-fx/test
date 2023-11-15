import { Flag } from '@/models/api/Flag';

export function getDivision(payload: {
	misumiFlag?: Flag;
	departmentCode: string;
}) {
	if (payload.misumiFlag === undefined) {
		return payload.departmentCode;
	}

	return `${Flag.isTrue(payload.misumiFlag) ? 'm' : 'v'}_${
		payload.departmentCode
	}`;
}
