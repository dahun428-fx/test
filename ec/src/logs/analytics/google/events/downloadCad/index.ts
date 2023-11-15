import { cadenas } from './cadenas';
import { fixedCad } from './fixedCad';
import { sinus } from './sinus';
import { web2Cad } from './web2Cad';

export const downloadCad = {
	cadenas,
	sinus,
	web2Cad,
	fixedCad,
} as const;
