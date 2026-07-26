import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;

before(() => {
	({ context } = cl.quickStart());
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
