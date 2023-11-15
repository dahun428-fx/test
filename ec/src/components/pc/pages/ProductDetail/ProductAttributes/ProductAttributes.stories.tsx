import { ComponentStoryObj, Meta } from '@storybook/react';
import { useRef } from 'react';
import { ProductAttributes } from './ProductAttributes';
import {
	defaultAuthStoreStateMock,
	defaultProductDetailStateMock,
	seriesResponseMock,
	MockStore,
	queryParamsMock,
	partNumberResponseMock,
} from './ProductAttributes.mocks';
import { Flag } from '@/models/api/Flag';
import { assertNotNull } from '@/utils/assertions';

type Story = ComponentStoryObj<typeof ProductAttributes>;

const ProductAttributesComponent = ({}) => {
	const refFaq = useRef<HTMLDivElement>(null);
	return <ProductAttributes faqRef={refFaq} />;
};

export default {
	component: ProductAttributesComponent,
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={defaultProductDetailStateMock}
			>
				{story()}
			</MockStore>
		),
	],
} as Meta<typeof ProductAttributesComponent>;

const [series] = seriesResponseMock.seriesList;
const [partNumber] = partNumberResponseMock.partNumberList;
assertNotNull(series);
assertNotNull(partNumber);

export const DefaultAll: Story = {
	parameters: {
		nextRouter: {
			query: { ...queryParamsMock, HissuCode: 'BOX-NKJ2-3' },
		},
	},
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					seriesResponse: {
						...seriesResponseMock,
						seriesList: [
							{
								...series,
								minPiecesPerPackage: 300,
								maxPiecesPerPackage: 2000,
								cValueFlag: Flag.TRUE,
								catchCopy:
									'<b>The Misumi original</b> fine intermediate flute length is available at a reasonable price,<i>The Misumi original</i> fine intermediate flute length is available at a reasonable price. The Misumi original fine intermediate flute length is available at a reasonable price,The Misumi original fine intermediate flute length is available at a reasonable price',
								seriesInfoText: [
									'<b>seriesInfo Text1</b>',
									'<i>seriesInfo Text2</i>',
									'seriesInfo Text3 <a href="https://google.com">Link</a>',
								],
							},
						],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};

export const ProductNameWithPiecesPerPackage: Story = {
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					seriesResponse: {
						...seriesResponseMock,
						seriesList: [
							{
								...series,
								minPiecesPerPackage: 300,
								maxPiecesPerPackage: 2000,
							},
						],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};

export const ProductNameWithPartNumber: Story = {
	parameters: {
		nextRouter: {
			query: { ...queryParamsMock, HissuCode: 'BOX-NKJ2-3' },
		},
	},
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={defaultProductDetailStateMock}
			>
				{story()}
			</MockStore>
		),
	],
};

export const ProductNameWithPartNumberWhenPartNumberListMoreThanOne: Story = {
	parameters: {
		nextRouter: {
			query: { ...queryParamsMock, HissuCode: 'BOX-NKJ2-3', wl: 1 },
		},
	},
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					currentPartNumberResponse: {
						...partNumberResponseMock,
						totalCount: 2,
						partNumberList: [
							partNumber,
							{
								...partNumber,
								partNumber: 'BOX-NKJ2-9',
							},
						],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};

export const DisplayCValueIcon: Story = {
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					seriesResponse: {
						...seriesResponseMock,
						seriesList: [{ ...series, cValueFlag: Flag.TRUE }],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};

export const DisplayCatchCopy: Story = {
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					seriesResponse: {
						...seriesResponseMock,
						seriesList: [
							{
								...series,
								catchCopy:
									'<b>The Misumi original</b> fine intermediate flute length is available at a reasonable price,<i>The Misumi original</i> fine intermediate flute length is available at a reasonable price. The Misumi original fine intermediate flute length is available at a reasonable price,The Misumi original fine intermediate flute length is available at a reasonable price',
							},
						],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};

export const DisplaySeriesInfoText: Story = {
	decorators: [
		story => (
			<MockStore
				authStoreState={defaultAuthStoreStateMock}
				productDetailsState={{
					...defaultProductDetailStateMock,
					seriesResponse: {
						...seriesResponseMock,
						seriesList: [
							{
								...series,
								seriesInfoText: [
									'<b>seriesInfo Text1</b>',
									'<i>seriesInfo Text2</i>',
									'seriesInfo Text3 <a href="https://google.com">Link</a>',
								],
							},
						],
					},
				}}
			>
				{story()}
			</MockStore>
		),
	],
};
