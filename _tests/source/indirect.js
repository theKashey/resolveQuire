import proxyquire from 'proxyquire';
import Proxyquire from 'proxyquire/lib/proxyquire';

import { withIndirectUsage, overrideEntryPoint } from '../../src/index';

overrideEntryPoint();
const withIndirect = withIndirectUsage(Proxyquire);

export {
  proxyquire,
  withIndirect
}