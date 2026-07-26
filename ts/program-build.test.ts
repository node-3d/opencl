import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - buildProgram', () => {
	it('builds using a valid program and a given device', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg, [device]);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('builds using a valid program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('builds using a valid program and options', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg, null, '-D NOCL_TEST=5');
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('throws if program is nullptr', () => {
		assert.throws(
			() => cl.buildProgram(null as unknown as cl.TClProgram),
			new Error('Argument 0 must be of type `Object`'),
		);
	});

	it('throws if program is INVALID', () => {
		const prg = cl.createProgramWithSource(context, `${squareKern}????`);
		assert.throws(() => cl.buildProgram(prg, [device]), cl.BUILD_PROGRAM_FAILURE);
	});
});

describe('Program - retainProgram', () => {
	it('increments the reference count', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		cl.retainProgram(prg);
		const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
		assert.strictEqual(after, 2);
		cl.releaseProgram(prg);
	});
});

describe('Program - releaseProgram', () => {
	it('decrements the reference count', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		cl.retainProgram(prg);
		cl.releaseProgram(prg);
		const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
		assert.strictEqual(after, 1);
		cl.releaseProgram(prg);
	});
});
