
import { ethers } from 'ethers';

// --- BLOCKCHAIN CONFIGURATION ---
const PROVIDER_URL = 'https://polygon-mumbai.g.alchemy.com/v2/your-api-key'; 
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
const CONTRACT_ABI = [
  "function verifyOrder(string orderHash) public view returns (uint8 status)",
  "function markOrderPaid(string orderHash) public",
  "function markOrderUsed(string orderHash) public"
];

// Status Enum from Contract
export enum OrderBlockchainStatus {
  PENDING = 0,
  PAID = 1,
  USED = 2,
  INVALID = 3
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private isMock: boolean = true;
  private readonly MOCK_STORAGE_KEY = 'scango_mock_blockchain_v1';

  constructor() {
    if (PROVIDER_URL.includes('your-api-key')) {
      console.warn('Blockchain: Using mock mode because API key is not configured');
      this.isMock = true;
    } else {
      try {
        this.provider = new ethers.JsonRpcProvider(PROVIDER_URL);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
        this.isMock = false;
      } catch (error) {
        console.error('Blockchain initialization failed:', error);
        this.isMock = true;
      }
    }
  }

  private getMockStore(): Record<string, OrderBlockchainStatus> {
    const data = localStorage.getItem(this.MOCK_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveMockStore(store: Record<string, OrderBlockchainStatus>) {
    localStorage.setItem(this.MOCK_STORAGE_KEY, JSON.stringify(store));
  }

  async getOrderStatus(orderHash: string): Promise<OrderBlockchainStatus> {
    if (this.isMock) {
      await new Promise(r => setTimeout(r, 500));
      
      const store = this.getMockStore();
      if (store[orderHash] !== undefined) {
        return store[orderHash];
      }

      if (orderHash.includes('paid')) return OrderBlockchainStatus.PAID;
      if (orderHash.includes('used')) return OrderBlockchainStatus.USED;
      
      return OrderBlockchainStatus.PENDING;
    }

    try {
      const status = await this.contract?.verifyOrder(orderHash);
      return Number(status) as OrderBlockchainStatus;
    } catch (error) {
      console.error('Error fetching from blockchain:', error);
      return OrderBlockchainStatus.INVALID;
    }
  }

  async markPaid(orderHash: string): Promise<boolean> {
    if (this.isMock) {
      console.log(`[Mock Blockchain] Marking ${orderHash} as PAID`);
      const store = this.getMockStore();
      store[orderHash] = OrderBlockchainStatus.PAID;
      this.saveMockStore(store);
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }

    try {
      return true;
    } catch (error) {
      console.error('Blockchain transaction failed:', error);
      return false;
    }
  }

  async markUsed(orderHash: string): Promise<boolean> {
    if (this.isMock) {
      console.log(`[Mock Blockchain] Marking ${orderHash} as USED`);
      const store = this.getMockStore();
      store[orderHash] = OrderBlockchainStatus.USED;
      this.saveMockStore(store);
      await new Promise(r => setTimeout(r, 1000));
      return true;
    }

    try {
      return true;
    } catch (error) {
      console.error('Blockchain transaction failed:', error);
      return false;
    }
  }
}

export const blockchainService = new BlockchainService();
