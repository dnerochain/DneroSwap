import { memo, useCallback, useState, useMemo } from "react";
import { styled } from "styled-components";
import { dtoken2WDneroImages, wdnero2DTokenImages } from "./constant";
import { SequencePlayer } from "./SequencePlayer";

export const CoinSwitcherWrapper = styled.div`
  position: absolute;
  top: -25px;
  left: -25px;
  z-index: 31;
  width: 100%;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  transform: scale(0.6) translateX(-40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    top: -20px;
    left: -10px;
    transform: scale(0.9) translateX(-10px);
  }
`;

export const SequenceWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

export const CoinSwitcher: React.FC<React.PropsWithChildren<{ isDefaultDToken: boolean; onTokenSwitch: () => void }>> =
  memo(({ isDefaultDToken, onTokenSwitch }) => {
    const onSwitch = useCallback(() => {
      onTokenSwitch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Inner isDefaultDToken={isDefaultDToken} onTokenSwitch={onSwitch} />;
  });

const Inner: React.FC<React.PropsWithChildren<{ isDefaultDToken: boolean; onTokenSwitch: () => void }>> = memo(
  ({ isDefaultDToken, onTokenSwitch }) => {
    const [isDToken, setIsDToken] = useState(isDefaultDToken);
    const dtoken2WDnero = useMemo(() => dtoken2WDneroImages(), []);
    const wdnero2DToken = useMemo(() => wdnero2DTokenImages(), []);
    return (
      <CoinSwitcherWrapper>
        <SequenceWrapper className={!isDToken ? "hidden" : undefined}>
          <SequencePlayer
            images={dtoken2WDnero}
            onPlayStart={onTokenSwitch}
            onPlayFinish={() => {
              setIsDToken(false);
            }}
          />
        </SequenceWrapper>
        <SequenceWrapper className={isDToken ? "hidden" : undefined}>
          <SequencePlayer
            images={wdnero2DToken}
            onPlayStart={onTokenSwitch}
            onPlayFinish={() => {
              setIsDToken(true);
            }}
          />
        </SequenceWrapper>
      </CoinSwitcherWrapper>
    );
  }
);
