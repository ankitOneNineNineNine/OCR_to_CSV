var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var csvWriter = require('csv-write-stream')
var writer = csvWriter()
var fs = require('fs')
var app = express();

var Tesseract = require('tesseract.js');

// writer.pipe(fs.createWriteStream('out.csv'))
// writer.end();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  let output = ""
  fs.readdir(path.join(__dirname, './jpg'), async function (err, files) {
    // files.forEach((file) => {
    
    let i = 0;
    for (let i = 400; i < 800; i++) {
      let file = files[i];
      if(file.includes('.gif')){
        continue;
      }
      let { data: { text } } = await
        Tesseract.recognize(
          path.join(__dirname, `./jpg/${file}`),
          'eng',
          { logger: m => { } })
      text = text.replace(/(\r\n|\r|\n){2,}/g, '$1\n');
      text = text.replace(/(\r\n|\n|\r)/gm, "");
      text = text.replace(/,/g, ' ')
      // console.log(text)
      output += `spam,${text}\n`
    }

    fs.appendFile("test.csv", output, function (err) {
      if (err) return console.log(err);
      console.log("The file was saved!");
    })


  })


})()

// writer.end()
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err)
});

module.exports = app;
