/* tslint:disable:no-import-side-effect */
import * as process from 'process';
process.env.NODE_ENV = 'test';

import 'jest-preset-angular';
import 'src/web/rx';
import 'src/test-lib/mocks/storage.mock';
import 'src/test-lib/mocks/getComputedStyles.mock';
