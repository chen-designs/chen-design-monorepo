export const ZERO_CHAR = String('\u200b')
// 组件尺寸
export const SIZES = ['mini', 'small', 'medium', 'large'] as const
export type Size = typeof SIZES[number]

export const SHAPES = ['square', 'round', 'circle'] as const
// 组件状态
export const STATUS = ['default', 'primary', 'success', 'warning', 'danger', 'info', 'process'] as const
// 消息类型
export const MESSAGE_TYPES = ['info', 'success', 'warning', 'error'] as const
export type MessageType = typeof MESSAGE_TYPES[number]
// 排列方式
export const ORIENTATIONS = ['horizontal', 'vertical'] as const
export type Orientation = typeof ORIENTATIONS[number]
// 方向
export const DIRECTIONS = ['top', 'right', 'bottom', 'left'] as const
export type Direction = typeof DIRECTIONS[number]
// 文案对齐方式
export const TEXT_ALIGNS = ['left', 'center', 'right'] as const
