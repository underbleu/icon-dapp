/* eslint-disable */
import IconService, { IconAmount, IconConverter, HttpProvider, IconWallet, IconBuilder, SignedTransaction } from 'icon-sdk-js';
import MockData from '../../mockData/index.js';

let tomasDice;

class TomasDice {
	constructor() {
		this.provider = new HttpProvider(MockData.NODE_URL);
        this.iconService = new IconService(this.provider);
        this.wallet = IconWallet.loadPrivateKey(MockData.PRIVATE_KEY_1);
        this.scoreAddress = 'cx4558b111a0bb9f3889fb7e082252b67756e48966';
        this.addListener();
    }

    addListener() {
        document.getElementById('diceRoll__roll').addEventListener('click', async () => {
            const guess = document.getElementById('diceRoll__guess').value
            if (!guess) return alert('Guess Dice Number ;)');
            await this.rollDice(guess);
        });
        document.getElementById('result').addEventListener('click', async () => {
            await this.checkTxResult(this.transactionTxHash);
        });
    }

    async getDefaultStepCost() {
        const { CallBuilder } = IconBuilder;

        const governanceApi = await this.iconService.getScoreApi(MockData.GOVERNANCE_ADDRESS).execute();
        const methodName = 'getStepCosts';
        const getStepCostsApi = governanceApi.getMethod(methodName);
        const getStepCostsApiInputs = getStepCostsApi.inputs.length > 0 ? JSON.stringify(getStepCostsApi.inputs) : 'none';
        const getStepCostsApiOutputs = getStepCostsApi.outputs.length > 0 ? JSON.stringify(getStepCostsApi.outputs) : 'none';
        const callBuilder = new CallBuilder();
        const call = callBuilder
            .to(MockData.GOVERNANCE_ADDRESS)
            .method(methodName)
            .build();
        const stepCosts = await this.iconService.call(call).execute();
        return IconConverter.toBigNumber(stepCosts.default).times(2)
    }

    async rollDice(guess) {
        const { CallTransactionBuilder } = IconBuilder;

        document.getElementById("diceRoll__resultNumber").innerHTML = '?'
        document.getElementById("diceRoll__resultStr").innerHTML = 'Click me'

        const walletAddress = this.wallet.getAddress();
        const stepLimit = await this.getDefaultStepCost();
        const networkId = IconConverter.toBigNumber(3);
        const version = IconConverter.toBigNumber(3);
        const timestamp = (new Date()).getTime() * 1000;
        const methodName = "start";
        const params = { guess }

        const tokenTransactionBuilder = new CallTransactionBuilder();
        const transaction = tokenTransactionBuilder
            .nid(networkId)
            .from(walletAddress)
            .to(this.scoreAddress)
            .stepLimit(stepLimit)
            .timestamp(timestamp)
            .method(methodName)
            .params(params)
            .version(version)
            .build();
        
        const signedTransaction = new SignedTransaction(transaction, this.wallet);
        this.transactionTxHash = await this.iconService.sendTransaction(signedTransaction).execute()
        document.getElementById('result').classList.add("diceRoll__result--show")
    }

    async checkTxResult(txHash) {
        const result = await this.iconService.getTransactionResult(txHash).execute()
        const resultNumber = result.eventLogs[0].indexed[2].slice(-1)
        const resultStr = result.eventLogs[0].indexed[3]
        document.getElementById("diceRoll__resultNumber").innerHTML = resultNumber
        document.getElementById("diceRoll__resultStr").innerHTML = resultStr
        console.log('result', result)
    }
}

if (document.getElementById('diceRoll')) {
	tomasDice = new TomasDice();
}

export default TomasDice;
