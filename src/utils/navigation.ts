import type { NavigationProp, ParamListBase } from "@react-navigation/native";

// Rebuilds the stack as Dashboard -> Posts so "back" never loops through
// screens (view/edit) the user already left.
export function resetToTeacherPosts(navigation: NavigationProp<ParamListBase>) {
  navigation.reset({
    index: 1,
    routes: [{ name: "TeacherDashboard" }, { name: "TeacherPosts" }],
  });
}

export function resetToTeacherDashboard(
  navigation: NavigationProp<ParamListBase>,
) {
  navigation.reset({ index: 0, routes: [{ name: "TeacherDashboard" }] });
}
