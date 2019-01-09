const path = require('path');
const fs = require('fs');
const Metalsmith = require('metalsmith');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const changed = require('metalsmith-changed');
const nodeStatic = require('node-static');
const watch = require('metalsmith-watch');
const sass = require('metalsmith-sass');
const eslint = require('metalsmith-eslint');
const babel = require('metalsmith-babel');
const buildStatic = process.argv.indexOf('--static') >= 0;

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
      livereload: !buildStatic,
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
  .use(eslint({
    src: ["**/*.js", "!**/vendor/**/*.js"],
    formatter: "unix",
    eslintConfig: JSON.parse(fs.readFileSync(path.join(process.cwd(), ".eslintrc"), "utf8"))
  }))
  .use(babel({
    presets: ['@babel/preset-env'],
  }))
  .build((err, files) => {
    if (files) {
      let filenames = Object.keys(files).join(', ');
      console.log('Built: ' + filenames);
    } else {
      console.error(err);
    }

    if (buildStatic) {
      process.exit(0);
    }
  });

if (!buildStatic) {
  const serve = new nodeStatic.Server(path.join(__dirname, 'build'));
  require('http').createServer((req, res) => {
    req.addListener('end', () => serve.serve(req, res));
    req.resume();
  }).listen(8080);
}
