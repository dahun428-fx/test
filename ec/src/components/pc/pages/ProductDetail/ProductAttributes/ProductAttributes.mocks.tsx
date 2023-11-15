import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { SettlementType } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { AuthState } from '@/store/modules/auth';
import { ProductDetailState } from '@/store/modules/pages/productDetail/types';

type QueryParams = {
	Tab?: string;
	HissuCode?: string;
	Page?: number;
	CategorySpec?: string;
	PNSearch?: string;
	wl?: number;
};

//=============================================================================
// API Response Mocks
//=============================================================================

export const seriesResponseMock: SearchSeriesResponse$detail = {
	specList: [
		{
			specCode: '00000018111',
			specCodeDisp: 'C4',
			specName: 'Outer Diameter (D)',
			specUnit: 'φ',
			specType: '1',
		},
		{
			specCode: '00000018110',
			specCodeDisp: 'C3',
			specName: 'Work Material',
			specType: '1',
		},
		{
			specCode: '00000018112',
			specCodeDisp: 'C5',
			specName: 'Flute Length (ℓ)',
			specUnit: 'mm',
			specType: '1',
		},
		{
			specCode: '00000018115',
			specCodeDisp: 'C8',
			specName: 'Number of Flutes',
			specUnit: 'sheet',
			specType: '1',
		},
		{
			specCode: '00000018108',
			specCodeDisp: 'C1',
			specName: 'Model',
			specType: '1',
		},
		{
			specCode: '00000018119',
			specCodeDisp: 'C12',
			specName: 'Coating',
			specType: '1',
		},
		{
			specCode: '00000018114',
			specCodeDisp: 'C7',
			specName: 'Shank Diameter (d)',
			specUnit: 'mm',
			specType: '1',
		},
		{
			specCode: '00000018113',
			specCodeDisp: 'C6',
			specName: 'Overall Length (L)',
			specUnit: 'mm',
			specType: '1',
		},
		{
			specCode: '00000018109',
			specCodeDisp: 'C2',
			specName: 'Processing Applications',
			specType: '1',
		},
		{
			specCode: '00000018118',
			specCodeDisp: 'C11',
			specName: 'Geometry',
			specType: '1',
		},
		{
			specCode: '00000018117',
			specCodeDisp: 'C10',
			specName: 'Torsion Angle (θ)',
			specType: '1',
		},
		{
			specCode: 'jp000020460',
			specCodeDisp: 'D1',
			specName: 'Additional Classification',
			specType: '2',
		},
		{
			specCode: 'jp000020465',
			specCodeDisp: 'E2',
			specName: 'Tolerance of OD',
			specUnit: 'mm',
			specType: '3',
		},
		{
			specCode: 'jp000020467',
			specCodeDisp: 'E4',
			specName: 'Figure',
			specType: '3',
		},
		{
			specCode: 'jp000020468',
			specCodeDisp: 'E5',
			specName: '● Inventory Product □ Manufacturer Product',
			specType: '3',
		},
	],
	seriesList: [
		{
			priceHiddenFlag: '0',
			departmentCode: 'fs',
			categoryCode: 'T0101010100',
			categoryName: 'Square End Mills (Carbide)',
			searchCategoryCode: 'T0101010000',
			seriesCode: '110600000670',
			seriesName:
				'XAL series carbide square end mill, 4-flute / 3D Flute Length (regular) model',
			brandCode: 'MSM1',
			brandUrlCode: 'misumi',
			brandName: 'MISUMI_Test',
			seriesStatus: '1',
			templateType: '1',
			productField: '6',
			productImageList: [
				{
					type: '2',
					url: '//assets.misumi-ec.com/is/image/misumiPrd/110600000670_001',
					comment:
						'XAL series carbide square end mill, 4-flute / 3D Flute Length (regular) model',
				},
			],
			catchCopy:
				"The Misumi's original fine intermediate flute length is available at a reasonable price",
			minPiecesPerPackage: 1,
			maxPiecesPerPackage: 1,
			minShortestDaysToShip: 0,
			minStandardDaysToShip: 0,
			maxStandardDaysToShip: 0,
			directCartType: '1',
			priceCheckLessFlag: '0',
			minStandardUnitPrice: 50.74,
			maxStandardUnitPrice: 879.43,
			minPricePerPiece: 50.74,
			maxPricePerPiece: 879.43,
			recommendFlag: '0',
			iconTypeList: [
				{
					iconType: '1000',
					iconTypeDisp: 'Volume Discount',
				},
				{
					iconType: '1000',
					iconTypeDisp: 'Expansion of standard',
				},
			],
			volumeDiscountFlag: '1',
			rohsFrameFlag: '0',
			relatedLinkFrameFlag: '0',
			cValueFlag: '0',
			stockItemFlag: '0',
			displayStandardPriceFlag: '0',
			discontinuedProductFlag: '0',
			pictList: [],
			cadTypeList: [],
			misumiFlag: '1',
			packageSpecFlag: '0',
			seriesInfoText: [],
			digitalBookPdfUrl: '//stg0-my.misumi-ec.com/pdf/vona/14292137_0033.pdf',
			digitalBookList: [
				{
					digitalBookCode: 'MSM1_TH_T01',
					digitalBookPage: '9',
					digitalBookName: 'Product TOP',
				},
			],
			chatFlag: '0',
			similarSearchFlag: '1',
			cadDownloadButtonType: '3',
			cad3DPreviewFlag: '0',
			tabType: '7',
			productDescriptionHtml:
				'\r\n<div class="pad_b15"><img src="//stg0-my.misumi-ec.com/linked/item/10600000670/img/SEA_drw_01.gif" alt="XAL series carbide square end mill, 4-flute / 3D Flute Length (regular) model:Related Image" /></div>\r\n',
			specificationsHtml:
				'<h2>Specifications</h2><p><img src="//stg0-my.misumi-ec.com/linked/item/10600000670/img/SEA_ord_01.gif" alt="XAL series carbide square end mill, 4-flute / 3D Flute Length (regular) model:Related Image" /><br /><br /></p>\r\n<table border="0" cellspacing="0">\r\n<tbody>\r\n<tr>\r\n<td class="headerCell" rowspan="3" align="center" style="border-width: 1px 0px 1px 1px;"><span class="fontType">Model Number</span></td>\r\n<td class="headerCell" style="border-width: 1px 0px 1px 0px;">&nbsp;</td>\r\n<td class="headerCell" style="border-width: 1px 1px 1px 0px;">&nbsp;</td>\r\n<td class="headerCell" rowspan="3" align="center">Shank Diameter<span class="fontType"><br /></span>d</td>\r\n<td class="headerCell" rowspan="3" align="center">Flute Length<br />ℓ</td>\r\n<td class="headerCell" rowspan="3" align="center">Overall Length<br />L</td>\r\n<td class="headerCell" rowspan="3" align="center">Figure</td>\r\n<td class="headerCell" colspan="2" rowspan="2" align="center">Standards Y/N</td>\r\n</tr>\r\n<tr>\r\n<td class="headerCell" rowspan="2" align="center"><span class="fontType">Outer Diameter<br />D</span></td>\r\n<td class="headerCell" rowspan="2" align="center"><span class="fontType">Shank Diameter<br />d</span></td>\r\n</tr>\r\n<tr>\r\n<td class="headerCell" align="center">Standard</td>\r\n<td class="headerCell" align="center">Sharp Edge</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" rowspan="19" align="center"><span class="fontType">XAL-EM4R<br /></span>(Standard)<br /><span class="fontType"><br /></span><span class="fontType">XAL-PEM4R<br /></span>(Sharp Edge)</td>\r\n<td class="bodyCell" align="right"><span class="fontType">1</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">3</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">1.5</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">4.5</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">2</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">6</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">2.5</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">7.5</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">3</span></td>\r\n<td class="bodyCell" align="center"><span class="fontType">4</span></td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">9</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">3</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">9</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">3.5</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">10.5</td>\r\n<td class="bodyCell" align="right">45</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">4</span></td>\r\n<td class="bodyCell" align="center"><span class="fontType">4</span></td>\r\n<td class="bodyCell" align="right">4</td>\r\n<td class="bodyCell">12</td>\r\n<td class="bodyCell" align="right">50</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">4</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">12</td>\r\n<td class="bodyCell" align="right">50</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">5</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">15</td>\r\n<td class="bodyCell" align="right">55</td>\r\n<td class="bodyCell" align="center">1</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">6</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">18</td>\r\n<td class="bodyCell" align="right">60</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">7</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">6</td>\r\n<td class="bodyCell">21</td>\r\n<td class="bodyCell" align="right">50</td>\r\n<td class="bodyCell" align="center">3</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">8</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">8</td>\r\n<td class="bodyCell">24</td>\r\n<td class="bodyCell" align="right">70</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">9</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">8</td>\r\n<td class="bodyCell">27</td>\r\n<td class="bodyCell" align="right">60</td>\r\n<td class="bodyCell" align="center">3</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">No Standards</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">10</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">10</td>\r\n<td class="bodyCell">30</td>\r\n<td class="bodyCell" align="right">80</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">12</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">12</td>\r\n<td class="bodyCell">36</td>\r\n<td class="bodyCell" align="right">85</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">14</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">12</td>\r\n<td class="bodyCell">42</td>\r\n<td class="bodyCell" align="right">80</td>\r\n<td class="bodyCell" align="center">3</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">16</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">16</td>\r\n<td class="bodyCell">48</td>\r\n<td class="bodyCell" align="right">110</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n<tr>\r\n<td class="bodyCell" align="right"><span class="fontType">20</span></td>\r\n<td class="bodyCell" align="center">&mdash;</td>\r\n<td class="bodyCell" align="right">20</td>\r\n<td class="bodyCell">60</td>\r\n<td class="bodyCell" align="right">130</td>\r\n<td class="bodyCell" align="center">2</td>\r\n<td class="bodyCell" align="center">●</td>\r\n<td class="bodyCell" align="center">●</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>&nbsp; <span class="fontNote">[ ! ]</span>For shank diameter (d) specifications listed in blue, specify both a&nbsp;outer diameter (D) and shank diameter (d).</p>',
			overviewHtml:
				'<h2>More Information</h2><p><img src="//stg0-my.misumi-ec.com/linked/img/wysiwygcommon/VONA_merit_EN.gif" alt="" /><br /><span class="fontGreen">●</span> An affordable set price that moves according to quantity from 3 pieces and up.<span class="fontGreen"><br /></span><span class="fontGreen">●</span> The XAL coating with excellent lubricity delivers stable wear-resistant performance, especially when milling raw materials, resulting in improved shape accuracy of the machined objects.<br /><span class="fontGreen">●</span> A 4-flute end mill that is ideal for raw material side-surface work at a high machining frequency.<br /><span class="fontNote">[ ! ]</span>The XAL coating does not have conductive properties. Cannot be used with conduction model tool setters.</p>',
			technicalInfoUrl: '',
			simpleFlag: '1',
			standardSpecValueList: [],
			categoryList: [
				{
					categoryCode: 'fs_machining',
					categoryName: 'Cutting Tools',
					discontinuedProductFlag: '0',
				},
				{
					categoryCode: 'T0101000000',
					categoryName: 'Carbide End Mills',
					discontinuedProductFlag: '0',
				},
				{
					categoryCode: 'T0101010000',
					categoryName: 'Carbide Square End Mills',
					discontinuedProductFlag: '0',
				},
			],
			contact: {
				contactName:
					'Factory Automation, Electronics, Tools, & MRO (Maintenance, Repair and Operations)',
				tel: '(60) 3 7890 6399',
				fax: '(60) 3 7960 7499',
				receptionTime:
					'9:00am - 6:00pm (Monday - Friday)<br />9:00am - 1:00pm (Saturday)',
			},
			msdsList: [],
			priceCheckLoginFlag: '0',
			unitCodeList: [],
			promptDeliveryFlag: '0',
			specialShipmentFlag: '0',
			campaignEndDate: '2022/12/31',
			gradeTypeDisp: 'Economy',
		},
	],
	currencyCode: 'MYR',
};

export const partNumberResponseMock: SearchPartNumberResponse$search = {
	totalCount: 1,
	completeFlag: '0',
	unitProductFlag: '0',
	specList: [
		{
			specCode: '00000230744',
			specCodeDisp: 'C5',
			specName: 'Nominal of Thread (M)',
			specType: '1',
			standardSpecFlag: '0',
			similarSearchType: '2',
		},
		{
			specCode: '00000230683',
			specCodeDisp: 'C6',
			specName: 'Length L',
			specUnit: 'mm',
			specType: '1',
			standardSpecFlag: '0',
			similarSearchType: '2',
		},
		{
			specCode: '00000251676',
			specCodeDisp: 'C19',
			specName: 'Pitch',
			specUnit: 'mm',
			specType: '1',
			standardSpecFlag: '0',
			similarSearchType: '2',
		},
		{
			specCode: '00000230620',
			specCodeDisp: 'C7',
			specName: 'Detailed Shape',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230925',
			specCodeDisp: 'C2',
			specName: 'Mounting Hole Shape',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230591',
			specCodeDisp: 'C1',
			specName: 'Basic Shape',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230656',
			specCodeDisp: 'C3',
			specName: 'Material',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230766',
			specCodeDisp: 'C18',
			specName: 'Surface Treatment',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230574',
			specCodeDisp: 'C10',
			specName: 'Thread Type',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230907',
			specCodeDisp: 'C9',
			specName: 'Tip Shape',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230677',
			specCodeDisp: 'C8',
			specName: 'Additional Shape',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230643',
			specCodeDisp: 'C11',
			specName: 'Sales Unit',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000230653',
			specCodeDisp: 'C14',
			specName: 'Application',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
		{
			specCode: '00000252183',
			specCodeDisp: 'C20',
			specName: 'Screw Type',
			specType: '1',
			standardSpecFlag: '1',
			similarSearchType: '2',
		},
	],
	regulationList: [],
	partNumberList: [
		{
			unfitFlag: '0',
			fixedType: '4',
			innerCode: 'MDM00001313085',
			zinnerCode: '30360780001',
			partNumber: 'BOX-NKJ2-3',
			internalPartNumber: 'BOX-NKJ2-3',
			productCode: 'BOX-NKJ2-3',
			typeCode: 'BOX-NKJ',
			simpleFlag: '1',
			standardUnitPrice: 108.9,
			volumeDiscountFlag: '0',
			minStandardDaysToShip: 2,
			maxStandardDaysToShip: 99,
			rohsFlag: '0',
			piecesPerPackage: 2000,
			discontinuedProductFlag: '0',
			partNumberCautionList: [],
			partNumberNoticeList: [],
			relatedLinkList: [],
			iconTypeList: [],
			cadTypeList: [
				{
					cadType: '1',
					cadTypeDisp: '2D',
				},
				{
					cadType: '2',
					cadTypeDisp: '3D',
				},
			],
			specValueList: [
				{
					specValue: 'nvd00000000000001',
					specValueDisp: '2',
					cadSpecValue: '',
					specCode: '00000230744',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'mig00000001808185',
					specValueDisp: '3',
					specCode: '00000230683',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'nvd00000000000001',
					specValueDisp: '0.4',
					cadSpecValue: '',
					specCode: '00000251676',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'g',
					specValueDisp: 'Pan Head',
					specCode: '00000230620',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'b',
					specValueDisp: 'Cross Recessed',
					specCode: '00000230925',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: '00000230591.a!00001',
					specValueDisp: '[Standard (Round)] Standard (Round)',
					originalSpecValue: 'a',
					originalSpecValueDisp: 'Standard (Round)',
					specCode: '00000230591',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: '00000230656.b!00027',
					specValueDisp: '[Stainless Steel] SUS304 Equivalent',
					originalSpecValue: 'b',
					originalSpecValueDisp: 'Stainless Steel',
					specCode: '00000230656',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Not Provided',
					specCode: '00000230766',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Metric Coarse',
					specCode: '00000230574',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Flat End',
					specCode: '00000230907',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Standard',
					specCode: '00000230677',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'b',
					specValueDisp: 'Box, Pkg.',
					specCode: '00000230643',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Standard',
					specCode: '00000230653',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
				{
					specValue: 'a',
					specValueDisp: 'Full Thread',
					specCode: '00000252183',
					sourceType: '1',
					sourceTypeDisp: 'dataSheet',
				},
			],
			stockItemFlag: '0',
			promptDeliveryFlag: '0',
			specialShipmentFlag: '0',
		},
	],
	groupSpecList: [],
	alterationSpecList: [],
	cadTypeList: [
		{
			cadType: '1',
			cadTypeDisp: '2D',
			hiddenFlag: '0',
			selectedFlag: '0',
		},
		{
			cadType: '2',
			cadTypeDisp: '3D',
			hiddenFlag: '0',
			selectedFlag: '0',
		},
	],
	daysToShipList: [
		{
			daysToShip: 1,
			hiddenFlag: '0',
			selectedFlag: '0',
		},
		{
			daysToShip: 2,
			hiddenFlag: '0',
			selectedFlag: '0',
		},
	],
	stockItem: {
		stockItemFlag: Flag.FALSE,
		selectedFlag: Flag.FALSE,
	},
	currencyCode: 'MYR',
	maxGuideCount: 10,
	guideCount: 5,
	partNumberSpecList: [],
};

//=============================================================================
// Redux Store Mocks
//=============================================================================

type Props = {
	authStoreState: AuthState;
	productDetailsState: ProductDetailState;
};

// NOTE: this mock store is only meant for read-only access
export const MockStore: React.FC<Props> = ({
	authStoreState,
	productDetailsState,
	children,
}) => (
	<Provider
		store={configureStore({
			reducer: {
				auth: createSlice({
					name: 'auth',
					initialState: authStoreState,
					reducers: {},
				}).reducer,
				productDetail: createSlice({
					name: 'pages/productDetail',
					initialState: productDetailsState,
					reducers: {
						// implement mock reducers as necessary
					},
				}).reducer,
			},
		})}
	>
		{children}
	</Provider>
);

export const defaultAuthStoreStateMock: AuthState = {
	authenticated: true,
	isReady: true,
	userCode: '',
	customerCode: '',
	user: {
		sessionStatus: '',
		permissionList: [],
		cartCount: 0,
		quotationUnfitCount: 0,
		orderUnfitCount: 0,
		unconfirmedMessageCount: 0,
		unreadMessageCount: 0,
		settlementType: SettlementType.CREDIT,
		settlementTypeDisp: '',
		staffList: [],
		campaignApplyFlag: Flag.TRUE,
	},
};

export const defaultProductDetailStateMock: ProductDetailState = {
	seriesResponse: seriesResponseMock,
	templateType: TemplateType.COMPLEX,
	partNumberResponse: null,
	currentPartNumberResponse: partNumberResponseMock,
	priceCache: {},
};

export const queryParamsMock: QueryParams = {
	Tab: '',
	HissuCode: '',
	CategorySpec: '',
	PNSearch: '',
};
