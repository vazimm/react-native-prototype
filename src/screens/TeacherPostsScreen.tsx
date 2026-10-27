import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ActionButton from "../components/ActionButton";
import SelectField from "../components/SelectField";
import { StatusBadge } from "./TeacherDashboardScreen";
import { useAuth } from "../contexts/AuthContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import {
  deletePostRequest,
  getTeacherPostsRequest,
} from "../services/postService";
import type { Post } from "../types/models";
import { colors, commonStyles, teacherPostsStyles as styles } from "../styles";
import { filterTeacherPosts, formatDate, isPublishedPost } from "../utils/post";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherPosts">;
type StatusFilter = "todos" | "publicado" | "rascunho";

export default function TeacherPostsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");

  const loadPosts = useCallback(async () => {
    try {
      setError("");
      setPosts(await getTeacherPostsRequest());
    } catch {
      setError("Não foi possível carregar os seus posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const disciplines = useMemo(
    () =>
      Array.from(new Set(posts.map((post) => post.discipline.label))).sort(
        (left, right) => left.localeCompare(right, "pt-BR"),
      ),
    [posts],
  );
  const filteredPosts = filterTeacherPosts(
    posts,
    user?.id ?? "",
    user?.email ?? "",
    search,
    discipline,
    status,
  );

  function confirmDelete(post: Post) {
    Alert.alert(
      "Excluir post",
      `Tem certeza que deseja excluir "${post.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => void deletePost(post),
        },
      ],
    );
  }

  async function deletePost(post: Post) {
    try {
      await deletePostRequest(post._id);
      setPosts((current) => current.filter((item) => item._id !== post._id));
      Alert.alert("Post excluído", "Post excluído com sucesso.");
    } catch (requestError) {
      const code =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError
          ? (requestError as { response?: { status?: number } }).response
              ?.status
          : undefined;
      const message =
        code === 403
          ? "Você não tem permissão para excluir este post."
          : code === 404
            ? "Post não encontrado para exclusão."
            : "Não foi possível excluir o post. Verifique sua conexão e tente novamente.";
      Alert.alert("Falha ao excluir", message);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={commonStyles.subtitle}>Carregando seus posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <FlatList
        contentContainerStyle={commonStyles.content}
        data={error ? [] : filteredPosts}
        keyExtractor={(post) => post._id}
        ListEmptyComponent={
          <View style={commonStyles.card}>
            <Text style={commonStyles.subtitle}>
              {error
                ? "Nenhum conteúdo carregado."
                : "Nenhum post encontrado para os filtros aplicados."}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={commonStyles.title}>Meus Posts</Text>
            <ActionButton
              label="Novo post"
              onPress={() => navigation.navigate("TeacherPostForm")}
            />
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <ActionButton
                  label="Tentar novamente"
                  onPress={() => void loadPosts()}
                  variant="secondary"
                />
              </View>
            ) : null}
            <View style={styles.filters}>
              <TextInput
                accessibilityLabel="Buscar post por título"
                onChangeText={setSearch}
                placeholder="Buscar por título..."
                returnKeyType="search"
                style={commonStyles.input}
                value={search}
              />
              <SelectField
                label="Disciplina"
                onChange={setDiscipline}
                options={[
                  { label: "Todas as disciplinas", value: "" },
                  ...disciplines.map((item) => ({ label: item, value: item })),
                ]}
                placeholder="Todas as disciplinas"
                value={discipline}
              />
            </View>
            <View style={styles.statusFilters}>
              {(
                [
                  ["todos", "Todos"],
                  ["publicado", "Publicados"],
                  ["rascunho", "Rascunhos"],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: status === value }}
                  key={value}
                  onPress={() => setStatus(value)}
                  style={[
                    styles.filterButton,
                    status === value && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      status === value && styles.activeFilterText,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
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
        renderItem={({ item }) => (
          <PostCard
            onDelete={() => confirmDelete(item)}
            onEdit={() =>
              navigation.navigate("TeacherPostForm", { postId: item._id })
            }
            onView={() =>
              navigation.navigate("PostView", { postId: item._id })
            }
            post={item}
          />
        )}
      />
    </View>
  );
}

function PostCard({
  post,
  onView,
  onEdit,
  onDelete,
}: {
  post: Post;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const published = isPublishedPost(post);
  return (
    <View style={commonStyles.card}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <StatusBadge
          published={published}
          label={published ? "Publicado" : "Rascunho"}
        />
      </View>
      <Text style={commonStyles.subtitle}>{post.discipline.label}</Text>
      <Text style={styles.date}>Criado em {formatDate(post.createDate)}</Text>
      <View style={styles.actions}>
        <TextAction label="Ver" onPress={onView} />
        <TextAction label="Editar" onPress={onEdit} />
        <TextAction label="Excluir" onPress={onDelete} danger />
      </View>
    </View>
  );
}

function TextAction({
  label,
  onPress,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.actionButton}
    >
      <Text style={[styles.actionLabel, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
}
