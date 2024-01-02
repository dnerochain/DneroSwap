import BigNumber from 'bignumber.js'

interface FormatiWDnero {
  lockedAmount: any
  duration: number
  ceiling: BigNumber
}

export default function formatIWDnero({ lockedAmount, duration, ceiling }: FormatiWDnero) {
  const durationAsBn = new BigNumber(duration)
  if (durationAsBn.gte(ceiling)) {
    return new BigNumber(lockedAmount).toNumber()
  }

  if (durationAsBn.lt(ceiling) && durationAsBn.gte(0)) {
    return durationAsBn.times(lockedAmount).div(ceiling).toNumber()
  }

  return 0
}
