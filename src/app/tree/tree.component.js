import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './tree.routes';

export class TreeController {

  /*@ngInject*/
  constructor($sce, StorageService, PaymentService) {
    this.$sce = $sce;
    this.StorageService = StorageService;
    this.PaymentService = PaymentService;
  }

  $onInit() {
    this.selectedFile = null;
    this.tree = {
      name: "Root",
      type: "ROOT",
      id: "ROOT",
      nodes: []
    };
    this.generateTree(this.tree, this.StorageService.getNodes());
  };

  generateTree(node, array) {
    node.nodes = array.filter(function (entry) {
      return entry.parent === node.id;
    });

    for (let i in node.nodes) {
      this.generateTree(node.nodes[i], array);
    }
  };

  addFile(entry) {
    entry.nodes = entry.nodes || [];
    entry.nodes.push({
      name: "",
      id: `FILE-${new Date().getTime()}`,
      type: "FILE",
      inEditMode: true,
      parent: entry.id
    });
  }

  addFolder(entry) {
    entry.nodes = entry.nodes || [];
    entry.nodes.push({
      name: "",
      id: `FOLDER-${new Date().getTime()}`,
      type: "FOLDER",
      inEditMode: true,
      parent: entry.id
    })
  }

  editNode(entry) {
    entry.inEditMode = true
  }

  saveNode(entry) {
    entry.inEditMode = false;
    this.StorageService.saveNode(entry);
  }

  toggleSelect(entry, isSelected) {
    entry.isSelected = isSelected;
    if (entry.nodes) {
      for (var i in entry.nodes) {
        this.toggleSelect(entry.nodes[i], isSelected);
      }
    }
  }

  removeSelected() {
    const nodsToDelete = [];
    this.findSelected(this.tree, nodsToDelete);
    nodsToDelete.forEach((node) => {
      this.StorageService.removeNode(node.id);
    });

    this.tree = {
      name: "Root",
      type: "ROOT",
      id: "ROOT",
      nodes: []
    };
    this.generateTree(this.tree, this.StorageService.getNodes());
  }

  findSelected(node, stack) {
    for (var i in node.nodes) {
      if (node.nodes[i].isSelected) {
        stack.push(node.nodes[i]);
      }
      node.nodes[i].nodes && this.findSelected(node.nodes[i], stack);
    }
  }

  previewFile(file) {
    this.selectedFile = file;
  }

  closePreview() {
    this.selectedFile = null;
  }

  pay() {
    //Find selected nodes
    const selectedNodes = [];
    this.findSelected(this.tree, selectedNodes);

    if (!selectedNodes.length) {
      this.paymentError = "You have to select nodes to pay for";
      return;
    }

    let price = 0;
    selectedNodes.forEach((entry) => {
      //each char cost 100 cents
      price += entry.name.length * 100;
    });

    this.PaymentService.getPaymentDetails(price)
      .then((res) => {
        res.sale_url = this.$sce.trustAsResourceUrl(res.sale_url);
        this.paymentDetails = res;
        this.paymentSuccess = `You can pay now $${price / 100}`;
      }, (err) => {
        this.paymentError = err.status_error_details;
      });
  }
}

export default angular.module('feTaskApp.tree', [uiRouter])
  .config(routing)
  .component('tree', {
    template: require('./tree.html'),
    controller: TreeController,
    controllerAs: 'vm',
  })
  .name;
