export interface DepositsResponse {
  deposits: Deposit[];
  total_cnt: number;
}

export interface MerkleProofResponse {
  proof: {
    merkle_proof: MerkleProof;
    rollup_exit_root: string;
    main_exit_root: string;
  };
}

type Deposit = {
  leaf_type: number;
  orig_net: number;
  orig_addr: string;
  amount: number;
  dest_net: number;
  dest_addr: string;
  block_num: number;
  deposit_cnt: number;
  network_id: number;
  tx_hash: string;
  claim_tx_hash: string;
  metadata: string;
  ready_for_claim: boolean;
};

type MerkleProof = string[];
