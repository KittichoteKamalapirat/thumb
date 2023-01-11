// value: "Label"
export const CONTAINER_TAB_OBJ = {
  current: "Current",
  snapshots: "Snapshots",
} as const;

export type CONTAINER_TAB_VALUES = keyof typeof CONTAINER_TAB_OBJ;
export type CONTAINER_TAB_LABELS =
  typeof CONTAINER_TAB_OBJ[CONTAINER_TAB_VALUES];

interface ContainerTabOption {
  value: CONTAINER_TAB_VALUES;
  label: CONTAINER_TAB_LABELS;
}
export const serviceTypeOptions: ContainerTabOption[] = Object.keys(
  CONTAINER_TAB_OBJ
).map((key) => ({
  value: key as CONTAINER_TAB_VALUES,
  label: CONTAINER_TAB_OBJ[key as CONTAINER_TAB_VALUES],
}));
