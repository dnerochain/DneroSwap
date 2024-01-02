import { Flex, ModalV2 } from '@dneroswap/uikit'
import { FarmWidget } from '@dneroswap/widgets-internal'
import { formatBigInt } from '@dneroswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { TokenPairImage } from 'components/TokenImage'
import { useMemo, useState } from 'react'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import FarmV3CardList from 'views/Farms/components/FarmCard/V3/FarmV3CardList'
import { V3Farm } from 'views/Farms/FarmsV3'
import { useFarmsV3BatchHarvest } from 'views/Farms/hooks/v3/useFarmV3Actions'

const { AvailableFarming, TotalStakedBalance, ViewAllFarmModal } = FarmWidget.FarmV3Card

interface FarmInfoProps {
  farm: V3Farm
  isReady: boolean
  onAddLiquidity: () => void
}

const FarmInfo: React.FunctionComponent<React.PropsWithChildren<FarmInfoProps>> = ({
  farm,
  isReady,
  onAddLiquidity,
}) => {
  const wdneroPrice = useWDneroPrice()
  const [show, setShow] = useState(false)

  const inactive = farm.multiplier === '0X'

  const { lpSymbol, token, quoteToken, multiplier, stakedPositions, unstakedPositions, pendingWDneroByTokenIds } = farm

  const onlyOnePosition = useMemo(
    () => new BigNumber(stakedPositions.length).plus(unstakedPositions.length).eq(1),
    [stakedPositions, unstakedPositions],
  )

  const hasEarningTokenIds = useMemo(
    () =>
      Object.entries(pendingWDneroByTokenIds)
        .filter(([, value]) => value > 0)
        .map(([key]) => key),
    [pendingWDneroByTokenIds],
  )

  const totalEarnings = useMemo(
    () =>
      +formatBigInt(
        Object.values(pendingWDneroByTokenIds).reduce((total, vault) => total + vault, 0n),
        4,
      ),
    [pendingWDneroByTokenIds],
  )

  const { harvesting, onHarvestAll } = useFarmsV3BatchHarvest()

  const earningsBusd = useMemo(
    () => new BigNumber(totalEarnings).times(wdneroPrice).toNumber(),
    [wdneroPrice, totalEarnings],
  )

  return (
    <Flex flexDirection="column">
      {onlyOnePosition ? (
        <FarmV3CardList farm={farm} />
      ) : (
        <>
          {!inactive && unstakedPositions.length > 0 && (
            <AvailableFarming
              lpSymbol={lpSymbol}
              unstakedPositions={unstakedPositions}
              onClickViewAllButton={() => {
                setShow(true)
                setTimeout(() => {
                  document.getElementById(`${farm.pid}-farm-v3-available`)?.scrollIntoView()
                })
              }}
            />
          )}
          {stakedPositions.length > 0 && (
            <TotalStakedBalance
              stakedPositions={stakedPositions}
              earnings={totalEarnings}
              earningsBusd={earningsBusd}
              onClickViewAllButton={() => {
                setShow(true)
                setTimeout(() => {
                  document.getElementById(`${farm.pid}-farm-v3-staking`)?.scrollIntoView()
                })
              }}
            />
          )}
        </>
      )}
      <ModalV2 isOpen={show} onDismiss={() => setShow(false)} closeOnOverlayClick>
        <ViewAllFarmModal
          title={lpSymbol}
          isReady={isReady}
          lpSymbol={lpSymbol}
          multiplier={multiplier}
          boosted={farm.boosted}
          feeAmount={farm.feeAmount}
          onAddLiquidity={onAddLiquidity}
          tokenPairImage={
            <TokenPairImage
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
              width={32}
              height={32}
            />
          }
          onHarvestAll={hasEarningTokenIds.length > 1 ? () => onHarvestAll(hasEarningTokenIds) : undefined}
          harvesting={harvesting}
          onDismiss={() => setShow(false)}
        >
          <Flex flexDirection="column">
            <FarmV3CardList farm={farm} onDismiss={() => setShow(false)} harvesting={harvesting} />
          </Flex>
        </ViewAllFarmModal>
      </ModalV2>
    </Flex>
  )
}

export default FarmInfo
