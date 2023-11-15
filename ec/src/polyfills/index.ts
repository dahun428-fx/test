// Next.js で「.browserslistrc に基づいて必要な polyfill を追加する」機構が正しく働かないため、
// 主に IE11 のために手で polyfill を追加するためのファイルです。
import 'core-js/stable/string/replace-all';
import 'core-js/stable/url';
import 'core-js/stable/url-search-params';
// NOTE: IE 11 doesn't support NoteList.forEach -> need polyfill
import 'core-js/stable/dom-collections/for-each';
// for fetch-jsonp
import es6Promise from 'es6-promise';
import smoothScroll from 'smoothscroll-polyfill';

import 'intersection-observer';

// Usable window or element scroll
// http://iamdustan.com/smoothscroll/
if (typeof window !== 'undefined') {
	smoothScroll.polyfill();
	es6Promise.polyfill();
}
