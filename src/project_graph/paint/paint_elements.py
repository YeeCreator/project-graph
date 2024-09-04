from PyQt5.QtGui import QColor, QPainter

from project_graph.camera import Camera
from project_graph.data_struct.number_vector import NumberVector
from project_graph.data_struct.rectangle import Rectangle
from project_graph.logging import log
from project_graph.paint.paint_utils import PainterUtils
from project_graph.settings.setting_enums import ThemeEnum
from project_graph.settings.setting_service import SETTING_SERVICE


def paint_grid(paint: QPainter, camera: Camera):
    try:
        if SETTING_SERVICE.theme_style == ThemeEnum.GRAY_2B:
            grid_color = QColor(255, 255, 255, 50)
            grid_color_main = QColor(255, 255, 255, 100)
        elif SETTING_SERVICE.theme_style == ThemeEnum.WHITE_PAPER:
            grid_color = QColor(0, 0, 0, 50)
            grid_color_main = QColor(0, 0, 0, 100)

        for y in range(-1000, 1000, 100):
            PainterUtils.paint_solid_line(
                paint,
                camera.location_world2view(NumberVector(-1000, y)),
                camera.location_world2view(NumberVector(1000, y)),
                grid_color_main if y == 0 else grid_color,
                1 * camera.current_scale,
            )
        for x in range(-1000, 1000, 100):
            PainterUtils.paint_solid_line(
                paint,
                camera.location_world2view(NumberVector(x, -1000)),
                camera.location_world2view(NumberVector(x, 1000)),
                grid_color_main if x == 0 else grid_color,
                1 * camera.current_scale,
            )
    except Exception as e:
        log(e)


def paint_details_data(paint: QPainter, camera: Camera, datas: list[str]):
    """
    左上角绘制细节信息
    :param paint:
    :param camera:
    :param datas:
    :return:
    """
    start_y = 30
    for i, data in enumerate(datas):
        PainterUtils.paint_text_from_top_left(
            paint,
            NumberVector(20, start_y + (i - 1) * 50),
            data,
            12,
            QColor(255, 255, 255, 100),
        )
    pass


def paint_alert_message(paint: QPainter, camera: Camera, message: str):
    """
    屏幕中心绘制警告信息
    :param paint:
    :param camera:
    :param message:
    :return:
    """

    PainterUtils.paint_text_from_center(
        paint,
        NumberVector(camera.view_width / 2, camera.view_height / 2),
        message,
        24,
        QColor(255, 255, 0, 255),
    )


def paint_rect_in_world(
    paint: QPainter,
    camera: Camera,
    rect: Rectangle,
    fill_color: QColor,
    stroke_color: QColor,
):
    PainterUtils.paint_rect(
        paint,
        camera.location_world2view(rect.location_left_top),
        rect.width * camera.current_scale,
        rect.height * camera.current_scale,
        fill_color,
        stroke_color,
        1,
    )
