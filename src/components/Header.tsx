import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LightColors, DarkColors } from "../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
  reloadGame: () => void;
  pauseGame: () => void;
  isPaused: boolean;
  isDarkMode: boolean;
  speedLevel: number; // Nueva prop para el nivel de velocidad
  children: React.ReactNode;
}

export default function Header({
  reloadGame,
  pauseGame,
  isPaused,
  isDarkMode,
  speedLevel,
  children,
}: HeaderProps): React.JSX.Element {
  const Colors = isDarkMode ? DarkColors : LightColors;

  // Función para generar iconos de velocidad
  const renderSpeedIcons = () => {
    const icons = [];
    for (let i = 1; i <= 10; i++) {
      icons.push(
        <MaterialIcons
          key={i}
          name="speed"
          size={16}
          color={i <= speedLevel ? Colors.primary : Colors.secondary}
          style={styles.speedIcon}
        />
      );
    }
    return icons;
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <TouchableOpacity onPress={reloadGame}>
        <MaterialIcons name="replay" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.speedContainer}>
        <Text style={[styles.speedText, { color: Colors.primary }]}>
          Velocidad:
        </Text>
        <View style={styles.speedIconsContainer}>
          {renderSpeedIcons()}
        </View>
        <Text style={[styles.speedLevel, { color: Colors.primary }]}>
          {speedLevel}/10
        </Text>
      </View>

      {children}

      <TouchableOpacity onPress={pauseGame}>
        <MaterialIcons
          name={isPaused ? "play-arrow" : "pause"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 2,
  },
  speedContainer: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  speedText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  speedIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  speedIcon: {
    marginHorizontal: 1,
  },
  speedLevel: {
    fontSize: 10,
    marginTop: 2,
  },
});