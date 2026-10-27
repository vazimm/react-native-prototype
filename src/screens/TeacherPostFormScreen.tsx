import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ActionButton from "../components/ActionButton";
import SelectField from "../components/SelectField";
import { useAuth } from "../contexts/AuthContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import {
  createTeacherPostRequest,
  getDisciplinesRequest,
  getPostByIdRequest,
  getPostStatusesRequest,
  updateTeacherPostRequest,
} from "../services/postService";
import type { Discipline, PostStatus, PostValues } from "../types/models";
import {
  colors,
  commonStyles,
  teacherPostFormStyles as styles,
} from "../styles";
import {
  emptyPostValues,
  plainText,
  validatePost,
  type FieldErrors,
  type FormField,
} from "../utils/validation";
import { normalizeText } from "../utils/post";
import { resetToTeacherPosts } from "../utils/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherPostForm">;

export default function TeacherPostFormScreen({ navigation, route }: Props) {
  const postId = route.params?.postId;
  const { user } = useAuth();
  const [values, setValues] = useState<PostValues>(emptyPostValues);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [statuses, setStatuses] = useState<PostStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadForm() {
      setLoading(true);
      setLoadError("");
      setSaveError("");
      try {
        const [availableDisciplines, availableStatuses, post] =
          await Promise.all([
            getDisciplinesRequest(),
            getPostStatusesRequest(),
            postId ? getPostByIdRequest(postId) : Promise.resolve(null),
          ]);
        if (!active) return;
        if (post && post.author._id !== user?.id) {
          setLoadError("Você só pode editar os seus próprios posts.");
          return;
        }
        setDisciplines(availableDisciplines);
        setStatuses(availableStatuses);
        setValues(
          post
            ? {
                title: post.title,
                summary: post.summary,
                content: post.content,
                disciplineId: post.discipline._id,
                statusId: post.status._id,
                semester: post.semester ?? "",
                series: post.series ?? "",
                imageUrl: post.imageUrl ?? "",
                isFeatured: post.isFeatured ?? false,
              }
            : { ...emptyPostValues },
        );
      } catch (error) {
        if (active)
          setLoadError(
            getRequestError(
              error,
              "Não foi possível carregar o formulário. Tente novamente.",
            ),
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadForm();
    return () => {
      active = false;
    };
  }, [postId, user?.id]);

  const availableCatalogs = useMemo(
    () =>
      disciplines.some((item) => item.isActive) &&
      statuses.some(
        (item) => item.isActive && normalizeText(item.label) !== "arquivado",
      ),
    [disciplines, statuses],
  );

  function changeField<K extends FormField>(field: K, value: PostValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError("");
  }

  async function handleSave() {
    const nextErrors = validatePost(values, disciplines, statuses);
    setErrors(nextErrors);
    setSaveError("");
    if (Object.keys(nextErrors).length > 0) {
      setSaveError("Revise os campos destacados antes de salvar.");
      return;
    }
    const payload: PostValues = {
      ...values,
      title: plainText(values.title),
      summary: plainText(values.summary),
      content: plainText(values.content),
      semester: values.semester.trim(),
      series: values.series.trim(),
      imageUrl: values.imageUrl.trim(),
    };

    try {
      setSaving(true);
      if (postId) await updateTeacherPostRequest(postId, payload);
      else await createTeacherPostRequest(payload);
      Alert.alert(
        "Post salvo",
        postId ? "Post atualizado com sucesso." : "Post criado com sucesso.",
        [{ text: "OK", onPress: () => resetToTeacherPosts(navigation) }],
      );
    } catch (error) {
      setSaveError(
        getRequestError(
          error,
          "Não foi possível salvar o post. Seus dados continuam no formulário; tente novamente.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.teal} size="large" />
        <Text style={commonStyles.subtitle}>Carregando formulário...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={[commonStyles.card, styles.loadError]}>
        <Text style={styles.heading}>Formulário indisponível</Text>
        <Text style={styles.errorText}>{loadError}</Text>
        <ActionButton
          label="Voltar para meus posts"
          onPress={() => resetToTeacherPosts(navigation)}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.page}
    >
      <ScrollView
        contentContainerStyle={commonStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headingBlock}>
          <Text style={commonStyles.title}>
            {postId ? "Editar Post" : "Novo Post"}
          </Text>
          <Text style={commonStyles.subtitle}>
            {postId
              ? "Atualize o conteúdo e salve suas alterações."
              : "Compartilhe um novo conteúdo com seus alunos."}{" "}
            Campos com * são obrigatórios.
          </Text>
        </View>
        {!availableCatalogs ? (
          <Text style={styles.warning}>
            É necessário ter uma disciplina e um status ativos cadastrados para
            salvar posts.
          </Text>
        ) : null}
        <View style={commonStyles.card}>
          <FormInput
            error={errors.title}
            label="Título *"
            maxLength={100}
            onChangeText={(text) => changeField("title", text)}
            placeholder="Título do conteúdo"
            value={values.title}
          />
          <Text style={styles.counter}>
            {values.title.length}/100 caracteres
          </Text>
          <FormInput
            error={errors.summary}
            label="Resumo *"
            maxLength={300}
            multiline
            onChangeText={(text) => changeField("summary", text)}
            placeholder="Uma breve apresentação do post"
            value={values.summary}
          />
          <Text style={styles.counter}>
            {values.summary.length}/300 caracteres
          </Text>
          <FormInput
            error={errors.content}
            label="Conteúdo *"
            multiline
            onChangeText={(text) => changeField("content", text)}
            placeholder="Escreva o conteúdo completo do post"
            value={values.content}
          />
          <Text style={styles.hint}>
            Use texto simples. Separe os parágrafos com uma linha em branco.
          </Text>
          <SelectField
            error={errors.disciplineId}
            label="Disciplina *"
            onChange={(value) => changeField("disciplineId", value)}
            options={[
              { label: "Selecione a disciplina", value: "" },
              ...disciplines
                .filter(
                  (item) => item.isActive || item._id === values.disciplineId,
                )
                .map((item) => ({
                  label: `${item.label}${item.isActive ? "" : " (indisponível)"}`,
                  value: item._id,
                })),
            ]}
            placeholder="Selecione a disciplina"
            value={values.disciplineId}
          />
          <SelectField
            error={errors.statusId}
            label="Status *"
            onChange={(value) => changeField("statusId", value)}
            options={[
              { label: "Selecione o status", value: "" },
              // "Arquivado" não faz parte do fluxo de autoria neste protótipo.
              ...statuses
                .filter(
                  (item) =>
                    (item.isActive || item._id === values.statusId) &&
                    normalizeText(item.label) !== "arquivado",
                )
                .map((item) => ({
                  label: item.label,
                  value: item._id,
                })),
            ]}
            placeholder="Selecione o status"
            value={values.statusId}
          />
          <FormInput
            error={errors.semester}
            label="Semestre *"
            onChangeText={(text) => changeField("semester", text)}
            placeholder="Ex.: 1"
            value={values.semester}
          />
          <FormInput
            label="Série / Ano (opcional)"
            onChangeText={(text) => changeField("series", text)}
            placeholder="Ex.: 1º ano do Ensino Médio"
            value={values.series}
          />
          <FormInput
            autoCapitalize="none"
            error={errors.imageUrl}
            keyboardType="url"
            label="URL da imagem de capa (opcional)"
            onChangeText={(text) => changeField("imageUrl", text)}
            placeholder="https://exemplo.com/imagem.jpg"
            value={values.imageUrl}
          />
          <Text style={styles.hint}>
            Deixe em branco para salvar sem imagem de capa.
          </Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Marcar post como destaque</Text>
            <Switch
              accessibilityLabel="Marcar post como destaque"
              onValueChange={(checked) => changeField("isFeatured", checked)}
              thumbColor={values.isFeatured ? colors.teal : undefined}
              trackColor={{ true: "#99f6e4", false: "#cbd5e1" }}
              value={values.isFeatured}
            />
          </View>
          {saveError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {saveError}
            </Text>
          ) : null}
          <View style={styles.buttons}>
            <ActionButton
              label="Cancelar"
              onPress={() => resetToTeacherPosts(navigation)}
              variant="secondary"
            />
            <ActionButton
              disabled={!availableCatalogs}
              label={postId ? "Salvar alterações" : "Criar post"}
              loading={saving}
              onPress={() => void handleSave()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  maxLength,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  keyboardType?: "default" | "url";
  autoCapitalize?: "none" | "sentences";
}) {
  return (
    <View>
      <Text style={commonStyles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[
          commonStyles.input,
          multiline && styles.multiline,
          error && styles.invalid,
        ]}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function getRequestError(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return fallback;
  }
  const response = (
    error as { response?: { status?: number; data?: { message?: unknown } } }
  ).response;
  if (response?.status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar.";
  }
  if (response?.status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }
  if (response?.status === 404) {
    return "Post, disciplina ou status não encontrado. O cadastro pode ter sido removido.";
  }
  if (response?.status === 400 && typeof response.data?.message === "string") {
    return response.data.message;
  }
  return fallback;
}
