class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    const _insert = function (newNode, node) {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode;
        } else {
          _insert(newNode, node.left);
        }
      } else {
        if (node.right === null) {
          node.right = newNode;
        } else {
          _insert(newNode, node.right);
        }
      }
    };
    const newNode = new BSTNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      _insert(newNode, this.root);
    }
    return this;
  }
  preOrderTraverse() {
    const _preOrderTraverse = function (node, callback) {
      if (node !== null) {
        callback(node.value);
        _preOrderTraverse(node.left, callback);
        _preOrderTraverse(node.right, callback);
      }
    };
    _preOrderTraverse(this.root, console.log);
  }
  preOrderTraverseByStack(callback) {
    let node = this.root;
    const stack = [node];
    while (stack.length !== 0) {
      node = stack.pop();
      if (node) {
        callback(node.value);
        if (node.right) {
          stack.push(node.right);
        }
        if (node.left) {
          stack.push(node.left);
        }
      }
    }
  }
  inOrderTraverse() {
    const _inOrderTraverse = function (node, callback) {
      if (node !== null) {
        _inOrderTraverse(node.left, callback);
        callback(node.value);
        _inOrderTraverse(node.right, callback);
      }
    };
    _inOrderTraverse(this.root, console.log);
  }
  inOrderTraverseByStack(callback) {
    const stack = [];
    let node = this.root;
    while (node !== null || stack.length !== 0) {
      while (node !== null) {
        stack.push(node);
        node = node.left;
      }
      if (stack.length !== 0) {
        node = stack.pop();
        callback(node.value);
        node = node.right;
      }
    }
  }
  postOrderTraverse() {
    const _postOrderTraverse = function (node, callback) {
      if (node !== null) {
        _postOrderTraverse(node.left, callback);
        _postOrderTraverse(node.right, callback);
        callback(node.value);
      }
    };
    _postOrderTraverse(this.root, console.log);
  }
  postOrderTraverseByStack(callback) {
    const stack = [];
    let node = this.root;
    let lastVisit = node;
    while (node !== null || stack.length !== 0) {
      while (node !== null) {
        stack.push(node);
        node = node.left;
      }
      node = stack[stack.length - 1];
      if (node.right === null || lastVisit === node.right) {
        callback(node.value);
        node = stack.pop();
        lastVisit = node;
        node = null;
      } else {
        node = node.right;
      }
    }
  }
}

const bst = new BinarySearchTree();
bst
  .insert(11)
  .insert(7)
  .insert(15)
  .insert(5)
  .insert(3)
  .insert(9)
  .insert(8)
  .insert(10)
  .insert(13)
  .insert(12)
  .insert(14)
  .insert(20)
  .insert(18)
  .insert(25)
  .insert(6);

bst.preOrderTraverseByStack(console.log);
