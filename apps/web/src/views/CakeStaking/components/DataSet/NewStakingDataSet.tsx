import { useTranslation } from '@dneroswap/localization'
import { AutoRow, Box, Text, TooltipText, useMatchBreakpoints } from '@dneroswap/uikit'
import { getFullDisplayBalance } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import styled from 'styled-components'
import { useRoundedUnlockTimestamp } from 'views/WDneroStaking/hooks/useRoundedUnlockTimestamp'
import { MyVeWDneroCard } from '../MyVeWDneroCard'
import { Tooltips } from '../Tooltips'
import { DataRow } from './DataBox'
import { formatDate } from './format'

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

export const NewStakingDataSet: React.FC<{
  veWDneroAmount?: number
  wdneroAmount?: number
}> = ({ veWDneroAmount = 0, wdneroAmount = 0 }) => {
  const { t } = useTranslation()
  const veWDnero = veWDneroAmount ? getFullDisplayBalance(new BN(veWDneroAmount), 0, 3) : '0'
  const factor = veWDneroAmount && veWDneroAmount ? `${new BN(veWDneroAmount).div(wdneroAmount).toPrecision(2)}x` : '0x'
  const { wdneroLockWeeks } = useLockWDneroData()
  const unlockTimestamp = useRoundedUnlockTimestamp()
  const { isDesktop } = useMatchBreakpoints()
  const unlockOn = useMemo(() => {
    return formatDate(dayjs.unix(Number(unlockTimestamp)))
  }, [unlockTimestamp])
  return (
    <>
      <Text fontSize={12} bold color={isDesktop ? 'textSubtle' : undefined} textTransform="uppercase">
        {t('lock overview')}
      </Text>
      <Box padding={['16px 0', '16px 0', 12]}>
        <MyVeWDneroCard type="row" value={veWDnero} />
        <AutoRow px={['0px', '0px', '16px']} py={['16px', '16px', '12px']} gap="8px">
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle" textTransform="uppercase">
                {t('WDNERO to be locked')}
              </Text>
            }
            value={<ValueText>{wdneroAmount}</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'The ratio factor between the amount of WDNERO locked and the final veWDNERO number. Extend your lock duration for a higher ratio factor.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Factor')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{factor}</ValueText>}
          />
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle">
                {t('Duration')}
              </Text>
            }
            value={<ValueText>{wdneroLockWeeks} weeks</ValueText>}
          />
          <DataRow
            label={
              <Tooltips
                content={t(
                  'Once locked, your WDNERO will be staked in veWDNERO contract until this date. Early withdrawal is not available.',
                )}
              >
                <TooltipText fontSize={14} fontWeight={400} color="textSubtle">
                  {t('Unlock on')}
                </TooltipText>
              </Tooltips>
            }
            value={<ValueText>{unlockOn}</ValueText>}
          />
        </AutoRow>
      </Box>
    </>
  )
}
