import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

export interface AddReviewReportRequest extends MsmApiRequest {
	review_id: number;
	reg_id: string;
	reg_name: string;
	reg_code: string;
	reg_company: string;
	reg_tel: string;
	report_type: string;
	report_content: string;
}
