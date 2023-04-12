import Axios from 'axios';
import { config } from 'dotenv';
config();

interface IResult {
    error: boolean,
    message: string,
    data: any
}

class Tatum {

    public apiKey: string;
    public apiUrl: string;
    public result: IResult;
    private chains: Array<{name: string, symbol: string}>
    private config: any;
    private pagination: { pageSize: number, offset: number }

    constructor(){

        this.apiKey = process.env.TATUM_API_KEY || '';
        this.apiUrl = process.env.TATUM_API_URL || '';

        this.result = { error: false, message: '', data: null }

        this.chains = [
            { name: 'bitcoin', symbol: 'BTC' },
            { name: 'algorand', symbol: 'ALGO' },
            { name: 'bcash', symbol: 'BCH' },
            { name: 'bsc', symbol: 'BSC' },
            { name: 'bnb', symbol: 'BNB' },
            { name: 'ada', symbol: 'ADA' },
            { name: 'celo', symbol: 'CELO' },
            { name: 'dogecoin', symbol: 'DOGE' },
            { name: 'ethereum', symbol: 'ETH' },
            { name: 'flow', symbol: 'FLOW' },
            { name: 'one', symbol: 'ONE' },
            { name: 'klaytn', symbol: 'KLAY' },
            { name: 'kcs', symbol: 'BTC' },
            { name: 'litecoin', symbol: 'LTC' },
            { name: 'neo', symbol: 'NEO' },
            { name: 'polygon', symbol: 'MATIC' },
            { name: 'qtum', symbol: 'QTUM' },
            { name: 'solana', symbol: 'SOL' },
            { name: 'xlm', symbol: 'XLM' },
            { name: 'terra', symbol: 'TERRA' },
            { name: 'tron', symbol: 'TRON' },
            { name: 'vet', symbol: 'VET' },
            { name: 'xdc', symbol: 'XDC' },
            { name: 'xrp', symbol: 'XRP' },
        ];

        this.config = { headers: { 'x-api-key': this.apiKey } }

        this.pagination = { pageSize: 10, offset: 0 }

    }

    /**
     * @name filterChains
     * @description find out the blockchain from list of chains based on param
     * @param {string} name 
     * 
     * @returns {} Chain { name: string, symbol: string }
     */
    private async filterChains(name: string): Promise<{ name: string, symbol: string }> {

        const chain = this.chains.find((c) => c.name === name);

        if(chain){
            return chain;
        }else{
            return { name: '', symbol: '' }
        }

    }

    /**
     * @name generateBTCWallet
     * @description Use Tatum API to generate BTC wallet. Automatically creates mnemonic if you don't provide it
     * @param {string} mnemonic
     * @async method is marked asynchronus
     * 
     * @returns {IResult} returns an object containing { error, message & data } properties
     */
    public async generateBTCWallet(mnemonic: string = ''): Promise<IResult> {

        await Axios.get(`${this.apiUrl}/bitcoin/wallet?mnemonic=${mnemonic}`, this.config)
        .then((resp) => {

            this.result.data = resp.data;

        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })
        
        return this.result;

    }

    /**
     * @name generateBTCAddress
     * @description Use Tatum API to generate BTC wallet address.
     * @param {string} xpub - extended public key
     * @param {string} index - derivation index
     * @async method is marked asynchronus
     * 
     * @returns {IResult} returns an object containing { error, message & data } properties
     */
    public async generateBTCAddress(xpub: string, index: number): Promise<IResult> {

        await Axios.get(`${this.apiUrl}/bitcoin/address/${xpub}/${index}`, this.config)
        .then((resp) => {

            this.result.data = resp.data;

        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    /**
     * @name generateBTCPrivateKey
     * @description Use Tatum API to generate BTC private key from mnemonic.
     * @param {string} mnemonic - wallet mnemonic
     * @param {string} index - derivation index
     * @async method is marked asynchronus
     * 
     * @returns {IResult} returns an object containing { error, message & data } properties
     */
     public async generateBTCPrivateKey(mnemonic: string, index: number): Promise<IResult> {

        this.config.headers = { 
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
        }

        const data = { mnemonic, index }

        await Axios.post(`${this.apiUrl}/bitcoin/wallet/priv`, { ...data }, this.config)
        .then((resp) => {

            this.result.data = resp.data;

        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    /**
     * @name getChainBTCInfo
     * @description Use Tatum API: get BTC blockchain (node) info running on Tatum
     * @async - method is marked async
     * 
     * @returns {IResult} returns an object containing { error, message & data } properties
     */
    public async getChainBTCInfo(): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/info`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCBlockHash(index: number = 0): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/block/hash/${index}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCBlockByHash(hash: string): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/block/${hash}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCBlockByHeight(height: number): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/block/${height}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCTxnByHash(hash: string): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/transaction/${hash}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCMempoolTxns(): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/mempool`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCTxnByAddress(address: string, query: any = null): Promise<IResult>{

        if(query !== null){
            this.pagination = query;
        }

        const qUrl = `pageSize=${this.pagination.pageSize}&offset=${this.pagination.offset}`

        await Axios.get(`${this.apiUrl}/bitcoin/transaction/address/${address}?${qUrl}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCBalance(address: string): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/address/balance/${address}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async getBTCUtxoTxn(hash: string, index: number = 0): Promise<IResult>{

        await Axios.get(`${this.apiUrl}/bitcoin/utxo/${hash}/${index}`, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async sendBTCFromAddress(from: { address: string, privateKey: string }, to: { address: string, value: number }): Promise<IResult>{

        const data = {
            fromAddress: [ from ],
            to: [to]
        }

        await Axios.post(`${this.apiUrl}/bitcoin/transaction`, {...data}, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

    public async sendBTCFromUtxo(from: { txHash: string, index: number, privateKey: string }, to: { address: string, value: number }): Promise<IResult>{

        const data = {
            fromUTXO: [ from ],
            to: [to]
        }

        await Axios.post(`${this.apiUrl}/bitcoin/transaction`, {...data}, this.config)
        .then((resp) => {
            this.result.data = resp.data;
        }).catch((err) => {
            this.result.error = true;
            this.result.message = `Error: ${ err.response.data.message }`;
            this.result.data = err.response.data;
        })

        return this.result;

    }

}

export default new Tatum();