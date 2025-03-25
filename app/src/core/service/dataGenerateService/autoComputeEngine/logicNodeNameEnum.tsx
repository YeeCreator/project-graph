/**
 * 所有逻辑节点的枚举
 */
export enum LogicNodeNameEnum {
  // 逻辑运算符
  AND = "#AND#",
  OR = "#OR#",
  NOT = "#NOT#",
  XOR = "#XOR#",
  // 测试
  TEST = "#TEST#",
  // 数学运算
  ADD = "#ADD#",
  SUBTRACT = "#SUB#",
  MULTIPLY = "#MUL#",
  DIVIDE = "#DIV#",
  MODULO = "#MOD#",
  FLOOR = "#FLOOR#",
  CEIL = "#CEIL#",
  ROUND = "#ROUND#",
  SQRT = "#SQRT#",
  POWER = "#POW#",
  LOG = "#LOG#",
  ABS = "#ABS#",
  // 概率论
  RANDOM = "#RANDOM#",
  RANDOM_INT = "#RANDOM_INT#",
  RANDOM_FLOAT = "#RANDOM_FLOAT#",
  RANDOM_ITEM = "#RANDOM_ITEM#",
  RANDOM_ITEMS = "#RANDOM_ITEMS#",
  RANDOM_POISSON = "#RANDOM_POISSON#",
  // 数组
  // 数学一元函数
  SIN = "#SIN#",
  COS = "#COS#",
  TAN = "#TAN#",
  ASIN = "#ASIN#",
  ACOS = "#ACOS#",
  ATAN = "#ATAN#",
  LN = "#LN#",
  EXP = "#EXP#",
  // 取值运算
  MAX = "#MAX#",
  MIN = "#MIN#",
  // 比较运算
  LT = "#LT#",
  GT = "#GT#",
  LTE = "#LTE#",
  GTE = "#GTE#",
  EQ = "#EQ#",
  NEQ = "#NEQ#",

  // 字符串
  UPPER = "#UPPER#",
  LOWER = "#LOWER#",
  LEN = "#LEN#",
  COPY = "#COPY#",
  SPLIT = "#SPLIT#",
  REPLACE = "#REPLACE#",
  CONNECT = "#CONNECT#",
  CHECK_REGEX_MATCH = "#CHECK_REGEX_MATCH#",
  // 统计
  COUNT = "#COUNT#",
  AVE = "#AVE#",
  MEDIAN = "#MEDIAN#",
  MODE = "#MODE#",
  VARIANCE = "#VARIANCE#",
  STANDARD_DEVIATION = "#STANDARD_DEVIATION#",
  // 编程类
  SET_VAR = "#SET_VAR#",
  GET_VAR = "#GET_VAR#",
  // 其他
  RGB = "#RGB#",
  RGBA = "#RGBA#",
  GET_LOCATION = "#GET_LOCATION#",
  SET_LOCATION = "#SET_LOCATION#",
  SET_LOCATION_BY_UUID = "#SET_LOCATION_BY_UUID#",
  GET_LOCATION_BY_UUID = "#GET_LOCATION_BY_UUID#",
  GET_SIZE = "#GET_SIZE#",
  GET_MOUSE_LOCATION = "#GET_MOUSE_LOCATION#",
  GET_MOUSE_WORLD_LOCATION = "#GET_MOUSE_WORLD_LOCATION#",
  GET_CAMERA_LOCATION = "#GET_CAMERA_LOCATION#",
  SET_CAMERA_LOCATION = "#SET_CAMERA_LOCATION#",
  GET_CAMERA_SCALE = "#GET_CAMERA_SCALE#",
  SET_CAMERA_SCALE = "#SET_CAMERA_SCALE#",
  IS_COLLISION = "#IS_COLLISION#",
  GET_TIME = "#GET_TIME#",
  GET_DATE_TIME = "#GET_DATE_TIME#",
  ADD_DATE_TIME = "#ADD_DATE_TIME#",
  PLAY_SOUND = "#PLAY_SOUND#",
  GET_NODE_UUID = "#GET_NODE_UUID#",
  GET_NODE_RGBA = "#GET_NODE_RGBA#",
  COLLECT_NODE_DETAILS_BY_RGBA = "#COLLECT_NODE_DETAILS_BY_RGBA#",
  COLLECT_NODE_NAME_BY_RGBA = "#COLLECT_NODE_NAME_BY_RGBA#",
  FPS = "#FPS#",
  CREATE_TEXT_NODE_ON_LOCATION = "#CREATE_TEXT_NODE_ON_LOCATION#",
  IS_HAVE_ENTITY_ON_LOCATION = "#IS_HAVE_ENTITY_ON_LOCATION#",
  REPLACE_GLOBAL_CONTENT = "#REPLACE_GLOBAL_CONTENT#",
  SEARCH_CONTENT = "#SEARCH_CONTENT#",
  DELETE_PEN_STROKE_BY_COLOR = "#DELETE_PEN_STROKE_BY_COLOR#",
}
export const LogicNodeNameToRenderNameMap: {
  [key in LogicNodeNameEnum]: string;
} = {
  [LogicNodeNameEnum.AND]: "and",
  [LogicNodeNameEnum.OR]: "or",
  [LogicNodeNameEnum.NOT]: "not",
  [LogicNodeNameEnum.XOR]: "xor",
  [LogicNodeNameEnum.TEST]: "测试",
  [LogicNodeNameEnum.ADD]: "+",
  [LogicNodeNameEnum.SUBTRACT]: "-",
  [LogicNodeNameEnum.MULTIPLY]: "×",
  [LogicNodeNameEnum.DIVIDE]: "÷",
  [LogicNodeNameEnum.MODULO]: "%",
  [LogicNodeNameEnum.FLOOR]: "⌊ ⌋",
  [LogicNodeNameEnum.CEIL]: "⌈ ⌉",
  [LogicNodeNameEnum.ROUND]: "round",
  [LogicNodeNameEnum.SQRT]: "√",
  [LogicNodeNameEnum.POWER]: "幂",
  [LogicNodeNameEnum.LOG]: "log",
  [LogicNodeNameEnum.ABS]: "| |",
  [LogicNodeNameEnum.RANDOM]: "Random",
  [LogicNodeNameEnum.SIN]: "sin",
  [LogicNodeNameEnum.COS]: "cos",
  [LogicNodeNameEnum.ASIN]: "arcsin",
  [LogicNodeNameEnum.ACOS]: "arccos",
  [LogicNodeNameEnum.ATAN]: "arctan",
  [LogicNodeNameEnum.LN]: "ln",
  [LogicNodeNameEnum.EXP]: "exp",
  [LogicNodeNameEnum.TAN]: "tan",
  [LogicNodeNameEnum.MAX]: "Max",
  [LogicNodeNameEnum.MIN]: "Min",
  [LogicNodeNameEnum.LT]: "<",
  [LogicNodeNameEnum.GT]: ">",
  [LogicNodeNameEnum.LTE]: "≤",
  [LogicNodeNameEnum.GTE]: "≥",
  [LogicNodeNameEnum.EQ]: "==",
  [LogicNodeNameEnum.NEQ]: "≠",
  [LogicNodeNameEnum.UPPER]: "大写",
  [LogicNodeNameEnum.LOWER]: "小写",
  [LogicNodeNameEnum.LEN]: "字符长度",
  [LogicNodeNameEnum.COPY]: "复制",
  [LogicNodeNameEnum.SPLIT]: "分割",
  [LogicNodeNameEnum.REPLACE]: "替换",
  [LogicNodeNameEnum.CONNECT]: "连接",
  [LogicNodeNameEnum.CHECK_REGEX_MATCH]: "正则匹配",
  [LogicNodeNameEnum.COUNT]: "count",
  [LogicNodeNameEnum.AVE]: "平均值",
  [LogicNodeNameEnum.MEDIAN]: "中位数",
  [LogicNodeNameEnum.MODE]: "众数",
  [LogicNodeNameEnum.VARIANCE]: "方差",
  [LogicNodeNameEnum.STANDARD_DEVIATION]: "标准差",
  [LogicNodeNameEnum.RANDOM_FLOAT]: "随机浮点数",
  [LogicNodeNameEnum.RANDOM_INT]: "随机整数",
  [LogicNodeNameEnum.RANDOM_ITEM]: "随机选项",
  [LogicNodeNameEnum.RANDOM_ITEMS]: "随机选项组",
  [LogicNodeNameEnum.RANDOM_POISSON]: "泊松分布",

  [LogicNodeNameEnum.RGB]: "通过RGB设置节点颜色",
  [LogicNodeNameEnum.RGBA]: "通过RGBA设置节点颜色",
  [LogicNodeNameEnum.GET_LOCATION]: "获取节点位置",
  [LogicNodeNameEnum.SET_LOCATION]: "设置节点位置",
  [LogicNodeNameEnum.SET_LOCATION_BY_UUID]: "根据UUID设置节点位置",
  [LogicNodeNameEnum.GET_LOCATION_BY_UUID]: "根据UUID获得节点位置",
  [LogicNodeNameEnum.GET_SIZE]: "获取节点大小",
  [LogicNodeNameEnum.GET_MOUSE_LOCATION]: "获取鼠标窗口位置",
  [LogicNodeNameEnum.GET_MOUSE_WORLD_LOCATION]: "获取鼠标世界位置",
  [LogicNodeNameEnum.GET_CAMERA_LOCATION]: "获取相机位置",
  [LogicNodeNameEnum.SET_CAMERA_LOCATION]: "设置相机位置",
  [LogicNodeNameEnum.GET_CAMERA_SCALE]: "获取相机缩放",
  [LogicNodeNameEnum.SET_CAMERA_SCALE]: "设置相机缩放",
  [LogicNodeNameEnum.IS_COLLISION]: "碰撞检测",
  [LogicNodeNameEnum.GET_TIME]: "获取当前时间戳",
  [LogicNodeNameEnum.GET_DATE_TIME]: "获取当前日期时间",
  [LogicNodeNameEnum.ADD_DATE_TIME]: "增加当前日期时间",
  [LogicNodeNameEnum.PLAY_SOUND]: "播放声音",
  [LogicNodeNameEnum.GET_NODE_UUID]: "获取节点UUID",
  [LogicNodeNameEnum.GET_NODE_RGBA]: "获取节点颜色",
  [LogicNodeNameEnum.COLLECT_NODE_DETAILS_BY_RGBA]: "根据颜色收集节点详情",
  [LogicNodeNameEnum.COLLECT_NODE_NAME_BY_RGBA]: "根据颜色收集节点名称",
  [LogicNodeNameEnum.FPS]: "FPS",
  [LogicNodeNameEnum.CREATE_TEXT_NODE_ON_LOCATION]: "在指定位置创建节点",
  [LogicNodeNameEnum.IS_HAVE_ENTITY_ON_LOCATION]: "判断某位置是否存在实体",
  [LogicNodeNameEnum.REPLACE_GLOBAL_CONTENT]: "全局替换内容",
  [LogicNodeNameEnum.SEARCH_CONTENT]: "搜索内容",
  [LogicNodeNameEnum.DELETE_PEN_STROKE_BY_COLOR]: "删除画笔颜色的笔画",

  [LogicNodeNameEnum.SET_VAR]: "设置变量",
  [LogicNodeNameEnum.GET_VAR]: "获取变量",
};

/**
 * 逻辑节点的输入参数提示文本信息
 */
export const LogicNodeNameToArgsTipsMap: {
  [key in LogicNodeNameEnum]: string;
} = {
  [LogicNodeNameEnum.AND]: "a0 && a1 && a2 &&...",
  [LogicNodeNameEnum.OR]: "a0 || a1 || a2 || ...",
  [LogicNodeNameEnum.NOT]: "a0",
  [LogicNodeNameEnum.XOR]: "a0 ^ a1 ^ a2 ^ ...",
  [LogicNodeNameEnum.TEST]: "无输入",
  [LogicNodeNameEnum.ADD]: "a0 + a1 + a2 + ...",
  [LogicNodeNameEnum.SUBTRACT]: "a0 - a1 - a2 - ...",
  [LogicNodeNameEnum.MULTIPLY]: "a0 × a1 × a2 × ...",
  [LogicNodeNameEnum.DIVIDE]: "a0 ÷ a1 ÷ a2 ÷ ...",
  [LogicNodeNameEnum.MODULO]: "a0 % a1 % a2 % ...",
  [LogicNodeNameEnum.FLOOR]: "⌊a0⌋, ⌊a1⌋, ⌊a2⌋, ...",
  [LogicNodeNameEnum.CEIL]: "⌈a0⌉, ⌈a1⌉, ⌈a2⌉, ...",
  [LogicNodeNameEnum.ROUND]: "round(a0), round(a1), round(a2), ...",
  [LogicNodeNameEnum.SQRT]: "√a0, √a1, √a2, ...",
  [LogicNodeNameEnum.POWER]: "a0 ** a1 ** a2 ** ...",
  [LogicNodeNameEnum.LOG]: "a0: base, a1: number",
  [LogicNodeNameEnum.ABS]: "|a0|, |a1|, |a2|, ...",
  [LogicNodeNameEnum.RANDOM]: "无输入",
  [LogicNodeNameEnum.RANDOM_INT]: "a0: 最小值, a1: 最大值",
  [LogicNodeNameEnum.RANDOM_FLOAT]: "a0: 最小值, a1: 最大值",
  [LogicNodeNameEnum.RANDOM_ITEM]: "随机选项",
  [LogicNodeNameEnum.RANDOM_ITEMS]: "随机选项组",
  [LogicNodeNameEnum.RANDOM_POISSON]: "a0: lambda",
  [LogicNodeNameEnum.SIN]: "sin(a0), sin(a1), sin(a2), ...",
  [LogicNodeNameEnum.COS]: "cos(a0), cos(a1), cos(a2), ...",
  [LogicNodeNameEnum.ASIN]: "arcsin(a0), arcsin(a1), arcsin(a2), ...",
  [LogicNodeNameEnum.ACOS]: "arccos(a0), arccos(a1), arccos(a2), ...",
  [LogicNodeNameEnum.ATAN]: "arctan(a0), arctan(a1), arctan(a2), ...",
  [LogicNodeNameEnum.LN]: "ln(a0), ln(a1), ln(a2), ...",
  [LogicNodeNameEnum.EXP]: "exp(a0), exp(a1), exp(a2), ...",
  [LogicNodeNameEnum.TAN]: "tan(a0), tan(a1), tan(a2), ...",
  [LogicNodeNameEnum.MAX]: "Max(a0, a1, a2, ...)",
  [LogicNodeNameEnum.MIN]: "Min(a0, a1, a2, ...)",
  [LogicNodeNameEnum.LT]: "a0 < a1 < a2 < ...",
  [LogicNodeNameEnum.GT]: "a0 > a1 > a2 > ...",
  [LogicNodeNameEnum.LTE]: "a0 ≤ a1 ≤ a2 ≤ ...",
  [LogicNodeNameEnum.GTE]: "a0 ≥ a1 ≥ a2 ≥ ...",
  [LogicNodeNameEnum.EQ]: "a0 == a1 == a2 == ...",
  [LogicNodeNameEnum.NEQ]: "a0 ≠ a1 ≠ a2 ≠ ...",
  [LogicNodeNameEnum.UPPER]: "a0: string, 将字符串转为大写",
  [LogicNodeNameEnum.LOWER]: "a0: string, 将字符串转为小写",
  [LogicNodeNameEnum.LEN]: "a0: string, 获取字符串长度",
  [LogicNodeNameEnum.COPY]: "a0: string, 复制字符串",
  [LogicNodeNameEnum.SPLIT]: "a0: string, a1: separator, a2: separator2, a3: ...",
  [LogicNodeNameEnum.REPLACE]: "a0: string, a1: old, a2: new, 替换字符串",
  [LogicNodeNameEnum.CONNECT]: "a0 + a1 + a2 + ... 连接字符串",
  [LogicNodeNameEnum.CHECK_REGEX_MATCH]: "正则匹配",
  [LogicNodeNameEnum.COUNT]: "a0, a1, ... 统计元素个数",
  [LogicNodeNameEnum.AVE]: "a0, a1, ... ",
  [LogicNodeNameEnum.MEDIAN]: "a0, a1, ... ",
  [LogicNodeNameEnum.MODE]: "a0, a1, ... ",
  [LogicNodeNameEnum.VARIANCE]: "a0, a1, ... ",
  [LogicNodeNameEnum.STANDARD_DEVIATION]: "a0, a1, ... ",
  [LogicNodeNameEnum.RGB]: "a0: red, a1: green, a2: blue",
  [LogicNodeNameEnum.RGBA]: "a0: red, a1: green, a2: blue, a3: alpha",
  [LogicNodeNameEnum.GET_LOCATION]: "a0: node",
  [LogicNodeNameEnum.SET_LOCATION]: "a0: x, a1: y",
  [LogicNodeNameEnum.SET_LOCATION_BY_UUID]: "a0: uuid, a1: x, a2: y",
  [LogicNodeNameEnum.GET_LOCATION_BY_UUID]: "a0: uuid",
  [LogicNodeNameEnum.GET_SIZE]: "a0: node",
  [LogicNodeNameEnum.GET_MOUSE_LOCATION]: "无输入",
  [LogicNodeNameEnum.GET_MOUSE_WORLD_LOCATION]: "无输入",
  [LogicNodeNameEnum.GET_CAMERA_LOCATION]: "无输入",
  [LogicNodeNameEnum.SET_CAMERA_LOCATION]: "a0: x, a1: y",
  [LogicNodeNameEnum.GET_CAMERA_SCALE]: "无输入",
  [LogicNodeNameEnum.SET_CAMERA_SCALE]: "a0: number",
  [LogicNodeNameEnum.IS_COLLISION]: "a0: node1, a1: node2, a2, ...",
  [LogicNodeNameEnum.GET_TIME]: "无输入",
  [LogicNodeNameEnum.GET_DATE_TIME]: "无输入",
  [LogicNodeNameEnum.ADD_DATE_TIME]: "无输入",
  [LogicNodeNameEnum.PLAY_SOUND]: "a0: filePath, a1: 0/1",
  [LogicNodeNameEnum.GET_NODE_UUID]: "a0: node",
  [LogicNodeNameEnum.GET_NODE_RGBA]: "a0: node",
  [LogicNodeNameEnum.COLLECT_NODE_DETAILS_BY_RGBA]: "a0: red, a1: green, a2: blue, a3: alpha",
  [LogicNodeNameEnum.COLLECT_NODE_NAME_BY_RGBA]: "a0: red, a1: green, a2: blue, a3: alpha",
  [LogicNodeNameEnum.FPS]: "无输入",
  [LogicNodeNameEnum.CREATE_TEXT_NODE_ON_LOCATION]: "a0: x, a1: y, a2: text, a3: 0/1",
  [LogicNodeNameEnum.IS_HAVE_ENTITY_ON_LOCATION]: "a0: x, a1: y",
  [LogicNodeNameEnum.REPLACE_GLOBAL_CONTENT]: "a0: 被替换内容, a1: 新内容",
  [LogicNodeNameEnum.SEARCH_CONTENT]: "a0: 被搜索内容, a1: 是否大小写敏感0/1",
  [LogicNodeNameEnum.DELETE_PEN_STROKE_BY_COLOR]: "a0: red, a1: green, a2: blue, a3: alpha",

  [LogicNodeNameEnum.SET_VAR]: "a0: name, a1: value",
  [LogicNodeNameEnum.GET_VAR]: "a0: name",
};

/**
 * 获取逻辑节点的渲染名称
 * 如果输入的不是名称，则返回原值
 * @param name
 * @returns
 */
export function getLogicNodeRenderName(name: LogicNodeNameEnum): string {
  // 使用名称作为键来索引 LogicNodeNameToRenderNameMap 对象
  const renderName = LogicNodeNameToRenderNameMap[name];
  return renderName !== undefined ? renderName : name; // 如果找不到对应的渲染名称，则返回原值
}

/**
 * 简化的符号
 * 用于连线
 */
export enum LogicNodeSimpleOperatorEnum {
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DIVIDE = "/",
  MODULO = "%",
  POWER = "**",
  // 比较
  LT = "<",
  GT = ">",
  LTE = "<=",
  GTE = ">=",
  EQ = "==",
  NEQ = "!=",
  // 逻辑
  AND = "&&",
  OR = "||",
  NOT = "!",
  XOR = "^",
}
