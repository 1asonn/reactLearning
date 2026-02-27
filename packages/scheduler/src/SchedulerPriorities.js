/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */


/*本文件定义了任务的优先级*/
export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?


export const NoPriority = 0; //无优先级（不调度）
export const ImmediatePriority = 1; //立即执行（同步任务，如用户输入等）
export const UserBlockingPriority = 2; //用户阻塞（？）
export const NormalPriority = 3; //正常优先级（默认）
export const LowPriority = 4; //低优先级（预加载等）
export const IdlePriority = 5; //空闲时执行（不紧急的任务）
