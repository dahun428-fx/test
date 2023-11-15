import { Router } from 'next/router';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
// ========================================================= Experimental
// WARN: Experimental. This has not been adequately discussed.
//       If you wish to imitate it, please consult an expert.
let alreadySentOnSamePage = false;
Router.events.on('routeChangeStart', () => (alreadySentOnSamePage = false));

// ========================================================= Experimental

type SpecSearchTimesEvent = {
	event: 'gaSpecCount';
	cd_088: '[spec_search]Spec Search';
	cm_183: '1';
};

export function specSearchTimes() {
	if (!alreadySentOnSamePage) {
		sendEvent<SpecSearchTimesEvent>({
			event: 'gaSpecCount',
			cd_088: '[spec_search]Spec Search',
			cm_183: '1',
		});
	}
	alreadySentOnSamePage = true;
}
