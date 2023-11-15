import { Pict } from '@/models/api/msm/ect/series/shared';

export const discountRegex = /^discount_(-?\d+)$/;

/**
 * Remove discount from pict list
 */
export function removeDiscountFromPictList(pictList: Pict[]) {
	return pictList.filter(pict => {
		if (!pict.pict) {
			return false;
		}

		return !discountRegex.test(pict.pict);
	});
}
