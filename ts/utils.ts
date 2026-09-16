import { strict as assert } from 'node:assert';
import * as cl from './index.ts';

export const newQueue = (context: cl.TClContext, device: cl.TClDevice): cl.TClQueue =>
	cl.createCommandQueue(context, device, null);

export const isD3DDevice = ({
	name,
	version,
}: Pick<cl.TQuickStartResult, 'name' | 'version'>): boolean =>
	version.includes('D3D') || name.includes('D3D') || name.includes('D3D12');

export const withProgram = (
	context: cl.TClContext,
	source: string,
	cb: (p: cl.TClProgram) => void,
): void => {
	const prg = cl.createProgramWithSource(context, source);
	cl.buildProgram(prg, null, '-cl-kernel-arg-info');
	try {
		return cb(prg);
	} finally {
		cl.releaseProgram(prg);
	}
};

export const assertType = (v: unknown, name: string): void => {
	if (name === 'object') {
		assert.ok(v);
	}

	if (name === 'array') {
		assert.ok(v);
		assert.strictEqual(typeof v, 'object', 'assertType(v, \'array\'): "v" must be an object');
		assert.strictEqual(
			typeof (v as unknown[]).length,
			'number',
			'assertType(v, \'array\'): "v.length" must be a number',
		);
		return;
	}

	assert.strictEqual(typeof v, name, `assertType(v, '${name}'): the type is "${typeof v}"`);
};
