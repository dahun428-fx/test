import { ecommerce } from './ecommerce';
import { events } from './events';
import { pageView } from './pageView';
import { settings } from './settings';

export const ga = { events, settings, ecommerce, pageView } as const;
