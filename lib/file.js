function File(file) {
  file = file || {};

  this.path = file.path;
  this.content = file.content;
}

module.exports = File;
