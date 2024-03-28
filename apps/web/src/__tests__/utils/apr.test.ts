import BigNumber from 'bignumber.js'
import lpAprs from 'config/constants/lpAprs/5647.json'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { ChainId } from '@dneroswap/chains'
import { vi } from 'vitest'

vi.mock('../../config/constants/lpAprs/5647.json', async () => {
  const actual = await vi.importActual('../../config/constants/lpAprs/5647.json')
  // @ts-ignore
  return {
    default: {
      // @ts-ignore
      ...actual.default,
      '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0': 10.5,
    },
  }
})

describe('getPoolApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getPoolApr(null, null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getPoolApr(0, 0, 0, 0)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getPoolApr(10, 1, 100000, 1)
    expect(apr).toEqual(1051.2)
  })
})

describe('getFarmApr', () => {
  it(`returns null when parameters are missing`, () => {
    const { wdneroRewardsApr, lpRewardsApr } = getFarmApr(ChainId.DNERO, null, null, null, null, 40)
    expect(wdneroRewardsApr).toBeNull()
    expect(lpRewardsApr).toEqual(0)
  })
  it(`returns null when APR is infinite`, () => {
    const { wdneroRewardsApr, lpRewardsApr } = getFarmApr(ChainId.DNERO, BIG_ZERO, BIG_ZERO, BIG_ZERO, '', 40)
    expect(wdneroRewardsApr).toBeNull()
    expect(lpRewardsApr).toEqual(0)
  })
  it(`get the correct pool APR`, () => {
    const { wdneroRewardsApr, lpRewardsApr } = getFarmApr(
      ChainId.DNERO,
      BIG_TEN,
      new BigNumber(1),
      new BigNumber(100000),
      '',
      40,
    )
    expect(wdneroRewardsApr).toEqual(4204800)
    expect(lpRewardsApr).toEqual(0)
  })
  it(`get the correct pool APR combined with LP APR`, () => {
    const { wdneroRewardsApr, lpRewardsApr } = getFarmApr(
      ChainId.DNERO,
      BIG_TEN,
      new BigNumber(1),
      new BigNumber(100000),
      '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      40,
    )
    expect(wdneroRewardsApr).toEqual(4204800)
    expect(lpRewardsApr).toEqual(lpAprs['0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'])
  })
})
