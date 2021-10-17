let fs = null;
let path = null;

try {
  fs = require('fs');
  path = require('path');
} catch (error) {
  console.warn('WARN [strif]', 'StrifFormatter.fromFile will not work on the Browser');
}

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

  hasTransformers() {
    return this.transformers && this.transformers.length > 0;
  }

  getFromObject(obj) {
    let str = this.accessor.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    for (let k of str.split('.')) {
      if (k in obj) obj = obj[k] || null;
      else return null;
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
      throw new Error('template is required');
    } else if (typeof template != 'string') {
      throw new Error('template is required to be a string');
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

  prop(name, opts = {}) {
    this._props.push(new StrifVar(name, opts));
    return this;
  }

  compile(data, options = {}) {
    options = {
      ...StrifTemplate.DefaultCompileOptions,
      ...options
    }

    // TODO: Check and see if cloning is necessary here
    const dataClone = { ...data };

    let transformers = this._transformers;

    // TODO: Look for better/more performant way of checking this
    // Maybe check on reduce instead
    if (options.ignoreTransformers) {
      transformers = {};
      Object.keys(this._transformers).forEach(key => {
        transformers[key] = this._transformers[key];
        if (options.ignoreTransformers.includes(key)) {
          transformers[key].ignore = true;
        }
      });
    } else {
      Object.keys(this._transformers).forEach(key => {
        transformers[key].ignore = false;
      });
    }

    let map = dataClone;

    for (let prop of this._props) {
      let propData = prop.getFromObject(dataClone);

      if (propData) {
        map[prop.name] = propData;
      }

      if (prop.hasTransformers()) {
        map[prop.name] = prop.transformers
          .reduce((prev, curr) => {
            const isFn = typeof curr === 'function';
            const isTransformer = isFn || transformers[curr] != undefined;

            if (!isTransformer) {
              throw new Error('Transformer not found and is not a function: ' + curr);
            }

            if (isFn) return curr(prev);

            if (transformers[curr].ignore) {
              return prev;
            }

            return transformers[curr](prev);
          }, map[prop.name]);
      }
    }

    return StrifTemplate.compile(this.template, map, options);
  }

  static compile(template, data, options) {
    // TODO: memoize/cache?
    return template.replace(
      /([{}])\1|[{](.*?)(?:!(.+?))?[}]/g,
      (m, l, key) => {
        if (key || l) {
          let val = data[key || l] || '';
          return val;
        }

        return data;
      });
  }
}

StrifTemplate.DefaultCompileOptions = {
  ignoreTransformers: null
};

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
      if (!path) {
        return console.warn('WARN [strif]', '"Plugins" don not work on the browser... for now...');
      }

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

  addTransformer(name, transformer) {
    if (typeof name != 'string') {
      throw new Error('name is required to be a string');
    }

    if (typeof transformer != 'function') {
      throw new Error('transformer is required to be a function');
    }

    this.transformers[name] = transformer;

    return this;
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
  fromFile(filePath, options) {
    if (!fs) {
      return console.warn('WARN [strif]', '"StrifFormatter.fromFile "does not work on the browser');
    }

    if (!filePath) {
      throw new Error(
        'filePath is required');
    } else if (typeof filePath != 'string') {
      throw new Error(
        'filePath is required to be a string');
    }

    let template = fs.readFileSync(filePath).toString();
    return new StrifTemplate(template, this.transformers, options);
  }
}
StrifFormatter.DEFAULT_TRANSFORMERS = {};

const DEFAULT_FORMATTER_OPTS = {
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString(),
    capitalize: s => {
      return s && s[0].toUpperCase() + s.slice(1);
    }
  }
};

let strif = new StrifFormatter(DEFAULT_FORMATTER_OPTS);
strif.Formatter = StrifFormatter;
strif.Template = StrifTemplate;
strif.Var = StrifVar;

strif.create = (opts) => new StrifFormatter(opts);
strif.compile = StrifTemplate.compile;


global.strif = strif;
module.exports = strif;
