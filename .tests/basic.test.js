const strif = require('../strif');

describe('strif basic tests', () => {
  it('should be exported correctly', () => {
    expect(strif).toBeDefined();
  });

  it('should have exports', () => {
    expect(typeof strif.create).toEqual('function');
    expect(strif.Template).toBeDefined();
    expect(strif.Formatter).toBeDefined();
    expect(strif.Var).toBeDefined();
  });

  it('should create formatter correctly', () => {
    let formatter = strif.create();
    expect(formatter).toBeInstanceOf(strif.Formatter);
  });

  it('formatter should create template correctly', () => {
    let formatter = strif.create();
    let template = formatter.template('{name}');
    expect(template).toBeInstanceOf(strif.Template);
  });

  it('template should compile correctly', () => {
    let formatter = strif.create();
    let template = formatter.template('{name}');
    expect(template.compile({
      name: 'John'
    })).toEqual('John');
  });

  it('template should compile correctly for empty placeholders', () => {
    let formatter = strif.create();
    let template = formatter.template('{}');
    expect(template.compile('John')).toEqual('John');
  });

  it('template should compile correctly for array placeholders', () => {
    let formatter = strif.create();
    let template = formatter.template('$0 is $1');
    expect(template.compile(['John', 'dead'])).toEqual('John is dead');
  });

  it('global compile should work', () => {
    expect(strif.compile('Hi {name}!', {
      name: 'John'
    })).toEqual('Hi John!');
  });
});