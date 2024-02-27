export const BannerType = {
	S_BANNER_PATH: '1',
	L_BANNER_PATH: '2',
} as const;
export type BannerType = typeof BannerType[keyof typeof BannerType];
