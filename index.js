'use strict'

var Promise = require('promise');

module.exports = submit;

/**
 * Initialize a new `Submit` form.
 * This represents a single form upload.
 *
 * @param {FormData} form
 * @api public
 */

function submit(form, to) {
  if (arguments.length === 2) return (new Submission(form)).to(to)
  return new Submission(form);
}
function Submission(form) {
  this.form = form;
}
Submission.prototype.to = function (url) {
  var from = this.form;
  var req = new XMLHttpRequest();
  var listeners = [];
  var result = new Promise(function (resolve, reject) {
    req.open('POST', url);
    req.onload = function () { resolve(req) };
    req.onerror = reject;
    console.log("Sending form data");
    console.log(JSON.stringify(from));
    req.send(from);
  })
  req.onprogress = function (e) {
    e.percent = e.loaded / e.total * 100;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](e)
    }
  }
  result.on = function (name, fn) {
    if (name != 'progress') throw new Error('the only supported method is progress');
    listeners.push(fn)
    return this;
  }
  return result;
}
