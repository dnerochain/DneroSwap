import { Text } from '@dneroswap/uikit'

const TextComponent = ({ text }: { text: string }) => {
  return (
    <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
      {text}
    </Text>
  )
}

export default TextComponent
