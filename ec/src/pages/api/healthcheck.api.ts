import { NextApiRequest, NextApiResponse } from 'next';

/**
 * ヘルスチェックAPI
 * - NOTE: vercelの構成上 APIはバッググラウンドのlambdaとフロントのEdgeネットワーク両方を使う仕掛けのため、vercel全体のヘルスチェックとなる。
 */
const healthCheck = (req: NextApiRequest, res: NextApiResponse): void => {
	res.status(200).json({ status: 'OK' });
};
export default healthCheck;
