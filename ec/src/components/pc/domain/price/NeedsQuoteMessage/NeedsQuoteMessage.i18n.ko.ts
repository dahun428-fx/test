import { Translation } from '@/i18n/types';

export const needsQuoteMessage: Translation = {
	nonstandard: '견적을 통하여 가격, 출하일 확인이 필요한 상품입니다.',
	bigOrder:
		'{{largeOrderMaxQuantity}}개 이상 주문을 원하실 경우 출하일, 추가할인 확인이 필요하여 견적 확인 후 주문이 가능합니다.',
	priceLeadTime: '견적을 통하여 가격, 출하일 확인이 필요한 상품입니다.',
	price:
		'이 상품의 가격/납기는 WOS에서 확인 바랍니다.(<0>WOS 사용방법</0>)<1></1>WOS에서 확인 바랍니다.',
	leadTime: '견적을 통하여 가격, 출하일 확인이 필요한 상품입니다.',
	quoteOnWos: '견적',
};
