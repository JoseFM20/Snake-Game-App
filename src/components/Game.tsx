import React, { useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { StyleSheet, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { LightColors, DarkColors } from "../styles/colors";
import { Colors } from "../styles/colors";
import { Direction, Coordinate, GestureEventType } from "../types/types";
import { checkEatsFood } from "../utils/checkEatsFood";
import { checkGameOver } from "../utils/checkGameOver";
import { randomFoodPosition } from "../utils/randomFoodPosition";
import Food from "./Food";
import Header from "./Header";
import Score from "./Score";
import Snake from "./Snake";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 37, yMin: 0, yMax: 70 };
const INITIAL_MOVE_INTERVAL = 150;
const MIN_MOVE_INTERVAL = 30;
const MAX_SPEED_LEVEL = 10;
const SCORE_INCREMENT = 10;

export default function Game(): React.JSX.Element {
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [moveInterval, setMoveInterval] = useState<number>(INITIAL_MOVE_INTERVAL);
  const [speedLevel, setSpeedLevel] = useState<number>(1);
  
  const lastUpdateTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const calculateSpeed = useCallback((snakeLength: number) => {
    const baseSpeed = 0.85;
    const speedUps = Math.floor((snakeLength - 1) / 2);
    const newSpeedLevel = Math.min(speedUps + 1, MAX_SPEED_LEVEL);
    const speedFactor = Math.pow(baseSpeed, newSpeedLevel - 1);
    const newInterval = Math.max(INITIAL_MOVE_INTERVAL * speedFactor, MIN_MOVE_INTERVAL);
    return { newInterval, newSpeedLevel };
  }, []);

  useEffect(() => {
    const { newInterval, newSpeedLevel } = calculateSpeed(snake.length);
    setMoveInterval(newInterval);
    setSpeedLevel(newSpeedLevel);
  }, [snake.length, calculateSpeed]);

  const moveSnake = useCallback(() => {
    const snakeHead = snake[0];
    const newHead = { ...snakeHead };

    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver(true);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
    }

    if (checkEatsFood(newHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake(prev => [newHead, ...prev]);
      setScore(prev => prev + SCORE_INCREMENT);
      setIsDarkMode(prev => !prev);
    } else {
      setSnake(prev => [newHead, ...prev.slice(0, -1)]);
    }
  }, [snake, food, direction]);

  const gameLoop = useCallback((timestamp: number) => {
    if (isGameOver || isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (timestamp - lastUpdateTimeRef.current > moveInterval) {
      lastUpdateTimeRef.current = timestamp;
      moveSnake();
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isGameOver, isPaused, moveInterval, moveSnake]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [gameLoop]);

  const handleGesture = useCallback((event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;
    const deadzone = 10;
    
    if (Math.abs(translationX) > deadzone || Math.abs(translationY) > deadzone) {
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0 && direction !== Direction.Left) {
          setDirection(Direction.Right);
        } else if (translationX < 0 && direction !== Direction.Right) {
          setDirection(Direction.Left);
        }
      } else {
        if (translationY > 0 && direction !== Direction.Up) {
          setDirection(Direction.Down);
        } else if (translationY < 0 && direction !== Direction.Down) {
          setDirection(Direction.Up);
        }
      }
    }
  }, [direction]);

  const reloadGame = useCallback(() => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
    setIsDarkMode(false);
    setMoveInterval(INITIAL_MOVE_INTERVAL);
    setSpeedLevel(1);
  }, []);

  const pauseGame = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const Colors = isDarkMode ? DarkColors : LightColors;

  return (
    <PanGestureHandler onGestureEvent={handleGesture}>
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.primary }]}>
        <Header
          reloadGame={reloadGame}
          pauseGame={pauseGame}
          isPaused={isPaused}
          isDarkMode={isDarkMode}
          speedLevel={speedLevel}
        >
          <Score score={score} isDarkMode={isDarkMode} />
        </Header>
        <View style={[styles.boundaries, { backgroundColor: Colors.background, borderColor: Colors.primary }]}>
          <Snake snake={snake} isDarkMode={isDarkMode} />
          <Food x={food.x} y={food.y} />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background,
  },
});