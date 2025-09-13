import React from "react";
import { Text, StyleSheet } from "react-native";
import { LightColors, DarkColors } from "../styles/colors";

interface ScoreProps {
  score: number;
  isDarkMode: boolean; // <-- agrega esta línea
}

export default function Score({ score, isDarkMode }: ScoreProps): React.JSX.Element {
  const Colors = isDarkMode ? DarkColors : LightColors;

  return <Text style={[styles.text, { color: Colors.primary }]}>🍎 {score}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
});