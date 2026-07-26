import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';
import * as U from './utils.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Kernel - getKernelInfo', () => {
	const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
		it(`returns the good type for ${key}`, () => {
			U.withProgram(context, squareKern, (prg) => {
				const k = cl.createKernel(prg, 'square');
				const val = cl.getKernelInfo(k, cl[key] as number);
				cl.releaseKernel(k);
				_assert(val);
			});
		});
	};
	if (cl.VERSION_1_2) {
		testForType('KERNEL_ATTRIBUTES', (v) => U.assertType(v, 'string'));
	}

	testForType('KERNEL_FUNCTION_NAME', (v) => U.assertType(v, 'string'));
	testForType('KERNEL_REFERENCE_COUNT', (v) => U.assertType(v, 'number'));
	testForType('KERNEL_NUM_ARGS', (v) => U.assertType(v, 'number'));
	testForType('KERNEL_CONTEXT', (v) => U.assertType(v, 'object'));
	testForType('KERNEL_PROGRAM', (v) => U.assertType(v, 'object'));

	it('returns the corresponding number of arguments', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const nbArgs = cl.getKernelInfo(k, cl.KERNEL_NUM_ARGS);
			cl.releaseKernel(k);
			if (nbArgs !== 3) {
				assert.fail(nbArgs, 3);
			}
		});
	});

	it('returns the corresponding kernel name', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const name = cl.getKernelInfo(k, cl.KERNEL_FUNCTION_NAME);
			cl.releaseKernel(k);
			if (name !== 'square') {
				assert.fail(name, 'square');
			}
		});
	});

	it('returns the corresponding context', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const c = cl.getKernelInfo(k, cl.KERNEL_CONTEXT);
			cl.releaseKernel(k);
			assert.ok(c);
		});
	});

	it('returns the corresponding program', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const p = cl.getKernelInfo(k, cl.KERNEL_PROGRAM);
			cl.releaseKernel(k);
			assert.ok(p);
		});
	});
});

describe('Kernel - getKernelArgInfo', () => {
	it('returns the corresponding names', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_NAME);
			const n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_NAME);
			const n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_NAME);
			cl.releaseKernel(k);
			assert.equal(n1, 'input');
			assert.equal(n2, 'output');
			assert.equal(n3, 'count');
		});
	});

	it('returns the corresponding types', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			const n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_TYPE_NAME);
			const n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_TYPE_NAME);
			const n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_TYPE_NAME);
			cl.releaseKernel(k);
			assert.equal(n1, 'float*');
			assert.equal(n2, 'float*');
			assert.equal(n3, 'uint');
		});
	});
});

describe('Kernel - getKernelWorkGroupInfo', () => {
	const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
		it(`returns the good type for ${key}`, () => {
			U.withProgram(context, squareKern, (prg) => {
				const k = cl.createKernel(prg, 'square');
				const val = cl.getKernelWorkGroupInfo(k, device, cl[key] as number);
				cl.releaseKernel(k);
				_assert(val);
			});
		});
	};

	testForType('KERNEL_COMPILE_WORK_GROUP_SIZE', (v) => U.assertType(v, 'array'));
	testForType('KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE', (v) => U.assertType(v, 'number'));
	testForType('KERNEL_WORK_GROUP_SIZE', (v) => U.assertType(v, 'number'));
	testForType('KERNEL_LOCAL_MEM_SIZE', (v) => U.assertType(v, 'number'));
	testForType('KERNEL_PRIVATE_MEM_SIZE', (v) => U.assertType(v, 'number'));

	it('throws INVALID_VALUE when looking for KERNEL_GLOBAL_WORK_SIZE', () => {
		U.withProgram(context, squareKern, (prg) => {
			const k = cl.createKernel(prg, 'square');
			assert.throws(
				() => cl.getKernelWorkGroupInfo(k, device, cl.KERNEL_GLOBAL_WORK_SIZE),
				cl.INVALID_VALUE,
			);
			cl.releaseKernel(k);
		});
	});
});
