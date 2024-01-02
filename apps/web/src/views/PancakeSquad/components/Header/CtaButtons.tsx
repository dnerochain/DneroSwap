/* eslint-disable react-hooks/exhaustive-deps */

import { Flex } from '@dneroswap/uikit'
import { Address } from 'wagmi'
import { ContextApi } from '@dneroswap/localization'
import { DefaultTheme } from 'styled-components'
import { SaleStatusEnum, UserStatusEnum } from '../../types'
import BuyTicketsButtons from '../Buttons/BuyTickets'
import MintButton from '../Buttons/Mint'
import EndEventButtons from '../Buttons/EndEvent'
import ActivateProfileButton from '../Buttons/ActivateProfile'
import { getCurrentButton } from './utils'
import { ButtonsEnum } from './types'

export type CtaButtonsProps = {
  t: ContextApi['t']
  account: Address
  saleStatus: SaleStatusEnum
  userStatus: UserStatusEnum
  theme: DefaultTheme
  canClaimForGen0: boolean
  maxPerAddress: number
  maxPerTransaction: number
  numberTicketsOfUser: number
  numberTicketsForGen0: number
  numberTicketsUsedForGen0: number
  maxSupply: number
  totalSupplyMinted: number
  numberTokensOfUser: number
  startTimestamp: number
  wdneroBalance: bigint
  pricePerTicket: bigint
  ticketsOfUser: bigint[]
}

const CtaButtons: React.FC<React.PropsWithChildren<CtaButtonsProps>> = ({
  t,
  account,
  saleStatus,
  userStatus,
  theme,
  canClaimForGen0,
  maxPerAddress,
  maxPerTransaction,
  numberTicketsOfUser,
  numberTicketsForGen0,
  numberTicketsUsedForGen0,
  numberTokensOfUser,
  startTimestamp,
  maxSupply,
  totalSupplyMinted,
  wdneroBalance,
  pricePerTicket,
  ticketsOfUser,
}) => {
  const buttonType = getCurrentButton({ numberTicketsOfUser, saleStatus, userStatus })
  return (
    <>
      <Flex>
        {buttonType === ButtonsEnum.ACTIVATE && <ActivateProfileButton userStatus={userStatus} t={t} />}
        {buttonType === ButtonsEnum.BUY && (
          <BuyTicketsButtons
            t={t}
            account={account}
            theme={theme}
            userStatus={userStatus}
            saleStatus={saleStatus}
            canClaimForGen0={canClaimForGen0}
            maxPerAddress={maxPerAddress}
            numberTicketsOfUser={numberTicketsOfUser}
            numberTicketsUsedForGen0={numberTicketsUsedForGen0}
            wdneroBalance={wdneroBalance}
            maxPerTransaction={maxPerTransaction}
            numberTicketsForGen0={numberTicketsForGen0}
            pricePerTicket={pricePerTicket}
            startTimestamp={startTimestamp}
          />
        )}
        {buttonType === ButtonsEnum.MINT && (
          <MintButton
            t={t}
            theme={theme}
            saleStatus={saleStatus}
            numberTicketsOfUser={numberTicketsOfUser}
            numberTokensOfUser={numberTokensOfUser}
            ticketsOfUser={ticketsOfUser}
          />
        )}
        {buttonType === ButtonsEnum.END && (
          <EndEventButtons
            t={t}
            account={account}
            saleStatus={saleStatus}
            userStatus={userStatus}
            maxSupply={maxSupply}
            totalSupplyMinted={totalSupplyMinted}
            numberTokensOfUser={numberTokensOfUser}
          />
        )}
      </Flex>
    </>
  )
}

export default CtaButtons
