import { Translation } from '@/i18n/types';

export const compareBalloon: Translation = {
	title: '비교',
	order: '주문',
	cart: '장바구니',
	myComponent: 'My 부품표',
	guide: '비교 형번은 당일 이후 자동 삭제됩니다.',
	compareResult: '비교결과',
	close: '닫기',
	message: {
		yes: '예',
		no: '아니오',
		ok: '확인',
		confirm: {
			deleteOne:
				'{{categoryName}}의 모든 형번이 삭제됩니다. {{categoryName}}을(를) 삭제하시겠습니까?',
			deleteAll: '선택하신 {{length}}개의 형번이 삭제됩니다. 삭제하시겠습니까?',
			check: '삭제하시겠습니까?',
			alert: '삭제하실 형번을 선택해주세요.',
		},
	},
	totalCount: '총 {{totalCount}} 건',
	totalSelect: ' | {{totalSelect}} 건 선택',
	delete: '삭제',
	selectAll: '전체선택',
};
