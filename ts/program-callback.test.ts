import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import type { TestContext } from 'node:test';
import * as cl from './index.ts';

const squareKern = fs
	.readFileSync(new URL('../examples/assets/kernels/square.cl', import.meta.url))
	.toString();

let context = null as unknown as cl.TClContext;
let device = null as unknown as cl.TClDevice;

before(() => {
	({ context, device } = cl.quickStart());
});

describe('Program - buildProgram callback', () => {
	it('builds and calls the callback using a valid program', (_t, done) => {
		const cb: cl.TBuildProgramCb = (prg, userData) => {
			assert.ok(prg);
			cl.releaseProgram(prg);
			assert.strictEqual((userData as { done: () => void }).done, done);
			done();
		};
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.buildProgram(prg, [device], undefined, cb, { done });
		assert.strictEqual(ret, undefined);
	});
});

describe('Program - compileProgram callback', () => {
	it('compiles a program and calls the callback', (_t, done) => {
		const cb: cl.TBuildProgramCb = (prg, userData) => {
			assert.ok(prg);
			cl.releaseProgram(prg);
			assert.strictEqual((userData as { done: () => void }).done, done);
			done();
		};
		const prg = cl.createProgramWithSource(context, squareKern);
		const ret = cl.compileProgram(prg, [device], null, null, null, cb, { done });
		assert.strictEqual(ret, undefined);
	});
});

describe('Program - linkProgram callback', () => {
	it('links one program and calls the callback', (t: TestContext, done: () => void) => {
		t.plan(2);

		const prg = cl.createProgramWithSource(context, squareKern);
		cl.compileProgram(prg);

		cl.linkProgram(
			context,
			null,
			null,
			[prg],
			(linked, userData) => {
				t.assert.ok(linked);
				t.assert.strictEqual(userData, 'hello');

				cl.releaseProgram(linked);
				done();
			},
			'hello',
		);

		cl.releaseProgram(prg);
	});
});
