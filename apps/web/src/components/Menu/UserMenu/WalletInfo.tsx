import {
  Box,
  Button,
  Flex,
  InjectedModalProps,
  LinkExternal,
  Message,
  Skeleton,
  Text,
  CopyAddress,
  FlexGap,
  useTooltip,
  TooltipText,
  InfoFilledIcon,
  ScanLink,
} from '@dneroswap/uikit'
import { WNATIVE } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@dneroswap/localization'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useTokenBalance, { useDNEROWDneroBalance } from 'hooks/useTokenBalance'
import { ChainLogo } from 'components/Logo/ChainLogo'

import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { getFullDisplayBalance, formatBigInt } from '@dneroswap/utils/formatBalance'
import { useBalance } from 'wagmi'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { isMobile } from 'react-device-detect'
import { useState } from 'react'
import InternalLink from 'components/Links'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import WDneroBenefitsCard from './WDneroBenefitsCard'

const COLORS = {
  ETH: '#627EEA',
  DTOKEN: '#14151A',
}

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  switchView: (newIndex: number) => void
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId, chain } = useActiveWeb3React()
  const { domainName } = useDomainNameForAddress(account)
  const isDNERO = chainId === ChainId.DNERO
  const dtokenBalance = useBalance({ address: account, chainId: ChainId.DNERO })
  const nativeBalance = useBalance({ address: account, enabled: !isDNERO })
  const native = useNativeCurrency()
  const wNativeToken = !isDNERO ? WNATIVE[chainId] : null
  const wDTOKENToken = WNATIVE[ChainId.DNERO]
  const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(wNativeToken?.address)
  const { balance: wDTOKENBalance, fetchStatus: wDTOKENFetchStatus } = useTokenBalance(wDTOKENToken?.address, true)
  const { balance: wdneroBalance, fetchStatus: wdneroFetchStatus } = useDNEROWDneroBalance()
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }
  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <>
      <Box maxWidth="140px">
        <FlexGap gap="8px" flexDirection="column" justifyContent="space-between">
          <Text as="p">
            {t('%currency% Balance Low. You need %currency% for transaction fees.', {
              currency: native?.symbol,
            })}
          </Text>
          <InternalLink href="/buy-crypto" onClick={() => onDismiss?.()}>
            <Button height="30px">{t('Buy %currency%', { currency: native?.symbol })}</Button>
          </InternalLink>
        </FlexGap>
      </Box>
    </>,
    {
      isInPortal: false,
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    },
  )

  const showDneroEntryPoint = Number(dtokenBalance?.data?.value) === 0 && SUPPORT_BUY_CRYPTO.includes(chainId)
  const showNativeEntryPoint = Number(nativeBalance?.data?.value) === 0 && SUPPORT_BUY_CRYPTO.includes(chainId)

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <FlexGap flexDirection="column" mb="24px" gap="8px">
        <CopyAddress tooltipMessage={t('Copied')} account={account} />
        {domainName ? <Text color="textSubtle">{domainName}</Text> : null}
      </FlexGap>
      {hasLowNativeBalance && SUPPORT_BUY_CRYPTO.includes(chainId) && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">
              {t('%currency% Balance Low', {
                currency: native.symbol,
              })}
            </Text>
            <InternalLink href="/buy-crypto" onClick={() => onDismiss?.()}>
              <Text color="primary">
                {t('You need %currency% for transaction fees.', {
                  currency: native.symbol,
                })}
              </Text>
            </InternalLink>
          </Box>
        </Message>
      )}
      {!isDNERO && chain && (
        <Box mb="12px">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Flex bg={COLORS.ETH} borderRadius="16px" pl="4px" pr="8px" py="2px">
              <ChainLogo chainId={chain.id} />
              <Text color="white" ml="4px">
                {chain.name}
              </Text>
            </Flex>
            <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
              {getBlockExploreName(chainId)}
            </LinkExternal>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">
              {native.symbol} {t('Balance')}
            </Text>
            {!nativeBalance.isFetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Flex>
                <Text
                  color={showNativeEntryPoint ? 'warning' : 'text'}
                  fontWeight={showNativeEntryPoint ? 'bold' : 'normal'}
                >
                  {formatBigInt(nativeBalance?.data?.value ?? 0n, 6)}
                </Text>
                {showNativeEntryPoint ? (
                  <TooltipText
                    ref={buyCryptoTargetRef}
                    onClick={() => setMobileTooltipShow(false)}
                    display="flex"
                    style={{ justifyContent: 'center' }}
                  >
                    <InfoFilledIcon pl="2px" fill="#000" color="#D67E0A" width="22px" />
                  </TooltipText>
                ) : null}
                {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
              </Flex>
            )}
          </Flex>
          {wNativeBalance && wNativeBalance.gt(0) && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">
                {wNativeToken?.symbol} {t('Balance')}
              </Text>
              {wNativeFetchStatus !== FetchStatus.Fetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                wNativeToken?.decimals && (
                  <Text>{getFullDisplayBalance(wNativeBalance, wNativeToken?.decimals, 6)}</Text>
                )
              )}
            </Flex>
          )}
        </Box>
      )}

      <Box mb="24px">
        <Flex justifyContent="space-between" alignItems="center" mb="8px">
          <Flex bg={COLORS.DTOKEN} borderRadius="16px" pl="4px" pr="8px" py="2px">
            <ChainLogo chainId={ChainId.DNERO} />
            <Text color="white" ml="4px">
              DNEROCHAIN
            </Text>
          </Flex>
          <ScanLink useDneroCoinFallback href={getBlockExploreLink(account, 'address', ChainId.DNERO)}>
            {getBlockExploreName(ChainId.DNERO)}
          </ScanLink>
        </Flex>
        {chainId === 56 ? (
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">DTOKEN {t('Balance')}</Text>
            {!dtokenBalance.isFetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Flex alignItems="center" justifyContent="center">
                <Text
                  fontWeight={showDneroEntryPoint ? 'bold' : 'normal'}
                  color={showDneroEntryPoint ? 'warning' : 'normal'}
                >
                  {formatBigInt(dtokenBalance?.data?.value ?? 0n, 6)}
                </Text>
                {showDneroEntryPoint ? (
                  <TooltipText
                    ref={buyCryptoTargetRef}
                    onClick={() => setMobileTooltipShow(false)}
                    display="flex"
                    style={{ justifyContent: 'center' }}
                  >
                    <InfoFilledIcon pl="2px" fill="#000" color="#D67E0A" width="22px" />
                  </TooltipText>
                ) : null}
                {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
              </Flex>
            )}
          </Flex>
        ) : null}
        {wDTOKENBalance.gt(0) && (
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">WDTOKEN {t('Balance')}</Text>
            {wDTOKENFetchStatus !== FetchStatus.Fetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Text>{getFullDisplayBalance(wDTOKENBalance, wDTOKENToken.decimals, 6)}</Text>
            )}
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle">{t('WDNERO Balance')}</Text>
          {wdneroFetchStatus !== FetchStatus.Fetched ? (
            <Skeleton height="22px" width="60px" />
          ) : (
            <Text>{formatBigInt(wdneroBalance, 3)}</Text>
          )}
        </Flex>
      </Box>
      <WDneroBenefitsCard onDismiss={onDismiss} />
      <Button variant="secondary" width="100%" minHeight={48} onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
