import {
  roundBaseFields as roundBaseFieldsDTOKEN,
  betBaseFields as betBaseFieldsDTOKEN,
  userBaseFields as userBaseFieldsDTOKEN,
} from './dtokenQueries'
import {
  roundBaseFields as roundBaseFieldsWDNERO,
  betBaseFields as betBaseFieldsWDNERO,
  userBaseFields as userBaseFieldsWDNERO,
} from './wdneroQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'WDNERO' ? roundBaseFieldsWDNERO : roundBaseFieldsDTOKEN

export const getBetBaseFields = (tokenSymbol: string) => (tokenSymbol === 'WDNERO' ? betBaseFieldsWDNERO : betBaseFieldsDTOKEN)

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'WDNERO' ? userBaseFieldsWDNERO : userBaseFieldsDTOKEN
