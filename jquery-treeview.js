const Treeview = function (containerElement, settings) {
    'use strict';

    let options;
    let baseList;

    function init() {
        options = settings;

        containerElement.classList.add('treeview');
        containerElement.dataset.treeview = 'container';

        baseList = document.createElement('ul');
        containerElement.append(baseList);

        containerElement.addEventListener('data-loaded', buildTreeNodes);

        loadData();
    }

    function loadData() {
        fetch(options.sourceUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response was not ok: ${response.status} (${response.statusText})`);
                }

                return response.json();
            })
            .then(data => {
                const eventDataLoaded = new CustomEvent('data-loaded', {
                    detail: data
                });

                containerElement.dispatchEvent(eventDataLoaded);
            })
            .catch(error => {
                console.error('Load Data Error:', error);
            });
    }

    function buildTreeNodes(event) {
        const data = event.detail;

        if (Array.isArray(data)) {
            data.forEach(item => createNode(item, baseList));
        } else {
            createNode(data, baseList);
        }
    }

    function createNode(value, parentNode) {
        const currentNode = document.createElement('li');
        currentNode.classList.add('node-bg-vimage');
        // currentNode.dataset.item = JSON.stringify(value);
        currentNode.dataset.treeviewNodeId = value.id;
        currentNode.dataset.treeview = 'node';
        currentNode.innerHTML = value.name;
        parentNode.append(currentNode);

        const nodeHitArea = document.createElement('span');
        currentNode.append(nodeHitArea);


        const eventNodeCreated = new CustomEvent('node-created', {
            detail: {
                data: value,
                element: currentNode
            }
        });

        containerElement.dispatchEvent(eventNodeCreated);

        if (value.children && value.children.length > 0) {
            nodeHitArea.classList.add('hit-area');

            const childList = document.createElement('ul');
            currentNode.append(childList);

            value.children.forEach(item => createNode(item, childList));
        } else {
            nodeHitArea.classList.add('no-hit-area');
        }
    }

    init();

    return {
    };
};
