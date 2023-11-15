import { datadogRum } from '@datadog/browser-rum';
import Head from 'next/head';
import React, { ErrorInfo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RootErrorBoundary.module.scss';
import { ApplicationErrorContents } from '@/components/mobile/error/ApplicationErrorContents';
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

// Header
const ErrorPageHeader: React.FC = () => {
	return (
		<header className={styles.headerBox}>
			<a href={pagesPath.$url().pathname} className={styles.logo}>
				MiSUMi Malaysia
			</a>
		</header>
	);
};

ErrorPageHeader.displayName = 'ErrorPageHeader';

// Footer
const ErrorPageFooter: React.FC = () => {
	const [t] = useTranslation();
	return (
		<footer className={styles.footer}>
			<div className={styles.copyright}>
				{t('mobile.components.layouts.footers.footer.copyright')}
			</div>
		</footer>
	);
};

ErrorPageFooter.displayName = 'ErrorPageFooter';

/**
 * RootErrorBoundary
 * Display a fallback UI when uncaught JS error happened in the app
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
	 * Update state to show fallback UI in the next render
	 *
	 * componentDidCatch can also do the job but it's officially recommended to use this instead
	 */
	static getDerivedStateFromError(): ErrorState {
		return { hasError: true };
	}

	/**
	 * Send error to DatadogRUM within rendering by React
	 * When send error manually to Datadog, datadog can use it for ErrorTracking function.
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
	 * Render
	 *
	 * If there is a JS error which has been caught, render fallback UI
	 * If there are no JS errors, ErrorBoundary does nothing
	 */
	render(): React.ReactNode {
		if (this.state.hasError) {
			// Render fallback UI
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
		// When no caught errors, ErrorBoundary does nothing, just return as is
		return this.props.children;
	}
}

RootErrorBoundary.displayName = 'RootErrorBoundary';

export default RootErrorBoundary;
