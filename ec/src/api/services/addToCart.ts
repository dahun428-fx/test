import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { AddCartRequest } from '@/models/api/msm/ect/cart/AddCartRequest';
import { AddCartResponse } from '@/models/api/msm/ect/cart/AddCartResponse';

/**
 * Add to cart.
 * - NOTE: service のメソッド名は通常URLに合わせていますが、カート追加API は /cart/add であり
 *         そのままだと addCart になってしまうため、URL とは異なりますが意図的に addToCart と命名しています。
 *         通常は URL に記載されているままの命名としてください。
 *
 * @param {AddCartRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<AddCartResponse>} search result
 */
export function addToCart(
	request: AddCartRequest,
	cancelToken?: CancelToken
): Promise<AddCartResponse> {
	return ectApi.post('/api/v1/cart/add', request, { cancelToken });
}
