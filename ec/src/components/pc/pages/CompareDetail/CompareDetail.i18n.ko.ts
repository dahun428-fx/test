import { Translation } from '@/i18n/types';
import { unitPrice } from './UnitPrice/UnitPrice.i18n.ko';

export const compareDetail: Translation = {
	breadcrumbText: '비교결과',
	title: '{{categoryName}} 비교결과',
	totalCount: '총 {{totalCount}} 건',
	totalSelect: ' | {{totalSelect}} 건 선택',
	delete: '삭제',
	selectAll: '전체선택',
	brand: '브랜드',
	discount: '수량할인',
	have: '있음',
	emptySentence: '-',
	shippingDate: '출하일',
	cad: 'CAD',
	rohs: 'RoHS',
	price: '가격',
	image: '이미지',
	productName: '상품명',
	partNumber: '형번',
	unitPrice,
	message: {
		yes: '예',
		no: '아니오',
		alert: {
			delete: {
				noSelected: '삭제하실 형번을 선택하세요.',
			},
			close: '닫기',
		},
		confirm: {
			deleteOne: '삭제하시겠습니까?',
			deleteMany: '선택하신 {{count}}개의 형번을 삭제 하시겠습니까?',
			yes: '예',
			no: '아니오',
		},
		check: '형번을 선택 하세요.',
	},
};
