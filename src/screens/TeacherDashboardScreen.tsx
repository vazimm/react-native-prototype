import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../contexts/AuthContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { getTeacherPostsRequest } from "../services/postService";
import type { Post } from "../types/models";
import {
  colors,
  commonStyles,
  teacherDashboardStyles as styles,
} from "../styles";
import { formatDate, isDraftPost, isPublishedPost } from "../utils/post";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherDashboard">;

export default function TeacherDashboardScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      const response = await getTeacherPostsRequest();
      setPosts(
        response.filter(
          (post) =>
            post.author._id === user?.id || post.author.email === user?.email,
        ),
      );
    } catch {
      setError("Não foi possível carregar os dados do painel.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email, user?.id]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const publishedCount = posts.filter(isPublishedPost).length;
  const draftCount = posts.filter(isDraftPost).length;
  const latestPosts = [...posts]
    .sort(
      (left, right) =>
        new Date(right.createDate).getTime() -
        new Date(left.createDate).getTime(),
    )
    .slice(0, 5);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={commonStyles.subtitle}>
          Carregando painel do professor...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={commonStyles.content}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            setRefreshing(true);
            void loadPosts();
          }}
          refreshing={refreshing}
          tintColor={colors.teal}
        />
      }
    >
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <Text style={commonStyles.title}>Dashboard</Text>
          <Text style={commonStyles.subtitle}>Olá, {user?.name}.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert("Encerrar sessão", "Deseja sair da sua conta?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Sair",
                style: "destructive",
                onPress: () => void logout(),
              },
            ])
          }
        >
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Dashboard indisponível</Text>
          <Text style={styles.errorText}>{error}</Text>
          <ActionButton
            label="Tentar novamente"
            onPress={() => void loadPosts()}
            variant="secondary"
          />
        </View>
      ) : (
        <>
          <View style={styles.metrics}>
            <MetricCard count={publishedCount} label="Posts publicados" />
            <MetricCard count={draftCount} label="Rascunhos" />
          </View>
          <View style={styles.actions}>
            <ActionButton
              label="Meus posts"
              onPress={() => navigation.navigate("TeacherPosts")}
              variant="secondary"
            />
            <ActionButton
              label="Criar post"
              onPress={() => navigation.navigate("TeacherPostForm")}
            />
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Últimos posts</Text>
            <Pressable onPress={() => navigation.navigate("TeacherPosts")}>
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>
          {latestPosts.length ? (
            latestPosts.map((post) => (
              <Pressable
                accessibilityRole="button"
                key={post._id}
                onPress={() =>
                  navigation.navigate("PostView", {
                    postId: post._id,
                  })
                }
                style={commonStyles.card}
              >
                <View style={styles.postTitleRow}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <StatusBadge
                    published={isPublishedPost(post)}
                    label={post.status.label}
                  />
                </View>
                <Text style={commonStyles.subtitle}>
                  {post.discipline.label} · Criado em{" "}
                  {formatDate(post.createDate)}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.empty}>
              Nenhum post encontrado para este professor.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

export function StatusBadge({
  published,
  label,
}: {
  published: boolean;
  label: string;
}) {
  return (
    <View style={[styles.badge, published ? styles.published : styles.draft]}>
      <Text
        style={[
          styles.badgeText,
          published ? styles.publishedText : styles.draftText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function MetricCard({ count, label }: { count: number; label: string }) {
  return (
    <View style={[commonStyles.card, styles.metric]}>
      <Text style={styles.metricCount}>{count}</Text>
      <Text style={commonStyles.subtitle}>{label}</Text>
    </View>
  );
}
