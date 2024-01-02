import { Ifo } from '@dneroswap/widgets-internal'
import { ChainId } from '@dneroswap/chains'
import { Button } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import Link from 'next/link'
import { SpaceProps } from 'styled-system'
import { useAccount } from 'wagmi'
import { Address } from 'viem'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { WDNERO } from '@dneroswap/tokens'
import { formatBigInt } from '@dneroswap/utils/formatBalance'

import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ConnectWalletButton from 'components/ConnectWalletButton'

// TODO should be common hooks
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { useIsMigratedToVeWDnero } from 'views/WDneroStaking/hooks/useIsMigratedToVeWDnero'

import { useUserIfoInfo } from '../hooks/useUserIfoInfo'

function NavigateButton(props: SpaceProps) {
  const { t } = useTranslation()

  return (
    <Button width="100%" as={Link} href="/wdnero-staking" {...props}>
      {t('Go to WDNERO Staking')}
    </Button>
  )
}

type Props = {
  ifoAddress?: Address
}

export function VeWDneroCard({ ifoAddress }: Props) {
  const { chainId } = useActiveChainId()
  const { isConnected } = useAccount()
  const wdneroPrice = useWDneroPrice()
  const {
    wdneroUnlockTime: nativeUnlockTime,
    nativeWDneroLockedAmount,
    proxyWDneroLockedAmount,
    wdneroPoolLocked: proxyLocked,
    wdneroPoolUnlockTime: proxyUnlockTime,
    wdneroLocked: nativeLocked,
    shouldMigrate,
  } = useWDneroLockStatus()
  const isMigrated = useIsMigratedToVeWDnero()
  const needMigrate = useMemo(() => shouldMigrate && !isMigrated, [shouldMigrate, isMigrated])
  const totalLockWDnero = useMemo(
    () => Number(formatBigInt(nativeWDneroLockedAmount + proxyWDneroLockedAmount, WDNERO[chainId || ChainId.DNERO].decimals)),
    [nativeWDneroLockedAmount, proxyWDneroLockedAmount, chainId],
  )
  const hasProxyWDneroButNoNativeVeWDnero = useMemo(() => !nativeLocked && proxyLocked, [nativeLocked, proxyLocked])
  const unlockAt = useMemo(() => {
    if (hasProxyWDneroButNoNativeVeWDnero) {
      return proxyUnlockTime
    }
    return nativeUnlockTime
  }, [hasProxyWDneroButNoNativeVeWDnero, nativeUnlockTime, proxyUnlockTime])

  const { snapshotTime, credit, veWDnero } = useUserIfoInfo({ ifoAddress, chainId })
  const creditBN = useMemo(
    () => credit && new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()),
    [credit],
  )
  const hasIWDnero = useMemo(() => creditBN && creditBN.toNumber() > 0, [creditBN])
  const hasVeWDnero = useMemo(() => veWDnero && veWDnero.toNumber() > 0, [veWDnero])

  const header = (
    <>
      <Ifo.MyIWDnero amount={creditBN} />
      <Ifo.IfoSalesLogo hasIWDnero={hasIWDnero} />
    </>
  )

  return (
    <Ifo.VeWDneroCard header={header}>
      <Ifo.MyVeWDnero amount={veWDnero} />
      <Ifo.IWDneroInfo mt="1.5rem" snapshot={snapshotTime} />

      {isConnected && hasIWDnero && totalLockWDnero ? (
        <Ifo.LockInfoCard mt="1.5rem" amount={totalLockWDnero} unlockAt={unlockAt} usdPrice={wdneroPrice} />
      ) : null}

      {isConnected && !hasVeWDnero && !needMigrate && hasProxyWDneroButNoNativeVeWDnero ? (
        <Ifo.InsufficientNativeVeWDneroTips mt="1.5rem" />
      ) : null}

      {isConnected && !hasVeWDnero && !needMigrate && !hasProxyWDneroButNoNativeVeWDnero ? (
        <Ifo.ZeroVeWDneroTips mt="1.5rem" />
      ) : null}

      {needMigrate ? <Ifo.MigrateVeWDneroTips mt="1.5rem" /> : null}
      {isConnected ? <NavigateButton mt="1.5rem" /> : <ConnectWalletButton width="100%" mt="1.5rem" />}
    </Ifo.VeWDneroCard>
  )
}
