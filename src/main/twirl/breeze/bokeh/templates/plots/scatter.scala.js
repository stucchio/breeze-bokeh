@(xdata: String, ydata: String, radius: String, xlabel: String, ylabel: String, title: String)
(function() {
  require(['main'], function(Bokeh) {
    var data, i, options, plot, scatter, val;
    var x = @{xdata};
    var y = @{ydata};
    var r = @{radius};
    data = {
      x: x,
      y: y,
      radius: r,
    };
    scatter = {
      type: 'circle',
      x: 'x',
      y: 'y',
      radius: 'radius',
      radius_units: 'data',
      fill_alpha: 0.6,
      line_color: null
    };
    options = {
      title: "@{title}",
      nonselected: {
        fill_color: 'black',
        line_alpha: 0.1,
        fill_alpha: 0.05
      },
      dims: [600, 600],
      xrange: [0, 100],
      yrange: [0, 100],
      xaxes: "min",
      yaxes: "min",
      tools: true,
      legend: false
    };
    plot = Bokeh.Plotting.make_plot(scatter, data, options);
    return Bokeh.Plotting.show(plot, [document.getElementById("@{containerId}")]);
  });

}).call(this);
