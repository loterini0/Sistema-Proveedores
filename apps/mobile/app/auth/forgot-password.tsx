import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { router } from "expo-router";
import {Controller, useForm} from "react-hook-form"
import {Alert, StyleSheet, Text, View} from "react-native";
import {z} from "zod"
import { Button } from "../../src/components/button";
import { Input } from "../../src/components/Input";
import { Screen } from "../../src/components/Screen";
import { authService } from "../../src/services/api";
import { colors } from "../../src/theme/colors";

const schema = z.object({
    email: z.string().email("Ingresa un email válido")
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen(){
    const {
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async ({email}: FormData) =>{
        try {
            const {data} = await authService.forgotPassword(email);

            Alert.alert("Revisa tu correo", data.message, [
                {text: "Volver al inicio", onPress: () => router.replace("/auth/login")},
            ]);
        } catch (error){
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error ?? "No fue posible procesar la solicitud"
                : "No fue posible procesar la solicitud";

            Alert.alert("Error", message);
        }
    };

    return(
        <Screen>
            <View style={styles.container}>
                <Text style={styles.title}>Recuperar contraseña</Text>
                <Text style={styles.description}>
                    Escribe tu correo y te enviaremos las instrucciones para restablecerla
                </Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value} }) => (
                        <Input
                            label="Email"
                            placeholder="correo@empresa.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={value}
                            onChangeText={onChange}
                            error={errors.email?.message}
                        />
                    )}
                />

                <Button
                    label="Enviar instrucciones"
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, gap: 16 },
    title: { fontSize: 28, fontWeight: "700", color: colors.text },
    description: {
        color: colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    }
})