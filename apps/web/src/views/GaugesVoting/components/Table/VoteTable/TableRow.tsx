import { GAUGE_TYPE_NAMES, GaugeType } from '@dneroswap/gauges'
import { useTranslation } from '@dneroswap/localization'
import { Button, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, FlexGap, Grid, Tag, Text } from '@dneroswap/uikit'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { stringify } from 'viem'
import { Tooltips } from 'views/WDneroStaking/components/Tooltips'
import { useCurrentBlockTimestamp } from 'views/WDneroStaking/hooks/useCurrentBlockTimestamp'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { useUserVote } from 'views/GaugesVoting/hooks/useUserVote'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { TRow } from '../styled'
import { PercentInput } from './PercentInput'
import { useRowVoteState } from './hooks/useRowVoteState'
import { DEFAULT_VOTE, RowProps } from './types'

const debugFormat = (unix?: bigint | number) => {
  if (!unix) return ''
  return dayjs.unix(Number(unix)).format('YYYY-MM-DD HH:mm:ss')
}

export const TableRow: React.FC<RowProps> = ({ data, vote = { ...DEFAULT_VOTE }, onChange }) => {
  const { t } = useTranslation()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { wdneroLockedAmount } = useWDneroLockStatus()
  const wdneroLocked = useMemo(() => wdneroLockedAmount > 0n, [wdneroLockedAmount])
  const userVote = useUserVote(data)
  const {
    currentVoteWeight,
    currentVotePercent,
    previewVoteWeight,
    voteValue,
    voteLocked,
    willUnlock,
    proxyVeWDneroBalance,
    changeHighlight,
  } = useRowVoteState({
    data,
    vote,
    onChange,
  })
  const onMax = () => {
    onChange(vote, true)
  }

  return (
    <TRow>
      <Grid gridTemplateColumns="1fr 1fr" justifyContent="space-between" width="100%">
        <FlexGap alignItems="center" gap="13px">
          <Tooltips
            disabled={!(window.location.hostname === 'localhost' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview')}
            content={
              <pre>
                {stringify(
                  {
                    ...userVote,
                    currentTimestamp: debugFormat(currentTimestamp),
                    nativeLasVoteTime: debugFormat(userVote?.nativeLastVoteTime),
                    proxyLastVoteTime: debugFormat(userVote?.proxyLastVoteTime),
                    lastVoteTime: debugFormat(userVote?.lastVoteTime),
                    end: debugFormat(userVote?.end),
                    proxyEnd: debugFormat(userVote?.proxyEnd),
                    nativeEnd: debugFormat(userVote?.nativeEnd),
                    proxyVeWDneroBalance: proxyVeWDneroBalance?.toString(),
                  },
                  undefined,
                  2,
                )}
              </pre>
            }
          >
            <GaugeTokenImage gauge={data} />
          </Tooltips>
          <Text fontWeight={600} fontSize={16}>
            {data.pairName}
          </Text>
        </FlexGap>
        <FlexGap gap="5px" alignItems="center">
          <NetworkBadge chainId={Number(data.chainId)} />
          {/* {[GaugeType.V3, GaugeType.V2].includes(data.type) ? ( */}
          {GaugeType.V3 === data.type || GaugeType.V2 === data.type ? (
            <Tag outline variant="secondary">
              {feeTierPercent(data.feeTier)}
            </Tag>
          ) : null}

          <Tag variant="secondary">{data ? GAUGE_TYPE_NAMES[data.type] : ''}</Tag>
        </FlexGap>
      </Grid>
      <FlexGap alignItems="center" justifyContent="center" gap="4px">
        <Text bold>{currentVoteWeight}</Text>
        <Text>{currentVotePercent ? ` (${currentVotePercent}%)` : null}</Text>
      </FlexGap>
      <Flex alignItems="center" pr="25px">
        {voteLocked ? (
          <Tooltips
            content={t(
              'Gauge’s vote can not be changed more frequent than 10 days. You can update your vote for this gauge in: %distance%',
              {
                distance: userVote?.lastVoteTime
                  ? dayjs.unix(Number(userVote?.lastVoteTime)).add(10, 'day').from(dayjs.unix(currentTimestamp), true)
                  : '',
              },
            )}
          >
            <ErrorIcon height="20px" color="warning" mb="-2px" mr="2px" />
          </Tooltips>
        ) : null}
        <Text
          bold={changeHighlight}
          color={voteLocked || willUnlock || !wdneroLocked ? (changeHighlight ? 'textSubtle' : 'textDisabled') : ''}
        >
          {previewVoteWeight} veWDNERO
        </Text>
      </Flex>
      <Flex>
        <PercentInput
          disabled={voteLocked || willUnlock || !wdneroLocked}
          inputProps={{ disabled: voteLocked || willUnlock || !wdneroLocked }}
          onMax={onMax}
          value={voteValue}
          onUserInput={(v) => onChange({ ...vote!, power: v })}
        />
      </Flex>
    </TRow>
  )
}

export const ExpandRow: React.FC<{
  onCollapse?: () => void
  text?: string
  expandedText?: string
}> = ({ onCollapse, text, expandedText }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const handleCollapse = useCallback(() => {
    setExpanded((prev) => !prev)
    onCollapse?.()
  }, [onCollapse])
  const textToDisplay = expanded ? expandedText || t('Collapse') : text || t('Expand')

  return (
    <Flex alignItems="center" justifyContent="center" py="8px">
      <Button
        onClick={handleCollapse}
        variant="text"
        endIcon={expanded ? <ChevronUpIcon color="primary" /> : <ChevronDownIcon color="primary" />}
      >
        {textToDisplay}
      </Button>
    </Flex>
  )
}
