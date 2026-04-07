import FalloffType from "./falloff-type";
import FractalType from "./fractal-type";

export const defaultConfig: Config = {
  width: 960,
  height: 540,

  fractal: FractalType.Julia,

  real: -0.8727786784188099,
  imaginary: -0.2595344618589833,

  exponent: 2,

  translationX: 0,
  translationY: 0,
  rotation: 0,
  scale: 1,

  maxIterations: 100,
  radius: 4,
  
  falloffType: FalloffType.Sigmoid,
  falloffStrength: 3000,

  useSetColorOverValue: false,
  setValue: 0.5,
  falloffColorStrength: 100,

  falloffColorR: 177,
  falloffColorG: 102,
  falloffColorB: 242,
  falloffColorA: 1,

  backgroundColorR: 30,
  backgroundColorG: 30,
  backgroundColorB: 46,
  backgroundColorA: 1,

  setColorR: 0,
  setColorG: 0,
  setColorB: 0,
  setColorA: 1,
};

export interface Config {
  width: number;
  height: number;

  fractal: FractalType;
  
  real: number;
  imaginary: number;

  exponent: number;

  translationX: number;
  translationY: number;
  rotation: number;
  scale: number;

  maxIterations: number;
  radius: number;

  falloffType: FalloffType;
  falloffStrength: number;

  useSetColorOverValue: boolean;
  setValue: number;
  falloffColorStrength: number;

  falloffColorR: number;
  falloffColorG: number;
  falloffColorB: number;
  falloffColorA: number;

  backgroundColorR: number;
  backgroundColorG: number;
  backgroundColorB: number;
  backgroundColorA: number;

  setColorR: number;
  setColorG: number;
  setColorB: number;
  setColorA: number;
}
