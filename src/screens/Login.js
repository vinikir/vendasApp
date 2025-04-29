import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    Modal,
    Animated,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import UserModels from '../Models/UserModels';
import { Logar } from '../Models/UserServerModel';
import { AuthContext } from '../Contexts/auth';
import InfosLoginModel from '../Models/InfosLoginModel';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { checkUpdate, getVersao } from 'versionamento-push';

const Login = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [seguret, setSeguret] = useState(true);
    const [versao, setVersao] = useState('');
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [msg, setMsg] = useState('');
    const [visionIcon, setVision] = useState('eye-slash');
    const { setUser } = useContext(AuthContext);
    
    // Animations
    const fadeAnim = useState(new Animated.Value(0))[0];
    const logoScale = useState(new Animated.Value(0.8))[0];
    const buttonScale = useState(new Animated.Value(1))[0];

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true
            })
        ]).start();

        checkUpdate();
        inicializar();
    }, []);

    const inicializar = async () => {
        try {
            const versaoApp = await getVersao();
            setVersao(versaoApp.titulo);
            
            const res = UserModels.buscausuraio();
            const res2 = InfosLoginModel.buscaInfosLogin();
            
            if(res2.length > 0){
                setLogin(res2[0].login);
                setSenha(res2[0].senha);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const vision = () => {
        setVision(prev => {
            const newIcon = prev === 'eye' ? 'eye-slash' : 'eye';
            setSeguret(newIcon === 'eye-slash');
            return newIcon;
        });
    };

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    const LogarF = async () => {
        if(login.trim() === ""){
            setMsg("Login é obrigatório");
            setModalVisible(true);
            return;
        }

        if(senha.trim() === ""){
            setMsg("Senha é obrigatória");
            setModalVisible(true);
            return;
        }

        setLoading(true);
        try {
            const res = await Logar(login.trim(), senha.trim());
            setLoading(false);
            
            if(res.erro){
                setMsg(res.valor);
                setModalVisible(true);
                return;
            }

            UserModels.salvarUsuario(res.valor.ID, res.valor.Nome);
            InfosLoginModel.salvarInfos(login.trim(), senha.trim());
            setUser(res.valor);
            navigation.navigate('Index');
        } catch (e) {
            console.log("e", e);
            setLoading(false);
            setMsg("Erro ao conectar com o servidor");
            setModalVisible(true);
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <StatusBar
                animated={true}
                backgroundColor={"#1a1a1a"}
                barStyle="light-content"
            />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.content}>
                    {/* Logo Section */}
                    <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/logoGem.png')}
                            resizeMode='contain'
                        />
                    </Animated.View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        {/* Login Input */}
                        <View style={styles.inputContainer}>
                            <Icon name="user-alt" size={18} color="#f0660a" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Login"
                                placeholderTextColor="#666"
                                style={styles.input}
                                value={login}
                                onChangeText={setLogin}
                                autoCapitalize="none"
                                autoCorrect={false}
                                selectionColor="#f0660a"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={18} color="#f0660a" style={styles.inputIcon} />
                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor="#666"
                                style={styles.input}
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={seguret}
                                autoCapitalize="none"
                                selectionColor="#f0660a"
                            />
                            <TouchableOpacity onPress={vision} style={styles.eyeIcon}>
                                <Icon name={visionIcon} size={18} color="#f0660a" />
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity 
                                style={styles.loginButton}
                                onPress={LogarF}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Image
                                        style={styles.loadingGif}
                                        source={require("../../assets/pulse.gif")}
                                    />
                                ) : (
                                    <Text style={styles.loginButtonText}>ENTRAR</Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Version Info */}
            <Text style={styles.versionText}>Versão {versao}</Text>

            {/* Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Atenção</Text>
                        <Text style={styles.modalMessage}>{msg}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Animated.View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    keyboardAvoid: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: windowWidth * 0.6,
        height: windowHeight * 0.2,
    },
    formContainer: {
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#333',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    loginButton: {
        backgroundColor: '#f0660a',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#f0660a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    loadingGif: {
        width: 40,
        height: 30,
    },
    versionText: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        color: '#666',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 25,
        width: windowWidth * 0.8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0660a',
    },
    modalTitle: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#f0660a',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Login;