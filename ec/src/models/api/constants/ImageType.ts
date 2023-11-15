/**
 * Image type
 * NOTE: type: 3 以降もあると思われるが設計書上記載されておらず
 * 下記　1, 2 が背反というわけでもないため !== 等の使用時は注意
 */
const ImageType = {
	/** 通常画像 */
	Normal: '1',

	/** 拡大画像 */
	Zoomable: '2',
} as const;

type ImageType = typeof ImageType[keyof typeof ImageType];
export default ImageType;
