import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../contexts/AuthContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { getPostByIdRequest } from "../services/postService";
import type { Post } from "../types/models";
import { colors, commonStyles, postViewStyles as styles } from "../styles";
import { formatDate } from "../utils/post";
import {
  resetToTeacherDashboard,
  resetToTeacherPosts,
} from "../utils/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "PostView">;

export default function PostViewScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPostByIdRequest(route.params.postId)
      .then((result) => {
        if (active) setPost(result);
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar esta publicação.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [route.params.postId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={commonStyles.subtitle}>Carregando publicação...</Text>
      </View>
    );
  }
  if (!post || error) {
    return (
      <View style={[commonStyles.card, styles.errorCard]}>
        <Text style={styles.error}>
          {error || "Publicação não encontrada."}
        </Text>
        <ActionButton
          label="Voltar para meus posts"
          onPress={() =>
            user?.role === "PROFESSOR"
              ? resetToTeacherPosts(navigation)
              : navigation.goBack()
          }
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        commonStyles.content,
        { paddingBottom: insets.bottom + 32 },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => resetToTeacherDashboard(navigation)}
      >
        <Text style={styles.backLink}>← Voltar ao painel do professor</Text>
      </Pressable>

      <View style={styles.article}>
        {post.imageUrl ? (
          <Image
            accessibilityLabel={post.title}
            resizeMode="cover"
            source={{ uri: post.imageUrl }}
            style={styles.cover}
          />
        ) : (
          <View style={styles.fallbackCover}>
            <Text style={styles.fallbackText}>
              {post.discipline.label.slice(0, 3).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.articleBody}>
          <View style={styles.badges}>
            <Badge label={post.discipline.label} variant="teal" />
            {post.series ? <Badge label={post.series} variant="slate" /> : null}
            <Badge label={`${post.semester} semestre`} variant="slate" />
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.meta}>
            <Text style={styles.metaStrong}>
              {formatProfessorName(post.author.name)}
            </Text>
            {" · "}
            {formatDate(post.createDate)}
            {" · "}
            {estimateReadingTime(post.summary, post.content)} min de leitura
          </Text>

          <Text style={styles.summary}>{post.summary}</Text>

          <View style={styles.paragraphs}>
            {splitParagraphs(post.content).map((paragraph, index) => (
              <Text key={`${post._id}-paragraph-${index}`} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {user?.role === "PROFESSOR" ? (
        <View style={styles.actions}>
          <Text style={commonStyles.subtitle}>
            Status atual: {post.status.label}
          </Text>
          <ActionButton
            label="Editar publicação"
            onPress={() =>
              navigation.navigate("TeacherPostForm", { postId: post._id })
            }
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function splitParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function formatProfessorName(name: string) {
  const trimmed = name.trim();
  return /^prof\.?\s/i.test(trimmed) ? trimmed : `Prof. ${trimmed}`;
}

function estimateReadingTime(...texts: string[]) {
  const words = texts
    .join(" ")
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return Math.max(1, Math.ceil(words.length / 200));
}

function Badge({ label, variant }: { label: string; variant: "teal" | "slate" }) {
  return (
    <View style={[styles.badge, variant === "teal" ? styles.tealBadge : styles.slateBadge]}>
      <Text
        style={[
          styles.badgeText,
          variant === "teal" ? styles.tealBadgeText : styles.slateBadgeText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
