import CodePush from 'react-native-code-push';
import DeviceInfo, { getVersion } from 'react-native-device-info';

export const getVersaoApp = async  () => {
    
    let appVersion  = await Promise.all([
        CodePush.getConfiguration(),
        CodePush.getUpdateMetadata()
    ]);
    const versionBundle =  getVersion()

    if(appVersion && appVersion[1] && appVersion[1].label){

        let ver = appVersion[1].label.replace('v',"")

        return "V "+versionBundle+"."+ver

        
    }else{
        try{
            const t = await  CodePush.sync({
                updateDialog: false,
                installMode: CodePush.InstallMode.IMMEDIATE
            }).catch((e) => {
                console.log(e)
            });
            console.log(t)
        }catch(e){
            console.log("erro", e)
        }
        
        
        return "V "+versionBundle+".1"
        
    }
}