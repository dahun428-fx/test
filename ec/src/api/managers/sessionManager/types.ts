export type Session = {
	refreshTokenHash?: string;
	accessTokenKey?: string;
	accessTokenExpiration?: string;
};

// 将来的に userCode も cookie ではなく userInfo などから
// 取得することを想定して Cookies から除外している
export type User = {
	userCode?: string;
};
