(function($) {

    "use strict";

    var Treeview = function(element, settings) {
      this.baseContainer = $(element).addClass('treeview');
      this.options = settings;

      this.baseList = $('<ul>').appendTo(this.baseContainer);

      this.initialize();
    };

    Treeview.prototype = {
      initialize: function() {
        if (this.options.dataIsFlatten) {
          this.readFlattenData();
        } else {
          this.readNotFlattenData();
        }
      },
      readFlattenData: function() {
        $.getJSON(this.options.sourceUrl, $.proxy(function(data) {
          var items = this.getDataChildren(null, data);
          this.buildTreeNodes(items, this.baseList);
        }, this));
      },
      getDataChildren: function(currentId, data) {
        var items = $.grep(data, $.proxy(function(value, index) {
          return value[this.options.parentPropertyIdName] === currentId;
        }, this));

        $.each(items, $.proxy(function(index, value) {
          value.children = this.getDataChildren(value.id, data);
        }, this));

        return items || [];
      },
      readNotFlattenData: function() {
        $.getJSON(this.options.sourceUrl, $.proxy(function(data) {
          this.buildTreeNodes(data, this.baseList);
        }, this));
      },
      buildTreeNodes: function(data, parentNode) {
        if ($.isArray(data)) {
          $.each(data, $.proxy(function(index, value) {
            this.createNode(value, parentNode);
          }, this));
        } else {
          this.createNode(data, parentNode);
        }
      },
      createNode: function(value, parentNode) {
        var currentNode = $('<li>').addClass('node-bg-vimage').appendTo(parentNode);
        currentNode.data('item', value);
        currentNode.html(value.name);

        var nodeHitArea = $('<span>').appendTo(currentNode);

        if (value.children && value.children.length > 0) {
          nodeHitArea.addClass('hit-area');
          nodeHitArea.click($.proxy(function (e) {
              this.expandNode($(e.target).parent());
          }, this));

          var newList = $('<ul>').appendTo(currentNode);
          $.each(value.children, $.proxy(function(index, value) {
            this.createNode(value, newList);
          }, this));
        } else {
            nodeHitArea.addClass('no-hit-area');
        }
      },

      expandNode: function (node) {
        this.buildTreeNodes(node.data('item').children, node);
      },
      collapseNode: function (node) {
        node.children('ul').remove();
      }
    };

    $.fn.treeview = function(options) {
      var defaults = {
        sourceUrl: null,
        dataIsFlatten: false,
        parentPropertyIdName: null
      };

      var settings = $.extend({}, defaults, options);

      return this.each(function() {
        var data = $(this).data('TreeviewMonitor');

        if (!data)
          $(this).data('TreeviewMonitor', new Treeview(this, settings));
      });
    };
  })(window.jQuery);
