import { config } from '@/config';
import { url } from '@/utils/url';

// NOTE: https://github.com/misumi-org/order-web/issues/241#issuecomment-845840420
/** プリセットを含んだ商品画像URLの正規表現 */
const imageUrlPresetIncludePattern = /\/image\/upload\/[a-zA-Z]+?_.+?\//;

/**
 * 指定したプリセットが適用された商品画像URLを返却します。(Cloudinary のみ対応)
 *
 * @param {string} imageUrl 商品画像URL
 * @param {string} preset プリセット
 * @returns 商品画像URL
 */
const convertImageUrl = (imageUrl: string | undefined, preset: string) => {
	// 商品画像URLがない場は undefined を返却します。
	if (!imageUrl) {
		return undefined;
	}

	// 商品画像URLのドメインがCloudinary以外の場合、そのまま返却します。
	if (
		!imageUrl.includes(config.cdn.domain.cloudinary.global) &&
		!imageUrl.includes(config.cdn.domain.cloudinary.china)
	) {
		return imageUrl;
	}

	// 商品画像URLにプリセットが含まれてない場合、商品画像URLの「/image/upload/」後にプリセットを追加して返却します。
	if (!hasPreset(imageUrl)) {
		return addPreset(imageUrl, preset);
	}

	// 商品画像URLにプリセットが含まれている場合、商品画像URLのプリセットを差し替えて返却します。
	return replacePreset(imageUrl, preset);
};

/**
 * 商品画像URLにプリセットが含まれているかどうか
 *
 * @param {string} imageUrl 商品画像URL
 * @returns {boolean}
 */
const hasPreset = (imageUrl: string): boolean => {
	return imageUrlPresetIncludePattern.test(imageUrl);
};

/**
 * プリセットが含まれていない商品画像URLにプリセットを追加した商品画像URLを返却します。
 *
 * @param {string} imageUrl プリセットが含まれていない商品画像URL
 * @param {string} preset プリセット
 * @returns {string} 商品画像URL
 */
const addPreset = (imageUrl: string, preset: string): string => {
	return imageUrl.replace(`/image/upload/`, `/image/upload/${preset}/`);
};

/**
 * プリセットが含まれる商品画像URLのプリセットを差し替えた（上書きした）商品画像URLを返却します。
 *
 * @param {string} imageUrl プリセットが含まれている商品画像URL
 * @param {string} preset プリセット
 * @returns {string} 商品画像URL
 */
const replacePreset = (imageUrl: string, preset: string): string => {
	return imageUrl.replace(
		imageUrlPresetIncludePattern,
		`/image/upload/${preset}/`
	);
};

/**
 * Normalize image url
 * @param imageUrl
 * @param identifier
 */
const normalizeImageUrl = (imageUrl: string, identifier: string) =>
	`${imageUrl}?$${identifier}$`;

type ImageLoadedOptions = {
	/** Reject if failed to load. Default: always resolve */
	rejectOnError: boolean;
};

/** Wait for an image to be loaded */
const imageLoaded = (url: string, option?: ImageLoadedOptions) => {
	return new Promise<void>((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve();
		img.onerror = () => (option?.rejectOnError ? reject() : resolve());
	});
};

/** Wait for multiple images to be loaded */
const imagesLoaded = (urls: string[], option?: ImageLoadedOptions) => {
	return Promise.all(urls.map(url => imageLoaded(url, option)));
};

/** Returns the Open Graph image URL of a web page. */
const getOGImageUrl = (imageUrl: string | undefined) => {
	if (!imageUrl) {
		return url.noImagePath;
	}

	if (imageUrl.startsWith('//')) {
		return `https:${imageUrl}`;
	}

	if (imageUrl.includes('https')) {
		return imageUrl;
	}

	return `https:${imageUrl}`;
};

export {
	convertImageUrl,
	normalizeImageUrl,
	imagesLoaded,
	imageLoaded,
	getOGImageUrl,
};
