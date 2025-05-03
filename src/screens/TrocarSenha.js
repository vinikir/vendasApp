import React, { useState, useContext } from "react";
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import api from "../Api/api";
import { AuthContext } from '../Contexts/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TrocarSenha = ({ navigation, route }) => {
    const [senhaRepete, setSenhaRepete] = useState("");
    const [senha, setSenha] = useState('');
    const [visionIcon, setVision] = useState('eye-slash');
    const [visionIcon2, setVision2] = useState('eye-slash');
    const [seguro, setSeguro] = useState(true);
    const [seguro2, setSeguro2] = useState(true);
    const [erro, setErro] = useState(false);
    const [msg, SetMsg] = useState(true);
    const { userInfos } = useContext(AuthContext);

    const fadeAnim = useState(new Animated.Value(0))[0];

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, []);

    const toggleVision = () => {
        if (visionIcon === 'eye') {
            setVision('eye-slash');
            setSeguro(true);
        } else {
            setVision('eye');
            setSeguro(false);
        }
    };

    const toggleVision2 = () => {
        if (visionIcon2 === 'eye') {
            setVision2('eye-slash');
            setSeguro2(true);
        } else {
            setVision2('eye');
            setSeguro2(false);
        }
    };
    
    const salvarSenha = () => {

       

        if (senha.length > 20) {
            setErro(true);
            SetMsg('A senha deve ter no máximo 20 caracteres');
            return;
        }

        if(senha.length === 0 ) {
            setErro(true);
            SetMsg('A senha não pode ser vazia');
            return;

        }

        if(senhaRepete.length === 0 ) {
            setErro(true);
            SetMsg('A senha repetida não pode ser vazia');
            return;

        }

        if (senha.length < 6) {
            setErro(true);
            SetMsg('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (senha !== senhaRepete) {
            setErro(true);
            SetMsg('As senhas não coincidem');
            return;
        }

        api.post('/trocar-senha', {
            senha:senha,
            id:userInfos.ID
        })
            .then((res) => {
                if (res.data.erro) {
                    setErro(true);
                    SetMsg(res.data.valor);
                } else {
                    
                    navigation.navigate('Index')
                }
            }).catch((err) => {
                console.log(err);
                setErro(true);
                SetMsg('Erro ao conectar com o servidor');
            });

        
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <Text style={styles.title}>ALTERAR SENHA</Text>
                <Text style={styles.subtitle}>Digite sua nova senha abaixo</Text>
            </View>

            <View style={styles.formContainer}>
                {/* Campo Senha */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={18} color="#f0660a" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Nova senha"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        style={styles.input}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry={seguro}
                        autoCapitalize="none"
                        selectionColor="#f0660a"
                    />
                    <TouchableOpacity onPress={toggleVision} style={styles.eyeIcon}>
                        <Icon name={visionIcon} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Campo Repetir Senha */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={18} color="#f0660a" style={styles.inputIcon} />
                    <TextInput
                        placeholder="Repetir senha"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        style={styles.input}
                        value={senhaRepete}
                        onChangeText={setSenhaRepete}
                        secureTextEntry={seguro2}
                        autoCapitalize="none"
                        selectionColor="#f0660a"
                    />
                    <TouchableOpacity onPress={toggleVision2} style={styles.eyeIcon}>
                        <Icon name={visionIcon2} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {
                    erro && (
                        <View style={styles.erroContainer}>
                            <Icon name="exclamation-circle" size={16} color="#ff4444" />
                            <Text style={styles.erroTexto}>{msg}</Text>
                        </View>
                    )
                }

                {/* Botões */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => salvarSenha()}>
                        <Text style={styles.buttonText}>TROCAR SENHA</Text>
                        <Icon name="key" size={16} color="#fff" style={styles.buttonIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>CANCELAR</Text>
                        <Icon name="times" size={16} color="#f0660a" style={styles.buttonIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 25,
        justifyContent: 'center'
    },
    erroContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 68, 68, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#ff4444',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 4,
        marginBottom: 15
    },
    erroTexto: {
        color: '#ff4444',
        marginLeft: 10,
        fontSize: 14
    },
    header: {
        marginBottom: 40,
        alignItems: 'center'
    },
    title: {
        color: '#f0660a',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 8
    },
    subtitle: {
        color: '#aaa',
        fontSize: 14
    },
    formContainer: {
        marginBottom: 30
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333'
    },
    inputIcon: {
        marginRight: 15
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16
    },
    eyeIcon: {
        padding: 10
    },
    buttonsContainer: {
        marginTop: 30
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0660a',
        borderRadius: 25,
        height: 50,
        marginBottom: 15
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 25,
        height: 50,
        borderWidth: 1,
        borderColor: '#f0660a'
    },
    buttonText: {
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    secondaryButtonText: {
        color: "#f0660a",
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10
    },
    buttonIcon: {
        marginLeft: 5
    }
});

export default TrocarSenha;