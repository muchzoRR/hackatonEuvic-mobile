var rollup = require('rollup').rollup;
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
//var componentSass = require('@ionic/component-sass').componentSass;


function rollupNG2() {
  return {
    resolveId(id) {
      console.log("id: ", id);
      if (id.startsWith('rxjs/')) {
        return process.cwd() + '/node_modules/rxjs-es/' + id.split('rxjs/').pop() + '.js';
      }
    }
  };
}


var appOptions = {
  entry: '.ngc/app/main.js',
  sourceMap: true,
  plugins: [
    rollupNG2(),
    nodeResolve(),
    commonjs({
      //exclude: 'node_modules/@angular/**'
    })
  ],
  /*acorn: {
    allowImportExportEverywhere: true
  }*/
};

rollup(appOptions).then(function(bundle) {

  bundle.write({
    format: 'iife',
    dest: 'www/build/bundle.es6.js'
  });

  var modulePaths = bundle.modules.map(function(m) { return m.id; });

}).catch(function(err) {
  console.log('ERROR: ', err.message);
  process.exit(1);
});


var polyfillOptions = {
  entry: '.ngc/app/polyfills.js',
  sourceMap: true,
  plugins: [
    commonjs({}),
    nodeResolve()
  ]
};
rollup(polyfillOptions).then(function(bundle) {
  bundle.write({
    format: 'iife',
    dest: 'www/build/polyfills.js'
  });
}, console.error)