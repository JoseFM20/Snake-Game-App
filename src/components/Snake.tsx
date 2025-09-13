import React from "react";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { LightColors, DarkColors } from "../styles/colors";
import { Coordinate } from "../types/types";

interface SnakeProps {
  snake: Coordinate[];
  isDarkMode: boolean; // <-- agrega esta línea
}

export default function Snake({ snake, isDarkMode }: SnakeProps): React.JSX.Element {
  const Colors = isDarkMode ? DarkColors : LightColors;

  return (
    <Fragment>
      {snake.map((segment: any, index: number) => {
        const segmentStyle = {
          left: segment.x * 10,
          top: segment.y * 10,
          backgroundColor: Colors.primary, // <-- usa el color dinámico
        };
        return <View key={index} style={[styles.snake, segmentStyle]} />;
      })}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  snake: {
    width: 15,
    height: 15,
    borderRadius: 7,
    position: "absolute",
  },
});