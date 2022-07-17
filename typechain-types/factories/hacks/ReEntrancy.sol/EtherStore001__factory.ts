/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  EtherStore001,
  EtherStore001Interface,
} from "../../../hacks/ReEntrancy.sol/EtherStore001";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061056c806100206000396000f3fe60806040526004361061003f5760003560e01c806312065fe01461004457806327e235e31461006f5780633ccfd60b146100ac578063d0e30db0146100c3575b600080fd5b34801561005057600080fd5b506100596100cd565b60405161006691906102d7565b60405180910390f35b34801561007b57600080fd5b5061009660048036038101906100919190610355565b6100d5565b6040516100a391906102d7565b60405180910390f35b3480156100b857600080fd5b506100c16100ed565b005b6100cb610267565b005b600047905090565b60006020528060005260406000206000915090505481565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008111610173576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161016a906103df565b60405180910390fd5b60003373ffffffffffffffffffffffffffffffffffffffff168260405161019990610430565b60006040518083038185875af1925050503d80600081146101d6576040519150601f19603f3d011682016040523d82523d6000602084013e6101db565b606091505b505090508061021f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161021690610491565b60405180910390fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102b591906104e0565b92505081905550565b6000819050919050565b6102d1816102be565b82525050565b60006020820190506102ec60008301846102c8565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610322826102f7565b9050919050565b61033281610317565b811461033d57600080fd5b50565b60008135905061034f81610329565b92915050565b60006020828403121561036b5761036a6102f2565b5b600061037984828501610340565b91505092915050565b600082825260208201905092915050565b7f4e6f2062616c616e636500000000000000000000000000000000000000000000600082015250565b60006103c9600a83610382565b91506103d482610393565b602082019050919050565b600060208201905081810360008301526103f8816103bc565b9050919050565b600081905092915050565b50565b600061041a6000836103ff565b91506104258261040a565b600082019050919050565b600061043b8261040d565b9150819050919050565b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b600061047b601483610382565b915061048682610445565b602082019050919050565b600060208201905081810360008301526104aa8161046e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006104eb826102be565b91506104f6836102be565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561052b5761052a6104b1565b5b82820190509291505056fea2646970667358221220b65abd25a023ddf3c436102fdd5ef58b238122d0372535a0d79849e00eebb81b64736f6c634300080d0033";

type EtherStore001ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EtherStore001ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EtherStore001__factory extends ContractFactory {
  constructor(...args: EtherStore001ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<EtherStore001> {
    return super.deploy(overrides || {}) as Promise<EtherStore001>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): EtherStore001 {
    return super.attach(address) as EtherStore001;
  }
  override connect(signer: Signer): EtherStore001__factory {
    return super.connect(signer) as EtherStore001__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EtherStore001Interface {
    return new utils.Interface(_abi) as EtherStore001Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EtherStore001 {
    return new Contract(address, _abi, signerOrProvider) as EtherStore001;
  }
}