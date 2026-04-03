import { mat4 } from "gl-matrix";

export function calculateTransform(translationX: number, translationY: number, rotation: number, scale: number, width: number, height: number) {
  // Order of transformation matters a lot here, do not touch because it will get absolutely fucked up
  const transform = mat4.create();

  // Translation
  mat4.translate(transform, transform, [
    translationX as number,
    translationY as number,
    0,
  ]);

  // Rotation
  mat4.rotate(transform, transform, rotation, [0, 0, 1]);

  // Scale - Reciprocate, idk why
  const oneOverScale = 1 / scale;
  mat4.scale(transform, transform, [oneOverScale, oneOverScale, oneOverScale]);

  // Aspect ratio - We need to flip y axis because we change from postive y being down to up
  const aspectRatio = width / height;
  mat4.scale(transform, transform, [aspectRatio, -1, 1]);

  return transform;
}

