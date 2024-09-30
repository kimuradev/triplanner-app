import { View, Image, TextInput, Button } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 bg-yellow100 items-center justify-center p-8">

      <View>
        <Image
          className='absolute'
          source={require('@/assets/bg.png')}
        />

        <Image
          className='w-[300px]'
          source={require('@/assets/logo.png')}
        />
      </View>

      <View className='w-full h-[180px] border rounded bg-white'>
        <TextInput>Para onde?</TextInput>
        <TextInput>Quando?</TextInput>
        <Button title='Continuar' ></Button>
      </View>

    </View>
  );
}