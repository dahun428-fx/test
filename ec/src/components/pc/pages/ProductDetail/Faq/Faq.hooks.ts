import { Faq } from '@/models/api/msm/ect/faq/SearchFaqResponse';
import { useSelector } from '@/store/hooks';
import { selectFaqResponse } from '@/store/modules/pages/productDetail';

export const useFaqResponse = (): Faq[] | [] => {
	const faqResponse = useSelector(selectFaqResponse);
	return !!faqResponse ? faqResponse.faqList : [];
};
