/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */


/**
 * 定义了Scheduler的特性开关和超时配置
 * 特性开关：
 * 1、enableProfiling：是否启用性能分析（收集任务执行数据，供DevTools使用）
 * 2、enableRequestPaint：是否启用帧对齐调度（配合requestPaint使用）
 * 3、enableAlwaysYieldScheduler：是否启用“始终让出”模式（实验性）
 *
 * 时间片配置：
 * frameYieldMs：Scheduler占用主线程的最长时间
 *
 * 任务超时配置：
 * 1、userBlockingPriorityTimeout（用户交互）
 * 2、normalPriorityTimeout（默认优先级）
 * 3、lowPriorityTimeout（低优先级）
 */

export const enableProfiling = false;
export const frameYieldMs = 5;

export const userBlockingPriorityTimeout = 250;
export const normalPriorityTimeout = 5000;
export const lowPriorityTimeout = 10000;
export const enableRequestPaint = true;

export const enableAlwaysYieldScheduler = __EXPERIMENTAL__;
