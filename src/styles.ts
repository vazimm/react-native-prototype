import { StyleSheet } from "react-native";

export const colors = {
  ink: "#0f172a",
  muted: "#64748b",
  border: "#cbd5e1",
  surface: "#ffffff",
  background: "#f8fafc",
  teal: "#0f766e",
  tealLight: "#f0fdfa",
  red: "#be123c",
  redLight: "#fff1f2",
  amber: "#92400e",
  amberLight: "#fffbeb",
  green: "#047857",
  greenLight: "#ecfdf5",
};

export const commonStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export const actionButtonStyles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  secondary: {
    borderColor: colors.border,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
  },
});

export const selectFieldStyles = StyleSheet.create({
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    color: colors.ink,
    fontSize: 15,
    flexShrink: 1,
  },
  placeholder: {
    color: colors.muted,
  },
  chevron: {
    color: colors.muted,
    fontSize: 20,
    paddingLeft: 8,
  },
  invalid: {
    borderColor: colors.red,
  },
  error: {
    color: colors.red,
    fontSize: 13,
    marginTop: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "75%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  option: {
    minHeight: 48,
    justifyContent: "center",
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    color: colors.ink,
    fontSize: 16,
  },
  selectedOption: {
    color: colors.teal,
    fontWeight: "700",
  },
});

export const loginStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    gap: 24,
  },
  heading: {
    gap: 8,
  },
  brand: {
    color: colors.teal,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export const teacherDashboardStyles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    flex: 1,
    gap: 4,
  },
  logout: {
    color: colors.teal,
    fontWeight: "700",
    padding: 8,
  },
  metrics: {
    flexDirection: "row",
    gap: 12,
  },
  metric: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 112,
  },
  metricCount: {
    color: colors.teal,
    fontSize: 32,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
  },
  link: {
    color: colors.teal,
    fontWeight: "700",
  },
  postTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  postTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  published: {
    backgroundColor: colors.greenLight,
  },
  publishedText: {
    color: colors.green,
  },
  draft: {
    backgroundColor: colors.amberLight,
  },
  draftText: {
    color: colors.amber,
  },
  empty: {
    color: colors.muted,
    padding: 12,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderColor: "#fecdd3",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  errorTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
  },
  errorText: {
    color: colors.muted,
  },
});

export const teacherPostsStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  header: {
    gap: 14,
  },
  filters: {
    gap: 12,
  },
  statusFilters: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  activeFilter: {
    borderColor: colors.teal,
    backgroundColor: colors.tealLight,
  },
  filterText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  activeFilterText: {
    color: colors.teal,
  },
  errorBox: {
    backgroundColor: colors.redLight,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  errorText: {
    color: colors.red,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  postTitle: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
  },
  date: {
    color: colors.muted,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingRight: 20,
  },
  actionLabel: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
  danger: {
    color: colors.red,
  },
});

export const teacherPostFormStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadError: {
    margin: 20,
  },
  headingBlock: {
    gap: 6,
  },
  heading: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  warning: {
    color: colors.amber,
    backgroundColor: colors.amberLight,
    borderRadius: 10,
    padding: 14,
    lineHeight: 20,
  },
  counter: {
    color: colors.muted,
    fontSize: 12,
    marginTop: -8,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -6,
  },
  multiline: {
    minHeight: 112,
    paddingTop: 12,
  },
  invalid: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 13,
    lineHeight: 19,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  switchLabel: {
    color: "#334155",
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  buttons: {
    gap: 10,
    borderTopColor: "#e2e8f0",
    borderTopWidth: 1,
    paddingTop: 12,
  },
});

export const postViewStyles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  errorCard: {
    margin: 20,
  },
  error: {
    color: colors.red,
  },
  backLink: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "700",
  },
  article: {
    backgroundColor: colors.surface,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: 260,
    backgroundColor: "#e2e8f0",
  },
  fallbackCover: {
    width: "100%",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#cbd5e1",
  },
  fallbackText: {
    color: "#334155",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 4,
  },
  articleBody: {
    padding: 20,
    gap: 12,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tealBadge: {
    backgroundColor: colors.tealLight,
  },
  slateBadge: {
    backgroundColor: "#f1f5f9",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  tealBadgeText: {
    color: colors.teal,
  },
  slateBadgeText: {
    color: colors.muted,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "700",
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  metaStrong: {
    color: "#334155",
    fontWeight: "700",
  },
  summary: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    borderLeftColor: colors.teal,
    borderLeftWidth: 4,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
  },
  paragraphs: {
    gap: 14,
  },
  paragraph: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 27,
  },
  actions: {
    gap: 10,
  },
});

export const rootNavigatorStyles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  gateErrorText: {
    color: colors.red,
    textAlign: "center",
  },
  gateActionText: {
    color: colors.teal,
    fontWeight: "700",
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  accessDeniedTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  accessDeniedText: {
    color: colors.muted,
  },
});
