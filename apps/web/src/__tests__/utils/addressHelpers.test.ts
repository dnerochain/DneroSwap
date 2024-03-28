import { getAddressFromMap } from 'utils/addressHelpers'

describe('getAddress', () => {
  const address = {
    5647: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    97: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
  } as const

  it(`get address for mainnet (chainId 5647)`, () => {
    const expected = address[5647]
    expect(getAddressFromMap(address, 5647)).toEqual(expected)
  })
  it(`get address for testnet (chainId 97)`, () => {
    const expected = address[97]
    expect(getAddressFromMap(address, 97)).toEqual(expected)
  })
  it(`get address for any other network (chainId 31337)`, () => {
    const expected = address[5647]
    expect(getAddressFromMap(address, 31337)).toEqual(expected)
  })
})
