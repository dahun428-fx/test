import getConfig from 'next/config';
import { Config } from './types';

// as は使用禁止です。ここでは特別に許可されていますが真似しないでください。
// ここでは config の型が別の仕組みで担保されているため、as の使用が許可されています。
export const config = getConfig().publicRuntimeConfig.config as Config;
