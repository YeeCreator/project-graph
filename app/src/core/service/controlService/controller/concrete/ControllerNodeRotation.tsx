import { CursorNameEnum } from "../../../../../types/cursors";
import { Vector } from "../../../../dataStruct/Vector";
import { Renderer } from "../../../../render/canvas2d/renderer";
import { Stage } from "../../../../stage/Stage";
import { StageNodeConnector } from "../../../../stage/stageManager/concreteMethods/StageNodeConnector";
import { StageNodeRotate } from "../../../../stage/stageManager/concreteMethods/stageNodeRotate";
import { StageHistoryManager } from "../../../../stage/stageManager/StageHistoryManager";
import { StageManager } from "../../../../stage/stageManager/StageManager";
import { Controller } from "../Controller";
import { ControllerClass } from "../ControllerClass";

/**
 * 旋转图的节点控制器
 * 鼠标按住Ctrl旋转节点
 * 或者拖拽连线旋转
 */
export const ControllerNodeRotation = new ControllerClass();

ControllerNodeRotation.mousewheel = (event: WheelEvent) => {
  if (Controller.pressingKeySet.has("control")) {
    const location = Renderer.transformView2World(new Vector(event.clientX, event.clientY));
    const hoverNode = StageManager.findTextNodeByLocation(location);
    if (hoverNode !== null) {
      // 旋转节点
      if (event.deltaY > 0) {
        StageNodeRotate.rotateNodeDfs(hoverNode, hoverNode, 10, []);
      } else {
        StageNodeRotate.rotateNodeDfs(hoverNode, hoverNode, -10, []);
      }
    }
  }
};

ControllerNodeRotation.mousedown = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }
  const pressWorldLocation = Renderer.transformView2World(new Vector(event.clientX, event.clientY));
  const clickedEdge = StageManager.findLineEdgeByLocation(pressWorldLocation);
  const isHaveEdgeSelected = StageManager.getLineEdges().some((edge) => edge.isSelected);
  if (clickedEdge === null) {
    return;
  }
  ControllerNodeRotation.lastMoveLocation = pressWorldLocation.clone();

  if (isHaveEdgeSelected) {
    Controller.isMovingEdge = true;

    if (clickedEdge.isSelected) {
      // E1
      StageManager.getLineEdges().forEach((edge) => {
        edge.isSelected = false;
      });
    } else {
      // E2
      StageManager.getLineEdges().forEach((edge) => {
        edge.isSelected = false;
      });
    }
    clickedEdge.isSelected = true;
  } else {
    // F
    clickedEdge.isSelected = true;
  }
  Controller.setCursorNameHook(CursorNameEnum.Move);
};

ControllerNodeRotation.mousemove = (event: MouseEvent) => {
  if (Stage.selectMachine.isUsing || Stage.cuttingMachine.isUsing) {
    return;
  }
  const worldLocation = Renderer.transformView2World(new Vector(event.clientX, event.clientY));
  if (Controller.isMouseDown[0]) {
    if (Controller.pressingKeySet.has("control")) {
      // 更改连线的目标
      const entity = StageManager.findConnectableEntityByLocation(worldLocation);
      if (entity !== null) {
        // 找到目标，更改目标
        StageNodeConnector.changeSelectedEdgeTarget(entity);
      }
    } else {
      const diffLocation = worldLocation.subtract(ControllerNodeRotation.lastMoveLocation);
      // 拖拽连线
      Controller.isMovingEdge = true;
      StageNodeRotate.moveEdges(ControllerNodeRotation.lastMoveLocation, diffLocation);
    }
    ControllerNodeRotation.lastMoveLocation = worldLocation.clone();
  } else {
    // 什么都没有按下的情况
    // 看看鼠标当前的位置是否和线接近
    Stage.mouseInteractionCore.updateByMouseMove(worldLocation);
  }
};

ControllerNodeRotation.mouseup = (event: MouseEvent) => {
  if (event.button !== 0) {
    return;
  }
  if (Controller.isMovingEdge) {
    StageHistoryManager.recordStep(); // 鼠标抬起了，移动结束，记录历史过程
    Controller.isMovingEdge = false;
  }
  Controller.setCursorNameHook(CursorNameEnum.Default);
};
