import CodePush from 'react-native-code-push';
import DeviceInfo, { getVersion } from 'react-native-device-info';

export const getVersaoApp = async () => {

    let appVersion = await Promise.all([
        CodePush.getConfiguration(),
        CodePush.getUpdateMetadata()
    ]);
    const versionBundle = getVersion()

    if (appVersion && appVersion[1] && appVersion[1].label) {

        let ver = appVersion[1].label.replace('v', "")

        return "V " + versionBundle + "." + ver


    } else {
        try {
            const t = await CodePush.sync({
                updateDialog: false,
                installMode: CodePush.InstallMode.IMMEDIATE
            }).catch((e) => {
                console.log(e)
            });

        } catch (e) {

            console.log("erro", e)

        }


        return "V " + versionBundle + ".1"

    }
}

export const formatMoney = (value) => {
    // Remove caracteres não numéricos
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Adiciona a vírgula se a quantidade de dígitos for maior que 2
    let formattedValue = cleanedValue;
    
    if (cleanedValue.length > 2) {
        formattedValue = `${cleanedValue.slice(0, -2)},${cleanedValue.slice(-2)}`;
    }

    // Retorna o valor formatado
    return formattedValue;
};