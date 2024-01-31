import Head from 'next/head';
import { VFC } from 'react';

export const Meta: VFC = () => {
	const focusMessage = '';
	const title = '비교결과 | MISUMI한국미스미';
	const description =
		'미스미 제품 외 2천개 브랜드 취급, FA, 금형 부품, 공구, 소모품, 메카니컬 설계 CAD 데이터 무료 다운로드, 도면가공품 제작서비스, 설계지원툴 무료지원, 정확하고 빠른 납기, 무료배송 온라인 판매 사이트.';
	const keywords = `한국미스미, 미스미 ,기계부품, FA, 메카니컬, 일렉트로닉스, 금형, 프레스, 몰드, 공구, 소모품, ${focusMessage}`;
	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="format-detection" content="telephone=no" />
		</Head>
	);
};
Meta.displayName = 'Meta';
