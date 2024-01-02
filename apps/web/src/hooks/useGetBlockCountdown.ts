import { useEffect, useRef, useState } from 'react'
import { DNERO_BLOCK_TIME } from 'config'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@dneroswap/chains'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    const startCountdown = async () => {
      const dneroClient = publicClient({ chainId: ChainId.DNERO })
      const currentBlock = await dneroClient.getBlockNumber()

      if (blockNumber > currentBlock) {
        setSecondsRemaining((blockNumber - Number(currentBlock)) * DNERO_BLOCK_TIME)

        // Clear previous interval
        if (timer.current) {
          clearInterval(timer.current)
        }

        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => {
            if (prevSecondsRemaining === 1) {
              clearInterval(timer.current)
            }

            return prevSecondsRemaining - 1
          })
        }, 1000)
      }
    }

    startCountdown()

    return () => {
      clearInterval(timer.current)
    }
  }, [setSecondsRemaining, blockNumber, timer])

  return secondsRemaining
}

export default useBlockCountdown
