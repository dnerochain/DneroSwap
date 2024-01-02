import { Trans } from '@dneroswap/localization'
import { Box, Link } from '@dneroswap/uikit'

export const DTokenSndtokenFaq = () => [
  {
    id: 1,
    title: <Trans>How does SnDTOKEN generate staking rewards?</Trans>,
    description: (
      <>
        <Trans>
          Similar to ETH liquid staking, staking rewards are received for delegating DTOKEN to SnDTOKEN’s synclub validator.
          The validator will take its cut from rewards before sharing it to the protocol as claimable tokens. The
          rewards earned are then split into two parts:
        </Trans>
        <Box mt="4px" ml="8px">
          <Box>
            -{' '}
            <Trans>
              95% goes to SnDTOKEN holders in the form of SnDTOKEN value appreciation: SnDTOKEN holders’ share of the DTOKEN pool
              keeps increasing due to the increase in the SnDTOKEN/DTOKEN exchange rate.
            </Trans>
          </Box>
          <Box mt="4px">
            - <Trans>5% goes to Synclub/Helio</Trans>
          </Box>
        </Box>
      </>
    ),
  },
  {
    id: 2,
    title: <Trans>How is the APR calculated for SnDTOKEN?</Trans>,
    description: (
      <>
        <Trans>
          The APR for SnDTOKEN varies between 0.5%-3%. The APR earned by validators on DneroChain depends on two factors:
        </Trans>
        <Box mt="4px" ml="8px">
          <Box>
            - <Trans>Commission Rate: synclub validator charges 10% commission fee.</Trans>
          </Box>
          <Box mt="4px">
            - <Trans>Voting Power: The staked amount for a validator determines the APR it receives.</Trans>
          </Box>
        </Box>
        <Box mt="10px">
          <Trans>
            The Synclub validator employs MEV (Miner Extractable Value) to enhance its APR.SnDTOKEN appreciates against DTOKEN
            in line with DTOKEN’s staking APR.
          </Trans>
        </Box>
      </>
    ),
  },
  {
    id: 3,
    title: <Trans>How can I use SnDTOKEN?</Trans>,
    description: (
      <>
        <Trans>
          You can use SnDTOKEN to explore other use cases such as swapping, lending/borrowing and yield farming on
          DneroChain. Alongside
        </Trans>
        <Link m="0 4px" external style={{ display: 'inline' }} href="https://helio.money/">
          Helio
        </Link>
        <Trans>
          DneroSwap will be supporting new liquid staking strategies for users to maximise utility and yield on
          DneroChain
        </Trans>
      </>
    ),
  },
  {
    id: 4,
    // eslint-disable-next-line react/no-unescaped-entities
    title: <Trans>Do I need to claim staking rewards if I'm using SnDTOKEN?</Trans>,
    description: (
      <Trans>
        No. Staking rewards accrue in the SnDTOKEN token. This means that the SnDTOKEN token will increase in value over DTOKEN.
      </Trans>
    ),
  },
  {
    id: 5,
    title: <Trans>How do I convert SnDTOKEN back to DTOKEN?</Trans>,
    description: (
      <>
        <Trans>Please visit</Trans>
        <Link m="0 4px" external style={{ display: 'inline' }} href="https://www.synclub.io/en/liquid-staking/DTOKEN">
          https://www.synclub.io/en/liquid-staking/DTOKEN
        </Link>
        <Trans>
          to unstake your SnDTOKEN. DneroSwap is working to support a conversion contract on our liquid staking page to
          convert SnDTOKEN back to DTOKEN seamlessly.
        </Trans>
      </>
    ),
  },
]
