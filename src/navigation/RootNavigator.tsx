import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen";
import TeacherPostsScreen from "../screens/TeacherPostsScreen";
import TeacherPostFormScreen from "../screens/TeacherPostFormScreen";
import PostViewScreen from "../screens/PostViewScreen";
import { colors, rootNavigatorStyles as styles } from "../styles";

export type RootStackParamList = {
  Login: undefined;
  AccessDenied: undefined;
  PostView: { postId: string };
  TeacherDashboard: undefined;
  TeacherPosts: undefined;
  TeacherPostForm: { postId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading, loadError, retrySessionLoad, logout } = useAuth();

  if (isLoading || loadError) {
    return (
      <View
        style={styles.gateContainer}
      >
        {isLoading ? (
          <>
            <ActivityIndicator color={colors.teal} size="large" />
            <Text style={{ color: colors.ink }}>Restaurando sessão segura...</Text>
          </>
        ) : (
          <>
            <Text style={styles.gateErrorText}>{loadError}</Text>
            <Pressable onPress={retrySessionLoad}>
              <Text style={styles.gateActionText}>Tentar novamente</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.teal,
          headerTitleStyle: { color: colors.ink, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!user ? (
          <Stack.Screen
            component={LoginScreen}
            name="Login"
            options={{ title: "EduBlog — Professor", headerBackVisible: false }}
          />
        ) : (
          <>
            {user.role !== "PROFESSOR" ? (
              <Stack.Screen
                name="AccessDenied"
                options={{ title: "Acesso restrito", headerBackVisible: false }}
              >
                {() => (
                  <View style={styles.accessDeniedContainer}>
                    <Text style={styles.accessDeniedTitle}>Área exclusiva para professores</Text>
                    <Text style={styles.accessDeniedText}>
                      Esta conta não tem a permissão necessária para administrar publicações.
                    </Text>
                    <Pressable onPress={() => void logout()}>
                      <Text style={styles.gateActionText}>Sair</Text>
                    </Pressable>
                  </View>
                )}
              </Stack.Screen>
            ) : (
              <>
                <Stack.Screen
                  component={TeacherDashboardScreen}
                  name="TeacherDashboard"
                  options={{ title: "Painel do professor", headerBackVisible: false }}
                />
                <Stack.Screen
                  component={TeacherPostsScreen}
                  name="TeacherPosts"
                  options={{ title: "Meus posts" }}
                />
                <Stack.Screen
                  component={TeacherPostFormScreen}
                  name="TeacherPostForm"
                  options={({ route }) => ({
                    title: route.params?.postId ? "Editar post" : "Novo post",
                  })}
                />
              </>
            )}
            <Stack.Screen
              component={PostViewScreen}
              name="PostView"
              options={{ title: "Visualizar post" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
