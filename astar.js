const Direction = require("./direction.js");

class Node {
  constructor(coord, prevNode, goal) {
    this._coord = coord;
    this._prevNode = prevNode;
    this._cost = prevNode ? prevNode.cost + 1 : 0;
    this._distance = coord.distance(goal);
  }

  get coord() {
    return this._coord;
  }
  get cost() {
    return this._cost;
  }
  get distance() {
    return this._distance;
  }
  get estimatedCost() {
    return this._cost + this._distance;
  }

  aroundNode(goal) {
    const around = [];
    for (const dir of Direction.AROUND) {
      around.push(new Node(this._coord.plus(dir), this, goal));
    }
    return around;
  }

  makeRoute() {
    let current = this;
    const route = [];
    while (current._prevNode !== null) {
      route.unshift(current.coord);
      current = current._prevNode;
    }
    return route;
  }
}

class NodeList {
  constructor() {
    this._nodes = [];
  }

  isEmpty() {
    return this._nodes.length === 0;
  }

  add(newNode) {
    for (const node of this._nodes) {
      if (node.coord !== newNode.coord) continue;
      if (node.estimatedCost <= newNode.estimatedCost) return;
      break;
    }
    this._nodes.push(newNode);
  }

  popLowestCostNode() {
    const lowestCostNode = this.lowestCostNode(this._nodes);
    this._nodes.splice(this._nodes.indexOf(lowestCostNode), 1);
    return lowestCostNode;
  }

  lowestCostNode(nodes) {
    let lowestCostNode = null;
    for (const node of nodes) {
      if (
        lowestCostNode === null ||
        node.estimatedCost < lowestCostNode.estimatedCost
      ) {
        lowestCostNode = node;
      }
    }
    return lowestCostNode;
  }

  nearestLowestCostNode() {
    let lowestDistance = null;
    this._nodes.forEach(node => {
      if (lowestDistance === null || node.distance < lowestDistance) {
        lowestDistance = node.distance;
      }
    });
    const lowestDistanceNodes = this._nodes.filter(
      node => node.distance === lowestDistance
    );
    return this.lowestCostNode(lowestDistanceNodes);
  }
}

class Astar {
  constructor(blockAt) {
    this._blockAt = blockAt;
    this._goal = null;
    this._opens = null;
    this._closes = null;
    this._limit = 0;
  }

  compute(start, goal, limit = 0) {
    this._goal = goal;
    this._limit = limit;
    [this._opens, this._closes] = [new NodeList(), new NodeList()];
    this._opens.add(new Node(start, null, this._goal));
    while (!this._opens.isEmpty()) {
      const node = this._opens.popLowestCostNode();
      if (node.distance === 1) return node.makeRoute();
      for (const side of node.aroundNode(this._goal)) {
        if (this._blockAt(side.coord)) continue;
        if (this._limit > 0 && side.cost > this._limit) continue;
        this._opens.add(side);
      }
      this._closes.add(node);
    }
    return this._closes.nearestLowestCostNode().makeRoute();
  }
}

module.exports = Astar;
