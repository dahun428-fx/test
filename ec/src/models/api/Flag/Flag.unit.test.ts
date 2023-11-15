import { Flag } from './Flag';

describe('models/api/Flag', () => {
	describe('isTrue', () => {
		it('flagが"1"の場合はtrueを返す', () => {
			expect(Flag.isTrue('1')).toBe(true);
		});

		it('flagが"1"以外の場合はfalseを返す', () => {
			expect(Flag.isTrue('0')).toBe(false);
			expect(Flag.isTrue(undefined)).toBe(false);
		});
	});

	describe('isFalse', () => {
		it('flagが"1"以外の場合はtrueを返す', () => {
			expect(Flag.isFalse('0')).toBe(true);
			expect(Flag.isFalse(undefined)).toBe(true);
		});

		it('flagが"1"の場合はfalseを返す', () => {
			expect(Flag.isFalse('1')).toBe(false);
		});
	});

	describe('isFlag', () => {
		it('flagが"0"または"1"の場合、trueを返す', () => {
			expect(Flag.isFlag('0')).toBe(true);
			expect(Flag.isFlag('1')).toBe(true);
		});

		it('flagが"0"または"1"以外の場合、falseを返す', () => {
			expect(Flag.isFlag('2')).toBe(false);
			expect(Flag.isFlag('a')).toBe(false);
			expect(Flag.isFlag(0)).toBe(false);
			expect(Flag.isFlag(false)).toBe(false);
			expect(Flag.isFlag(undefined)).toBe(false);
		});
	});
});
