const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: '0x13881',
    token: 'MATIC',
    label: 'Polygon - Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
  },
  {
    id: '0xA',
    token: 'OETH',
    label: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
  },
  {
    id: '0xA4B1',
    token: 'ARB-ETH',
    label: 'Arbitrum',
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
  },
  // {
  //   id: '0xaa36a7',
  //   token: 'ETH',
  //   label: 'Sepolia',
  //   rpcUrl: 'https://rpc.sepolia.org',
  // },
  {
    id: '0x7A69',
    token: 'ETH',
    label: 'Hardhat',
    rpcUrl: 'http://127.0.0.1:8545/',
  }
];

export default chains;