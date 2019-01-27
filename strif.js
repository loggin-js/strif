const fs = require('fs');
const path = require('path');

class StrifVar {
  constructor(name, opts) {
    if (!name) {
      throw new Error('name is required');
    } else if (typeof name != 'string') {
      throw new Error('name is required to be a string');
    } else {
      this.name = name;
    }

    this.accessor = opts.accessor || name;
    this.transformers = opts.transformers;
    this.opts = opts;
  }

  getFromObject(obj) {
    let str = this.accessor.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    for (let k of str.split('.')) {
      if (k in obj) obj = obj[k];
      else return;
    }

    if (this.opts.type && !(typeof obj === this.opts.type)) {
      throw new Error(`Var {${this.name}} type does not match "${this.opts.type}"`);
    }
    return obj;
  }
}

class StrifTemplate {
  constructor(template, transformers, options = {}) {
    if (!template) {
      throw new Error(
        'template is required');
    } else if (typeof template != 'string') {
      throw new Error(
        'template is required to be a string');
    } else {
      this.template = template;
    }
    this._options = options;
    this._transformers = transformers;
    this._props = [];

    if (options.props) {
      for (let key in options.props) {
        let prop = options.props[key];
        this.prop(key, prop);
      }
    }
  }

  print() {
    console.log(this.template);
  }

  prop(name, opts = {}) {
    this._props.push(
      new StrifVar(name, opts)
    );

    return this;
  }

  compile(data) {
    let map = {};
    for (let prop of this._props) {
      map[prop.name] = prop.getFromObject(data);
      if (prop.transformers) {
        map[prop.name] = prop.transformers
          .reduce((prev, curr) => {
            if (!this._transformers[curr]) {
              throw new Error('Transformer not found: ' + curr);
            } else return this._transformers[curr](prev);
          }, map[prop.name]);
      }
    }

    return this.template
      .replace(
        /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
        (m, l, key) => {
          if (key) return map[key];
          else throw new Error(
            'Template placeholders ({}) should not be empty');
        });
  }
}

class StrifFormatter {
  /**
   * @param {object} opts 
   * @param {object} opts.transformers
   * @param {string[]} opts.plugins
   */
  constructor(opts = {}) {
    this.opts = opts;

    this.transformers = {
      ...StrifFormatter.DEFAULT_TRANSFORMERS,
      ...this.opts.transformers
    };

    if (opts.plugins) {
      this.opts.plugins.forEach(plugPath => {
        let plugin = require(path.resolve(plugPath));
        if (plugin.transformers) {
          this.transformers = {
            ...this.transformers,
            ...plugin.transformers,
          };
        }
      });
    }
  }

  /**
   * @param {string} template 
   * @param {object} options 
   */
  template(template, options) {
    return new StrifTemplate(template, this.transformers, options);
  }

  /**
   * @param {string} path 
   * @param {object} options 
   */
  fromFile(path, options) {
    if (!path) {
      throw new Error(
        'path is required');
    } else if (typeof path != 'string') {
      throw new Error(
        'path is required to be a string');
    }

    let template = fs.readFileSync(path).toString();
    return new StrifTemplate(template, this.transformers, options);
  }
}
StrifFormatter.DEFAULT_TRANSFORMERS = {};

const DEFAULT_FORMATTER_OPTS = {
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  }
};

let strif = new StrifFormatter(DEFAULT_FORMATTER_OPTS);
strif.Formatter = StrifFormatter;
strif.Template = StrifTemplate;
strif.Var = StrifVar;

/**
 * 
 * @param {object} opts 
 * @param {object} opts.transformers
 * @returns {StrifFormatter}
 */
strif.create = (opts) => {
  return new StrifFormatter(opts);
};

global.strif = strif;
module.exports = strif;