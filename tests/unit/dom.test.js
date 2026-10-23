import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createH } from '../../src/dom.js';

class El {
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.dataset = {};
  }
  append(...nodes) {
    this.children.push(...nodes);
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  }
}
const doc = {
  createElement: (tag) => new El(tag),
  createTextNode: (text) => ({ nodeType: 3, text }),
};
const h = createH(doc);

test('string children become text nodes, never markup', () => {
  const el = h('p', null, '<b>x</b>');
  assert.deepEqual(el.children, [{ nodeType: 3, text: '<b>x</b>' }]);
});

test('numbers become text and null/false children are skipped', () => {
  const el = h('p', null, 3, null, false, 'a');
  assert.deepEqual(el.children.map((c) => c.text), ['3', 'a']);
});

test('element children are appended as nodes', () => {
  const child = h('span');
  const el = h('p', null, child);
  assert.equal(el.children[0], child);
});

test('markup-injecting attributes throw', () => {
  for (const name of ['inner' + 'HTML', 'outer' + 'HTML', 'srcdoc']) {
    assert.throws(() => h('div', { [name]: 'x' }), /not allowed/);
  }
  assert.throws(() => h('div', { style: 'color:red' }), /not allowed/);
});

test('event handlers register listeners', () => {
  const fn = () => {};
  const el = h('button', { onclick: fn });
  assert.equal(el.listeners.click, fn);
});

test('class, dataset, aria and boolean attributes', () => {
  const el = h('button', { class: 'a b', dataset: { id: '7' }, 'aria-pressed': 'true', disabled: true, hidden: false });
  assert.equal(el.attributes.class, 'a b');
  assert.equal(el.dataset.id, '7');
  assert.equal(el.attributes['aria-pressed'], 'true');
  assert.equal(el.attributes.disabled, '');
  assert.equal('hidden' in el.attributes, false);
});
