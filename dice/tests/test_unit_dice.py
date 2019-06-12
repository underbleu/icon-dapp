from ..dice import Dice
from tbears.libs.scoretest.score_test_case import ScoreTestCase


class TestDice(ScoreTestCase):

    def setUp(self):
        super().setUp()
        self.score = self.get_score_instance(Dice, self.test_account1)

    def test_hello(self):
        self.assertEqual(self.score.hello(), "Hello")
