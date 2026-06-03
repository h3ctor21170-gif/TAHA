/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: '1.0.0'
});
