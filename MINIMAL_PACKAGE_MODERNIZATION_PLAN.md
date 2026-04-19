# mp-react-components 最小配置改造方案

## 目标

本方案只覆盖 npm 包发布层面的最小配置改造，目标是让 `mp-react-components`：

- 更适合作为 React 组件库被宿主项目消费
- 避免发布包自带一份 `react` / `react-dom`
- 使打包产物入口声明更清晰、更现代
- 为 React 18 / 19 和 Node 20+ 的使用场景扫清明显的配置障碍

本方案不等同于“已经完整适配 React 18 / 19 与 Node 20+”。运行时兼容性仍需要后续验证。

## 范围

本轮仅建议修改以下文件：

- `package.json`
- `rollup.config.mjs`

如需补全类型声明产物，可额外调整 TypeScript 相关配置，但不属于必做项。

## 现状问题

### 1. React 被放在 dependencies 中

当前 `package.json` 将 `react` 和 `react-dom` 放在 `dependencies` 中。这会导致：

- 宿主项目更容易出现重复安装 React
- 组件库与宿主项目的 React 版本边界不清晰
- React 18 / 19 项目接入时更容易出现双 React 风险

### 2. 发布入口不统一

当前包入口声明为：

- `main: index.js`
- `module: dist/index.es.js`

这意味着 CommonJS 和 ESM 产物不在同一目录层级，不利于维护和发布检查。

### 3. 缺少现代包元数据

当前缺少或不完整的字段包括：

- `peerDependencies`
- `types`
- `files`
- `exports`
- `sideEffects`

这些字段缺失会降低包在现代工具链中的可预期性。

### 4. Node 版本目标不应写死为仅 20+

本次目标是“可以支持 Node 20+”，不是“必须只能在 Node 20+ 下安装或使用”。

因此不建议把 `engines.node` 写成硬限制 `>=20`。更合适的做法是：

- 不写 `engines.node`
- 或仅写较宽松范围，例如 `>=18`

## 建议改造

### 1. 调整 React 依赖归属

将以下依赖从 `dependencies` 移出：

- `react`
- `react-dom`

新增到 `peerDependencies`：

```json
"peerDependencies": {
  "react": "^18.2.0 || ^19.0.0",
  "react-dom": "^18.2.0 || ^19.0.0"
}
```

同时在 `devDependencies` 中保留本地开发和测试所需的 React：

```json
"devDependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

说明：

- `peerDependencies` 表示宿主项目负责提供 React
- `devDependencies` 表示仓库自身开发、测试、storybook 仍可正常运行

### 2. 统一发布产物入口到 dist

建议将入口调整为：

```json
"main": "dist/index.cjs.js",
"module": "dist/index.esm.js"
```

如后续增加类型声明产物，再补：

```json
"types": "dist/index.d.ts"
```

### 3. 增加 files

建议只发布 `dist`：

```json
"files": ["dist"]
```

这样可以减少无关文件进入 npm 包。

### 4. 增加 exports

建议增加根导出声明：

```json
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "require": "./dist/index.cjs.js",
    "import": "./dist/index.esm.js"
  }
}
```

如果本轮暂未生成 `dist/index.d.ts`，则应先省略 `types` 字段与 `exports["."].types`，避免发布后声明指向不存在的文件。

### 5. 增加 sideEffects

仓库内存在 `.css` 和 `.less` 样式导入，不建议直接设置：

```json
"sideEffects": false
```

更稳妥的做法是：

```json
"sideEffects": [
  "**/*.css",
  "**/*.less"
]
```

这样既保留样式副作用，又让 JS 模块具备更好的 tree-shaking 兼容性。

### 6. Node 版本声明保持宽松

本轮不建议把 Node 20 设成硬门槛。

推荐两种方案二选一：

方案 A：不写 `engines`

- 适合当前仍处于兼容性梳理阶段
- 不会阻止 Node 18 用户安装

方案 B：写宽松范围

```json
"engines": {
  "node": ">=18"
}
```

适合希望表达“较新的 Node 环境更受支持”，但不把 Node 20+ 写成唯一合法范围的场景。

## Rollup 最小改动

`rollup.config.mjs` 可保持当前插件体系不变，仅同步输出文件名到新的包入口：

```js
output: [
  {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    sourcemap: true
  },
  {
    file: 'dist/index.esm.js',
    format: 'es',
    sourcemap: true
  }
]
```

当前 `external` 逻辑已经会读取 `dependencies` 和 `peerDependencies`，因此当 `react` / `react-dom` 被移入 `peerDependencies` 后，外部化逻辑仍可继续工作。

## 推荐 package.json 草案

以下片段仅表示本轮建议新增或修改的关键字段，不表示完整文件：

```json
{
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.cjs.js",
      "import": "./dist/index.esm.js"
    }
  },
  "sideEffects": [
    "**/*.css",
    "**/*.less"
  ],
  "peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0"
  }
}
```

如需增加 `engines`，推荐仅使用：

```json
"engines": {
  "node": ">=18"
}
```

或直接省略。

## 本轮不处理的内容

以下问题不属于“最小配置改造”范围：

- `react-router-dom@5` 的升级
- `use-query-params@1` 的兼容性调整
- `react-collapsible`、`react-tooltip`、`react-aria-menubutton` 等旧依赖的替换
- `Storybook 6`、`Jest 26`、`Parcel 1`、`Rollup 2` 的整体升级
- demo 入口中的 `ReactDOM.render` 改造

这些内容会影响运行时兼容性或开发工具链，但不属于本轮最小发布配置修正。

## 验收标准

完成本轮后，至少应满足：

- npm 包不再把 `react` 和 `react-dom` 作为运行时依赖一并发布
- 包入口统一指向 `dist/`
- 宿主项目可以自行提供 React 18 或 React 19
- Node 20+ 使用场景不会被配置硬限制挡住
- 发布内容更聚焦，仅包含构建产物

## 后续建议

完成本轮后，建议再做一轮小范围验证：

- 在 React 18 宿主项目中安装并跑通基础渲染
- 在 React 19 宿主项目中安装并验证高频组件
- 在 Node 20 环境下执行打包与测试

若验证中出现运行时问题，再决定是否进入“第二阶段：工具链和依赖升级”。
