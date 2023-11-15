import { unfixedSpecPartNumberParts } from './partNumber';

describe('partNumber.ts', () => {
	describe('unfixedSpecPartNumberParts', () => {
		it('should return an array of 1 item if no unfixed parts', () => {
			const partNumber = 'PN123';
			const result = unfixedSpecPartNumberParts(partNumber);
			expect(result).toEqual([
				{
					part: 'PN123',
					unfixedSpec: false,
				},
			]);
		});
		it('should return an array of parts if part number contains unfixed parts', () => {
			const partNumber = 'PN123[0.5-5/a]';
			const result = unfixedSpecPartNumberParts(partNumber);
			expect(result).toEqual([
				{
					part: 'PN123',
					unfixedSpec: false,
				},
				{
					part: '[0.5-5/a]',
					unfixedSpec: true,
				},
			]);
		});
		it('should return an array of parts if part number contains unfixed parts (many unfixed parts)', () => {
			const partNumber = 'PN123[0.5-5/a]-[2-5.5]';
			const result = unfixedSpecPartNumberParts(partNumber);
			expect(result).toEqual([
				{
					part: 'PN123',
					unfixedSpec: false,
				},
				{
					part: '[0.5-5/a]',
					unfixedSpec: true,
				},
				{
					part: '-',
					unfixedSpec: false,
				},
				{
					part: '[2-5.5]',
					unfixedSpec: true,
				},
			]);
		});
	});
});
