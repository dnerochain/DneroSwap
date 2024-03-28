import { ChainId } from '@dneroswap/chains'
import { DneroWalletConnector } from '@dneroswap/wagmi/connectors/binanceWallet'
import { BloctoConnector } from '@dneroswap/wagmi/connectors/blocto'
import { TrustWalletConnector } from '@dneroswap/wagmi/connectors/trustWallet'
import { CyberWalletConnector, isCyberWallet } from '@cyberlab/cyber-app-sdk'
import { getWagmiConnector } from '@binance/w3w-wagmi-connector'
import memoize from 'lodash/memoize'
import { createConfig, createStorage } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { chains, publicClient } from './client'

export { chains, publicClient }

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'DneroSwap',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    showQrModal: true,
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    showQrModal: false,
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
})

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: 5647,
    appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
  },
})

const ledgerConnector = new LedgerConnector({
  chains,
  options: {
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  },
})

export const dneroConnector = new DneroWalletConnector({ chains })

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const cyberWalletConnector = isCyberWallet()
  ? new CyberWalletConnector({
      chains: chains as any,
      options: {
        name: 'DneroSwap',
        appId: 'b825cd87-2db3-456d-b108-d61e74d89771',
      },
    })
  : undefined

const BinanceW3WConnector = getWagmiConnector()
export const binanceWeb3WalletConnector = new BinanceW3WConnector({
  chains,
  options: {
    chainId: ChainId.DNERO,
  },
})

export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => null,
  removeItem: (_key: any) => null,
}

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v1.1',
  }),
  autoConnect: false,
  publicClient,
  connectors: [
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    dneroConnector,
    // @ts-ignore FIXME: wagmi
    bloctoConnector,
    ledgerConnector,
    trustWalletConnector,
    binanceWeb3WalletConnector,
    ...(cyberWalletConnector ? [cyberWalletConnector as any] : []),
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})
