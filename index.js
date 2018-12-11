const path = require('path');
const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const changed = require('metalsmith-changed');
const nodeStatic = require('node-static');
const watch = require('metalsmith-watch');
const sass = require('metalsmith-sass');

Metalsmith(__dirname)
  .metadata({
      title: "XOXO",
      description: "steamy.wedding",
      url: "http://www.steamy.wedding/"
  })
  .clean(true)
  .use(
    watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": true,
      },
      livereload: true,
    })
  )
  .use(changed())
  .use(markdown())
  .use(sass({
    outputStyle: "expanded"
  }))
  .use(layouts({
    engine: 'handlebars',
    suppressNoFilesError: true,
  }))
  .build((err, files) => {
    if (files) {
      let filenames = Object.keys(files).join(', ');
      console.log('Built: ' + filenames);
    } else {
      console.error(err);
    }
  });

const serve = new nodeStatic.Server(path.join(__dirname, 'build'));
require('http').createServer((req, res) => {
  req.addListener('end', () => serve.serve(req, res));
  req.resume();
}).listen(8080);
