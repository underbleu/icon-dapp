from iconservice import *

from .gameroom.gameroom import GameRoom
from .game.game import Game

TAG = 'Dice'

class Dice(IconScoreBase):
    _TOKEN_ADDRESS = "token_address"
    _GAME_ROOM = "game_room"
    _GAME = "game"
    _RESULTS = "results"

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)
        self.db = db

    def on_install(self) -> None:
        super().on_install()
        if _tokenAddress.is_contract:
            self._VDB_token_address.set(_tokenAddress)
        else:
            revert("Input params must be Contract Address")

    def on_update(self) -> None:
        super().on_update()
        pass
