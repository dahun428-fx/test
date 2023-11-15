/**
 * アプリケーション例外基底クラスです。
 * アプリケーションでthrowする例外はこのクラスを継承してください。
 */
export class ApplicationError extends Error {
	/**
	 * @param {string} message - エラーメッセージ
	 */
	constructor(message: string) {
		super(message);
		this.name = 'ApplicationError';
		// https://teratail.com/questions/114258
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
