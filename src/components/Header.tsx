import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LightColors, DarkColors } from "../styles/colors";
import { FontAwesome } from "@expo/vector-icons";

interface HeaderProps {
  reloadGame: () => void;
  pauseGame: () => void;
  children: React.JSX.Element;
  isPaused: boolean;
  isDarkMode: boolean; // <-- agrega esta línea
}

export default function Header({
  children,
  reloadGame,
  pauseGame,
  isPaused,
  isDarkMode, // <-- agrega esta línea
}: HeaderProps): React.JSX.Element {
  const Colors = isDarkMode ? DarkColors : LightColors;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors.background, borderColor: Colors.primary },
      ]}
    >
      <TouchableOpacity onPress={reloadGame}>
        <Ionicons name="reload-circle" size={35} color={Colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pauseGame}>
        <FontAwesome
          name={isPaused ? "play-circle" : "pause-circle"}
          size={35}
          color={Colors.primary}
        />
      </TouchableOpacity>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
    padding: 15,
  },
});