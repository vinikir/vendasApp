import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Vibration,
    Animated,
    Dimensions,
    SafeAreaView,
    Platform
} from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Icon2 from 'react-native-vector-icons/dist/Feather';

const ScannerScreen = ({ navigation }) => {
    const cameraRef = useRef(null);
    //const devices = useCameraDevices();
    const device = useCameraDevices("back");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [torchOn, setTorchOn] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
   
    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            
            setHasPermission(status === 'authorized' || status === 'granted' );

            
            
        })();

        // Animação de entrada
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();

        return () => {
            
        };
    }, []);

    

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        if (!isActive || scanned) return;
        
        
    }, []);

    const handleBarCodeScanned = (barcode) => {
        setScanned(true);
        Vibration.vibrate(100);
        playSound();
        
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();

        console.log(`Tipo: ${barcode.format}, Dados: ${barcode.displayValue}`);
        
        setTimeout(() => {
            navigation.navigate('Index', { scannedData: barcode.displayValue });
        }, 1500);
    };

    const toggleTorch = () => {
        setTorchOn(!torchOn);
    };

    const toggleScanner = () => {
        setIsActive(!isActive);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Solicitando permissão para a câmera...</Text>
            </View>
        );
    }

    if (hasPermission === false || !device) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionDeniedText}>Sem acesso à câmera</Text>
                <Text style={styles.permissionText}>Por favor, permita o acesso à câmera nas configurações do dispositivo</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.absoluteFill, { opacity: fadeAnim }]}>
                {isActive && (
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFillObject}
                        device={device}
                        isActive={isActive}
                        torch={torchOn ? 'on' : 'off'}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={5}
                    />
                )}
                
                {!isActive && (
                    <View style={styles.scannerDisabled}>
                        <Icon name="eye-slash" size={50} color="#fff" />
                        <Text style={styles.scannerDisabledText}>Scanner pausado</Text>
                    </View>
                )}
                
                <View style={styles.overlay}>
                    <View style={styles.overlayEdge} />
                    <View style={styles.overlayCenter}>
                        <View style={styles.overlayEdge} />
                        <View style={styles.viewfinder}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                        <View style={styles.overlayEdge} />
                    </View>
                    <View style={styles.overlayEdge} />
                </View>
                
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
                    >
                        <Icon2 name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>ESCANEAR CÓDIGO</Text>
                    <View style={styles.headerRight} />
                </View>
                
                {scanned && (
                    <View style={styles.successOverlay}>
                        <Icon name="check-circle" size={80} color="#4CAF50" />
                        <Text style={styles.successText}>Código lido com sucesso!</Text>
                    </View>
                )}
                
                <View style={styles.controls}>
                    <TouchableOpacity 
                        onPress={toggleTorch} 
                        style={[styles.controlButton, torchOn && styles.controlButtonActive]}
                    >
                        <Icon 
                            name={torchOn ? "flash" : "bolt"} 
                            size={24} 
                            color={torchOn ? "#f0660a" : "#fff"} 
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={toggleScanner} 
                        style={[styles.controlButton, !isActive && styles.controlButtonActive]}
                    >
                        <Icon 
                            name={isActive ? "pause" : "play"} 
                            size={24} 
                            color={isActive ? "#fff" : "#f0660a"} 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Posicione o código dentro da área de leitura</Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

// Os estilos permanecem os mesmos do exemplo anterior
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    absoluteFill: {
        flex: 1
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    permissionDeniedText: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    overlayEdge: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    overlayCenter: {
        flexDirection: 'row',
        flex: 2
    },
    viewfinder: {
        flex: 8,
        borderWidth: 2,
        borderColor: 'rgba(240, 102, 10, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#f0660a'
    },
    topLeft: {
        top: -2,
        left: -2,
        borderTopWidth: 4,
        borderLeftWidth: 4
    },
    topRight: {
        top: -2,
        right: -2,
        borderTopWidth: 4,
        borderRightWidth: 4
    },
    bottomLeft: {
        bottom: -2,
        left: -2,
        borderBottomWidth: 4,
        borderLeftWidth: 4
    },
    bottomRight: {
        bottom: -2,
        right: -2,
        borderBottomWidth: 4,
        borderRightWidth: 4
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    backButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    },
    headerRight: {
        width: 40
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10
    },
    controlButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    controlButtonActive: {
        backgroundColor: 'rgba(240, 102, 10, 0.3)',
        borderColor: '#f0660a'
    },
    footer: {
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10
    },
    footerText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20
    },
    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 20
    },
    successText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 20,
        fontWeight: 'bold'
    },
    scannerDisabled: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 5
    },
    scannerDisabledText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20
    }
});

export default ScannerScreen;