/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

/**
  堆以数组的方式进行存储：
  下标为i的节点，其左子节点下标为：2i + 1，右子节点为：2i + 2
*/
type Heap<T: Node> = Array<T>;

type Node = {
  id: number,
  sortIndex: number,
  ...
};

/**
 * 向任务堆中新增任务：
 * 1、向堆末尾添加一个叶子节点
 * 2、对这个叶子节点做上浮操作
*/
export function push<T: Node>(heap: Heap<T>, node: T): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

//取出堆顶任务
export function peek<T: Node>(heap: Heap<T>): T | null {
  return heap.length === 0 ? null : heap[0];
}


/**
 * 删除堆顶元素
 * 1、从堆末尾取出一个元素替换掉堆顶元素
 * 2、对这个新的堆顶元素进行下沉操作
*/
export function pop<T: Node>(heap: Heap<T>): T | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    // $FlowFixMe[incompatible-type]
    heap[0] = last;
    // $FlowFixMe[incompatible-call]
    siftDown(heap, last, 0);
  }
  return first;
}

//堆节点上浮
function siftUp<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  while (index > 0) {
    //高频代码中位运算代替除法
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}


//堆节点下沉
function siftDown<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  const length = heap.length;

  //同理：高频操作使用位运算节约性能
  const halfLength = length >>> 1;

  /**
   * 下标 >= length / 2 的节点都没有子节点，因此可以跳出循环
   * 当前节点的左子节点下标超出数组索引 -> 没有子节点
   * 即2i + 1 >= length
   * i >= (length -1) / 2
   * 近似认为 i >= length / 2
  */
  while (index < halfLength) {
    //左子节点
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    //右子节点
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.

    //当前节点大于左子节点
    if (compare(left, node) < 0) {
      /**
       * rightIndex < length
       * 指存在右子节点
      */
      //存在右子节点且右子节点小于左子节点 => 当前节点与右子节点交换
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
        //否则当前节点与左子节点交换
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
      //存在右子节点且当前节点小于左子节点且大于右子节点
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

//节点比较函数
function compare(a: Node, b: Node) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
