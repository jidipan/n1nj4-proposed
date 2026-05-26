import { ethers } from 'ethers';
import config from '../config';
import NFT_ABI from "../abi/abi.json" assert { type: "json" };


// EVM 合约交互服务类 (适配 ThirdWeb DropERC721)
export class EvmContractService {
  private readProvider: ethers.JsonRpcProvider | null = null;
  private readContract: ethers.Contract | null = null;

  private async getReadContract(): Promise<ethers.Contract> {
    this.ensureReadProvider();
    if (!this.readContract) {
      throw new Error("只读合约未初始化");
    }
    return this.readContract;
  }

  constructor() {
    // 延迟初始化，等待 window.ethereum 可用
  }

  private getContractAddress() {
    return config.nft.contractAddress;
  }

  private ensureReadProvider() {
    if (this.readProvider && this.readContract) {
      return;
    }

    const rpcUrl = config.chain.node;
    const chainId = config.chain.evmChainId;

    // Injective RPC 不支持批量请求，需要使用 staticNetwork 和禁用批量
    const fetchRequest = new ethers.FetchRequest(rpcUrl);
    this.readProvider = new ethers.JsonRpcProvider(
      fetchRequest,
      chainId,
      { staticNetwork: true, batchMaxCount: 1 }
    );

    this.readContract = new ethers.Contract(
      this.getContractAddress(),
      NFT_ABI,
      this.readProvider
    );
  }

  /**
   * 查询总铸造数量 (使用 totalMinted)
   */
  async getTotalMinted(): Promise<number> {
    try {
      const contract = await this.getReadContract();
      const totalMinted = await contract.totalMinted();
      return Number(totalMinted);
    } catch (error) {
      console.error('查询 totalMinted 失败:', error);
      return 0;
    }
  }

  /**
   * 查询用户已铸造的数量 (基于当前 Claim Condition)
   * @param address 用户地址
   */
  async getMintedCount(address: string): Promise<number> {
    try {
      const contract = await this.getReadContract();
      const conditionId = await contract.getActiveClaimConditionId();
      const supplyClaimed = await contract.getSupplyClaimedByWallet(conditionId, address);
      return Number(supplyClaimed);
    } catch (error) {
      console.error('查询用户铸造数量失败:', error);
      return 0;
    }
  }

  /**
   * 查询每个钱包最大铸造数量 (从当前 Claim Condition 获取)
   */
  async getMaxPerWallet(): Promise<number> {
    return config.nft.maxPerWallet;
  }

}

// 导出单例
export const evmContractService = new EvmContractService();

export default EvmContractService;
