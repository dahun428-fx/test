import {
	ReviewInfo,
	ReviewSortType,
} from '@/models/api/review/SearchReviewResponse';

/** is available reviewState */
export function isAvailaleReviewState(reviewConfig: any | undefined): boolean {
	if (!reviewConfig || !!!reviewConfig.reviewState) {
		return false;
	}
	if (reviewConfig.reviewState > 0) {
		return true;
	}
	return false;
}

export function totalCount(reviewInfo: ReviewInfo | undefined): number {
	if (!reviewInfo) return 0;
	return reviewInfo.reviewCnt;
}

export function getPageSize(reviewState: number): number {
	return reviewState && reviewState === 1 ? 9 : 3;
}

/**
 * masking for review
 * @param regId review regId
 * @param regName review regName
 * @param loginedUserCode auth.userCode | user.userCode
 * @returns maked user name - review regname
 */
export function modUserId(
	regId: string,
	regName: string,
	loginedUserCode: string
): string {
	if (regId === loginedUserCode) {
		return regName;
	}
	return `${regName.substring(0, 2)}******`;
}
