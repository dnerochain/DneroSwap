import { WETH9, WDTOKEN, ERC20Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { USDT, USDC } from './common'

export const opDneroTestnetTokens = {
  wdtoken: WDTOKEN[ChainId.OPDNERO_TESTNET],
  weth: WETH9[ChainId.OPDNERO_TESTNET],
  usdc: USDC[ChainId.OPDNERO_TESTNET],
  usdt: USDT[ChainId.OPDNERO_TESTNET],
  mockA: new ERC20Token(ChainId.OPDNERO_TESTNET, '0x394d64eD40a6aF892D8562eE816D5e71D8999E52', 18, 'A', 'MOCK Token A'),
  mockB: new ERC20Token(ChainId.OPDNERO_TESTNET, '0x232e111381abc519777BD9f09b2A38B60e244D06', 18, 'B', 'MOCK Token B'),
  mockC: new ERC20Token(ChainId.OPDNERO_TESTNET, '0x2B01BD26B57f2A4E3d715ccCD9e954A52b4C855E', 18, 'C', 'MOCK Token C'),
}
