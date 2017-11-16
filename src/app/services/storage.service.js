function StorageService() {
  const treeId = "FE_TASK_TREE";

  const service = {
    getNodes: function () {
      return JSON.parse(localStorage.getItem(treeId)) || [];
    },
    saveNodes: function (nodes) {
      localStorage.setItem(treeId, JSON.stringify(nodes));
    },
    saveNode: function (node) {
      const nodes = service.getNodes();
      const nodeIndex = nodes.findIndex(obj => obj.id === node.id);
      if (nodeIndex > -1) {
        nodes[nodeIndex] = node;
      } else {
        nodes.push(node);
      }
      service.saveNodes(nodes);
    },
    removeNode: function (nodeId) {
      service.saveNodes(service.getNodes().filter(obj => obj.id !== nodeId));
    }
  };

  return service;
}

export default angular.module('feTaskApp.storage', [])
  .factory('StorageService', StorageService)
  .name;
