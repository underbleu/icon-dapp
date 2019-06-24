from iconservice import *

class Dice(IconScoreBase):

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    def _get_random(self):
        key = 'raaaaaaannnnddddoooommmm'
        key2 = f'{self.block.timestamp}, {key}'.encode()
        hash = sha3_256(key2)
        return int.from_bytes(hash, 'big')

    @eventlog(indexed = 3)
    def gameLog(self, guess:int, actual: int, message: str): pass

    @external
    def start(self, guess:int) -> (str):
        diceNumber =  self._get_random() % 6 + 1
        if (diceNumber == guess):
            self.gameLog(guess, diceNumber, 'You win!!')
        else:
            self.gameLog(guess, diceNumber, 'You lost!!')