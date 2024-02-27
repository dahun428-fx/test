import React, { FC, useCallback, useLayoutEffect, useRef } from 'react';
import { CatalogDownload as Presenter } from './CatalogDownload';
import { downloadCad } from '@/api/services/downloadCad';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { CadSiteType } from '@/models/domain/cad';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import { selectAuthenticated } from '@/store/modules/auth';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { downloadCadLink } from '@/utils/cad';
import { first } from '@/utils/collection';
import { isSucceeded } from '@/utils/domain/cad/cadenas';
import { useGetCadenasFileUrl } from '@/utils/domain/cad/cadenas.hooks';
import { getMisumiOrVona } from '@/utils/domain/log';
import { get } from '@/utils/get';
import { url } from '@/utils/url';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';

type Props = {
	partNumber: string;
	seriesCode: string;
	innerCode?: string;
	cadId?: string;
};

const resolveIFrameName = 'catalog-resolve-iframe';
const generateIFrameName = 'catalog-generate-iframe';

/** Catalog download container */
export const CatalogDownload: FC<Props> = ({
	partNumber,
	seriesCode,
	innerCode,
	cadId,
}) => {
	const series = useSelector(selectSeries);

	const showLoginModal = useLoginModal();
	const { getCadenasFileUrl } = useGetCadenasFileUrl();

	const cadInfo = useRef<DownloadCadResponse>();
	const resolveRef = useRef<HTMLIFrameElement>(null);
	const generateRef = useRef<HTMLIFrameElement>(null);

	const [isGenerating, startGenerate, endGenerate] = useBoolState(false);

	const download = useCallback(
		(cadUrl?: string) => {
			endGenerate();
			downloadCadLink(
				url.catalogDownload(seriesCode, partNumber, innerCode, cadUrl)
			);
		},
		[endGenerate, innerCode, partNumber, seriesCode]
	);

	const loadCadInfo = useCallback(async () => {
		try {
			const response = await downloadCad({
				seriesCode,
				partNumber,
				cadId,
			});
			cadInfo.current = response;
		} catch (error) {
			download();
		}
	}, [cadId, download, partNumber, seriesCode]);

	const handleGenerate = useCallback(async () => {
		try {
			const iframeWindow = generateRef.current?.contentWindow;

			if (!iframeWindow) {
				return;
			}

			const path = iframeWindow.location.pathname;

			if (!path?.includes(url.cadenasDownloadCallbackPath)) {
				return;
			}

			const query = new URLSearchParams(iframeWindow.location.search);
			const xmlFile = query.get('xmlfile');

			if (!xmlFile) {
				return;
			}

			const data = await getCadenasFileUrl(`${xmlFile}?_=${Date.now()}`);
			download(data?.url);
		} catch {
			// noop
		}
	}, [download, getCadenasFileUrl]);

	const handleLoadResolve = useCallback(() => {
		try {
			const iframeWindow = resolveRef.current?.contentWindow;
			const parameterMap = first(
				cadInfo.current?.dynamic3DCadList
			)?.parameterMap;

			if (!iframeWindow) {
				return;
			}

			const path = iframeWindow?.location?.pathname;

			if (!path?.includes(url.cadenasDownloadCallbackPath)) {
				return;
			}

			const query = new URLSearchParams(iframeWindow.location.search);
			const mident = query.get('mident');

			if (!mident || !isSucceeded(query) || !parameterMap) {
				return;
			}

			get({
				url: parameterMap.cadenasCgi2PviewUrl,
				query: {
					cgiaction: parameterMap.cgiaction,
					downloadflags: parameterMap.downloadflags,
					firm: 'misumi',
					language: parameterMap.language,
					format: 'JPEGFILE',
					part: mident,
					ok_url: `${url.cadenasDownloadCallback}?xmlfile=<%download_xml%>`,
					dxfsettings: parameterMap.dxfsettings,
					CombinationView: parameterMap.CombinationView,
				},
				target: generateIFrameName,
			});
		} catch (error) {
			// noop
		}
	}, []);

	const getResolveIFrame = useCallback(() => {
		const parameterMap = first(cadInfo.current?.dynamic3DCadList)?.parameterMap;

		if (!parameterMap) {
			return;
		}

		if (
			cadInfo.current?.cadSiteType === CadSiteType.SINUS ||
			!parameterMap.cadenasResolveUrl
		) {
			download();
			return;
		}

		get({
			url: url
				.cadenas({
					cadenasResolveUrl: parameterMap.cadenasResolveUrl,
					cadenasPloggerUrl: parameterMap.cadenasPloggerUrl ?? '',
				})
				.resolve(),
			query: {
				prj: parameterMap.prj,
				ec_loc: parameterMap.ec_loc,
				gc_wos: parameterMap.gc_wos,
				ge_sdm: parameterMap.ge_sdm,
				location: parameterMap.location,
				language: parameterMap.language,
				ge_location: parameterMap.ge_location,
				pn: partNumber,
				url: url.cadenasDownloadCallback,
			},
			target: resolveIFrameName,
		});
	}, [download, partNumber]);

	const onCatalogDownload = useCallback(async () => {
		const authenticated = selectAuthenticated(store.getState());

		if (!authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		startGenerate();

		await loadCadInfo();
		getResolveIFrame();

		ga.events.productsPUCatalogDL({
			seriesCode,
			partNumber,
			innerCode,
			misumiOrVona: getMisumiOrVona(series.misumiFlag),
		});
		aa.events.detailPUCatalogDL(seriesCode, series.seriesName, partNumber);
	}, [
		startGenerate,
		loadCadInfo,
		getResolveIFrame,
		seriesCode,
		partNumber,
		innerCode,
		series.misumiFlag,
		series.seriesName,
		showLoginModal,
	]);

	useLayoutEffect(() => {
		document.body.style.cursor = isGenerating ? 'progress' : '';
	}, [isGenerating]);

	return (
		<Presenter
			isGenerating={isGenerating}
			resolveRef={resolveRef}
			generateRef={generateRef}
			resolveIFrameName={resolveIFrameName}
			generateIFrameName={generateIFrameName}
			onLoadResolve={handleLoadResolve}
			onGenerate={handleGenerate}
			onCatalogDownload={onCatalogDownload}
		/>
	);
};
CatalogDownload.displayName = 'CatalogDownload';
