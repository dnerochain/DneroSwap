import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import CompetitionBanner from '../CompetitionBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import GameBanner from '../GameBanner'
import IFOBanner from '../IFOBanner'
import PerpetualBanner from '../PerpetualBanner'
import UserBanner from '../UserBanner'
import VeWDneroBanner from '../VeWDneroBanner'
import WebNotificationBanner from '../WebNotificationBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
import useIsRenderUserBanner from './useIsRenderUserBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  const isRenderIFOBanner = useIsRenderIfoBanner()
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()
  const isRenderUserBanner = useIsRenderUserBanner()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      {
        shouldRender: isRenderIFOBanner,
        banner: <IFOBanner />,
      },
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <WebNotificationBanner /> },
      { shouldRender: true, banner: <VeWDneroBanner /> },
      { shouldRender: true, banner: <GameBanner /> },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
      },
    ]
    return [
      ...NO_SHUFFLE_BANNERS,
      ...shuffle(SHUFFLE_BANNERS),
      {
        // be the last one if harvest value is zero
        shouldRender: isRenderUserBanner.shouldRender && isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
    ]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [isRenderIFOBanner, isRenderCompetitionBanner, isRenderUserBanner])
}
