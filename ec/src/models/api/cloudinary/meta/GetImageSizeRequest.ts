import { CloudinaryApiRequest } from '@/models/api/cloudinary/CloudinaryApiRequest';

/** Get image size hosted on Cloudinary request */
export interface GetImageSizeRequest extends CloudinaryApiRequest {
	// 本来 preset を指定できる API ですが、2022/4/18 現在の既存システムでは
	// 固定値になっているため指定できるようにしていません。

	/** image url (on cloudinary) without preset */
	imageUrl: string;
}
