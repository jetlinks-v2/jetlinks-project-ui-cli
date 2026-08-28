# @jetlinks-web/components 组件映射

本文件是 `@jetlinks-web/components` 的 AI 导航入口。先按场景定位组件，再打开对应的组件文档核验 Props、事件、插槽和 Rules；不要一次性读取全部组件文档，也不要仅凭目录名推断公开 API。

## 使用流程

1. 根据当前业务场景从下方映射表选择 1～3 个候选组件。
2. 打开候选目录中的 `组件名.md`，确认用途、Props、事件、插槽、示例和限制。
3. 核验 [`components.ts`](components.ts) 是否从包根入口公开导出该能力；根入口导出名可能与目录名不同。
4. 核验目标项目安装的 `@jetlinks-web/components` 版本和相邻页面用法；源码工作区与目标项目依赖版本不一致时，以目标项目实际可用导出为准。
5. 需要确认边界时再读对应组件源码；不得发明文档和源码中不存在的 Props、事件、插槽或子路径。
6. 若 `@jetlinks-web-core/components` 已对同一场景提供项目级封装、权限/i18n/路由适配或稳定组合，优先使用项目级封装；否则直接复用本包的共享基础组件。

## 引入方式

### 根入口具名导入

```ts
import {
  AIcon,
  CardSelect,
  PermissionButton,
  ProTable,
  Search,
} from '@jetlinks-web/components';
```

根入口只公开 [`components.ts`](components.ts) 中列出的导出。`Icon` 目录的根导出名是 `AIcon`，不存在名为 `Icon` 的根导出。

### 整包安装后的全局组件

```ts
import JetLinksComponents from '@jetlinks-web/components';

app.use(JetLinksComponents);
```

整包安装只会安装 `components.ts` 中已公开且带 `install` 的组件。模板中的全局注册名通常以 `J` 开头，例如 `JCardSelect`、`JProTable`、`JSearch`；是否已整包安装，以目标应用入口为准。

### 子路径能力

深层子路径不是默认公共契约。只有根入口没有导出所需能力，并且目标项目当前依赖版本、构建产物和相邻生产代码都证明该子路径稳定可用时，才允许沿用；不要根据源码目录自行拼接 `@jetlinks-web/components/es/...` 路径。

## 场景映射

| 场景 | 候选能力 | 文档 | 根入口 / 全局名 |
| --- | --- | --- | --- |
| 输入联想、可创建选项、标签多选 | `AutoComplete` | [AutoComplete/AutoComplete.md](AutoComplete/AutoComplete.md) | `AutoComplete` / `JAutoComplete` |
| 状态徽标、语义色状态 | `BadgeStatus` | [BadgeStatus/BadgeStatus.md](BadgeStatus/BadgeStatus.md) | `BadgeStatus` / `JBadgeStatus` |
| 卡片式单选、多选、能力选择 | `CardSelect` | [CardSelect/CardSelect.md](CardSelect/CardSelect.md) | `CardSelect` / `JCardSelect` |
| 按钮式单选、多选 | `CheckButton` | [CheckButton/CheckButton.md](CheckButton/CheckButton.md) | `CheckButton` / `JCheckButton` |
| 组件库主题、图标、权限和国际化总配置 | `ConfigProvider` | [ConfigProvider/ConfigProvider.md](ConfigProvider/ConfigProvider.md) | `ConfigProvider` / `JConfigProvider` |
| 可拖动、可缩放弹窗 | `DragModal` | [DragModal/DragModal.md](DragModal/DragModal.md) | `DragModal` / `JDragModal` |
| 大数据量可编辑表格、单元格校验 | `EditTable` | [EditTable/EditTable.md](EditTable/EditTable.md) | `EditTable` / `JEditTable` |
| 文本省略、Tooltip、点击展开 | `Ellipsis` | [Ellipsis/Ellipsis.md](Ellipsis/Ellipsis.md) | `Ellipsis` / `JEllipsis` |
| 空状态 | `Empty` | [Empty/Empty.md](Empty/Empty.md) | `Empty` / `JEmpty` |
| 撑满页面剩余高度 | `FullPage` | [FullPage/FullPage.md](FullPage/FullPage.md) | `FullPage` / `JFullPage` |
| Ant Design 图标、iconfont 图标 | `AIcon` | [Icon/Icon.md](Icon/Icon.md) | `AIcon` / `AIcon` |
| Markdown 内容渲染 | `Markdown` | [Markdown/Markdown.md](Markdown/Markdown.md) | `Markdown` / `JMarkdown` |
| 权限控制按钮、二次确认 | `PermissionButton` | [PermissionButton/PermissionButton.md](PermissionButton/PermissionButton.md) | `PermissionButton` / `JPermissionButton` |
| 应用布局、页面容器 | `ProLayout`、`PageContainer` | [ProLayout/ProLayout.md](ProLayout/ProLayout.md) | `ProLayout`、`PageContainer` / `JProLayout`、`JPageContainer` |
| 请求、分页、行选择、表格/卡片双形态 | `ProTable` | [ProTable/ProTable.md](ProTable/ProTable.md) | `ProTable` / `JProTable` |
| 自定义滚动条 | `Scrollbar` | [Scrollbar/Scrollbar.md](Scrollbar/Scrollbar.md) | `Scrollbar` / `JScrollbar` |
| 配置式搜索、高级组合搜索 | `Search`、`AdvancedSearch` | [Search/Search.md](Search/Search.md) | `Search`、`AdvancedSearch` / `JSearch`、`JAdvancedSearch` |
| 加载占位、业务骨架 | `Skeleton` 及具名骨架 | [Skeleton/Skeleton.md](Skeleton/Skeleton.md) | 非根入口；见“非根入口能力” |
| 时间戳格式化 | `TimeFormat` | [TimeFormat/TimeFormat.md](TimeFormat/TimeFormat.md) | `TimeFormat` / `JTimeFormat` |
| 区块标题、标题右侧操作 | `Title` | [Title/Title.md](Title/Title.md) | `Title` / `JTitle` |
| 按字段类型渲染输入控件 | `ValueItem` | [ValueItem/ValueItem.md](ValueItem/ValueItem.md) | `ValueItem` / `JValueItem` |
| 虚拟滚动表格、树形大数据列表 | `VirtualTable` | [VirtualTable/VirtualTable.md](VirtualTable/VirtualTable.md) | `VirtualTable` / `JVirtualTable` |

## 非根入口能力

以下目录有实现和文档，但未从 [`components.ts`](components.ts) 导出，不能写成 `import { X } from '@jetlinks-web/components'`，也不会被整包安装自动注册：

| 目录 / 能力 | 用途 | 文档 | 使用边界 |
| --- | --- | --- | --- |
| `LocaleProvider` | 为组件子树提供语言包 | [LocaleProvider/LocaleProvider.md](LocaleProvider/LocaleProvider.md) | 包内部基础设施；优先通过根入口 `ConfigProvider` 配置 |
| `LocaleReciver` / `useLocaleReceiver` | 组件内部读取语言包的 Hook | [LocaleReciver/LocaleReciver.md](LocaleReciver/LocaleReciver.md) | 非组件；仅在维护组件包内部国际化时按源码路径使用 |
| `RadioButton` | 网格式受控单选按钮组 | [RadioButton/RadioButton.md](RadioButton/RadioButton.md) | 目录自身有安装器，但根插件不可达；使用前必须核验目标版本的子路径 |
| `Skeleton`、`JSkeleton*` | 通用及场景化骨架屏 | [Skeleton/Skeleton.md](Skeleton/Skeleton.md) | 仅子路径可达；使用前必须核验目标版本和相邻生产用法 |

## 附属导出与深层能力

- `PageContainer` 是 `ProLayout` 的根入口附属导出。
- `AdvancedSearch` 是 `Search` 的根入口附属导出，并由 `Search` 安装器注册为 `JAdvancedSearch`。
- `EditTable` 安装时会附带注册 `JEditTableFormItem`，但该表单项不是根入口具名导出。
- `BadgeStatus/getHexColor`、`ProLayout/LayoutType`、`PermissionButton/DefinedPropsType`、`ProTable/hooks` 等能力存在于目录或深层文件中，不等于包根入口公开 API。
- 深层能力必须以目标项目已存在的生产导入为证据；若没有证据，优先寻找根入口或 `@jetlinks-web-core` 的稳定封装。

## 与 @jetlinks-web-core/components 的边界

| 能力层 | 适合承载 | 查找入口 |
| --- | --- | --- |
| `@jetlinks-web/components` | 跨项目共享的基础组件、表格、搜索、图标、布局、权限按钮、输入与展示控件 | 本文件 → 单组件文档 → `components.ts` → 组件源码 |
| `@jetlinks-web-core/components` | JetLinks 项目级业务组件、共享业务壳、权限/i18n/路由适配、运行时注册和跨组件组合 | `jetlinks-web-core/src/components/index.ts` → 组件源码 → 相邻业务页面 |
| 业务模块局部组件 | 单一业务域的字段、流程、接口和状态编排 | 当前 feature → 当前模块 → 同业务域模块 |

当两层都能满足需求时，优先使用当前项目已经稳定使用的 `@jetlinks-web-core` 封装；不要为了直接使用基础组件而绕过项目级契约。项目级没有对应封装时，优先直接复用 `@jetlinks-web/components`，不要在业务模块再复制一层无职责包装。

## AI 自检

- 是否先打开本映射，再按需读取候选组件文档，而不是全文加载 25 份文档。
- 是否区分了目录名、根导出名和全局注册名。
- 是否核验了 `components.ts`，没有把非根入口目录当成根 API。
- 是否核验目标项目实际安装版本，避免用源码新版本能力生成旧项目代码。
- 是否搜索过相邻生产页面，确认权限、i18n、样式和组合方式。
- 是否优先复用 `@jetlinks-web-core` 已有项目级封装，并避免新增无职责包装组件。
- 是否只在有真实生产证据时使用深层子路径。
