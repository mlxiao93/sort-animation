export const ARRAY_LENGTH = 10;   // 数组长度
export const MAX_VALUE = 10;   // 数值最大值

export const RECT_WIDTH = 10;   // 矩形宽度
export const RECT_GAP = 2;      // 矩形间距

export const VIEW_BOX_VERTICAL_GAP = 10;  // viewBox距svg边框的上（下）边距，腾出空间给指示器

export const viewBoxRatio = 2.5;    // viewBox放大比例
export const heightMaxValueRatio = 10;  // 图形高度和最大值的比例

export const viewBoxHeight = MAX_VALUE * heightMaxValueRatio;
export const viewBoxWidth = RECT_WIDTH * ARRAY_LENGTH + RECT_GAP * (ARRAY_LENGTH - 1);

export const svgHeight = (viewBoxHeight + VIEW_BOX_VERTICAL_GAP * 2) * viewBoxRatio;
export const svgWidth = viewBoxWidth * viewBoxRatio;