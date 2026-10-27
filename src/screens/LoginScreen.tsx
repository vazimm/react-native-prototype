import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../contexts/AuthContext";
import { commonStyles, loginStyles as styles } from "../styles";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Dados obrigatórios", "Informe seu e-mail e sua senha.");
      return;
    }
    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
    } catch (error) {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      Alert.alert(
        "Não foi possível entrar",
        status === 401
          ? "E-mail ou senha inválidos."
          : "Falha ao conectar à API. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={commonStyles.page}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heading}>
          <Text style={styles.brand}>EduBlog</Text>
          <Text style={commonStyles.title}>Área do professor</Text>
          <Text style={commonStyles.subtitle}>
            Entre com a conta de professor cadastrada na plataforma.
          </Text>
        </View>
        <View style={commonStyles.card}>
          <View>
            <Text style={commonStyles.label}>E-mail</Text>
            <TextInput
              accessibilityLabel="E-mail"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="nome@exemplo.com"
              returnKeyType="next"
              style={commonStyles.input}
              value={email}
            />
          </View>
          <View>
            <Text style={commonStyles.label}>Senha</Text>
            <TextInput
              accessibilityLabel="Senha"
              autoCapitalize="none"
              onChangeText={setPassword}
              onSubmitEditing={() => void handleLogin()}
              placeholder="Sua senha"
              returnKeyType="go"
              secureTextEntry
              style={commonStyles.input}
              value={password}
            />
          </View>
          <ActionButton
            label="Entrar"
            loading={isSubmitting}
            onPress={() => void handleLogin()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
