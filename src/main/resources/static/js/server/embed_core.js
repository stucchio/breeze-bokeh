(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["common/base", "common/load_models", "server/serverutils"], function(base, load_models, serverutils) {
    var addDirectPlot, addDirectPlotWrap, addPlot, addPlotWrap, exports, find_injections, foundEls, injectCss, parse_el, search_and_plot, serverLoad, unsatisfied_els, utility;
    utility = serverutils.utility;
    addPlotWrap = function(settings, dd) {
      return addPlot(settings.bokeh_modelid, settings.bokeh_modeltype, settings.element, dd);
    };
    addPlot = function(modelid, modeltype, element, data) {
      var data_plot_id, model, view;
      data_plot_id = _.keys(data)[0];
      if (!data_plot_id === modelid) {
        return;
      }
      console.log("addPlot");
      console.log(modelid, modeltype, element);
      load_models(data[data_plot_id]);
      model = base.Collections(modeltype).get(modelid);
      view = new model.default_view({
        model: model
      });
      view.render();
      return _.delay(function() {
        return $(element).replaceWith(view.$el);
      });
    };
    addDirectPlotWrap = function(settings) {
      console.log("addDirectPlotWrap");
      return addDirectPlot(settings.bokeh_docid, settings.bokeh_ws_conn_string, settings.bokeh_docapikey, settings.bokeh_root_url, settings.bokeh_modelid, settings.bokeh_modeltype, settings.element);
    };
    serverLoad = function(docid, ws_conn_string, docapikey, root_url) {
      var BokehConfig, headers;
      console.log("serverLoad");
      headers = {
        'BOKEH-API-KEY': docapikey
      };
      $.ajaxSetup({
        'headers': headers
      });
      BokehConfig = base.Config;
      BokehConfig.prefix = root_url;
      BokehConfig.ws_conn_string = ws_conn_string;
      return utility.load_doc_once(docid);
    };
    addDirectPlot = function(docid, ws_conn_string, docapikey, root_url, modelid, modeltype, element) {
      return serverLoad(docid, ws_conn_string, docapikey, root_url).done(function() {
        var model, plot_collection, view;
        console.log("addPlot");
        console.log(modelid, modeltype, element);
        plot_collection = base.Collections(modeltype);
        model = plot_collection.get(modelid);
        view = new model.default_view({
          model: model
        });
        return _.delay(function() {
          return $(element).replaceWith(view.$el);
        });
      });
    };
    injectCss = function(static_root_url) {
      var css_urls, load_css;
      css_urls = ["" + static_root_url + "css/bokeh.css", "" + static_root_url + "css/continuum.css", "" + static_root_url + "js/vendor/bootstrap/bootstrap-bokeh-2.0.4.css"];
      load_css = function(url) {
        var link;
        link = document.createElement('link');
        link.href = url;
        link.rel = "stylesheet";
        link.type = "text/css";
        return document.body.appendChild(link);
      };
      return _.map(css_urls, load_css);
    };
    foundEls = [];
    parse_el = function(el) {
      "this takes a bokeh embed script element and returns the relvant\nattributes through to a dictionary, ";
      var attr, attrs, bokehCount, bokehRe, info, _i, _len;
      attrs = el.attributes;
      bokehRe = /bokeh.*/;
      info = {};
      bokehCount = 0;
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        attr = attrs[_i];
        if (attr.name.match(bokehRe)) {
          info[attr.name] = attr.value;
          bokehCount++;
        }
      }
      if (bokehCount > 0) {
        return info;
      } else {
        return false;
      }
    };
    unsatisfied_els = {};
    find_injections = function() {
      var container, d, el, els, info, is_new_el, matches, new_settings, re, _i, _len;
      els = document.getElementsByTagName('script');
      re = /.*embed.js.*/;
      new_settings = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        is_new_el = __indexOf.call(foundEls, el) < 0;
        matches = el.src.match(re);
        if (is_new_el && matches) {
          foundEls.push(el);
          info = parse_el(el);
          d = document.createElement('div');
          container = document.createElement('div');
          container.className = "bokeh-container";
          el.parentNode.insertBefore(container, el);
          info['element'] = container;
          new_settings.push(info);
        }
      }
      return new_settings;
    };
    search_and_plot = function(dd) {
      var new_plot_dicts, plot_from_dict;
      plot_from_dict = function(info_dict, key) {
        var dd_id;
        if (info_dict.bokeh_plottype === 'embeddata') {
          dd_id = _.keys(dd)[0];
          if (key === dd_id) {
            addPlotWrap(info_dict, dd);
            return delete unsatisfied_els[key];
          }
        } else {
          addDirectPlotWrap(info_dict);
          return delete unsatisfied_els[key];
        }
      };
      new_plot_dicts = find_injections();
      _.each(new_plot_dicts, function(plotdict) {
        return unsatisfied_els[plotdict['bokeh_modelid']] = plotdict;
      });
      return _.map(unsatisfied_els, plot_from_dict);
    };
    exports = {
      search_and_plot: search_and_plot,
      injectCss: injectCss
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=embed_core.js.map
*/