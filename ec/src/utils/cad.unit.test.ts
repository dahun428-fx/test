import { assertNotNull } from './assertions';
import {
	getDefaultFormat,
	getDefaultOtherFormat,
	getDefaultVersion,
} from './cad';

// NOTE: Refer to this PR for the meaning of test cases: https://github.com/misumi-org/order-web-my/pull/612
// Check the xlsx file under "Test patterns" section, there's a flow chart inside "Format & Version" tab
// which describes all the cases
describe('cad.ts', () => {
	describe('getDefaultFormat', () => {
		it('case 1: no file type list', () => {
			const result = getDefaultFormat(testData.cadData.noFileTypeList);
			expect(result).toEqual({
				label: 'Other',
				value: 'others',
			});
		});

		it('case 1-1: no file type list, no other file type list', () => {
			const result = getDefaultFormat(
				testData.cadData.noFileTypeListNoOtherFileTypeList
			);
			expect(result).toEqual({
				label: 'Other',
				value: 'others',
			});
		});

		describe('file type list has options', () => {
			describe('no cookie', () => {
				it('case 2: file type list has 2D and 3D options', () => {
					const result = getDefaultFormat(testData.cadData.noOtherFileTypeList);
					assertNotNull(sampleFileType2D.formatList[0]);
					expect(result).toEqual({
						label: sampleFileType2D.formatList[0].label,
						value: util.getValue(sampleFileType2D.formatList[0]),
					});
				});

				it('case 2-1: 3D options come before 2D options', () => {
					const data = util.deepClone(testData.cadData.noOtherFileTypeList);
					data.fileTypeList = [sampleFileType3D, sampleFileType2D];
					const result = getDefaultFormat(data);
					assertNotNull(sampleFileType2D.formatList[0]);
					expect(result).toEqual({
						label: sampleFileType2D.formatList[0].label,
						value: util.getValue(sampleFileType2D.formatList[0]),
					});
				});

				it('case 2-2: only 3D options', () => {
					const data = util.deepClone(testData.cadData.noOtherFileTypeList);
					data.fileTypeList = [sampleFileType3D];
					const result = getDefaultFormat(data);
					assertNotNull(sampleFileType3D.formatList[0]);
					expect(result).toEqual({
						label: sampleFileType3D.formatList[0].label,
						value: util.getValue(sampleFileType3D.formatList[0]),
					});
				});
			});

			describe('cookie exists', () => {
				it('case 3: last selected group is 3D but 3D formats not available', () => {
					const data = util.deepClone(testData.cadData.noOtherFileTypeList);
					data.fileTypeList = [sampleFileType2D];
					const result = getDefaultFormat(data, {
						format: 'XXX',
						formatText: 'XXX',
						grp: '3D',
					});
					assertNotNull(sampleFileType2D.formatList[0]);
					expect(result).toEqual({
						label: sampleFileType2D.formatList[0].label,
						value: util.getValue(sampleFileType2D.formatList[0]),
					});
				});

				it('case 3-1: last selected group is 3D and 3D formats available', () => {
					const result = getDefaultFormat(
						testData.cadData.noOtherFileTypeList,
						{
							format: 'XXX',
							formatText: 'XXX',
							grp: '3D',
						}
					);
					expect(result).toEqual({
						label: 'Autodesk Inventor®',
						value: 'Autodesk Inventor®',
					});
				});

				it('case 3-2: last selected format is Other', () => {
					const result = getDefaultFormat(
						testData.cadData.noOtherFileTypeList,
						{
							format: 'others',
							formatText: 'Other',
							grp: '3D',
						}
					);
					expect(result).toEqual({
						label: 'Other',
						value: 'others',
					});
				});

				it('case 4: last selected format exists in the same group', () => {
					const result = getDefaultFormat(
						testData.cadData.noOtherFileTypeList,
						{
							format: 'DWF',
							formatText: 'DWF',
							grp: '2D',
						}
					);
					expect(result).toEqual({
						label: 'DWF',
						value: 'DWF',
					});
				});

				it('case 4-1: last selected format exists but no group -> default group to 2D', () => {
					const result = getDefaultFormat(
						testData.cadData.noOtherFileTypeList,
						{
							format: 'DWF',
							formatText: 'DWF',
							// no grp -> default to 2D
						}
					);
					expect(result).toEqual({
						label: 'DWF',
						value: 'DWF',
					});
				});
			});
		});
	});

	describe('getDefaultOtherFormat', () => {
		it('case 5: no other file type list', () => {
			const result = getDefaultOtherFormat(
				testData.cadData.noOtherFileTypeList
			);
			expect(result).toBe(null);
		});

		it('case 5-1: both file type list and other file type list are empty', () => {
			const result = getDefaultOtherFormat(
				testData.cadData.noFileTypeListNoOtherFileTypeList
			);
			expect(result).toBe(null);
		});

		describe('no cookie or cookie.formatOther not exists', () => {
			it('case 6: no cookie, other file type list has options', () => {
				const result = getDefaultOtherFormat(testData.cadData.noFileTypeList);
				assertNotNull(
					testData.cadData.noFileTypeList.otherFileTypeList[0]?.formatList[0]
				);
				expect(result).toEqual({
					label:
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
							.label,
					value: util.getValue(
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
					),
				});
			});

			it('case 6-1: has cookie but last time "other" was not selected', () => {
				const result = getDefaultOtherFormat(testData.cadData.noFileTypeList, {
					format: 'XXX',
					formatText: 'XXX',
					formatOthers: 'none',
				});
				assertNotNull(
					testData.cadData.noFileTypeList.otherFileTypeList[0]?.formatList[0]
				);
				expect(result).toEqual({
					label:
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
							.label,
					value: util.getValue(
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
					),
				});
			});

			it('case 7: both file type list and other file type list have options', () => {
				const result = getDefaultOtherFormat(testData.cadData.normal);
				expect(result).toBe(null);
			});

			it('case 7-1:  has cookie but last time "other" was not selected', () => {
				const result = getDefaultOtherFormat(testData.cadData.normal, {
					format: 'XXX',
					formatText: 'XXX',
					formatOthers: 'none',
				});
				expect(result).toBe(null);
			});
		});

		describe('cookie.formatOther exists and is not "none"', () => {
			it('case 8: format exists but group does not match', () => {
				const result = getDefaultOtherFormat(testData.cadData.noFileTypeList, {
					grp: '2D',
					format: 'others',
					formatText: 'Other',
					formatOthers: '3DSTUDIOMAX',
				});
				assertNotNull(
					testData.cadData.noFileTypeList.otherFileTypeList[0]?.formatList[0]
				);
				expect(result).toEqual({
					label:
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
							.label,
					value: util.getValue(
						testData.cadData.noFileTypeList.otherFileTypeList[0].formatList[0]
					),
				});
			});

			it('case 10: format exists and group matched', () => {
				const result = getDefaultOtherFormat(testData.cadData.noFileTypeList, {
					grp: '3D',
					format: 'others',
					formatText: 'Other',
					formatOthers: '3DSTUDIOMAX',
				});
				expect(result).toEqual({
					label: '3D Studio MAX',
					value: '3DSTUDIOMAX',
				});
			});
		});
	});

	describe('getDefaultVersion', () => {
		it('case 11: selected format has no version list', () => {
			const result = getDefaultVersion(
				testData.cadData.noFileTypeListNoOtherFileTypeList
			);
			expect(result).toBe(null);
		});

		it('case 11-1: same as case 11 but cookie exists', () => {
			const result = getDefaultVersion(
				testData.cadData.noFileTypeListNoOtherFileTypeList,
				{
					version: 'XXX',
					versionText: 'XXX',
				}
			);
			expect(result).toBe(null);
		});

		describe('no cookie', () => {
			it('case 12: selected format has version list', () => {
				const result = getDefaultVersion(testData.cadData.noOtherFileTypeList);
				assertNotNull(sampleFileType2D.formatList[0]?.versionList[0]);
				expect(result).toEqual({
					label: sampleFileType2D.formatList[0].versionList[0].label,
					value: sampleFileType2D.formatList[0].versionList[0].format,
				});
			});

			it('case 12-1: selected format has no version list', () => {
				const data = util.deepClone(testData.cadData.noOtherFileTypeList);
				assertNotNull(data.fileTypeList[0]);
				data.fileTypeList[0].formatList = [
					formatWithNoVersionList,
					...data.fileTypeList[0].formatList,
				];

				const result = getDefaultVersion(data);
				expect(result).toBe(null);
			});

			it('case 12-2: selected other format has version list', () => {
				const result = getDefaultVersion(testData.cadData.noFileTypeList);
				assertNotNull(sampleOtherFileType2D.formatList[0]?.versionList[0]);
				expect(result).toEqual({
					label: sampleOtherFileType2D.formatList[0].versionList[0].label,
					value: sampleOtherFileType2D.formatList[0].versionList[0].format,
				});
			});

			it('case 12-3: selected other format has no version list', () => {
				const data = util.deepClone(testData.cadData.noFileTypeList);
				assertNotNull(data.otherFileTypeList[0]);
				data.otherFileTypeList[0].formatList = [
					formatWithNoVersionList,
					...data.otherFileTypeList[0].formatList,
				];

				const result = getDefaultVersion(data);
				expect(result).toBe(null);
			});
		});

		describe('cookie exists', () => {
			it('case 13: cookie.version not exists in version list', () => {
				const result = getDefaultVersion(testData.cadData.noOtherFileTypeList, {
					grp: '2D',
					format: 'DWG',
					version: 'XXX',
				});
				expect(result).toEqual({
					label: 'AUTOCAD VERSION 2013-2017',
					value: 'DWG2D-AUTOCAD VERSION 2013',
				});
			});

			it('case 14: cookie.version exists in version list', () => {
				const result = getDefaultVersion(testData.cadData.noOtherFileTypeList, {
					grp: '2D',
					format: 'DWG',
					version: 'DWG2D-AUTOCAD VERSION 2007 - 2009',
				});
				expect(result).toEqual({
					label: 'AUTOCAD VERSION 2007-2009',
					value: 'DWG2D-AUTOCAD VERSION 2007 - 2009',
				});
			});
		});
	});
});

const util = {
	getValue(format: { format?: string; label: string }) {
		return format.format ?? format.label;
	},
	// TODO: move to test util?
	deepClone<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj));
	},
};

// TODO: organize test data
const formatWithNoVersionList = {
	label: '3D Studio MAX',
	format: '3DSTUDIOMAX',
	versionList: [],
};

const sampleOtherFileType2D = {
	type: '2D',
	formatList: [
		{
			label: 'Animated GIF',
			versionList: [
				{
					label: 'ANIMGIFFILE-640x480',
					format: 'ANIMGIFFILE-640x480',
				},
				{
					label: '640x480',
					format: 'ANIMGIF-640x480',
				},
			],
		},
		{
			label: 'BMP(2D View)',
			format: 'BMP2D',
			versionList: [],
		},
	],
};

const sampleOtherFileType3D = {
	type: '3D',
	formatList: [
		{
			label: '3D Studio MAX',
			format: '3DSTUDIOMAX',
			versionList: [],
		},
		{
			label: 'DWG',
			versionList: [
				{
					label: 'AUTOCAD VERSION 2013-2017',
					format: 'DWG3D-AUTOCAD VERSION 2013',
				},
				{
					label: 'AUTOCAD VERSION 2010-2012',
					format: 'DWG3D-AUTOCAD VERSION 2010 - 2012',
				},
				{
					label: 'AUTOCAD VERSION 2007-2009',
					format: 'DWG3D-AUTOCAD VERSION 2007 - 2009',
				},
				{
					label: 'AUTOCAD VERSION 2004-2006',
					format: 'DWG3D-AUTOCAD VERSION 2004 - 2006',
				},
			],
		},
	],
};

const sampleFileType2D = {
	type: '2D',
	formatList: [
		{
			label: 'DWF',
			versionList: [
				{
					label: 'V5.5, ASCII',
					format: 'DWF2D-A5.5',
				},
				{
					label: 'V5.5, Binary',
					format: 'DWF2D-B5.5',
				},
				{
					label: 'V5.5, Compressed',
					format: 'DWF2D-C5.5',
				},
				{
					label: 'V6, ASCII',
					format: 'DWF2D-A6.0',
				},
				{
					label: 'V6, Uncompressed Binary',
					format: 'DWF2D-B6.0',
				},
			],
		},
		{
			label: 'DWG',
			versionList: [
				{
					label: 'AUTOCAD VERSION 2013-2017',
					format: 'DWG2D-AUTOCAD VERSION 2013',
				},
				{
					label: 'AUTOCAD VERSION 2010-2012',
					format: 'DWG2D-AUTOCAD VERSION 2010 - 2012',
				},
				{
					label: 'AUTOCAD VERSION 2007-2009',
					format: 'DWG2D-AUTOCAD VERSION 2007 - 2009',
				},
				{
					label: 'AUTOCAD VERSION 2004-2006',
					format: 'DWG2D-AUTOCAD VERSION 2004 - 2006',
				},
			],
		},
	],
};

const sampleFileType3D = {
	type: '3D',
	formatList: [
		{
			label: 'Autodesk Inventor®',
			versionList: [
				{
					label: '2022',
					format: 'AIS2022',
				},
				{
					label: '2021',
					format: 'AIS2021',
				},
				{
					label: '2020',
					format: 'AIS2020',
				},
				{
					label: '2019',
					format: 'AIS2019',
				},
			],
		},
		{
			label: 'Catia®',
			versionList: [
				{
					label: '>=V5',
					format: 'CATIAV5',
				},
				{
					label: '(Macro) >=V5 R8',
					format: 'CATV5MAC',
				},
			],
		},
	],
};

const testData = {
	cadData: {
		normal: {
			fixed2DCadList: [],
			fixed3DCadList: [],
			dynamic3DCadList: [],
			fileTypeList: [sampleFileType2D, sampleFileType3D],
			otherFileTypeList: [sampleOtherFileType2D, sampleOtherFileType3D],
		},
		noFileTypeList: {
			fixed2DCadList: [],
			fixed3DCadList: [],
			dynamic3DCadList: [],
			fileTypeList: [],
			otherFileTypeList: [sampleOtherFileType2D, sampleOtherFileType3D],
		},
		noFileTypeListNoOtherFileTypeList: {
			fixed2DCadList: [],
			fixed3DCadList: [],
			dynamic3DCadList: [],
			fileTypeList: [],
			otherFileTypeList: [],
		},
		noOtherFileTypeList: {
			fixed2DCadList: [],
			fixed3DCadList: [],
			dynamic3DCadList: [],
			fileTypeList: [sampleFileType2D, sampleFileType3D],
			otherFileTypeList: [],
		},
	},
};
