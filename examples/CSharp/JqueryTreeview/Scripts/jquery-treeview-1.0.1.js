var Treeview = (function () {
    function treeview(element, options) {
        this.myObject = $(element);
        this.myObject.empty();

        this.options = options;

        this.renderItem = this.options.renderItem || this.renderItem;

        if (this.options.loadNodesOnDemand) {
            this.getChildrenNodes = this.options.getChildrenNodes || this.getChildrenNodes;
            this.getChildrenNodes(0, this.myObject, $.proxy(this.getChildrenNodesSuccess, this));
        } else {
            this.getAllNodes();
        }
    }

    treeview.prototype = {
        getChildrenNodes: function (itemId, baseElement, funcCallback) {
            var baseDataToSend = { upperId: itemId };
            var dataToSend = $.extend(true, baseDataToSend, this.options.dataToSend);
            dataToSend = dataToSend == null ? "" : this.convertToString(dataToSend);

            $.ajax({
                type: this.options.ajaxVerb,
                contentType: "application/json; charset=utf-8",
                url: this.options.sourceUrl,
                data: dataToSend,
                dataType: "json",
                success: function (data) {
                    funcCallback(itemId, baseElement, data);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log("An error occurred when trying to obtain the nodes\n\njqXhr>" + jqXhr + "\n\ntextStatus>" + textStatus + "\n\nerrorThrown>" + errorThrown);
                }
            });
        },
        getChildrenNodesSuccess: function (itemId, parentElement, data) {
            if (data != null && data.length > 0) {
                var childTreeTag = $("<ul />").addClass("treeview").appendTo(parentElement);

                this.createNodeArray(data, childTreeTag);

                this.bindCheckboxes();

                if (this.options.onCompleted)
                    this.options.onCompleted(childTreeTag, this.myObject);
            }
        },

        getAllNodes: function () {
            var baseDataToSend = {};
            var dataToSend = $.extend(true, baseDataToSend, this.options.dataToSend);
            dataToSend = dataToSend == null ? "" : this.convertToString(dataToSend);

            var mySelf = this;
            $.ajax({
                type: this.options.ajaxVerb,
                contentType: "application/json; charset=utf-8",
                url: this.options.sourceUrl,
                data: dataToSend,
                dataType: "json",
                success: function (data) {
                    mySelf.getAllNodesSuccess(data, mySelf.myObject);
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log("An error occurred when trying to obtain the nodes\n\njqXhr>" + jqXhr + "\n\ntextStatus>" + textStatus + "\n\nerrorThrown>" + errorThrown);
                }
            });
        },
        getAllNodesSuccess: function (treeNode, parentElement) {
            if (treeNode != null) {
                var childTreeTag = $("<ul />").addClass("treeview").appendTo(parentElement);

                if ($.isArray(treeNode)) {
                    this.createNodeArray(treeNode, childTreeTag);
                } else {
                    this.createNode(treeNode, childTreeTag, "hit-single");
                }

                this.bindCheckboxes();
            }
        },
        createNodeArray: function (dataSource, parentElement) {
            for (var i = 0; i < dataSource.length; i++) {
                var item = dataSource[i];
                var hitPosition;

                if (dataSource.length == 1) {
                    hitPosition = "hit-single";
                } else {
                    switch (i) {
                        case 0:
                            hitPosition = "hit-first";
                            break;
                        case dataSource.length - 1:
                            hitPosition = "hit-last";
                            break;
                        default:
                            hitPosition = "";
                            break;
                    }
                }

                this.createNode(item, parentElement, hitPosition);
            }
        },
        createNode: function (item, parentElement, hitPosition) {
            // Create the base node li tag
            var nodeInnerTag = $("<li />");
            nodeInnerTag.attr("id", item.Id);
            nodeInnerTag.data("item", item);
            nodeInnerTag.addClass("node-bg-vimage");

            // Create the span hit area (where the plus and minus sign appears)
            var nodeSpanHit = $("<span />");
            nodeSpanHit.attr("id", item.Id);
            nodeSpanHit.addClass(hitPosition);
            nodeSpanHit.appendTo(nodeInnerTag);


            if (item.HasChild) {
                nodeInnerTag.addClass("with-child-node");

                nodeSpanHit.addClass("scontainer-expand");
                nodeSpanHit.addClass("hit-area");

                var mySelf = this;
                nodeSpanHit.click(function () {
                    mySelf.expandNode($(this).attr("id"));
                });
            } else {
                nodeInnerTag.addClass("without-child-node");

                nodeSpanHit.addClass("no-hit-area");
            }

            if (hitPosition == "hit-last" || hitPosition == "hit-single") {
                nodeInnerTag.removeClass("node-bg-vimage");
            }


            // Create a span to be used as a render node container.
            // The content of this container could be overridden by a custom _renderItem method.
            var spanText = $("<span />");
            spanText.addClass("scontainer-node-render-container");
            spanText.appendTo(nodeInnerTag);


            this.renderItem(spanText, item);


            // Attaching the new node to the parent element
            nodeInnerTag.appendTo(parentElement);

            if (this.options.onNodeCreated)
                this.options.onNodeCreated(nodeInnerTag, parentElement, this.myObject);

            // Expand child nodes
            if (item.HasChild && !this.options.loadNodesOnDemand) {
                this.switchCssClass(nodeInnerTag.children(".scontainer-expand"));

                this.getAllNodesSuccess(item.Children, nodeInnerTag);
            }
        },

        expandNode: function (itemNodeId) {
            var currentNode = this.getCurrentNodeById(itemNodeId);

            this.switchCssClass(currentNode.children(".scontainer-expand"));

            if (this.options.loadNodesOnDemand) {
                this.getChildrenNodes(itemNodeId, currentNode, $.proxy(this.getChildrenNodesSuccess, this));
            } else {
                this.getAllNodesSuccess(currentNode.data("item").Children, currentNode);
            }

            if (this.options.onNodeExpanded)
                this.options.onNodeExpanded(currentNode, this.myObject);
        },
        collapseNode: function (itemNodeId) {
            var currentNode = this.getCurrentNodeById(itemNodeId);

            this.switchCssClass(currentNode.children(".scontainer-collapse"));

            currentNode.children("ul").remove();

            if (this.options.onNodeColapsed)
                this.options.onNodeColapsed(currentNode, this.myObject);
        },

        renderItem: function (spanText, item) {
            if (this.options.showCheckbox) {
                var checkbox = $("<input />").attr("type", "checkbox").attr("value", item.Id).addClass("node-checkbox");
                checkbox.appendTo(spanText);

                if (this.options.checkboxesName)
                    checkbox.attr("name", this.options.checkboxesName);
            }

            var spanName = $("<span />");
            spanName.addClass("scontainer-node-text");
            spanName.html(item.Name);
            spanName.appendTo(spanText);
        },

        switchCssClass: function (workNode) {
            workNode.off('click');

            var mySelf = this;
            if (workNode.hasClass("scontainer-collapse")) {
                workNode.removeClass("scontainer-collapse").addClass("scontainer-expand");

                workNode.click(function () {
                    mySelf.expandNode($(this).attr("id"));
                });
            } else {
                if (workNode.hasClass("scontainer-expand")) {
                    workNode.removeClass("scontainer-expand").addClass("scontainer-collapse");

                    workNode.click(function () {
                        mySelf.collapseNode($(this).attr("id"));
                    });
                }
            }
        },
        convertToString: function (obj) {
            if (typeof JSON != "undefined") {
                return JSON.stringify(obj);
            }

            var arr = [];
            $.each(obj, function (key, val) {
                var next = key + ": ";
                next += $.isPlainObject(val) ? this.convertToString(val) : val;
                arr.push(next);
            });

            return "{ " + arr.join(", ") + " }";
        },
        getCurrentNodeById: function (nodeId) {
            return this.myObject.find("li[id='" + nodeId + "']").first();
        },

        bindCheckboxes: function () {
            var checkboxes = this.myObject.find("input[type='checkbox']");
            checkboxes.off("change");

            var mySelf = this;
            checkboxes.change(function () {
                var currentIsChecked = $(this).prop("checked");
                var container = $(this).parents("li").first();

                container.find("input[type='checkbox']").prop({ checked: currentIsChecked });

                mySelf.checkSiblingsState(container, currentIsChecked);
            });
        },
        checkSiblingsState: function (currentContainer, currentIsChecked) {
            var parent = currentContainer.parents("li").first();
            var siblingsState = true;

            var mySelf = this;
            currentContainer.siblings().each(function () {
                var siblingIsChecked = mySelf.getCurrentNodeCheckbox($(this)).prop("checked");
                return siblingsState = (siblingIsChecked === currentIsChecked);
            });

            if (siblingsState) {
                this.getCurrentNodeCheckbox(parent).prop({ checked: currentIsChecked });
                this.checkSiblingsState(parent);
            } else {
                this.getCurrentNodeCheckbox(currentContainer.parents("li")).prop({ checked: false });
            }
        },
        getCurrentNodeCheckbox: function (element) {
            return element.children(".scontainer-node-render-container").children('input[type="checkbox"]');
        }
    };

    return treeview;
})();

(function ($) {
    $.fn.treeview = function (options) {
        var defaults = {
            sourceUrl: "",
            dataToSend: null,
            ajaxVerb: "GET",
            onCompleted: null,
            onNodeExpanded: null,
            onNodeColapsed: null,
            onNodeCreated: null,
            renderItem: null,
            getChildrenNodes: null,
            showCheckbox: false,
            checkboxesName: null,
            loadNodesOnDemand: true
        };

        var settings = $.extend({}, defaults, options);

        this.each(function () {
            return new Treeview(this, settings);
        });
    };
})(jQuery);