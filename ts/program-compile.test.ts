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

describe('Program - compileProgram', () => {
	it('compiles a program', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.compileProgram(prg);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('compiles a program with header', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const prg2 = cl.createProgramWithSource(context, squareKern);

		const ret = cl.compileProgram(prg, null, null, [prg2], ['prg2.h']);
		assert.strictEqual(ret, undefined);
		cl.releaseProgram(prg);
	});

	it('fails with unnamed header', () => {
		const prg = cl.createProgramWithSource(context, squareKern);
		const prg2 = cl.createProgramWithSource(context, squareKern);

		assert.throws(() => cl.compileProgram(prg, null, null, [prg2], []));

		cl.releaseProgram(prg);
		cl.releaseProgram(prg2);
	});
});
