var app = {
  echo: function (value) {
    return !!value;
  }
};

console.log(app.echo("test"));
console.log(app.echo(0));
console.log(app.echo(false));
console.log(app.echo([]));
