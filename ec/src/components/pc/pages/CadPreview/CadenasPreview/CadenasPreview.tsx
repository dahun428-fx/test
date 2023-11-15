import React, { useCallback, useRef, useState } from 'react';
import { CadenasLoader } from './CadenasLoader';
import styles from './CadenasPreview.module.scss';
import { CadPreviewError } from '@/components/pc/pages/CadPreview/CadPreviewError';
import { ErrorType } from '@/components/pc/pages/CadPreview/CadPreviewError/types';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { CadenasParameters } from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { isSucceeded } from '@/utils/domain/cad/cadenas';
import { get } from '@/utils/get';
import { post } from '@/utils/post';
import { url } from '@/utils/url';

const resolveIFrameName = 'cadenas-resolve-iframe';
const previewIFrameName = 'cadenas-preview-iframe';
const targetMessageEventOrigin =
	'https://misumi-configurator.partcommunity.com';

export type Props = {
	params: CadenasParameters;
	partNumber: string;
};

/**
 * CADENAS preview
 */
export const CadenasPreview: React.VFC<Props> = ({ params, partNumber }) => {
	const [loadingResolve, , endLoadingResolve] = useBoolState(true);
	const [loadingPreview, startToLoadingPreview, endLoadingPreview] =
		useBoolState(false);
	const [loaded, setLoaded] = useState(false);
	const [errorState, setErrorState] = useState<ErrorType | null>(null);
	const resolveRef = useRef<HTMLIFrameElement>(null);

	const handleMessage = useCallback(
		(event: MessageEvent<unknown>) => {
			if (
				typeof event === 'undefined' ||
				event.origin !== targetMessageEventOrigin
			) {
				return;
			}

			if (typeof event.data !== 'string') {
				endLoadingPreview();
				setErrorState('unavailable-part-number-error');
				return;
			}

			let data;
			try {
				data = JSON.parse(event.data);
			} catch {
				endLoadingPreview();
				setErrorState('unavailable-part-number-error');
				return;
			}

			if (typeof data.reason !== 'string') {
				endLoadingPreview();
				setErrorState('unavailable-part-number-error');
				return;
			}

			let succeeded = false;
			switch (data.reason) {
				case 'previewLoading':
					return;
				case 'previewLoaded':
					succeeded = true;
					break;
				case 'previewFailed':
				default:
					break;
			}

			// 実質 deps のない useCallback だから出来る指定です。迂闊に真似しないでください。
			// This is only possible with useCallback, which has no deps.
			// Please do not try to imitate it.
			// (endLoadingPreview is never changed)
			window.removeEventListener('message', handleMessage);

			endLoadingPreview();
			if (succeeded) {
				setLoaded(true);
				// TODO: NEW_FE-2553 show CAD download button (like onLoad props)
				// onLoad();
				return;
			} else {
				setErrorState('unavailable-part-number-error');
				return;
			}
		},
		[endLoadingPreview]
	);

	const moveToPreview = useCallback(
		(mident: string) => {
			startToLoadingPreview();

			post({
				url: url.cadenas(params).preview(),
				query: {
					language: params.language,
					firm: params.firm,
					part: mident ? mident : params.part ? params.part : '',
					viewerOptions: params.viewerOptions,
				},
				target: previewIFrameName,
			});

			window.addEventListener('message', handleMessage);
		},
		[handleMessage, params, startToLoadingPreview]
	);

	const handleLoadResolve = useCallback(() => {
		try {
			const iframeWindow = resolveRef.current?.contentWindow;
			if (iframeWindow) {
				const path = iframeWindow.location.pathname;
				if (path?.includes(url.cadenasCallbackPath)) {
					const query = new URLSearchParams(iframeWindow.location.search);
					const mident = query.get('mident');
					endLoadingResolve();
					if (mident && isSucceeded(query)) {
						moveToPreview(mident);
					} else {
						setErrorState('unavailable-part-number-error');
					}
				}
			}
		} catch {
			// noop
			// - Error example:
			//   Uncaught DOMException: Blocked a frame with origin "https://xxx" from accessing a cross-origin frame.
		}
	}, [endLoadingResolve, moveToPreview]);

	useOnMounted(() => {
		if (resolveRef.current) {
			const iframeWindow = resolveRef.current.contentWindow;
			if (iframeWindow) {
				get({
					url: url.cadenas(params).resolve(),
					query: {
						pn: partNumber,
						ec_loc: params.ec_loc,
						gc_wos: params.gc_wos,
						ge_sdm: params.ge_sdm,
						language: params.language,
						location: params.location,
						ge_location: params.ge_location,
						prj: params.prj,
						url: url.cadenasCallback,
					},
					target: resolveIFrameName,
				});
			}
		}
	});

	return (
		<div className={styles.container}>
			{errorState ? (
				<CadPreviewError errorType={errorState} />
			) : loadingResolve ? (
				<div className={styles.loader}>
					<BlockLoader />
				</div>
			) : (
				loadingPreview && (
					<CadenasLoader cadGenerationTime={params.cadGenerationTime} />
				)
			)}
			<iframe
				name={previewIFrameName}
				className={styles.preview}
				style={{
					// DO NOT use "display: none" / "display: block" to display control in others.
					// This is for CADENAS only.
					display: loaded ? 'block' : undefined,
				}}
				allowFullScreen
			/>
			<iframe
				ref={resolveRef}
				name={resolveIFrameName}
				className={styles.resolve}
				onLoad={handleLoadResolve}
				allowFullScreen
			/>
		</div>
	);
};
CadenasPreview.displayName = 'CadenasPreview';
