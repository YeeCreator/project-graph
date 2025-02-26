import { v4 } from "uuid";
import { Direction } from "../../../types/directions";
import { Serialized } from "../../../types/node";
import { PathString } from "../../../utils/pathString";
import { Rectangle } from "../../dataStruct/shape/Rectangle";
import { StringDict } from "../../dataStruct/StringDict";
import { Vector } from "../../dataStruct/Vector";
import { EdgeRenderer } from "../../render/canvas2d/entityRenderer/edge/EdgeRenderer";
import { Renderer } from "../../render/canvas2d/renderer";
import { EntityShrinkEffect } from "../../service/feedbackService/effectEngine/concrete/EntityShrinkEffect";
import { Settings } from "../../service/Settings";
import { Camera } from "../Camera";
import { Stage } from "../Stage";
import { Association } from "../stageObject/abstract/Association";
import { ConnectableEntity } from "../stageObject/abstract/ConnectableEntity";
import { Entity } from "../stageObject/abstract/StageEntity";
import { StageObject } from "../stageObject/abstract/StageObject";
import { CublicCatmullRomSplineEdge } from "../stageObject/association/CublicCatmullRomSplineEdge";
import { Edge } from "../stageObject/association/Edge";
import { LineEdge } from "../stageObject/association/LineEdge";
import { ConnectPoint } from "../stageObject/entity/ConnectPoint";
import { ImageNode } from "../stageObject/entity/ImageNode";
import { PenStroke } from "../stageObject/entity/PenStroke";
import { PortalNode } from "../stageObject/entity/PortalNode";
import { Section } from "../stageObject/entity/Section";
import { TextNode } from "../stageObject/entity/TextNode";
import { UrlNode } from "../stageObject/entity/UrlNode";
import { GraphMethods } from "./basicMethods/GraphMethods";
import { StageDeleteManager } from "./concreteMethods/StageDeleteManager";
import { StageGeneratorAI } from "./concreteMethods/StageGeneratorAI";
import { StageNodeAdder } from "./concreteMethods/stageNodeAdder";
import { StageNodeConnector } from "./concreteMethods/StageNodeConnector";
import { StageNodeTextTransfer } from "./concreteMethods/StageNodeTextTransfer";
import { StageSectionInOutManager } from "./concreteMethods/StageSectionInOutManager";
import { StageSectionPackManager } from "./concreteMethods/StageSectionPackManager";
import { StageSerializedAdder } from "./concreteMethods/StageSerializedAdder";
import { StageTagManager } from "./concreteMethods/StageTagManager";
import { StageHistoryManager } from "./StageHistoryManager";

// littlefean:应该改成类，实例化的对象绑定到舞台上。这成单例模式了
// 开发过程中会造成多开
// zty012:这个是存储数据的，和舞台无关，应该单独抽离出来
// 并且会在舞台之外的地方操作，所以应该是namespace单例

type stageContent = {
  entities: StringDict<Entity>;
  associations: StringDict<Association>;
  tags: string[];
};

/**
 * 子场景的相机数据
 */
export type ChildCameraData = {
  /**
   * 传送门的左上角位置
   */
  location: Vector;
  zoom: number;
  /**
   * 传送门大小
   */
  size: Vector;
  /**
   * 相机的目标位置
   */
  targetLocation: Vector;
};

/**
 * 舞台管理器，也可以看成包含了很多操作方法的《舞台实体容器》
 * 管理节点、边的关系等，内部包含了舞台上的所有实体
 */
export namespace StageManager {
  const stageContent: stageContent = {
    entities: StringDict.create(),
    associations: StringDict.create(),
    tags: [],
  };

  export function getStageContentDebug() {
    return stageContent.entities.length;
  }
  /**
   * 子舞台，用于渲染传送门中的另一个世界
   * key：绝对路径构成的字符串，用于区分不同的子舞台
   */
  const childStageContent: Record<string, stageContent> = {};

  /**
   * 每一个子舞台的相机数据，用于渲染传送门中的另一个世界
   */
  const childStageCameraData: Record<string, ChildCameraData> = {};

  export function updateChildStageCameraData(path: string, data: ChildCameraData) {
    childStageCameraData[path] = data;
  }
  export function getChildStageCameraData(path: string) {
    return childStageCameraData[path];
  }

  export function storeMainStage() {
    childStageContent["main"] = {
      entities: stageContent.entities.clone(),
      associations: stageContent.associations.clone(),
      tags: [...stageContent.tags],
    };
  }
  export function restoreMainStage() {
    stageContent.associations = childStageContent["main"].associations.clone();
    stageContent.entities = childStageContent["main"].entities.clone();
    stageContent.tags = [...childStageContent["main"].tags];
  }
  export function storeMainStageToChildStage(path: string) {
    childStageContent[path] = {
      entities: stageContent.entities.clone(),
      associations: stageContent.associations.clone(),
      tags: [...stageContent.tags],
    };
  }
  export function storeChildStageToMainStage(path: string) {
    stageContent.associations = childStageContent[path].associations.clone();
    stageContent.entities = childStageContent[path].entities.clone();
    stageContent.tags = [...childStageContent[path].tags];
  }
  export function getAllChildStageKeys(): string[] {
    return Object.keys(childStageContent).filter((key) => key !== "main");
  }
  export function clearAllChildStage() {
    for (const key of Object.keys(childStageContent)) {
      if (key !== "main") {
        childStageContent[key].entities.clear();
        childStageContent[key].associations.clear();
        childStageContent[key].tags = [];
      }
    }
  }
  // 使用这个方法时要提前保证当前主舞台槽上放的是主舞台
  export function getAllChildStageKeysAndCamera(): { key: string; camera: ChildCameraData }[] {
    const result = [];
    for (const entity of getEntities().filter((entity) => entity instanceof PortalNode)) {
      const newKey = PathString.relativePathToAbsolutePath(
        PathString.dirPath(Stage.path.getFilePath()),
        entity.portalFilePath,
      );
      const item = {
        key: newKey,
        camera: {
          location: entity.location,
          zoom: entity.cameraScale,
          size: entity.size,
          targetLocation: entity.targetLocation,
        },
      };
      result.push(item);
    }
    return result;
  }

  export let isEnableEntityCollision: boolean = false;
  export let isAllowAddCycleEdge: boolean = false;

  export function init() {
    Settings.watch("isEnableEntityCollision", (value) => {
      isEnableEntityCollision = value;
    });
    Settings.watch("allowAddCycleEdge", (value) => {
      isAllowAddCycleEdge = value;
    });
  }

  export function isEmpty(): boolean {
    return stageContent.entities.length === 0;
  }
  export function getTextNodes(): TextNode[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof TextNode);
  }
  export function getConnectableEntity(): ConnectableEntity[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof ConnectableEntity);
  }
  export function isEntityExists(uuid: string): boolean {
    return stageContent.entities.hasId(uuid);
  }
  export function getSections(): Section[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof Section);
  }
  export function getImageNodes(): ImageNode[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof ImageNode);
  }
  export function getConnectPoints(): ConnectPoint[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof ConnectPoint);
  }
  export function getUrlNodes(): UrlNode[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof UrlNode);
  }
  export function getPortalNodes(): PortalNode[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof PortalNode);
  }
  export function getPenStrokes(): PenStroke[] {
    return stageContent.entities.valuesToArray().filter((node) => node instanceof PenStroke);
  }

  export function getStageObject(): StageObject[] {
    const result: StageObject[] = [];
    result.push(...stageContent.entities.valuesToArray());
    result.push(...stageContent.associations.valuesToArray());
    return result;
  }

  /**
   * 获取场上所有的实体
   * @returns
   */
  export function getEntities(): Entity[] {
    return stageContent.entities.valuesToArray();
  }
  export function getStageObjectByUUID(uuid: string): StageObject | null {
    const entity = stageContent.entities.getById(uuid);
    if (entity) {
      return entity;
    }
    const association = stageContent.associations.getById(uuid);
    if (association) {
      return association;
    }
    return null;
  }
  export function getEntitiesByUUIDs(uuids: string[]): Entity[] {
    const result = [];
    for (const uuid of uuids) {
      const entity = stageContent.entities.getById(uuid);
      if (entity) {
        result.push(entity);
      }
    }
    return result;
  }
  export function isNoEntity(): boolean {
    return stageContent.entities.length === 0;
  }
  export function deleteOneTextNode(node: TextNode) {
    stageContent.entities.deleteValue(node);
  }
  export function deleteOneImage(node: ImageNode) {
    stageContent.entities.deleteValue(node);
  }
  export function deleteOneUrlNode(node: UrlNode) {
    stageContent.entities.deleteValue(node);
  }
  export function deleteOneSection(section: Section) {
    stageContent.entities.deleteValue(section);
  }
  export function deleteOneConnectPoint(point: ConnectPoint) {
    stageContent.entities.deleteValue(point);
  }
  export function deleteOnePortalNode(node: PortalNode) {
    stageContent.entities.deleteValue(node);
  }
  export function deleteOnePenStroke(penStroke: PenStroke) {
    stageContent.entities.deleteValue(penStroke);
  }
  export function deleteOneEdge(edge: LineEdge) {
    stageContent.associations.deleteValue(edge);
  }

  export function getAssociations(): Association[] {
    return stageContent.associations.valuesToArray();
  }

  export function getLineEdges(): LineEdge[] {
    return stageContent.associations.valuesToArray().filter((edge) => edge instanceof LineEdge);
  }
  export function getCrEdges(): CublicCatmullRomSplineEdge[] {
    return stageContent.associations.valuesToArray().filter((edge) => edge instanceof CublicCatmullRomSplineEdge);
  }

  /** 关于标签的相关操作 */
  export namespace TagOptions {
    export function reset(uuids: string[]) {
      stageContent.tags = [];
      for (const uuid of uuids) {
        stageContent.tags.push(uuid);
      }
    }
    export function addTag(uuid: string) {
      stageContent.tags.push(uuid);
    }
    export function removeTag(uuid: string) {
      const index = stageContent.tags.indexOf(uuid);
      if (index !== -1) {
        stageContent.tags.splice(index, 1);
      }
    }
    export function hasTag(uuid: string): boolean {
      return stageContent.tags.includes(uuid);
    }
    export function getTagUUIDs(): string[] {
      return stageContent.tags;
    }
    /**
     * 清理未引用的标签
     */
    export function updateTags() {
      const uuids = stageContent.tags.slice();
      for (const uuid of uuids) {
        if (!stageContent.entities.hasId(uuid) && !stageContent.associations.hasId(uuid)) {
          stageContent.tags.splice(stageContent.tags.indexOf(uuid), 1);
        }
      }
    }

    export function moveUpTag(uuid: string) {
      const index = stageContent.tags.indexOf(uuid);
      if (index !== -1 && index > 0) {
        const temp = stageContent.tags[index - 1];
        stageContent.tags[index - 1] = uuid;
        stageContent.tags[index] = temp;
        console.log("move up tag");
      }
    }
    export function moveDownTag(uuid: string) {
      const index = stageContent.tags.indexOf(uuid);
      if (index !== -1 && index < stageContent.tags.length - 1) {
        const temp = stageContent.tags[index + 1];
        stageContent.tags[index + 1] = uuid;
        stageContent.tags[index] = temp;
        console.log("move down tag");
      }
    }
  }

  /**
   * 销毁函数
   * 以防开发过程中造成多开
   */
  export function destroy() {
    stageContent.entities.clear();
    stageContent.associations.clear();
    stageContent.tags = [];
  }

  export function addTextNode(node: TextNode) {
    stageContent.entities.addValue(node, node.uuid);
  }
  export function addUrlNode(node: UrlNode) {
    stageContent.entities.addValue(node, node.uuid);
  }
  export function addImageNode(node: ImageNode) {
    stageContent.entities.addValue(node, node.uuid);
  }
  export function addSection(section: Section) {
    stageContent.entities.addValue(section, section.uuid);
  }
  export function addConnectPoint(point: ConnectPoint) {
    stageContent.entities.addValue(point, point.uuid);
  }
  export function addLineEdge(edge: LineEdge) {
    stageContent.associations.addValue(edge, edge.uuid);
  }
  export function addCrEdge(edge: CublicCatmullRomSplineEdge) {
    stageContent.associations.addValue(edge, edge.uuid);
  }
  export function addPenStroke(penStroke: PenStroke) {
    stageContent.entities.addValue(penStroke, penStroke.uuid);
  }
  export function addPortalNode(portalNode: PortalNode) {
    stageContent.entities.addValue(portalNode, portalNode.uuid);
  }

  // 用于UI层监测
  export let selectedNodeCount = 0;
  export let selectedEdgeCount = 0;
  /**
   * 更新节点的引用，将unknown的节点替换为真实的节点，保证对象在内存中的唯一性
   * 节点什么情况下会是unknown的？
   *
   * 包含了对Section框的更新
   * 包含了对Edge双向线偏移状态的更新
   */
  export function updateReferences() {
    for (const entity of getEntities()) {
      // 实体是可连接类型
      if (entity instanceof ConnectableEntity) {
        for (const edge of getAssociations()) {
          if (edge instanceof Edge) {
            if (edge.source.unknown && edge.source.uuid === entity.uuid) {
              edge.source = entity;
            }
            if (edge.target.unknown && edge.target.uuid === entity.uuid) {
              edge.target = entity;
            }
          }
        }
      }
    }
    // 以下是Section框的更新，y值降序排序，从下往上排序，因为下面的往往是内层的Section
    for (const section of getSections().sort(
      (a, b) => b.collisionBox.getRectangle().location.y - a.collisionBox.getRectangle().location.y,
    )) {
      // 更新孩子数组，并调整位置和大小
      const newChildList = [];

      for (const childUUID of section.childrenUUIDs) {
        if (stageContent.entities.hasId(childUUID)) {
          const childObject = stageContent.entities.getById(childUUID);
          if (childObject) {
            newChildList.push(childObject);
          }
        }
      }
      section.children = newChildList;
      section.adjustLocationAndSize();
      section.adjustChildrenStateByCollapse();
    }

    // 以下是LineEdge双向线偏移状态的更新
    for (const edge of getLineEdges()) {
      let isShifting = false;
      for (const otherEdge of getLineEdges()) {
        if (edge.source === otherEdge.target && edge.target === otherEdge.source) {
          isShifting = true;
          break;
        }
      }
      edge.isShifting = isShifting;
    }

    // 对tags进行更新
    TagOptions.updateTags();
  }

  export function getTextNodeByUUID(uuid: string): TextNode | null {
    for (const node of getTextNodes()) {
      if (node.uuid === uuid) {
        return node;
      }
    }
    return null;
  }
  export function getConnectableEntityByUUID(uuid: string): ConnectableEntity | null {
    for (const node of getConnectableEntity()) {
      if (node.uuid === uuid) {
        return node;
      }
    }
    return null;
  }
  export function isSectionByUUID(uuid: string): boolean {
    return stageContent.entities.getById(uuid) instanceof Section;
  }
  export function getSectionByUUID(uuid: string): Section | null {
    const entity = stageContent.entities.getById(uuid);
    if (entity instanceof Section) {
      return entity;
    }
    return null;
  }

  /**
   * 计算所有节点的中心点
   */
  export function getCenter(): Vector {
    if (stageContent.entities.length === 0) {
      return Vector.getZero();
    }
    const allNodesRectangle = Rectangle.getBoundingRectangle(
      stageContent.entities.valuesToArray().map((node) => node.collisionBox.getRectangle()),
    );
    return allNodesRectangle.center;
  }

  /**
   * 计算所有节点的大小
   */
  export function getSize(): Vector {
    if (stageContent.entities.length === 0) {
      return new Vector(Renderer.w, Renderer.h);
    }
    const size = Rectangle.getBoundingRectangle(
      Array.from(stageContent.entities.valuesToArray()).map((node) => node.collisionBox.getRectangle()),
    ).size;

    return size;
  }

  /**
   * 根据位置查找节点，常用于点击事件
   * @param location
   * @returns
   */
  export function findTextNodeByLocation(location: Vector): TextNode | null {
    for (const node of getTextNodes()) {
      if (node.collisionBox.isContainsPoint(location)) {
        return node;
      }
    }
    return null;
  }

  /**
   * 用于鼠标悬停时查找边
   * @param location
   * @returns
   */
  export function findEdgeByLocation(location: Vector): LineEdge | null {
    for (const edge of getLineEdges()) {
      if (edge.collisionBox.isContainsPoint(location)) {
        return edge;
      }
    }
    return null;
  }

  export function findSectionByLocation(location: Vector): Section | null {
    for (const section of getSections()) {
      if (section.collisionBox.isContainsPoint(location)) {
        return section;
      }
    }
    return null;
  }

  export function findImageNodeByLocation(location: Vector): ImageNode | null {
    for (const node of getImageNodes()) {
      if (node.collisionBox.isContainsPoint(location)) {
        return node;
      }
    }
    return null;
  }

  export function findConnectableEntityByLocation(location: Vector): ConnectableEntity | null {
    for (const entity of getConnectableEntity()) {
      if (entity.isHiddenBySectionCollapse) {
        continue;
      }
      if (entity.collisionBox.isContainsPoint(location)) {
        return entity;
      }
    }
    return null;
  }

  export function findEntityByLocation(location: Vector): Entity | null {
    for (const entity of getEntities()) {
      if (entity.isHiddenBySectionCollapse) {
        continue;
      }
      if (entity.collisionBox.isContainsPoint(location)) {
        return entity;
      }
    }
    return null;
  }

  export function findConnectPointByLocation(location: Vector): ConnectPoint | null {
    for (const point of getConnectPoints()) {
      if (point.isHiddenBySectionCollapse) {
        continue;
      }
      if (point.collisionBox.isContainsPoint(location)) {
        return point;
      }
    }
    return null;
  }
  export function isHaveEntitySelected(): boolean {
    for (const entity of getEntities()) {
      if (entity.isSelected) {
        return true;
      }
    }
    return false;
  }

  /**
   * O(n)
   * @returns
   */
  export function getSelectedEntities(): Entity[] {
    return stageContent.entities.valuesToArray().filter((entity) => entity.isSelected);
  }
  export function getSelectedAssociations(): Association[] {
    return stageContent.associations.valuesToArray().filter((association) => association.isSelected);
  }
  export function getSelectedStageObjects(): StageObject[] {
    const result: StageObject[] = [];
    result.push(...getSelectedEntities());
    result.push(...getSelectedAssociations());
    return result;
  }

  /**
   * 判断某一点是否有实体存在（排除实体的被Section折叠）
   * @param location
   * @returns
   */
  export function isEntityOnLocation(location: Vector): boolean {
    for (const entity of getEntities()) {
      if (entity.isHiddenBySectionCollapse) {
        continue;
      }
      if (entity.collisionBox.isContainsPoint(location)) {
        return true;
      }
    }
    return false;
  }
  export function isAssociationOnLocation(location: Vector): boolean {
    for (const association of getAssociations()) {
      if (association instanceof LineEdge) {
        if (association.target.isHiddenBySectionCollapse && association.source.isHiddenBySectionCollapse) {
          continue;
        }
      }
      if (association.collisionBox.isContainsPoint(location)) {
        return true;
      }
    }
    return false;
  }

  // region 以下为舞台操作相关的函数
  // 建议不同的功能分类到具体的文件中，然后最后集中到这里调用，使得下面的显示简短一些
  // 每个操作函数尾部都要加一个记录历史的操作

  /**
   *
   * @param clickWorldLocation
   * @returns 返回新创建节点的uuid
   */
  export async function addTextNodeByClick(
    clickWorldLocation: Vector,
    addToSections: Section[],
    selectCurrent = false,
  ): Promise<string> {
    const res = await StageNodeAdder.addTextNodeByClick(clickWorldLocation, addToSections, selectCurrent);
    StageHistoryManager.recordStep();
    return res;
  }

  export async function addTextNodeFromCurrentSelectedNode(
    direction: Direction,
    selectCurrent = false,
  ): Promise<string> {
    const res = await StageNodeAdder.addTextNodeFromCurrentSelectedNode(direction, [], selectCurrent);
    StageHistoryManager.recordStep();
    return res;
  }

  export function deleteEntities(deleteNodes: Entity[]) {
    StageDeleteManager.deleteEntities(deleteNodes);
    StageHistoryManager.recordStep();
    // 更新选中节点计数
    selectedNodeCount = 0;
    for (const node of stageContent.entities.valuesToArray()) {
      if (node.isSelected) {
        selectedNodeCount++;
      }
    }
  }

  /**
   * 外部的交互层的delete键可以直接调用这个函数
   */
  export function deleteSelectedStageObjects() {
    const selectedEntities = StageManager.getEntities().filter((node) => node.isSelected);
    for (const entity of selectedEntities) {
      Stage.effectMachine.addEffect(EntityShrinkEffect.fromEntity(entity));
    }
    StageManager.deleteEntities(selectedEntities);

    for (const edge of StageManager.getLineEdges()) {
      if (edge.isSelected) {
        StageManager.deleteEdge(edge);
        Stage.effectMachine.addEffects(EdgeRenderer.getCuttingEffects(edge));
      }
    }
  }

  export function deleteEdge(deleteEdge: LineEdge): boolean {
    const res = StageDeleteManager.deleteEdge(deleteEdge);
    StageHistoryManager.recordStep();
    // 更新选中边计数
    selectedEdgeCount = 0;
    for (const edge of stageContent.associations.valuesToArray()) {
      if (edge.isSelected) {
        selectedEdgeCount++;
      }
    }
    return res;
  }

  // export function deleteSection(section: Section) {
  //   StageDeleteManager.deleteEntities([section]);
  //   StageHistoryManager.recordStep();
  // }

  export function connectEntity(fromNode: ConnectableEntity, toNode: ConnectableEntity) {
    if (fromNode === toNode && !isAllowAddCycleEdge) {
      return false;
    }
    StageNodeConnector.connectConnectableEntity(fromNode, toNode);
    StageHistoryManager.recordStep();
    return GraphMethods.isConnected(fromNode, toNode);
  }

  /**
   * 反转一个节点与他相连的所有连线方向
   * @param connectEntity
   */
  function reverseNodeEdges(connectEntity: ConnectableEntity) {
    const prepareReverseEdges = [];
    for (const edge of getLineEdges()) {
      if (edge.target === connectEntity || edge.source === connectEntity) {
        prepareReverseEdges.push(edge);
      }
    }
    StageNodeConnector.reverseEdges(prepareReverseEdges);
  }

  /**
   * 反转所有选中的节点的每个节点的连线
   */
  export function reverseSelectedNodeEdge() {
    const entities = getSelectedEntities().filter((entity) => entity instanceof ConnectableEntity);
    for (const entity of entities) {
      reverseNodeEdges(entity);
    }
  }

  export function reverseSelectedEdges() {
    const selectedEdges = getLineEdges().filter((edge) => edge.isSelected);
    if (selectedEdges.length === 0) {
      return;
    }
    StageNodeConnector.reverseEdges(selectedEdges);
  }

  export function addSerializedData(serializedData: Serialized.File, diffLocation = new Vector(0, 0)) {
    StageSerializedAdder.addSerializedData(serializedData, diffLocation);
    StageHistoryManager.recordStep();
  }

  export function generateNodeByText(text: string, indention: number = 4, location = Camera.location) {
    StageNodeAdder.addNodeByText(text, indention, location);
    StageHistoryManager.recordStep();
  }

  export function generateNodeByMarkdown(text: string, location = Camera.location) {
    StageNodeAdder.addNodeByMarkdown(text, location);
    StageHistoryManager.recordStep();
  }

  /** 将多个实体打包成一个section，并添加到舞台中 */
  export async function packEntityToSection(addEntities: Entity[]) {
    await StageSectionPackManager.packEntityToSection(addEntities);
    StageHistoryManager.recordStep();
  }

  /** 将选中的实体打包成一个section，并添加到舞台中 */
  export async function packEntityToSectionBySelected() {
    const selectedNodes = StageManager.getSelectedEntities();
    if (selectedNodes.length === 0) {
      return;
    }
    StageManager.packEntityToSection(selectedNodes);
  }

  export function goInSection(entities: Entity[], section: Section) {
    StageSectionInOutManager.goInSection(entities, section);
    StageHistoryManager.recordStep();
  }

  export function goOutSection(entities: Entity[], section: Section) {
    StageSectionInOutManager.goOutSection(entities, section);
    StageHistoryManager.recordStep();
  }
  /** 将所有选中的Section折叠起来 */
  export function packSelectedSection() {
    StageSectionPackManager.packSection();
    StageHistoryManager.recordStep();
  }

  /** 将所有选中的Section展开 */
  export function unpackSelectedSection() {
    StageSectionPackManager.unpackSection();
    StageHistoryManager.recordStep();
  }

  /**
   * 切换选中的Section的折叠状态
   */
  export function sectionSwitchCollapse() {
    StageSectionPackManager.switchCollapse();
    StageHistoryManager.recordStep();
  }

  export function calculateSelectedNode() {
    StageNodeTextTransfer.calculateAllSelected();
    StageHistoryManager.recordStep();
  }

  export function addConnectPointByClick(location: Vector, addToSections: Section[]) {
    StageNodeAdder.addConnectPoint(location, addToSections);
    StageHistoryManager.recordStep();
  }

  export function expandTextNodeByAI() {
    StageGeneratorAI.generateNewTextNodeBySelected();
    StageHistoryManager.recordStep();
  }

  export function addTagBySelected() {
    StageTagManager.changeTagBySelected();
  }

  export function refreshTags() {
    return StageTagManager.refreshTagNamesUI();
  }

  export function moveCameraToTag(tag: string) {
    StageTagManager.moveCameraToTag(tag);
  }
  export function connectEntityByCrEdge(fromNode: ConnectableEntity, toNode: ConnectableEntity) {
    return StageNodeConnector.addCrEdge(fromNode, toNode);
  }
  /**
   * 刷新选中内容
   */
  export function refreshSelected() {
    const entities = getSelectedEntities();
    for (const entity of entities) {
      if (entity instanceof ImageNode) {
        entity.refresh();
      }
    }
  }

  export function switchLineEdgeToCrEdge() {
    const prepareDeleteLineEdge: LineEdge[] = [];
    for (const edge of getLineEdges()) {
      if (edge instanceof LineEdge && edge.isSelected) {
        // 删除这个连线，并准备创建cr曲线
        prepareDeleteLineEdge.push(edge);
      }
    }
    for (const lineEdge of prepareDeleteLineEdge) {
      deleteEdge(lineEdge);
      connectEntityByCrEdge(lineEdge.source, lineEdge.target);
    }
  }

  export function selectAll() {
    for (const entity of stageContent.entities.valuesToArray()) {
      entity.isSelected = true;
    }
  }
  export function clearSelectAll() {
    for (const entity of stageContent.entities.valuesToArray()) {
      entity.isSelected = false;
    }
    for (const edge of stageContent.associations.valuesToArray()) {
      edge.isSelected = false;
    }
  }

  /**
   * 将所有实体移动到整数坐标位置
   * 用以减小导出时的文本内容体积
   */
  export function moveAllEntityToIntegerLocation() {
    for (const textNode of getTextNodes()) {
      const currentLocation = textNode.collisionBox.getRectangle().location;
      currentLocation.x = Math.round(currentLocation.x);
      currentLocation.y = Math.round(currentLocation.y);
      textNode.moveTo(currentLocation);
    }
  }

  /**
   * 将所有选中的节点转换成Section
   */
  export function textNodeToSection() {
    StageSectionPackManager.textNodeToSection();
    StageHistoryManager.recordStep();
  }

  export function targetTextNodeToSection(textNode: TextNode) {
    const result = StageSectionPackManager.targetTextNodeToSection(textNode);
    StageHistoryManager.recordStep();
    return result;
  }

  export function addPortalNodeToStage(otherPath: string) {
    const uuid = v4();
    const relativePath = PathString.getRelativePath(Stage.path.getFilePath(), otherPath);
    if (relativePath === "") {
      return false;
    }
    stageContent.entities.addValue(
      new PortalNode({
        uuid: uuid,
        title: PathString.dirPath(otherPath),
        portalFilePath: relativePath,
        location: [Camera.location.x, Camera.location.y],
        size: [500, 500],
        cameraScale: 1,
      }),
      uuid,
    );
    StageHistoryManager.recordStep();
    return true;
  }

  // 测试
  export function addOnePortalNode() {
    const uuid = v4();
    stageContent.entities.addValue(
      new PortalNode({
        uuid: uuid,
        title: "PortalNode",
        portalFilePath: "",
        location: [0, 0],
        size: [500, 500],
        cameraScale: 1,
      }),
      uuid,
    );
    StageHistoryManager.recordStep();
  }
}
