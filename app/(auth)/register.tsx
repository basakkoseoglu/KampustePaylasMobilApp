import { StyleSheet, Text, View ,Image, Pressable, Alert} from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import TextInputField from '@/components/TextInputField'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const Register = () => {
    const emailRef=useRef("");
    const passwordRef=useRef("");
    const nameRef=useRef("");
    const [isLoading,setIsLoading]=useState(false);
    const router= useRouter();
    const {register:registerUser} = useAuth()

    const handleSubmit = async ()=>{
        if(!emailRef.current || !passwordRef.current || !nameRef.current){
            Alert.alert('Kayıt Ol',"Lütfen tüm alanları doldurun.");
            return;
        }
        // console.log('Okul e-posta adresi: ',emailRef.current);
        // console.log('name: ',nameRef.current);
        // console.log('Şifre: ',passwordRef.current);
        // console.log("Her şey hazır");
        setIsLoading(true);
        const res=await registerUser(
            emailRef.current,
            passwordRef.current,
            nameRef.current
        );
        setIsLoading(false)
        console.log('sonucu kaydet',res);
        if(!res.success){
            Alert.alert('Kayıt Ol',res.msg);
        }
    };
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <BackButton iconSize={28}/>
        <View style={styles.logoContainer}>
            <Image
            style={styles.logo}
            resizeMode='contain'
            source={require('../../assets/images/logo.png')}/>
        </View>
        {/* form */}
        <View style={styles.form}>
            <TextInputField 
            placeholder='İsim'
            onChangeText={(value) => (nameRef.current=value)}
            icon={<Icons.User size={verticalScale(20)} color={colors.neutral300} 
            />
          }
        />
         <TextInputField 
            placeholder='Okul e-posta adresi'
            onChangeText={(value) => (emailRef.current=value)}
            icon={<Icons.At size={verticalScale(20)} color={colors.neutral300} 
            />
          }
        />
        <TextInputField 
            placeholder='Şifre'
            secureTextEntry
            onChangeText={(value) => (passwordRef.current=value)}
            icon={<Icons.Lock size={verticalScale(20)} color={colors.neutral300} 
            />
          }
        />
        <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={'700'} color={colors.white} size={21}>
               Kayıt Ol
            </Typo>
        </Button>
        </View>
        {/* footer */}
        <View style={styles.footer}>
            <Typo size={15} color={colors.neutral400}>Hesabın var mı?</Typo>
            <Pressable onPress={()=> router.navigate("/(auth)/login")} >
                <Typo size={15} fontWeight={"700"} color={colors.neutral150}>Giriş Yap</Typo>
            </Pressable>

        </View>
        </View>
    </ScreenWrapper>
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal:spacingX._20,
        justifyContent:'flex-start'
    },
    logoContainer:{
        alignItems:'center',
        marginTop:spacingY._20,
        marginBottom:spacingY._30,
    },
    logo:{
        height:200,
        aspectRatio:1,
    },
    welcomeText:{
        fontSize:verticalScale(20),
        fontWeight:"bold",
        color:colors.text,
    },
    form:{
        //flex:1,
        // justifyContent:"flex-start",
        gap:spacingY._20,
    },
    forgotPassword:{
        textAlign:"right",
        fontWeight:"500",
        color:colors.text,
    },
    footer:{
        position:"absolute",
        bottom:130,
        left:0,
        right:0,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:5,
    },
    footerText:{
        textAlign:"center",
        color:colors.text,
        fontSize:verticalScale(15),
    },
});