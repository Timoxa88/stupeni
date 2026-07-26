/** Калькулятор Hit Ceramics — публичный API движка (ТЗ §9). */

export * from "./types";
export {
  WASTE_FACTOR,
  STEP_WASTE_FACTOR,
  TILE_PER_SQM,
  FLOOR_MATS,
  HILST_LIFT,
  HILST_AREA_THRESHOLDS,
  HILST_PEDESTALS,
  DEFAULT_PEDESTAL_CODE,
  PEDESTAL_MIN_SIDE_MM,
  pedestalsPerSqm,
  formatKey,
} from "./reference";
export { calcMaterials, materialsTotal, materialsWeightKg } from "./materials";
export { calcModeA, calcMarch } from "./mode-a";
export { calcModeB, slabArea } from "./mode-b";
