import { datadogRum } from '@datadog/browser-rum';
import Head from 'next/head';
import React, { ErrorInfo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RootErrorBoundary.module.scss';
import { ApplicationErrorContents } from '@/components/pc/error/ApplicationErrorContents';
import { Link } from '@/components/pc/ui/links';
import { pagesPath } from '@/utils/$path';
import { shouldSendRum } from '@/utils/datadogRUM/rum';
import { DatadogErrorContext } from '@/utils/datadogRUM/type';

/**
 * error boundary props
 */
interface ErrorProps {}

/**
 * error boundary state
 */
interface ErrorState {
	hasError: boolean;
}

/**
 * RootErrorBoundary
 *
 * アプリ全体で発生する JS エラーを拾う
 * フォールバック UI の範囲が画面全体になるので、
 * フォールバック専用のフッター、ヘッターを用意してレンダリングさせる
 */
class RootErrorBoundary extends React.Component<ErrorProps, ErrorState> {
	/**
	 * constructor
	 */
	constructor(props: ErrorProps) {
		super(props);
		this.state = {
			hasError: false,
		};
	}

	/**
	 * displayName
	 */
	static displayName = 'RootErrorBoundary';

	/**
	 * 次のレンダーでフォールバック UI が表示されるように state を更新する
	 *
	 * componentDidCatch でもいけるが、公式ではこちらを推奨しているため
	 * フォールバックの描画を扱う場合はこちらを利用する
	 */
	static getDerivedStateFromError(): ErrorState {
		return { hasError: true };
	}

	/**
	 * React レンダー中に発生したエラーをdatadogに送信する。
	 * 明示的に送信しなくてもdatadogにエラーは通知されるが、ErrorTrackingにて既知のエラーかどうかを管理したいため、ここで送信する。
	 * @param error
	 * @param errorInfo
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (shouldSendRum(error)) {
			datadogRum.addError(error, {
				errorPart: 'rendering on browser',
				reactErrorInfo: errorInfo,
			} as DatadogErrorContext);
		}
	}

	/**
	 * レンダリング
	 *
	 * JS エラーあり、かつキャッチできた場合はフォールバック UI をレンダリングする
	 * JS エラーなしの場合は ErrorBoundary で何もしない
	 */
	render(): React.ReactNode {
		// Header
		const ErrorPageHeader: React.FC = () => {
			const [t] = useTranslation();
			return (
				<header className={styles.headerBox}>
					<div className={styles.header}>
						<Link className={styles.logo} href={pagesPath.$url()}>
							{t('components.ui.layouts.headers.header.logo.heading')}
						</Link>
					</div>
				</header>
			);
		};

		// Footer
		const ErrorPageFooter: React.FC = () => {
			const [t] = useTranslation();
			return (
				<footer className={styles.footer}>
					<div className={styles.copyright}>
						{t('components.ui.layouts.footers.footer.copyright')}
					</div>
				</footer>
			);
		};

		if (this.state.hasError) {
			// フォールバック UI をレンダリング
			return (
				<>
					<Head>
						<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
						<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
						<title>INTERNAL SERVER ERROR | MISUMI Malaysia</title>
						<meta name="robots" content="noindex,nofollow" />
						<meta httpEquiv="content-style-type" content="text/css" />
						<meta httpEquiv="content-script-type" content="text/javascript" />
						<link rel="icon" href="/favicon.ico" type="image/x-icon" />
						<link rel="Shortcut Icon" type="img/x-icon" href="/favicon.ico" />
						{/* viewport meta tags は _document.tsx に定義すると警告が出るため _app.tsx に定義しています */}
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1"
						/>
					</Head>
					<ErrorPageHeader />
					<ApplicationErrorContents />
					<ErrorPageFooter />
				</>
			);
		}
		// キャッチできるエラーがない、ErrorBoundary からは何もしなくてそのまま返す
		return this.props.children;
	}
}

export default RootErrorBoundary;
