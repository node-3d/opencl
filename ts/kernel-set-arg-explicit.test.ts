import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let isD3DDevice = false;

before(() => {
	const setup = cl.quickStart();
	({ context } = setup);
	isD3DDevice = U.isD3DDevice(setup);
});

describe('Kernel - setKernelArg explicit', () => {
	it('accepts a memobject as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const mem = cl.createBuffer(context, 0, 8, null);

			assert.equal(cl.setKernelArg(k, 0, 'float*', mem), cl.SUCCESS);

			cl.releaseMemObject(mem);
			cl.releaseKernel(k);
		});
	});

	it('fails when passed a scalar type as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(
				() => cl.setKernelArg(k, 0, 'float*', 5),
				new Error('Argument 3 must be of type `Object`'),
			);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a vector type as first argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(
				() => cl.setKernelArg(k, 0, 'float*', [5, 10, 15]),
				new Error('Argument 3 must be a CL Wrapper.'),
			);

			cl.releaseKernel(k);
		});
	});

	it('accepts an integer as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.ok(cl.setKernelArg(k, 2, 'uint', 5) === cl.SUCCESS);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a char as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, 'char', 'a'), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a vector as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			assert.throws(() => cl.setKernelArg(k, 2, 'int', [5, 10, 15]), cl.INVALID_ARG_VALUE);

			cl.releaseKernel(k);
		});
	});

	it('fails when passed a memobject as third argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const mem = cl.createBuffer(context, 0, 8, null);

			assert.throws(() => cl.setKernelArg(k, 2, 'int', mem), cl.INVALID_ARG_VALUE);

			cl.releaseMemObject(mem);
			cl.releaseKernel(k);
		});
	});

	it('fails to pass an extra argument', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');

			if (isD3DDevice) {
				assert.strictEqual(cl.setKernelArg(k, 3, 'int', 5), cl.SUCCESS);
			} else {
				assert.throws(() => cl.setKernelArg(k, 3, 'int', 5), cl.INVALID_ARG_INDEX);
			}

			cl.releaseKernel(k);
		});
	});
});
