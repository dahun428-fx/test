import { Router } from 'next/router';

// ========================================================= Experimental
// WARN: Experimental. This has not been adequately discussed.
//       If you wish to imitate it, please consult an expert.
let alreadySentOnSamePage = false;
let registered = false;
if (!registered) {
	Router.events.on('routeChangeStart', () => {
		alreadySentOnSamePage = false;
	});
	registered = true;
}
// ========================================================= Experimental

function sendPartNumberGenerated() {
	try {
		window.sc_f_products_pn_gen?.();
	} catch {
		// Do nothing
	}
}

export function sendPartNumberGeneratedOnce() {
	if (!alreadySentOnSamePage) {
		sendPartNumberGenerated();
		alreadySentOnSamePage = true;
	}
}
