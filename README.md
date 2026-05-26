# Ninja NFT 前端完整文档

这是一个基于 Injective 区块链的 NFT 铸造前端应用的完整文档。

## 📋 目录

1. [快速开始](#-快速开始)
2. [项目结构](#-项目结构)
3. [组件说明](#-组件说明)
4. [钱包配置](#-钱包配置)
5. [合约集成](#-合约集成)
6. [自定义指南](#-自定义指南)
7. [部署上线](#-部署上线)
8. [常见问题](#-常见问题)

---

## 🚀 快速开始

### 前置要求

- ✅ Node.js 16+ 已安装
- ✅ 已安装 Keplr 钱包浏览器扩展
- ✅ 依赖已经安装完成

### 第一步：运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173)

### 第二步：配置合约地址

打开 `src/config.ts` 文件：

```typescript
export const config = {
  network: Network.Testnet,

  nft: {
    contractAddress: "inj1...", // 🔴 改成你的合约地址
    maxSupply: 10000,
    maxPerWallet: 10,
  },
};
```

### 第三步：测试功能

1. 点击"连接钱包"按钮
2. 选择钱包类型（Keplr 或 MetaMask 小狐狸）
3. 在钱包中批准连接
4. 选择铸造数量
5. 点击"铸造"按钮

---

## 📁 项目结构

```
src/
├── components/           # 📦 组件目录（已模块化）
│   ├── Header.tsx       # 头部 + 钱包连接
│   ├── NFTPreview.tsx   # NFT 预览卡片
│   ├── StatsGrid.tsx    # 统计数据
│   ├── MintSection.tsx  # 铸造功能
│   ├── Message.tsx      # 消息提示
│   ├── Features.tsx     # 特性展示
│   ├── Footer.tsx       # 页脚
│   └── index.ts         # 统一导出
│
├── utils/
│   └── contract.ts      # 合约交互工具
│
├── App.tsx              # 主应用
├── App.css              # 主样式
├── config.ts            # ⚙️ 配置文件
└── main.tsx             # 入口文件
```

---

## 📦 组件说明

### Header 组件

**功能**：显示 Logo 和钱包连接按钮

**Props**：

```typescript
{
  isConnected: boolean    // 钱包是否连接
  address: string         // 钱包地址
  loading: boolean        // 加载状态
  onConnect: () => void   // 连接回调
  onDisconnect: () => void // 断开回调
}
```

**自定义**：

- 修改 Logo：编辑 `Header.tsx` 中的 `<h1>Ninja NFT</h1>`
- 修改图标：编辑 `<span className="ninja-icon">🥷</span>`

### NFTPreview 组件

**功能**：显示 NFT 预览卡片（带动画）

**自定义**：

- 替换图标：将 emoji 改为 `<img src="/nft.png" />`
- 修改动画：编辑 `NFTPreview.css` 中的 keyframes

### StatsGrid 组件

**功能**：显示统计信息（已铸造/总量、用户铸造量、价格）

**Props**：

```typescript
{
  totalMinted: number; // 已铸造数
  maxSupply: number; // 总供应量
  userMinted: number; // 用户已铸造
  maxPerWallet: number; // 每钱包限额
}
```

### MintSection 组件

**功能**：数量选择器 + 铸造按钮

**Props**：

```typescript
{
  isConnected: boolean    // 是否连接钱包
  loading: boolean        // 加载状态
  maxPerWallet: number    // 最大铸造量
  onMint: (quantity: number) => void // 铸造回调
}
```

### Message 组件

**功能**：显示成功/错误消息（自动判断类型）

### Features 组件

**功能**：显示项目特性

**自定义**：添加新特性卡片

```tsx
<div className="feature-card">
  <span className="feature-icon">🚀</span>
  <h4>新特性标题</h4>
  <p>新特性描述</p>
</div>
```

### Footer 组件

**功能**：页面底部信息

### WalletModal 组件

**功能**：钱包选择弹窗（支持 Keplr 和 MetaMask）

**Props**：

```typescript
{
  isOpen: boolean                      // 是否显示弹窗
  onClose: () => void                  // 关闭回调
  onSelectWallet: (walletType: 'keplr' | 'metamask') => void // 选择钱包回调
}
```

**特性**：

- 🔮 支持 Keplr 钱包
- 🦊 支持 MetaMask（小狐狸）钱包
- 自动检测钱包是否已安装
- 提供钱包下载链接

---

## 🔌 钱包配置

### 支持的钱包

本项目支持两种钱包：

1. **🔮 Keplr 钱包** - Cosmos 生态专用钱包

   - 下载：https://www.keplr.app/
   - 原生支持 Injective 链

2. **🦊 MetaMask（小狐狸）钱包** - 以太坊及兼容链钱包
   - 下载：https://metamask.io/
   - 通过 Injective EVM 兼容层支持

### Keplr 钱包配置

```typescript
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { ChainId } from "@injectivelabs/ts-types";

const strategy = new WalletStrategy({
  chainId: ChainId.Testnet,
} as any);
```

### MetaMask 钱包配置

```typescript
import { WalletStrategy } from "@injectivelabs/wallet-strategy";
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";

const strategy = new WalletStrategy({
  chainId: ChainId.Testnet,
  ethereumOptions: {
    ethereumChainId: EthereumChainId.Goerli,
  },
} as any);
```

### 连接钱包流程

项目已实现自动钱包选择：

1. 用户点击"连接钱包"
2. 弹出钱包选择弹窗
3. 用户选择 Keplr 或 MetaMask
4. 自动检测钱包是否已安装
5. 连接并获取地址

```typescript
// 自动处理，无需手动配置
const handleSelectWallet = async (walletType: "keplr" | "metamask") => {
  // 检查钱包安装
  if (walletType === "keplr" && !window.keplr) {
    alert("请先安装 Keplr 钱包");
    return;
  }

  if (walletType === "metamask" && !window.ethereum) {
    alert("请先安装 MetaMask 钱包");
    return;
  }

  // 初始化并连接
  const strategy = await initWalletStrategy(walletType);
  const addresses = await strategy.getAddresses();
  // ...
};
```

### 常见错误处理

**错误：钱包未安装**

```typescript
// Keplr 未安装
if (!window.keplr) {
  alert("请安装 Keplr 钱包: https://www.keplr.app/");
  window.open("https://www.keplr.app/", "_blank");
}

// MetaMask 未安装
if (!window.ethereum) {
  alert("请安装 MetaMask 钱包: https://metamask.io/");
  window.open("https://metamask.io/", "_blank");
}
```

**错误：用户拒绝连接**

```typescript
catch (error) {
  if (error.message.includes('User rejected')) {
    alert('您拒绝了连接请求，请重试')
  }
}
```

**错误：网络不匹配**

```typescript
// MetaMask 需要切换网络
if (walletType === "metamask") {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }], // Goerli 测试网
  });
}
```

---

## 🔗 合约集成

### 配置合约地址

编辑 `src/config.ts`：

```typescript
export const config = {
  network: Network.Testnet, // 或 Network.Mainnet

  nft: {
    contractAddress: "inj1...", // 你的合约地址
    maxSupply: 10000,
    maxPerWallet: 10,
    name: "Ninja NFT",
    symbol: "NINJA",
  },
};
```

### 实现合约交互

编辑 `src/utils/contract.ts`：

```typescript
import { MsgExecuteContractCompat } from "@injectivelabs/sdk-ts";

export class ContractService {
  async mint(quantity: number, senderAddress: string) {
    const msg = {
      mint: {
        quantity: quantity,
      },
    };

    const executeMsg = MsgExecuteContractCompat.fromJSON({
      sender: senderAddress,
      contractAddress: this.contractAddress,
      msg,
      funds: [], // 免费mint
    });

    const response = await this.walletStrategy.sendTransaction(executeMsg, {
      address: senderAddress,
    });

    return response;
  }
}
```

### 在 App.tsx 中使用

```typescript
import ContractService from "./utils/contract";

const handleMint = async (quantity: number) => {
  const contractService = new ContractService(walletStrategy);
  await contractService.mint(quantity, address);
};
```

---

## 🎨 自定义指南

### 修改项目名称

1. `src/components/Header.tsx` - 修改 `<h1>Ninja NFT</h1>`
2. `package.json` - 修改 `"name": "ninjanft"`
3. `index.html` - 修改 `<title>`

### 修改主题颜色

在各组件的 CSS 文件中搜索并替换：

```css
/* 主渐变色 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 改成你的颜色 */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### 使用 CSS 变量（推荐）

在 `src/index.css` 中添加：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --border-radius: 12px;
}
```

然后在组件中使用：

```css
.button {
  background: var(--primary-color);
  border-radius: var(--border-radius);
}
```

### 修改 NFT 图片

替换 `NFTPreview.tsx` 中的 emoji：

```tsx
// 使用 emoji
<span className="ninja-emoji">🥷</span>

// 改为图片
<img src="/path/to/nft.png" alt="NFT" className="nft-img" />
```

### 添加新组件

1. 在 `src/components/` 创建文件：

```tsx
// MyComponent.tsx
import "./MyComponent.css";

function MyComponent() {
  return <div className="my-component">内容</div>;
}

export default MyComponent;
```

2. 创建 CSS 文件：`MyComponent.css`

3. 在 `index.ts` 中导出：

```typescript
export { default as MyComponent } from "./MyComponent";
```

4. 在 `App.tsx` 中使用：

```tsx
import { MyComponent } from "./components";
```

---

## 🌐 部署上线

### 构建生产版本

```bash
npm run build
```

生成的文件在 `dist/` 目录。

### 部署到 Vercel（推荐）

#### 方法 1：通过 CLI

```bash
npm install -g vercel
vercel login
vercel
```

#### 方法 2：通过网站

1. 访问 [vercel.com](https://vercel.com)
2. 导入 Git 仓库
3. 配置：
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 点击 Deploy

### 部署到 Netlify

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

或通过 [netlify.com](https://netlify.com) 网站部署。

### 环境变量配置

创建 `.env.production`：

```env
VITE_CONTRACT_ADDRESS=inj1...
VITE_NETWORK=mainnet
VITE_MAX_SUPPLY=10000
```

在代码中使用：

```typescript
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
```

### 部署检查清单

- [ ] 合约地址已更新
- [ ] 网络设置正确（主网/测试网）
- [ ] 在测试网测试过所有功能
- [ ] 钱包连接正常
- [ ] 铸造功能正常
- [ ] 响应式设计正常
- [ ] 没有控制台错误

---

## 🐛 常见问题

### Q: 页面无法加载？

**A**: 检查：

1. Node.js 版本 >= 16
2. 运行 `npm install` 重新安装依赖
3. 端口 5173 是否被占用

### Q: 钱包连接失败？

**A**: 确保：

1. 已安装对应的钱包扩展（Keplr 或 MetaMask）
2. 钱包已解锁
3. 网络配置正确
4. 查看浏览器控制台的错误信息

**针对 MetaMask 用户**：

- 确保已添加 Injective 网络配置
- 检查是否在正确的网络上
- 尝试刷新页面重新连接

### Q: 如何修改网络（测试网/主网）？

**A**: 在 `src/config.ts` 中修改：

```typescript
network: Network.Mainnet, // 主网
// 或
network: Network.Testnet, // 测试网
```

### Q: 如何调试？

**A**:

1. 打开浏览器开发者工具（F12）
2. 查看 Console 面板的错误信息
3. 使用 Network 面板查看网络请求
4. 使用 `console.log()` 输出调试信息

### Q: 合约调用失败？

**A**: 检查：

1. 合约地址是否正确
2. 钱包是否有足够的 gas 费
3. 合约方法名是否正确
4. 参数格式是否正确

### Q: 样式不生效？

**A**: 确保：

1. CSS 文件已在组件中导入
2. 类名拼写正确
3. 没有被其他样式覆盖

### Q: 如何添加新页面？

**A**: 使用 React Router：

```bash
npm install react-router-dom
```

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📚 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Injective SDK** - 区块链交互
  - `@injectivelabs/sdk-ts` - 核心 SDK
  - `@injectivelabs/wallet-strategy` - 钱包集成
  - `@injectivelabs/networks` - 网络配置

## 🔄 开发流程

1. 启动开发服务器：`npm run dev`
2. 修改代码（自动热重载）
3. 在浏览器测试功能
4. 构建生产版本：`npm run build`
5. 部署到服务器

## 💡 最佳实践

1. **保持组件小而专注** - 每个组件只做一件事
2. **使用 TypeScript** - 定义清晰的类型
3. **分离样式** - 每个组件独立的 CSS
4. **响应式优先** - 确保移动端体验
5. **测试再部署** - 在测试网充分测试

## 🆘 获取帮助

- [Injective 官方文档](https://docs.injective.network/)
- [Injective SDK 文档](https://docs.ts.injective.network/)
- [Injective Discord](https://discord.gg/injective)
- [Keplr 钱包文档](https://docs.keplr.app/)

## 📝 待办事项

### 基础功能

- [x] 创建组件结构
- [x] 实现钱包连接 UI
- [ ] 集成真实合约
- [ ] 测试所有功能

### 高级功能（可选）

- [ ] 用户个人页面
- [ ] 稀有度展示
- [ ] 交易历史
- [ ] 白名单功能
- [ ] 多语言支持

## 📄 许可证

MIT

---

**祝你构建成功！** 🎉

如有问题，查看上面的常见问题部分或在社区寻求帮助。
