import { ReviewApiRequest } from '@/models/api/review/ReviewApiRequest';

export interface AddReviewReportRequest extends ReviewApiRequest {
	review_id: number;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
	report_type: string;
	report_content: string;
}
