import assert from 'node:assert/strict';
import test from 'node:test';
import { getPlatformIDs, getPlatformInfo } from '@node-3d/opencl';

test('loads the packed OpenCL addon', () => {
	assert.equal(typeof getPlatformIDs, 'function');
	assert.equal(typeof getPlatformInfo, 'function');
});
