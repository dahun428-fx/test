import { Translation } from '@/i18n/types';

export const reviewItem: Translation = {
	recommendDisplay: '추천수 <0>{{recommendCnt}}</0>',
	recommendAction: '추천하기',
	recommendActionComplete: '추천완료',
	reportAction: '신고하기',
	modify: '수정',
	delete: '삭제',
	confirm: {
		delete: '삭제하시겠습니까?',
		yes: '예',
		no: '아니오',
	},
	message: {
		delete: {
			success: '삭제되었습니다.',
		},
		systemError:
			'죄송합니다. 시스템 에러가 발생하였습니다. 잠시후에 다시한번 시도 부탁드립니다.',
		close: '닫기',
	},
	noReview: '작성된 리뷰가 없습니다',
};
