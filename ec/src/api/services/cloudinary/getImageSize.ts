import type { CancelToken } from 'axios';
import { cloudinaryApi } from '@/api/clients';
import { GetImageSizeRequest } from '@/models/api/cloudinary/meta/GetImageSizeRequest';
import { GetImageSizeResponse } from '@/models/api/cloudinary/meta/GetImageSizeResponse';
import { assertNotNull } from '@/utils/assertions';
import { convertImageUrl } from '@/utils/domain/image';

/**
 * Get image size
 * @param {GetImageSizeRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<GetImageSizeResponse>} search result
 */
export function getImageSize(
	request: GetImageSizeRequest,
	cancelToken?: CancelToken
): Promise<GetImageSizeResponse> {
	const url = convertImageUrl(request.imageUrl, 'fl_getinfo');
	assertNotNull(url); // ここで null が返ることはない。あったらバグ。
	return cloudinaryApi.get(
		url,
		{}, // 通常の API でこのようなことはしないので真似しないでください
		{
			cancelToken,
		}
	);
}
