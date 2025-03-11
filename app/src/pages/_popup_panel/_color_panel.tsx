import { Blend } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { Popup } from "../../components/popup";
import { Color } from "../../core/dataStruct/Color";
import { ColorManager } from "../../core/service/feedbackService/ColorManager";
import ColorManagerPanel from "./_color_manager_panel";
import { StageObjectColorManager } from "../../core/stage/stageManager/concreteMethods/StageObjectColorManager";
/**
 * 调色盘面板
 * @param param0
 * @returns
 */
export default function ColorPanel() {
  const [currentColors, setCurrentColors] = useState<Color[]>([]);

  useEffect(() => {
    ColorManager.getUserEntityFillColors().then((colors) => {
      setCurrentColors(colors);
    });
  }, []);

  return (
    <div className="bg-panel-bg flex h-64 w-64 flex-col rounded-lg">
      {/* 官方提供的默认颜色 */}
      <div className="flex flex-wrap items-center justify-center">
        <div
          className="m-1 h-5 w-5 cursor-pointer rounded bg-red-500 hover:scale-125"
          onClick={() => {
            const color = new Color(239, 68, 68);
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        />
        <div
          className="m-1 h-5 w-5 cursor-pointer rounded bg-yellow-500 hover:scale-125"
          onClick={() => {
            const color = new Color(234, 179, 8);
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        />
        <div
          className="m-1 h-5 w-5 cursor-pointer rounded bg-green-600 hover:scale-125"
          onClick={() => {
            const color = new Color(22, 163, 74);
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        />
        <div
          className="m-1 h-5 w-5 cursor-pointer rounded bg-blue-500 hover:scale-125"
          onClick={() => {
            const color = new Color(59, 130, 246);
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        />
        <div
          className="m-1 h-5 w-5 cursor-pointer rounded bg-purple-500 hover:scale-125"
          onClick={() => {
            const color = new Color(168, 85, 247);
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        />
        {/* 清除颜色 */}
        <div
          className="m-1 h-5 w-5 animate-pulse cursor-pointer rounded bg-transparent text-center text-sm hover:scale-125"
          onClick={() => {
            const color = Color.Transparent;
            StageObjectColorManager.setEntityColor(color);
            StageObjectColorManager.setEdgeColor(color);
            StageObjectColorManager.setStrokeColor(color);
          }}
        >
          <Blend className="h-5 w-5" />
        </div>
      </div>
      {/* 按钮 */}
      <div className="flex flex-wrap items-center justify-center">
        {/* 临时自定义 */}
        <input
          type="color"
          id="colorPicker"
          value="#ff0000"
          onChange={(e) => {
            const color = e.target.value;
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            StageObjectColorManager.setEntityColor(new Color(r, g, b));
            StageObjectColorManager.setEdgeColor(new Color(r, g, b));
            StageObjectColorManager.setStrokeColor(new Color(r, g, b));
          }}
        ></input>
        <Button
          onClick={() => {
            Popup.show(<ColorManagerPanel />, true);
          }}
        >
          打开颜色管理
        </Button>
      </div>
      <hr className="text-panel-details-text my-2" />
      {/* 用户颜色库 */}
      <div className="flex max-w-64 flex-1 flex-wrap items-center justify-center">
        {currentColors.length === 0 && (
          <div className="m-1 h-5 w-5 rounded bg-transparent text-center text-sm">暂无颜色</div>
        )}
        {currentColors.map((color) => {
          return (
            <div
              className="m-1 h-5 w-5 cursor-pointer rounded hover:scale-125"
              key={color.toString()}
              style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
              }}
              onClick={() => {
                StageObjectColorManager.setEntityColor(color);
                StageObjectColorManager.setEdgeColor(color);
                StageObjectColorManager.setStrokeColor(color);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
