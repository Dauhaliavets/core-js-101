/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  build: '',
  order: 0,
  orders: {
    element: 1,
    id: 2,
    class: 3,
    attr: 4,
    pseudoClass: 5,
    pseudoElement: 6,
  },
  error:
    'Element, id and pseudo-element should not occur more then one time inside the selector',
  orderError:
    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  element(value) {
    this.checkOrder(this.orders.element);
    const obj = { ...cssSelectorBuilder };
    obj.build = this.build + value;
    obj.order = this.orders.element;
    return obj;
  },

  id(value) {
    this.checkOrder(this.orders.id);
    const obj = { ...cssSelectorBuilder };
    obj.build = `${this.build}#${value}`;
    obj.order = this.orders.id;
    return obj;
  },

  class(value) {
    this.checkOrder(this.orders.class);
    const obj = { ...cssSelectorBuilder };
    obj.build = `${this.build}.${value}`;
    obj.order = this.orders.class;
    return obj;
  },

  attr(value) {
    this.checkOrder(this.orders.attr);
    const obj = { ...cssSelectorBuilder };
    obj.build = `${this.build}[${value}]`;
    obj.order = this.orders.attr;
    return obj;
  },

  pseudoClass(value) {
    this.checkOrder(this.orders.pseudoClass);
    const obj = { ...cssSelectorBuilder };
    obj.build = `${this.build}:${value}`;
    obj.order = this.orders.pseudoClass;
    return obj;
  },

  pseudoElement(value) {
    this.checkOrder(this.orders.pseudoElement);
    const obj = { ...cssSelectorBuilder };
    obj.build = `${this.build}::${value}`;
    obj.order = this.orders.pseudoElement;
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = { ...cssSelectorBuilder };
    obj.build = `${selector1.build} ${combinator} ${selector2.build}`;
    return obj;
  },

  checkOrder(order) {
    if (
      order === this.order
      && [this.orders.element, this.orders.id, this.orders.pseudoElement].includes(
        order,
      )
    ) {
      throw new Error(this.error);
    }
    if (order < this.order) {
      throw new Error(this.orderError);
    }
  },

  stringify() {
    const { build } = this;
    this.build = '';
    return build;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
