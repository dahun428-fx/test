import { RoHSType } from '@/models/api/constants/RoHSType';

type RohsFlag = '0' | '1' | '2' | '9';

export const shouldShowsRohs = (rohsFlag?: RohsFlag): rohsFlag is RohsFlag =>
	!!rohsFlag && (rohsFlag === '1' || rohsFlag === '2');

/**
 * Get rohs flag display value
 * @param rohsFlag
 * @returns
 */
export const rohsFlagDisp = (rohsFlag?: RoHSType) => {
	switch (rohsFlag) {
		case RoHSType.Correspondence6:
			return '6';
		case RoHSType.Correspondence10:
			return '10';
		default:
			return '-';
	}
};
