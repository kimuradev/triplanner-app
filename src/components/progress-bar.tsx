import { colors } from '@/styles/colors';
import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export function ProgressBar({ progress }: { progress: number }) {
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: progress, // The progress value should be between 0 and 1
            duration: 500, // Animation duration in milliseconds
            useNativeDriver: false, // Disable native driver for width animations
        }).start();
    }, [progress]);

    const widthInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const animatedStyle = {
        width: widthInterpolate,
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
            {/* <Text style={styles.progressText}>{Math.floor(progress * 100)}%</Text> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      height: 14,
      backgroundColor: colors.yellow[100],
      borderRadius: 10,
      overflow: 'hidden',
      margin: 10,
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.green[300], // Green color for the progress bar
    },
    progressText: {
      position: 'absolute',
      alignSelf: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
  });