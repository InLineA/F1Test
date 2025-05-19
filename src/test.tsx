import React, { useState, useEffect } from 'react';
import { TextInput, SafeAreaView, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const useDebounce = (input: string, timeout: number): string => {
    const [text, setText] = useState('')

    useEffect(()=>{
        const timer = setTimeout(() => {
            setText(input)
        }, timeout)
        return () => {
            clearTimeout(timer)
        }
    }, [text])

    return text
}

const TextInputExample = () => {
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 500);

  const onChangeText = (newText: string) => {
    setText(newText);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder="Введите текст..."
        />

        <Text>Debounced Text: {debouncedText}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default TextInputExample;