import { Text } from '@dneroswap/uikit'
import getTimePeriods from '@dneroswap/utils/getTimePeriods'
import { useTranslation } from '@dneroswap/localization'

const WithdrawalFeeTimer: React.FC<React.PropsWithChildren<{ secondsRemaining: number }>> = ({ secondsRemaining }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  return (
    <Text bold fontSize="14px">
      {t('%day%d:%hour%h:%minute%m', { day: days, hour: hours, minute: minutes })}
    </Text>
  )
}

export default WithdrawalFeeTimer
