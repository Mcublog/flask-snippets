#!/usr/bin/env python

import logging
import random
from dataclasses import asdict, dataclass, field
from enum import Enum, auto
from random import randint
from typing import Any, ClassVar

from flask import jsonify
from flask.wrappers import Response
from flask_table import Col, Table
from pylogus import logger_init

logger = logger_init(__name__, logging.INFO)

class Status(Enum):
    ONLINE = auto()
    OFFLINE = auto()
    WORKING = auto()
    IDLE = auto()

@dataclass
class AppResponse:
    result: str
    data: Any

class StatusTableHtml(Table):
    headname: str = "Current status:"
    status_col = Col('Status:')

    def upd_status(self, status: Status):
        self.status_col.name = f"{self.headname} {status.name}"


class StatusItem:

    def __init__(self, status_col_item):
        self.status_col = status_col_item


@dataclass
class StatusData:
    vbat: int = 0
    amp: int = 0
    temp: int = 0

    def rnd(self) -> 'StatusData':
        self.vbat = randint(5, 12)
        self.amp = randint(0, 50)
        self.temp = randint(-10, 30)
        return self


@dataclass
class StatusTable:
    STATUS_TABLE_ID: ClassVar[str] = 'status_table'
    TABLE_CLASSES: ClassVar[list[str]] = ["table"]
    table: StatusTableHtml = field(init=False)

    def __post_init__(self):
        self.table = self.upd_table(StatusData())

    def upd_table(self, status: StatusData) -> StatusTableHtml:
        items = []
        items.append(StatusItem(f"Vbat: {status.vbat} V"))
        items.append(StatusItem(f"Amp: {status.amp} A"))
        items.append(StatusItem(f"Temp (max): {status.temp} C"))
        self.table = StatusTableHtml(items,
                                     table_id=StatusTable.STATUS_TABLE_ID,
                                     classes=StatusTable.TABLE_CLASSES)
        self.table.upd_status(random.choice(list(Status)))
        return self.table

    def response(self)-> Response:
        return jsonify(asdict(AppResponse(result='OK', data=self.upd_table(StatusData().rnd()))))
