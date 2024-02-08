import { Translation } from '@/i18n/types';

export const cartboxMessage: Translation = {
	orderDeadline: `이 상품은 {{orderDeadline}} 이후의 주문인 경우 익일 접수되므로 주의하시기 바랍니다.`,
	chargeRaw1: `【분납（명세행단위）가능】`,
	chargeRaw2: `【분납가능】`,
	baraChargeNetRicoh: `<0>{{text}}</0>현재 갯수의 경우, 통상단가 <1></1>+<2></2>/개로 주문됩니다.`,
	baraCharge: `<0>{{text}}</0>현재 갯수의 경우, 통상단가 <1></1>+<2>분납</2><3></3>/개로 주문됩니다.`,
};
