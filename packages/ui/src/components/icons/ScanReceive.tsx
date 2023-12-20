import { Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

export const [ScanReceive, AnimatedScanReceive] = createIcon({
  name: 'ScanReceive',
  getIcon: (props) => (
    <Svg fill="none" viewBox="0 0 21 20" {...props}>
      <Path
        d="M6.33221 1H3.33221C2.80178 1 2.29307 1.21071 1.918 1.58579C1.54293 1.96086 1.33221 2.46957 1.33221 3V6M19.3322 6V3C19.3322 2.46957 19.1215 1.96086 18.7464 1.58579C18.3714 1.21071 17.8626 1 17.3322 1H14.3322M14.3322 19H17.3322C17.8626 19 18.3714 18.7893 18.7464 18.4142C19.1215 18.0391 19.3322 17.5304 19.3322 17V14M1.33221 14V17C1.33221 17.5304 1.54293 18.0391 1.918 18.4142C2.29307 18.7893 2.80178 19 3.33221 19H6.33221"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <Path
        d="M4.75432 6.00144C4.77668 4.99678 5.42425 4.24087 6.42775 4.18755C6.69625 4.17328 7.00705 4.16455 7.36563 4.16455C7.72422 4.16455 8.03501 4.17328 8.30351 4.18755C9.30701 4.24087 9.95458 4.99678 9.97694 6.00144C9.98203 6.23022 9.98505 6.48986 9.98505 6.78397C9.98505 7.07807 9.98203 7.33771 9.97694 7.56649C9.95458 8.57115 9.30701 9.32706 8.30351 9.38039C8.03501 9.39466 7.72422 9.40338 7.36563 9.40338C7.00705 9.40338 6.69625 9.39466 6.42775 9.38039C5.42425 9.32706 4.77668 8.57115 4.75432 7.56649C4.74923 7.33771 4.74622 7.07807 4.74622 6.78397C4.74622 6.48986 4.74923 6.23022 4.75432 6.00144Z"
        fill="currentColor"
      />
      <Path
        d="M4.75432 13.9695C4.77668 14.9742 5.42425 15.7301 6.42775 15.7834C6.69625 15.7977 7.00705 15.8064 7.36563 15.8064C7.72422 15.8064 8.03501 15.7977 8.30351 15.7834C9.30701 15.7301 9.95458 14.9742 9.97694 13.9695C9.98203 13.7407 9.98505 13.4811 9.98505 13.187C9.98505 12.8929 9.98203 12.6332 9.97694 12.4045C9.95458 11.3998 9.30701 10.6439 8.30351 10.5906C8.03501 10.5763 7.72422 10.5676 7.36563 10.5676C7.00705 10.5676 6.69625 10.5763 6.42775 10.5906C5.42425 10.6439 4.77668 11.3998 4.75432 12.4045C4.74923 12.6332 4.74622 12.8929 4.74622 13.187C4.74622 13.4811 4.74923 13.7407 4.75432 13.9695Z"
        fill="currentColor"
      />
      <Path
        d="M14.5512 4.17266C15.5558 4.19502 16.3117 4.84259 16.3651 5.84608C16.3793 6.11459 16.3881 6.42538 16.3881 6.78397C16.3881 7.14255 16.3793 7.45335 16.3651 7.72185C16.3117 8.72535 15.5558 9.37291 14.5512 9.39528C14.3224 9.40037 14.0628 9.40338 13.7686 9.40338C13.4745 9.40338 13.2149 9.40037 12.9861 9.39527C11.9815 9.37291 11.2255 8.72534 11.1722 7.72185C11.158 7.45334 11.1492 7.14255 11.1492 6.78397C11.1492 6.42538 11.158 6.11459 11.1722 5.84608C11.2255 4.84259 11.9815 4.19502 12.9861 4.17266C13.2149 4.16757 13.4745 4.16455 13.7686 4.16455C14.0628 4.16455 14.3224 4.16757 14.5512 4.17266Z"
        fill="currentColor"
      />
      <Path
        d="M14.5512 15.7983C15.5558 15.7759 16.3117 15.1284 16.3651 14.1249C16.3793 13.8564 16.3881 13.5456 16.3881 13.187C16.3881 12.8284 16.3793 12.5176 16.3651 12.2491C16.3117 11.2456 15.5558 10.598 14.5512 10.5757C14.3224 10.5706 14.0628 10.5676 13.7686 10.5676C13.4745 10.5676 13.2149 10.5706 12.9861 10.5757C11.9815 10.598 11.2255 11.2456 11.1722 12.2491C11.158 12.5176 11.1492 12.8284 11.1492 13.187C11.1492 13.5456 11.158 13.8564 11.1722 14.1249C11.2255 15.1284 11.9815 15.7759 12.9861 15.7983C13.2149 15.8034 13.4745 15.8064 13.7686 15.8064C14.0628 15.8064 14.3224 15.8034 14.5512 15.7983Z"
        fill="currentColor"
      />
    </Svg>
  ),
})
