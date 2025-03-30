import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const GifPagamentoRegeitado = ({mostrar, onAnimationEnd}) => {

    if(mostrar == false){
        return
    }
    // Animação da tela vermelha
    const scaleAnim = useRef(new Animated.Value(0)).current;

    // Animação do "pulinho" da imagem
    const bounceAnim = useRef(new Animated.Value(0)).current;

    // Opacidade para desaparecer
    const fadeAnim = useRef(new Animated.Value(1)).current;

   
        // Sequência de animações
        Animated.sequence([
            // Expansão da tela vermelha (0.5s)
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),

            // Animação de pulinho (3 vezes)
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -20,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]),
                { iterations: 3 }
            ),

            // Espera 2 segundos
            Animated.delay(2000),

            // Desaparece tudo (0.5s)
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onAnimationEnd) {
                onAnimationEnd();
            }
        });
   

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Tela vermelha que se expande */}
            <Animated.View
                style={[
                    styles.redBackground,
                    {
                        transform: [
                            {
                                scale: scaleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, Math.max(width, height) * 1.5] // Expande além da tela para cobrir tudo
                                })
                            }
                        ]
                    }
                ]}
            />

            <Animated.View
                style={{
                    transform: [
                        { translateY: bounceAnim }
                    ],
                    position: 'absolute',
                    zIndex: 2
                }}
            >
                <Image
                    source={require('../../assets/logoGem.png')} // Substitua pela sua imagem
                    style={styles.image}
                />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: width,
        height: height,
    },
    redBackground: {
        backgroundColor: 'red',
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    }
});

export default GifPagamentoRegeitado;